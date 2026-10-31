const test = require('node:test');
const assert = require('node:assert');
const { detectCountries, conversationText, buildSearchPlan, fallbackPlan } = require('../lib/yf/searchPlan');
process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-service-role';
const { createMockDb } = require('./helpers/mockDb');
const dbPath = require.resolve('../db');
require.cache[dbPath] = { id: dbPath, filename: dbPath, loaded: true, exports: createMockDb() };
const { safeTerm } = require('../lib/yf/matching');

test('detectCountries() reads English, French and Arabic names, cities and regions', () => {
  assert.deepEqual(detectCountries('ما هي الفرص المتاحة الان في الأمارات'), ['United Arab Emirates']);
  assert.deepEqual(detectCountries('Give me options in turkey'), ['Turkey']);
  assert.deepEqual(detectCountries('un emploi à Montréal'), ['Canada']);
  assert.deepEqual(detectCountries('عمل داخل اوروبا'), ['France', 'Germany', 'United Kingdom']);
  assert.ok(detectCountries('jobs in the gulf').includes('Saudi Arabia'));
});

test('detectCountries() does not match short codes inside other words', () => {
  assert.deepEqual(detectCountries('I need a quick answer'), []);
  assert.deepEqual(detectCountries('build my resume'), []);
});

test('conversationText() keeps recent user turns so a short follow-up keeps its topic', () => {
  const history = [
    { role: 'user', content: 'I am a nurse' },
    { role: 'assistant', content: 'Where would you like to work?' },
    { role: 'user', content: 'Germany' },
  ];
  const t = conversationText(history, 'go ahead');
  assert.match(t, /nurse/);
  assert.match(t, /Germany/);
  assert.match(t, /go ahead$/);
  assert.ok(!/Where would you like/.test(t), 'assistant turns are not search text');
});

test('buildSearchPlan() falls back to deterministic country detection without an API key', async () => {
  const saved = process.env.ANTHROPIC_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;
  try {
    const plan = await buildSearchPlan({ history: [{ role: 'user', content: 'بدي شغل بالسعودية' }], message: 'go ahead' });
    assert.deepEqual(plan, fallbackPlan('بدي شغل بالسعودية\ngo ahead'));
    assert.deepEqual(plan.countries, ['Saudi Arabia']);
  } finally {
    if (saved !== undefined) process.env.ANTHROPIC_API_KEY = saved;
  }
});

test('safeTerm() strips PostgREST filter syntax from keywords', () => {
  assert.equal(safeTerm('driver,title.ilike.*x*'), 'driver title ilike x');
  assert.equal(safeTerm('(nurse)'), 'nurse');
});
