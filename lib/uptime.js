'use strict';

// Watches the Atelier Sur Mesure service, which itself runs the uptime alert
// for all the owner's sites (studio-sur-mesure lib/uptime.js) — so the
// watcher is watched too. Two failed checks in a row = "down" email; the first
// success after that = "back up" email.
const { sendEmail } = require('./email');

const DEFAULT_URLS = ['https://www.ateliersurmesure.ca/api/health'];
const EVERY_MS = 5 * 60 * 1000;
const TIMEOUT_MS = 20000;
const FAILS_BEFORE_ALERT = 2;

function urls() {
  const raw = process.env.UPTIME_WATCH_URLS;
  return raw ? raw.split(',').map(s => s.trim()).filter(Boolean) : DEFAULT_URLS;
}

async function probe(url, fetchImpl = fetch) {
  const started = Date.now();
  try {
    const r = await fetchImpl(url, { redirect: 'follow', signal: AbortSignal.timeout(TIMEOUT_MS), headers: { 'User-Agent': 'AtelierUptime/1.0' } });
    return { ok: r.status < 500, status: r.status, ms: Date.now() - started };
  } catch (e) {
    return { ok: false, status: 0, ms: Date.now() - started, error: e.name };
  }
}

function createMonitor({ to = process.env.UPTIME_ALERT_EMAIL || 'canada.servcorp@gmail.com', send = sendEmail, fetchImpl = fetch } = {}) {
  const state = {}; // url -> { fails, down, downSince }
  async function checkOnce() {
    const events = [];
    for (const url of urls()) {
      const s = state[url] || (state[url] = { fails: 0, down: false, downSince: null });
      const res = await probe(url, fetchImpl);
      if (res.ok) {
        if (s.down) {
          const mins = Math.max(1, Math.round((Date.now() - s.downSince) / 60000));
          events.push({ url, type: 'up' });
          await send(to, `Back up: ${new URL(url).host}`, `<p>${url} answers again (HTTP ${res.status}). It was down for about ${mins} min.</p>`).catch(() => {});
        }
        s.fails = 0; s.down = false; s.downSince = null;
      } else {
        s.fails += 1;
        if (!s.down && s.fails >= FAILS_BEFORE_ALERT) {
          s.down = true; s.downSince = Date.now() - (FAILS_BEFORE_ALERT - 1) * EVERY_MS;
          events.push({ url, type: 'down' });
          await send(to, `DOWN: ${new URL(url).host}`, `<p>${url} is not responding (${res.status ? 'HTTP ' + res.status : res.error || 'no answer'}) on ${FAILS_BEFORE_ALERT} checks in a row, 5 minutes apart.</p><p>You'll get another email when it's back up.</p>`).catch(() => {});
        }
      }
    }
    return events;
  }
  return { checkOnce, state };
}

function start() {
  if (String(process.env.UPTIME || '').toLowerCase() === 'off' || process.env.NODE_ENV === 'test') return null;
  const m = createMonitor();
  const timer = setInterval(() => m.checkOnce().catch(e => console.error('uptime', e)), EVERY_MS);
  timer.unref();
  return timer;
}

module.exports = { createMonitor, probe, start, DEFAULT_URLS };
