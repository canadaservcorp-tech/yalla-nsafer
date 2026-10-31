"use strict";

// Crawlable "cheapest flights A → B" pages (/flights, /flights/:slug). Fares
// come from lib/flightSearch.js (Travelpayouts: prices travellers actually
// found in the last days, a cache, not a live quote) and each one links to
// its Aviasales booking page with our marker. No fare is ever made up: with
// no data the page says so and points to the concierge.

const flightSearch = require('./flightSearch');

const CITY = {
  BEY: { en: 'Beirut', fr: 'Beyrouth', ar: 'بيروت' },
  IST: { en: 'Istanbul', fr: 'Istanbul', ar: 'إسطنبول' },
  DXB: { en: 'Dubai', fr: 'Dubaï', ar: 'دبي' },
  PAR: { en: 'Paris', fr: 'Paris', ar: 'باريس' },
  YMQ: { en: 'Montreal', fr: 'Montréal', ar: 'مونتريال' },
  CAI: { en: 'Cairo', fr: 'Le Caire', ar: 'القاهرة' },
  JED: { en: 'Jeddah', fr: 'Djeddah', ar: 'جدة' },
  AMM: { en: 'Amman', fr: 'Amman', ar: 'عمّان' },
  ALG: { en: 'Algiers', fr: 'Alger', ar: 'الجزائر' },
  CMN: { en: 'Casablanca', fr: 'Casablanca', ar: 'الدار البيضاء' },
  TUN: { en: 'Tunis', fr: 'Tunis', ar: 'تونس' },
  BGW: { en: 'Baghdad', fr: 'Bagdad', ar: 'بغداد' },
  DOH: { en: 'Doha', fr: 'Doha', ar: 'الدوحة' },
  RUH: { en: 'Riyadh', fr: 'Riyad', ar: 'الرياض' },
};
const PAIRS = [
  ['BEY', 'IST'], ['BEY', 'DXB'], ['BEY', 'PAR'], ['BEY', 'YMQ'], ['BEY', 'CAI'],
  ['CAI', 'DXB'], ['CAI', 'IST'], ['CAI', 'JED'], ['RUH', 'CAI'], ['AMM', 'DXB'],
  ['AMM', 'IST'], ['BGW', 'IST'], ['BGW', 'DXB'], ['DXB', 'IST'], ['DOH', 'IST'],
  ['ALG', 'PAR'], ['CMN', 'PAR'], ['TUN', 'PAR'], ['ALG', 'YMQ'], ['CMN', 'YMQ'],
];
const slugOf = c => CITY[c].en.toLowerCase().replace(/[^a-z]+/g, '-');
const ROUTES = PAIRS.map(([from, to]) => ({ from, to, slug: `${slugOf(from)}-${slugOf(to)}` }));
const BY_SLUG = Object.fromEntries(ROUTES.map(r => [r.slug, r]));
const LANGS = ['en', 'fr', 'ar'];

const META = {
  en: (a, b) => ({ title: `Cheapest flights ${a} to ${b} | Yalla Nsafer`, description: `Cheapest one-way fares from ${a} to ${b} found by travellers in the last days, with airline, stops and a direct booking link.` }),
  fr: (a, b) => ({ title: `Vols pas chers ${a} – ${b} | Yalla Nsafer`, description: `Les tarifs aller simple les moins chers de ${a} à ${b} trouvés par des voyageurs ces derniers jours, avec compagnie, escales et lien de réservation.` }),
  ar: (a, b) => ({ title: `أرخص رحلات من ${a} إلى ${b} | يلا نسافر`, description: `أرخص أسعار الذهاب فقط من ${a} إلى ${b} التي وجدها المسافرون في الأيام الأخيرة، مع شركة الطيران والتوقفات ورابط الحجز.` }),
};
const INDEX_META = {
  en: { title: 'Cheap flights from the Middle East and North Africa | Yalla Nsafer', description: 'Recent cheapest fares on popular routes from Beirut, Cairo, Amman, Baghdad, Algiers, Casablanca and Tunis, with booking links.' },
  fr: { title: "Vols pas chers depuis le Moyen-Orient et l'Afrique du Nord | Yalla Nsafer", description: "Les tarifs récents les moins chers sur les routes populaires depuis Beyrouth, Le Caire, Amman, Bagdad, Alger, Casablanca et Tunis." },
  ar: { title: 'رحلات رخيصة من الشرق الأوسط وشمال أفريقيا | يلا نسافر', description: 'أحدث أرخص الأسعار على الخطوط الشائعة من بيروت والقاهرة وعمّان وبغداد والجزائر والدار البيضاء وتونس مع روابط الحجز.' },
};
const seoMeta = () => ({
  '/flights': INDEX_META,
  ...Object.fromEntries(ROUTES.map(r => [`/flights/${r.slug}`,
    Object.fromEntries(LANGS.map(l => [l, META[l](CITY[r.from][l], CITY[r.to][l])]))])),
});

