'use strict';

// Turns the conversation (not just the last message) into a search plan for
// the retrieval layer: which countries and which job/study/treatment terms
// to look up. A short follow-up like "go ahead" or "options in Turkey" keeps
// the topic of the earlier turns. A small model translates Arabic/French
// wording into the English/French/German terms the feeds are written in;
// without it (no key, timeout, bad JSON) a deterministic fallback still runs.

const PLAN_MODEL = process.env.ANTHROPIC_PLAN_MODEL || 'claude-haiku-4-5-20251001';
const PLAN_TIMEOUT_MS = 8000;

// Canonical names match jobs.country / study_opportunities.country values.
const COUNTRY_ALIASES = {
  'United Arab Emirates': ['uae', 'emirates', 'dubai', 'abu dhabi', 'sharjah', 'emirats', 'الامارات', 'الإمارات', 'دبي', 'ابوظبي', 'أبوظبي', 'الشارقة'],
  'Saudi Arabia': ['saudi', 'ksa', 'riyadh', 'jeddah', 'arabie saoudite', 'السعودية', 'الرياض', 'جدة'],
  'Qatar': ['qatar', 'doha', 'قطر', 'الدوحة'],
  'Kuwait': ['kuwait', 'koweit', 'الكويت'],
  'Bahrain': ['bahrain', 'bahrein', 'البحرين'],
  'Oman': ['oman', 'muscat', 'عمان', 'مسقط'],
  'Turkey': ['turkey', 'turkiye', 'türkiye', 'turquie', 'istanbul', 'ankara', 'تركيا', 'اسطنبول', 'إسطنبول'],
  'France': ['france', 'paris', 'lyon', 'marseille', 'فرنسا', 'باريس'],
  'Germany': ['germany', 'allemagne', 'deutschland', 'berlin', 'munich', 'المانيا', 'ألمانيا', 'برلين'],
  'United Kingdom': ['uk', 'united kingdom', 'england', 'britain', 'london', 'royaume-uni', 'angleterre', 'بريطانيا', 'انجلترا', 'إنجلترا', 'لندن'],
  'Canada': ['canada', 'quebec', 'québec', 'montreal', 'montréal', 'toronto', 'كندا', 'مونتريال', 'كيبيك'],
  'Australia': ['australia', 'australie', 'sydney', 'melbourne', 'استراليا', 'أستراليا'],
  'Lebanon': ['lebanon', 'liban', 'beirut', 'لبنان', 'بيروت'],
  'Jordan': ['jordan', 'jordanie', 'amman', 'الاردن', 'الأردن'],
  'Egypt': ['egypt', 'egypte', 'cairo', 'مصر', 'القاهرة'],
};
const COUNTRY_NAMES = Object.keys(COUNTRY_ALIASES);
const GULF = ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman'];
const EUROPE = ['France', 'Germany', 'United Kingdom'];
const REGION_ALIASES = [
  [GULF, ['gulf', 'gcc', 'golfe', 'الخليج']],
  [EUROPE, ['europe', 'european', 'اوروبا', 'أوروبا', 'اوربا']],
];

function norm(s) {
  return String(s || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f\u064b-\u065f\u0670]/g, '');
}

function detectCountries(text) {
  const t = ` ${norm(text).replace(/[^a-z0-9\u0600-\u06ff-]+/g, ' ')} `;
  const found = [];
  const has = (alias) => {
    const a = norm(alias);
    return /^[a-z]/.test(a) ? t.includes(` ${a} `) : t.includes(a);
  };
  for (const [name, aliases] of Object.entries(COUNTRY_ALIASES)) {
    if (aliases.some(has) && !found.includes(name)) found.push(name);
  }
  for (const [countries, aliases] of REGION_ALIASES) {
    if (aliases.some(has)) countries.forEach(c => { if (!found.includes(c)) found.push(c); });
  }
  return found;
}

// Recent user turns, newest last: enough topic memory for short follow-ups.
function conversationText(history, message, maxUserTurns = 4) {
  const userTurns = (Array.isArray(history) ? history : [])
    .filter(m => m && m.role === 'user' && typeof m.content === 'string')
    .map(m => m.content)
    .slice(-(maxUserTurns - 1));
  return [...userTurns, message || ''].join('\n').slice(0, 3000);
}

function cleanList(v, max, maxLen = 40) {
  return (Array.isArray(v) ? v : [])
    .filter(x => typeof x === 'string')
    .map(x => x.trim().slice(0, maxLen))
    .filter(Boolean)
    .slice(0, max);
}

function fallbackPlan(text) {
  return { countries: detectCountries(text), keywords: [], topic: 'unknown', source: 'fallback' };
}

const PLAN_INSTRUCTIONS = [
  'You turn a job/study/travel/medical seeker\'s recent messages into a database search plan.',
  'Reply with ONLY a JSON object, no prose: {"topic": "jobs"|"study"|"medical"|"travel"|"other", "countries": [...], "keywords": [...]}.',
  `countries: destination countries the seeker wants, as English names from this list when possible: ${COUNTRY_NAMES.join(', ')}. "Gulf" = ${GULF.join(', ')}. "Europe" = ${EUROPE.join(', ')}. Empty list if none is named or "anywhere".`,
  'keywords: up to 8 short search terms for job titles, fields of study or treatments, in English, plus the French and German equivalents for jobs (feeds are in those languages). Example for "سواق": ["driver", "chauffeur", "Fahrer", "delivery", "livreur"]. If the seeker says any job or any field is fine, use accessible entry-level terms instead: ["driver", "warehouse", "cleaner", "kitchen", "delivery", "construction", "Lagerhelfer", "manutentionnaire"].',
  'Use the whole conversation: a short last message ("go ahead", "in Turkey") keeps the topic of the earlier messages.',
].join('\n');

async function buildSearchPlan({ history, message, profileHint = '' }) {
  const text = conversationText(history, message);
  const base = fallbackPlan(text);
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return base;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), PLAN_TIMEOUT_MS);
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: PLAN_MODEL,
        max_tokens: 300,
        system: PLAN_INSTRUCTIONS,
        messages: [{ role: 'user', content: `${profileHint ? `Profile: ${profileHint}\n` : ''}Recent messages (oldest first):\n${text}` }],
      }),
    });
    if (!r.ok) return base;
    const body = await r.json();
    const raw = (body.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    const m = raw.match(/\{[\s\S]*\}/);
    if (!m) return base;
    const plan = JSON.parse(m[0]);
    const countries = cleanList(plan.countries, 8, 60);
    for (const c of base.countries) if (!countries.includes(c)) countries.push(c);
    return {
      countries,
      keywords: cleanList(plan.keywords, 8),
      topic: typeof plan.topic === 'string' ? plan.topic : 'unknown',
      source: 'model',
    };
  } catch (e) {
    return base;
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { buildSearchPlan, detectCountries, conversationText, fallbackPlan, COUNTRY_ALIASES };
