const { test, after } = require('node:test');
const assert = require('node:assert');
const { getApp } = require('./helpers/appHarness');
const flightPages = require('../lib/flightPages');
const seo = require('../lib/seo');

const h = getApp();
after(() => h.stop());

test('every route page renders, with no invented fare when no data is available', async () => {
  for (const r of flightPages.ROUTES) {
    const res = await fetch(`${h.base}/flights/${r.slug}?lang=fr`);
    assert.equal(res.status, 200, r.slug);
    const html = await res.text();
    assert.match(html, /<link rel="canonical"/);
    assert.match(html, /asm-credit/);
    assert.doesNotMatch(html, /class="price"/);
  }
});

test('fares render cheapest-first with marker booking links marked sponsored', () => {
  const html = flightPages.renderRoutePage({
    route: flightPages.ROUTES[0], lang: 'en', head: '',
    fares: [{ departureAt: '2026-11-03', airline: 'PC', transfers: 0, durationMinutes: 125, priceUsd: 74.4, url: 'https://www.aviasales.com/search/BEY0311IST1?t=x&marker=593909' }],
  });
  assert.match(html, /\$74/);
  assert.match(html, /rel="sponsored nofollow noopener"/);
  assert.match(html, /marker=593909/);
});

test('unknown route redirects to the index; routes are in the sitemap', async () => {
  const res = await fetch(`${h.base}/flights/nowhere-else`, { redirect: 'manual' });
  assert.equal(res.status, 302);
  assert.equal((await fetch(`${h.base}/flights`)).status, 200);
  const map = seo.sitemap();
  for (const r of flightPages.ROUTES) assert.ok(map.includes(`/flights/${r.slug}</loc>`), r.slug);
});