const COPY = {
  en: { h1: (a, b) => `Cheapest flights from ${a} to ${b}`, intro: 'One-way fares travellers found in the last days, cheapest first. Prices change; the final price is the one on the booking page.', date: 'Date', airline: 'Airline', stops: 'Stops', direct: 'Direct', time: 'Duration', price: 'Price', book: 'See & book', none: 'No recent fares were found for this route right now. Ask our assistant for other dates or nearby airports.', all: 'Other routes', cta: 'Ask the Yalla Nsafer assistant (3 free questions)', indexH1: 'Cheap flights on popular routes', indexIntro: 'Recent cheapest fares from the Middle East and North Africa, each with a booking link.', source: 'Fares: Aviasales / Travelpayouts. Booking links are affiliate links: Yalla Nsafer may earn a small commission, at no extra cost to you.' },
  fr: { h1: (a, b) => `Vols les moins chers de ${a} à ${b}`, intro: 'Tarifs aller simple trouvés par des voyageurs ces derniers jours, du moins cher au plus cher. Les prix changent ; le prix final est celui de la page de réservation.', date: 'Date', airline: 'Compagnie', stops: 'Escales', direct: 'Direct', time: 'Durée', price: 'Prix', book: 'Voir et réserver', none: "Aucun tarif récent pour cette route en ce moment. Demandez à notre assistant d'autres dates ou des aéroports proches.", all: 'Autres routes', cta: "Demandez à l'assistant Yalla Nsafer (3 questions gratuites)", indexH1: 'Vols pas chers sur les routes populaires', indexIntro: "Les tarifs récents les moins chers depuis le Moyen-Orient et l'Afrique du Nord, chacun avec un lien de réservation.", source: "Tarifs : Aviasales / Travelpayouts. Les liens de réservation sont des liens d'affiliation : Yalla Nsafer peut toucher une petite commission, sans frais pour vous." },
  ar: { h1: (a, b) => `أرخص رحلات من ${a} إلى ${b}`, intro: 'أسعار الذهاب فقط التي وجدها المسافرون في الأيام الأخيرة، من الأرخص. الأسعار تتغير، والسعر النهائي هو الظاهر في صفحة الحجز.', date: 'التاريخ', airline: 'الشركة', stops: 'التوقفات', direct: 'مباشر', time: 'المدة', price: 'السعر', book: 'عرض وحجز', none: 'لا توجد أسعار حديثة لهذا الخط حالياً. اسأل مساعدنا عن تواريخ أخرى أو مطارات قريبة.', all: 'خطوط أخرى', cta: 'اسأل مساعد يلا نسافر (3 أسئلة مجانية)', indexH1: 'رحلات رخيصة على الخطوط الشائعة', indexIntro: 'أحدث أرخص الأسعار من الشرق الأوسط وشمال أفريقيا، مع رابط حجز لكل رحلة.', source: 'الأسعار: Aviasales / Travelpayouts. روابط الحجز روابط شراكة: قد يحصل يلا نسافر على عمولة صغيرة دون أي تكلفة إضافية عليك.' },
};

const AIRLINES = { PC: 'Pegasus', VF: 'AJet', TK: 'Turkish Airlines', EY: 'Etihad', RJ: 'Royal Jordanian', SM: 'Air Cairo', XY: 'flynas', G9: 'Air Arabia', TO: 'Transavia', MS: 'EgyptAir', ME: 'MEA', FZ: 'flydubai', EK: 'Emirates', QR: 'Qatar Airways', SV: 'Saudia', AT: 'Royal Air Maroc', AH: 'Air Algérie', TU: 'Tunisair', AC: 'Air Canada', AF: 'Air France', F3: 'flyadeal', J9: 'Jazeera Airways', IA: 'Iraqi Airways', W6: 'Wizz Air', '3O': 'Air Arabia Maroc', LH: 'Lufthansa', KL: 'KLM', BJ: 'Nouvelair', V7: 'Volotea', HV: 'Transavia', U2: 'easyJet', FR: 'Ryanair', OV: 'SalamAir', WY: 'Oman Air', GF: 'Gulf Air', KU: 'Kuwait Airways' };
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const q = l => (l === 'en' ? '' : `?lang=${l}`);

const CACHE_MS = 6 * 60 * 60 * 1000;
const cache = new Map();
async function loadFares(route) {
  const hit = cache.get(route.slug);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.fares;
  let fares = [];
  if (flightSearch.configured()) {
    const r = await flightSearch.searchCheapest({ origin: route.from, destination: route.to }).catch(() => null);
    fares = (r && !r.illustrative && r.estimates) || [];
  }
  cache.set(route.slug, { at: Date.now(), fares });
  return fares;
}

