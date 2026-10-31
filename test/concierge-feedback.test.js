const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const { getApp } = require('./helpers/appHarness');

const h = getApp();
after(() => h.stop());
beforeEach(() => h.mock.__reset());
const send = body => fetch(h.base + '/api/concierge/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

test('feedback is stored with the question and answer, without an account', async () => {
  const r = await send({ rating: -1, question: 'jobs in Qatar', answer: 'No jobs on file', lang: 'en' });
  assert.equal(r.status, 200);
  const w = h.mock.__writes('concierge_feedback', 'insert');
  assert.equal(w.length, 1);
  const row = Array.isArray(w[0].payload) ? w[0].payload[0] : w[0].payload;
  assert.equal(row.rating, -1);
  assert.equal(row.user_id, null);
  assert.equal(row.question, 'jobs in Qatar');
});

test('a rating other than 1 or -1 is rejected', async () => {
  assert.equal((await send({ rating: 5 })).status, 400);
  assert.equal(h.mock.__writes('concierge_feedback', 'insert').length, 0);
});
