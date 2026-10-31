const { test } = require('node:test');
const assert = require('node:assert');
const sc = require('../lib/sourceCheck');

const page = (status, html = '') => async () => ({ ok: status < 400, status, text: async () => html });

test('price figures are read from the note whatever the thousands separator', () => {
  assert.deepEqual(sc.priceFigures('EUR 2,700–4,500 (site also quotes 3.290)'), ['2700', '4500', '3290']);
  assert.deepEqual(sc.priceFigures(null), []);
});

test('dead links, missing prices and blocked sites are reported separately', async () => {
  const pages = {
    'https://a.test/': page(200, '<p>Package: €3 290 all inclusive</p>'),
    'https://b.test/': page(200, '<p>Contact us for a quote</p>'),
    'https://c.test/': page(404),
    'https://d.test/': page(403),
  };
  const fetchImpl = (url, o) => pages[url](url, o);
  const r = await sc.checkItems([
    { kind: 'Clinic', name: 'A', url: 'https://a.test/', priceNote: 'EUR 3,290' },
    { kind: 'Clinic', name: 'B', url: 'https://b.test/', priceNote: 'EUR 3,290' },
    { kind: 'Study', name: 'C', url: 'https://c.test/' },
    { kind: 'Study', name: 'D', url: 'https://d.test/' },
    { kind: 'Study', name: 'no link', url: '' },
  ], fetchImpl);
  assert.equal(r.ok, 1);
  assert.deepEqual(r.priceGone.map(x => x.name), ['B']);
  assert.deepEqual(r.dead.map(x => x.name), ['C']);
  assert.deepEqual(r.unchecked.map(x => x.name), ['D']);
});

test('the report is sent once per month and never writes to the entries', async () => {
  const claimed = new Set(); const writes = [];
  const db = { from: t => ({
    insert: async row => { if (t !== 'source_check_runs') writes.push(t); if (claimed.has(row.month)) return { error: { code: '23505' } }; claimed.add(row.month); return { error: null }; },
    select: () => ({ eq: async () => ({ data: t === 'study_opportunities' ? [{ title: 'X', institution: 'U', source_url: 'https://c.test/' }] : [] }) }),
  }) };
  const sent = [];
  const opts = { db, send: async (to, subject) => sent.push(subject), fetchImpl: page(404), now: new Date('2026-11-01T08:00:00Z') };
  await sc.runMonthly(opts);
  assert.deepEqual(await sc.runMonthly(opts), { skipped: 'already ran' });
  assert.equal(sent.length, 1);
  assert.match(sent[0], /2026-11: 1 to fix/);
  assert.deepEqual(writes, []);
});

test('a captcha / bot-check page is unchecked, not a missing price', async () => {
  const wall = '<html><head><meta http-equiv="refresh" content="0;/.well-known/sgcaptcha/?r=%2Ffees%2F"></head></html>';
  const pages = { 'https://e.test/': page(202, wall), 'https://f.test/': page(200, wall) };
  const r = await sc.checkItems([
    { kind: 'Clinic', name: 'E', url: 'https://e.test/', priceNote: 'THB 79,000' },
    { kind: 'Clinic', name: 'F', url: 'https://f.test/', priceNote: 'THB 79,000' },
  ], url => pages[url]());
  assert.deepEqual(r.priceGone, []);
  assert.deepEqual(r.unchecked.map(x => x.name), ['E', 'F']);
});
