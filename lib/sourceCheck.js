'use strict';

// Monthly check of the official pages behind clinic and scholarship entries:
// dead links and published prices that no longer appear on the source page
// are emailed to the owner. It only reports; it never edits a row, so no
// unverified scraped figure ever replaces a verified one.

const { sendEmail } = require('./email');

const UA = 'Mozilla/5.0 (compatible; YallaNsaferLinkCheck/1.0; +https://www.yallansafir.com)';
const MAX_URLS = 300;
const CONCURRENCY = 4;

const digitsOnly = s => String(s).replace(/(\d)[,.\s\u00a0\u202f'](?=\d{3}(?!\d))/g, '$1');
// Price figures worth checking: 3+ digit amounts in the note, e.g. "EUR 3,290" -> "3290".
const priceFigures = note => [...new Set((digitsOnly(note || '').match(/\d{3,}/g) || []))].slice(0, 6);
const pageText = html => digitsOnly(String(html).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' '));

const BOT_WALL = /sgcaptcha|cf-chl-|challenge-platform|captcha-delivery|Just a moment\.\.\./i;

async function checkUrl(url, fetchImpl = fetch) {
  try {
    const r = await fetchImpl(url, { redirect: 'follow', headers: { 'User-Agent': UA, Accept: 'text/html,*/*' }, signal: AbortSignal.timeout(15000) });
    const body = r.ok ? await r.text() : '';
    if (r.status === 404 || r.status === 410) return { state: 'dead', status: r.status };
    if (!r.ok) return { state: 'unchecked', status: r.status }; // 403/429/5xx: bot wall or a bad moment
    // 202 + meta-refresh captcha (SiteGround, Cloudflare) is a bot wall, not the page: no price verdict
    if (r.status !== 200 || BOT_WALL.test(body)) return { state: 'unchecked', status: r.status === 200 ? 'bot check' : r.status };
    return { state: 'ok', status: r.status, text: pageText(body) };
  } catch (e) {
    const dns = /ENOTFOUND|EAI_AGAIN|getaddrinfo/.test(String(e && (e.cause && e.cause.code || e.message)));
    return { state: dns ? 'dead' : 'unchecked', status: dns ? 'no such domain' : (e.name || 'error') };
  }
}

async function pool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k]); }
  }));
  return out;
}

// items: [{ kind, name, url, priceNote? }] -> { dead, priceGone, unchecked, ok }
async function checkItems(items, fetchImpl = fetch) {
  const list = items.filter(x => /^https?:\/\//i.test(x.url || '')).slice(0, MAX_URLS);
  const results = await pool(list, CONCURRENCY, async it => ({ it, res: await checkUrl(it.url, fetchImpl) }));
  const report = { dead: [], priceGone: [], unchecked: [], ok: 0 };
  for (const { it, res } of results) {
    if (res.state === 'dead') { report.dead.push({ ...it, status: res.status }); continue; }
    if (res.state === 'unchecked') { report.unchecked.push({ ...it, status: res.status }); continue; }
    const missing = priceFigures(it.priceNote).filter(f => !res.text.includes(f));
    if (missing.length) report.priceGone.push({ ...it, missing });
    else report.ok++;
  }
  return report;
}

const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const li = (x, extra) => `<li>${esc(x.kind)}: <b>${esc(x.name)}</b> — <a href="${esc(x.url)}">${esc(x.url)}</a>${extra ? ` (${esc(extra)})` : ''}</li>`;
function renderReport(r, total) {
  const sec = (title, rows) => rows.length ? `<h3>${title} (${rows.length})</h3><ul>${rows.join('')}</ul>` : '';
  return `<p>Monthly check of ${total} official links behind Yalla Nsafer clinics and scholarships: ${r.ok} fine.</p>`
    + sec('Dead links: the page is gone', r.dead.map(x => li(x, x.status)))
    + sec('Published price not found on the page any more: check it', r.priceGone.map(x => li(x, `${x.priceNote} — missing ${x.missing.join(', ')}`)))
    + sec('Could not check (site blocks robots or was down)', r.unchecked.map(x => li(x, x.status)))
    + '<p>Nothing was changed in the database; fix or remove entries by hand.</p>';
}

async function loadItems(db) {
  const [med, study] = await Promise.all([
    db.from('medical_treatment_providers').select('hospital_name, source_url, price_range_note').eq('status', 'active'),
    db.from('study_opportunities').select('title, institution, source_url').eq('status', 'active'),
  ]);
  return [
    ...(med.data || []).map(r => ({ kind: 'Clinic', name: r.hospital_name, url: r.source_url, priceNote: r.price_range_note })),
    ...(study.data || []).map(r => ({ kind: 'Study', name: [r.institution, r.title].filter(Boolean).join(' — '), url: r.source_url })),
  ];
}

// Runs at most once per calendar month (source_check_runs claim), so the
// scheduler can tick it often and redeploys never repeat the report.
async function runMonthly({ db = require('../db'), send = sendEmail, fetchImpl = fetch, now = new Date(),
  to = process.env.SOURCE_CHECK_EMAIL || 'canada.servcorp@gmail.com' } = {}) {
  if (String(process.env.SOURCE_CHECK || '').toLowerCase() === 'off') return { skipped: 'off' };
  const month = now.toISOString().slice(0, 7);
  const { error } = await db.from('source_check_runs').insert({ month });
  if (error) return { skipped: 'already ran' };
  const items = await loadItems(db);
  const report = await checkItems(items, fetchImpl);
  const issues = report.dead.length + report.priceGone.length;
  await send(to, `Yalla monthly source check ${month}: ${issues ? `${issues} to fix` : 'all good'}`, renderReport(report, items.length));
  return report;
}

module.exports = { checkUrl, checkItems, priceFigures, renderReport, runMonthly };
