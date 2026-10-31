const test = require('node:test');
const assert = require('node:assert');
process.env.UPTIME_WATCH_URLS = 'https://a.example/health';
const { createMonitor } = require('../lib/uptime');

const fakeFetch = (statuses) => async () => {
  const s = statuses.shift();
  if (s === 'throw') throw Object.assign(new Error('x'), { name: 'TimeoutError' });
  return { status: s };
};

test('one failed check sends nothing; two in a row send one DOWN email; recovery sends one back-up email', async () => {
  const sent = [];
  const m = createMonitor({ to: 'me@x', send: async (to, subject) => { sent.push(subject); }, fetchImpl: fakeFetch([200, 'throw', 'throw', 503, 200, 200]) });
  await m.checkOnce(); assert.deepEqual(sent, []);
  await m.checkOnce(); assert.deepEqual(sent, [], 'a single failure is not an outage');
  await m.checkOnce(); assert.deepEqual(sent, ['DOWN: a.example']);
  await m.checkOnce(); assert.deepEqual(sent, ['DOWN: a.example'], 'no repeat while still down');
  await m.checkOnce(); assert.deepEqual(sent, ['DOWN: a.example', 'Back up: a.example']);
  await m.checkOnce(); assert.equal(sent.length, 2);
});

test('4xx answers count as up (the server is answering)', async () => {
  const sent = [];
  const m = createMonitor({ send: async (to, s) => { sent.push(s); }, fetchImpl: fakeFetch([404, 404, 404]) });
  for (let i = 0; i < 3; i++) await m.checkOnce();
  assert.deepEqual(sent, []);
});
