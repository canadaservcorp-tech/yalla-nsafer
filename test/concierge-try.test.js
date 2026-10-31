const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const { getApp } = require('./helpers/appHarness');

const h = getApp();
const realFetch = globalThis.fetch;
let calls = 0;
globalThis.fetch = async (url, opts) => {
  if (String(url).startsWith('https://api.anthropic.com/')) {
    calls += 1;
    return new Response(JSON.stringify({ content: [{ type: 'text', text: 'Here are real options. Create a free account to see more.' }] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  return realFetch(url, opts);
};
after(() => { globalThis.fetch = realFetch; return h.stop(); });
beforeEach(() => { h.mock.__reset(); calls = 0; process.env.ANTHROPIC_API_KEY = 'test-key'; });

const tryAsk = (body) => fetch(h.base + '/api/concierge/try', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

test('POST /api/concierge/try answers without an account and stores nothing', async () => {
  h.mock.__set('jobs', { data: [{ id: 'j1', title: 'Driver', country: 'United Arab Emirates', city: 'Dubai', requirements: 'licence', source_type: 'licensed_api', source_url: 'https://x', raw: {} }], error: null });
  const r = await tryAsk({ message: 'driver jobs in Dubai' });
  assert.equal(r.status, 200);
  const b = await r.json();
  assert.equal(b.trial, true);
  assert.match(b.reply, /free account/);
  assert.ok(b.jobs.every(j => j.teaser && j.url === ''), 'trial jobs are teasers only');
  assert.deepEqual(h.mock.__writes(null, 'insert').filter(w => w.table.startsWith('concierge')), [], 'no conversation is stored');
});

test('POST /api/concierge/try rejects an empty message', async () => {
  const r = await tryAsk({ message: '   ' });
  assert.equal(r.status, 400);
});
