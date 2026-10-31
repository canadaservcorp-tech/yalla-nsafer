'use strict';

// Cheapest-flight lookup -- thin wrapper around a real flight-search API,
// same house pattern as lib/webPush.js/lib/paypal.js/lib/stripe.js: nothing
// else in the codebase touches the vendor's HTTP shape directly, so swapping
// providers later (or adding a second one) never means chasing callers.
//
// NOT WIRED TO A REAL VENDOR YET -- this is the open item flagged in the
// "Yalla Nsafer — Platform Summary" build brief (Section 5, "concept-stage").
// Picking a real API (candidates: Kiwi/Tequila, Amadeus Self-Service, or
// Skyscanner's partner API) is a business decision (pricing tier, which
// markets it actually covers well for MENA/GCC routes) that needs Hicham's
// sign-off before Devin wires real credentials -- see FLIGHT_API_PROVIDER
// below. Until then, configured() is false and the mock provider returns
// clearly-labeled illustrative data ONLY, never presented as a live, bookable
// price -- see lib/yf/systemPrompt.js's TRAVEL_CONTEXT block, which states
// this explicitly to the model so it can never be talked into presenting a
// mock figure as real (same "retrieve, don't recall" discipline as JOB_CONTEXT).

const PROVIDER = process.env.FLIGHT_API_PROVIDER || ''; // e.g. 'kiwi' | 'amadeus' -- unset until a vendor is chosen
const API_KEY = process.env.FLIGHT_API_KEY || '';

const configured = () => Boolean(PROVIDER && API_KEY);

// origin/destination: IATA-ish free text (city or airport name) -- a real
// provider integration would resolve these to airport codes itself.
// dateRange: { earliest, latest } ISO date strings, both optional.
// Returns { estimates: [{ route, priceNote, note }], illustrative: boolean }.
// illustrative:true means "not a live quote" -- always true until a real
// provider is wired in below.
async function searchCheapest({ origin, destination, dateRange } = {}) {
  if (!configured()) {
    return {
      illustrative: true,
      estimates: [],
      note: 'Flight search is not yet configured on this platform -- no real fare data is available.',
    };
  }
  // Real-provider call goes here once PROVIDER/API_KEY are set -- e.g.
  //   if (PROVIDER === 'kiwi') return searchKiwi({ origin, destination, dateRange });
  // Left unimplemented on purpose: which vendor to call is exactly the open
  // decision this module's header comment describes, not something to guess
  // at with a placeholder integration that would look done but isn't real.
  if (PROVIDER !== 'travelpayouts') {
    throw new Error(`flightSearch: FLIGHT_API_PROVIDER=${PROVIDER} has no implementation wired in yet`);
  }
  return travelpayoutsCheapest({ origin, destination, dateRange });
}

// Travelpayouts (Aviasales) Data API: fares travellers actually found in the
// last days (a cache, not a live quote), cheapest first. origin/destination
// are IATA city or airport codes; dateRange is 'YYYY-MM' or 'YYYY-MM-DD'.
const IATA_RE = /^[A-Z]{3}$/;
const DATE_RE = /^\d{4}-\d{2}(-\d{2})?$/;
const MARKER = process.env.TRAVELPAYOUTS_MARKER || '';
async function travelpayoutsCheapest({ origin, destination, dateRange, limit = 5 }) {
  const o = String(origin || '').toUpperCase();
  const d = String(destination || '').toUpperCase();
  if (!IATA_RE.test(o) || !IATA_RE.test(d) || o === d) return { illustrative: false, estimates: [], note: 'No valid origin/destination airport code.' };
  const q = new URLSearchParams({ origin: o, destination: d, currency: 'usd', sorting: 'price', one_way: 'true', limit: String(limit), token: API_KEY });
  if (DATE_RE.test(String(dateRange || ''))) q.set('departure_at', dateRange);
  try {
    const r = await fetch(`https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${q}`, { signal: AbortSignal.timeout(8000) });
    if (!r.ok) return { illustrative: false, estimates: [], note: `Fare search unavailable (HTTP ${r.status}).` };
    const body = await r.json();
    const estimates = (body.data || []).slice(0, limit).map(f => ({
      origin: f.origin_airport || o,
      destination: f.destination_airport || d,
      departureAt: String(f.departure_at || '').slice(0, 10),
      airline: f.airline || '',
      transfers: Number(f.transfers) || 0,
      durationMinutes: Number(f.duration || f.duration_to) || null,
      priceUsd: Number(f.price),
      url: f.link ? `https://www.aviasales.com${f.link}${MARKER ? `&marker=${encodeURIComponent(MARKER)}` : ''}` : '',
    })).filter(f => Number.isFinite(f.priceUsd));
    return { illustrative: false, estimates, note: estimates.length ? '' : 'No recent fares found for this route.' };
  } catch (e) {
    return { illustrative: false, estimates: [], note: `Fare search unavailable (${e.name}).` };
  }
}

module.exports = { configured, searchCheapest, travelpayoutsCheapest };