const CREDIT = l => `<p class="siteCredit" style="text-align:center;margin:32px 0 12px"><a class="asm-credit" href="https://www.ateliersurmesure.ca" target="_blank" rel="noopener" style="display:inline-block;padding:6px 14px;border:1px solid currentColor;border-radius:999px;font-size:12px;font-weight:600;line-height:1.2;text-decoration:none;color:inherit;white-space:nowrap">${{ en: 'Website by', fr: 'Site conçu par', ar: 'تصميم الموقع:' }[l] || 'Website by'} Atelier Sur Mesure</a></p>`;
function shell(l, head, body) {
  const side = l === 'ar' ? 'right' : 'left';
  return `<!doctype html>
<html lang="${l}"${l === 'ar' ? ' dir="rtl"' : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${head}
<style>
body{font-family:system-ui,-apple-system,sans-serif;max-width:760px;margin:0 auto;padding:24px 16px;line-height:1.6;color:#1a1a1a;background:#fff}
h1{font-size:1.4rem;margin-top:0}h2{font-size:1.05rem;margin-top:28px}
table{width:100%;border-collapse:collapse;font-size:.95rem}th,td{padding:8px 6px;border-bottom:1px solid #e5e5e5;text-align:${side}}
.price{font-weight:700;white-space:nowrap}.note{color:#666;font-size:.85rem;margin-top:20px}
.routes{list-style:none;padding:0;display:flex;gap:10px 16px;flex-wrap:wrap}
.cta{display:inline-block;margin-top:18px;font-weight:600;background:#1f6f5c;color:#fff;padding:10px 16px;border-radius:10px;text-decoration:none}
@media(max-width:560px){.hide-sm{display:none}}
</style>
</head>
<body>
${body}
${CREDIT(l)}
<script async src="https://www.ateliersurmesure.ca/t.js"></script>
</body>
</html>
`;
}
const arrow = l => (l === 'ar' ? '←' : '→');
const routeLinks = (l, except) => ROUTES.filter(r => r.slug !== except).map(r =>
  `<li><a href="/flights/${r.slug}${q(l)}">${esc(CITY[r.from][l])} ${arrow(l)} ${esc(CITY[r.to][l])}</a></li>`).join('\n');
const fmtDuration = m => (m ? `${Math.floor(m / 60)}h${String(m % 60).padStart(2, '0')}` : '');

function renderRoutePage({ route, fares, lang, head }) {
  const l = LANGS.includes(lang) ? lang : 'en';
  const c = COPY[l];
  const a = CITY[route.from][l], b = CITY[route.to][l];
  const rows = fares.map(f => `<tr><td>${esc(f.departureAt)}</td><td>${esc(AIRLINES[f.airline] || f.airline)}</td><td>${f.transfers ? esc(f.transfers) : esc(c.direct)}</td><td class="hide-sm">${esc(fmtDuration(f.durationMinutes))}</td><td class="price">$${esc(Math.round(f.priceUsd))}</td><td>${f.url ? `<a href="${esc(f.url)}" rel="sponsored nofollow noopener" target="_blank">${esc(c.book)}</a>` : ''}</td></tr>`).join('\n');
  const table = fares.length
    ? `<table><thead><tr><th>${esc(c.date)}</th><th>${esc(c.airline)}</th><th>${esc(c.stops)}</th><th class="hide-sm">${esc(c.time)}</th><th>${esc(c.price)}</th><th></th></tr></thead><tbody>\n${rows}\n</tbody></table>`
    : `<p>${esc(c.none)}</p>`;
  return shell(l, head, `<h1>${esc(c.h1(a, b))}</h1>
<p>${esc(c.intro)}</p>
${table}
<p><a class="cta" href="/${q(l)}">${esc(c.cta)}</a></p>
<p class="note">${esc(c.source)}</p>
<h2>${esc(c.all)}</h2>
<ul class="routes">
${routeLinks(l, route.slug)}
</ul>`);
}

function renderIndexPage({ cheapest, lang, head }) {
  const l = LANGS.includes(lang) ? lang : 'en';
  const c = COPY[l];
  const items = ROUTES.map(r => {
    const f = cheapest[r.slug];
    return `<li><a href="/flights/${r.slug}${q(l)}">${esc(CITY[r.from][l])} ${arrow(l)} ${esc(CITY[r.to][l])}</a>${f ? ` <span class="price">$${esc(Math.round(f.priceUsd))}</span>` : ''}</li>`;
  }).join('\n');
  return shell(l, head, `<h1>${esc(c.indexH1)}</h1>
<p>${esc(c.indexIntro)}</p>
<ul class="routes" style="display:block">
${items}
</ul>
<p><a class="cta" href="/${q(l)}">${esc(c.cta)}</a></p>
<p class="note">${esc(c.source)}</p>`);
}

// The index shows only fares already cached by route-page visits, so one
// index hit never fans out into 20 API calls.
const cachedCheapest = () => Object.fromEntries([...cache].filter(([, v]) => v.fares.length && Date.now() - v.at < CACHE_MS).map(([k, v]) => [k, v.fares[0]]));

module.exports = { ROUTES, BY_SLUG, CITY, LANGS, seoMeta, loadFares, cachedCheapest, renderRoutePage, renderIndexPage, _cache: cache };
