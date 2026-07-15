// Turns a recipe's raw instruction text into a short "microwaving rice,
// browning meat, and mixing a sauce" style preview. There's no curated
// summary field on the recipe data (100+ recipes, all free-text
// instructions), so this is a heuristic scan for a known cooking verb at
// the start of each clause plus a short object -- e.g. "Mix soy sauce +
// sriracha..." becomes "mixing soy sauce". Anything it can't parse
// cleanly is dropped rather than shown as a clunky partial phrase; if
// fewer than two confident phrases turn up, the caller gets `null` and
// should just skip the summary line entirely.

// Multi-word verbs must be checked before any single-word verb that
// shares their first token would otherwise shadow them.
const VERB_PHRASES = [['air fry', 'air frying']];

const VERBS = {
  microwave: 'microwaving', bake: 'baking', broil: 'broiling', roast: 'roasting',
  grill: 'grilling', fry: 'frying', saute: 'sautéing', sauté: 'sautéing',
  sear: 'searing', brown: 'browning', simmer: 'simmering', boil: 'boiling',
  steam: 'steaming', poach: 'poaching', blanch: 'blanching', mix: 'mixing',
  whisk: 'whisking', stir: 'stirring', combine: 'combining', fold: 'folding',
  toss: 'tossing', blend: 'blending', mash: 'mashing', knead: 'kneading',
  marinate: 'marinating', season: 'seasoning', drizzle: 'drizzling',
  spread: 'spreading', spray: 'spraying', sprinkle: 'sprinkling', chop: 'chopping',
  dice: 'dicing', mince: 'mincing', slice: 'slicing', shred: 'shredding',
  grate: 'grating', drain: 'draining', rest: 'resting', chill: 'chilling',
  freeze: 'freezing', cook: 'cooking', heat: 'heating', melt: 'melting',
  preheat: 'preheating', pat: 'patting', cover: 'covering', flip: 'flipping',
  assemble: 'assembling', build: 'building', top: 'topping', garnish: 'garnishing',
  serve: 'serving', glaze: 'glazing', coat: 'coating', dip: 'dipping',
  wrap: 'wrapping', layer: 'layering', reduce: 'reducing', deglaze: 'deglazing',
  caramelize: 'caramelizing', char: 'charring', pour: 'pouring', add: 'adding',
  place: 'placing', arrange: 'arranging', brush: 'brushing', dust: 'dusting',
  crisp: 'crisping', warm: 'warming', toast: 'toasting', dredge: 'dredging',
  bread: 'breading',
};

const STOPWORDS = new Set([
  'with', 'until', 'for', 'at', 'on', 'in', 'over', 'to', 'from', 'into',
  'onto', 'under', 'before', 'after', 'while', 'about', 'through', 'and',
  'then', 'once',
]);

function buildPhrase(gerund, rest) {
  // Stop the object at the first digit, "+", dash, stopword, or missing
  // word -- whatever's left is the short object we show.
  const words = rest.trim().split(/\s+/);
  const objectWords = [];
  for (const w of words) {
    if (objectWords.length >= 3) break;
    const clean = w.replace(/[.,;:!]+$/, '');
    if (!clean) break;
    if (/\d/.test(clean)) break;
    if (clean === '+' || clean === '—' || clean === '–' || clean === '-') break;
    if (STOPWORDS.has(clean.toLowerCase())) break;
    objectWords.push(clean.toLowerCase());
  }
  if (objectWords.length === 0) return null;
  return `${gerund} ${objectWords.join(' ')}`;
}

function extractPhrase(clause) {
  const trimmed = clause.trim();
  if (!trimmed) return null;

  for (const [phrase, gerund] of VERB_PHRASES) {
    if (new RegExp(`^${phrase}\\b`, 'i').test(trimmed)) {
      return buildPhrase(gerund, trimmed.slice(phrase.length));
    }
  }

  const match = trimmed.match(/^([a-zA-Z]+)\b(.*)$/s);
  if (!match) return null;
  const gerund = VERBS[match[1].toLowerCase()];
  if (!gerund) return null;
  return buildPhrase(gerund, match[2]);
}

// Splits a raw instruction string into per-sentence clauses. A clause that
// opens with a dependent setup phrase ("While the oven heats, microwave
// rice...") won't start with a recognizable verb, so everything before
// its first comma is dropped and the check retries on what's left.
function splitClauses(instruction) {
  return instruction
    .split(/\.\s+/)
    .map((c) => c.trim())
    .filter(Boolean)
    .map((clause) => {
      const firstWord = clause.match(/^[a-zA-Z]+/)?.[0]?.toLowerCase();
      const startsWithVerb =
        (firstWord && VERBS[firstWord]) ||
        VERB_PHRASES.some(([p]) => clause.toLowerCase().startsWith(p));
      if (!startsWithVerb && clause.includes(',')) {
        return clause.slice(clause.indexOf(',') + 1).trim();
      }
      return clause;
    });
}

export function summarizeSteps(instructions) {
  if (!instructions || instructions.length === 0) return null;

  const seenVerbs = new Set();
  const phrases = [];

  outer: for (const instruction of instructions) {
    for (const clause of splitClauses(instruction)) {
      const phrase = extractPhrase(clause);
      if (!phrase) continue;
      const verbKey = phrase.split(' ')[0];
      if (seenVerbs.has(verbKey)) continue;
      seenVerbs.add(verbKey);
      phrases.push(phrase);
      if (phrases.length >= 3) break outer;
    }
  }

  if (phrases.length < 2) return null;
  if (phrases.length === 2) return `${phrases[0]} and ${phrases[1]}`;
  return `${phrases[0]}, ${phrases[1]}, and ${phrases[2]}`;
}
