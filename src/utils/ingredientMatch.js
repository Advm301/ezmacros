// Matches a recipe's ingredient components against a single instruction
// step's text, so the cook wizard can show "what you need for this step"
// alongside the amounts, instead of making people scroll back to the
// decide screen to remember quantities.

const STOPWORD_DESCRIPTORS = new Set([
  'ground', 'fresh', 'frozen', 'bagged', 'shredded', 'sliced', 'diced',
  'boneless', 'skinless', 'raw', 'cooked', 'canned', 'microwaveable',
  'bottled', 'dried', 'whole', 'liquid', 'grated', 'chopped', 'pouch',
  'fillet', 'fillets', 'thawed', 'drained', 'pre-washed', 'pre-shredded',
  'carton',
]);

// Words that describe a FORM/unit rather than identify a specific
// ingredient ("slice", "piece", "strip"...) -- too generic to trust as a
// lone matching signal once plural normalization is in play. Without this
// guard, singularizing "slices" -> "slice" would make "Cheddar Slice" match
// any step mentioning e.g. "bread slices", which has nothing to do with
// cheese. Still fine as part of a full phrase ("cheddar slice"), just not
// as the only distinguishing word.
const GENERIC_FORM_WORDS = new Set(['slice', 'piece', 'strip', 'cube', 'chunk', 'wedge']);

// A handful of common informal/abbreviated names people actually use in
// instruction text, mapped to the word that appears in the ingredient data.
// Tuned against real gaps found in this dataset (e.g. "guac" for
// "Guacamole"), not guessed speculatively.
const ALIASES = {
  guac: 'guacamole',
};

// Strips a plural "s"/"es" so "tortilla" matches "tortillas", "jalapeño"
// matches "jalapeños", "tomato" matches "tomatoes", etc. -- instruction text
// and ingredient names don't always agree on singular vs. plural. Guards
// against words that end in "se"/"ss" naturally (cheese, mayonnaise) so
// those aren't mangled into "chees"/"mayonnaise" -> "mayonnais".
function singularize(word) {
  if (word.endsWith('oes') && word.length > 4) return word.slice(0, -2);
  if (word.endsWith('s') && !word.endsWith('ss') && !word.endsWith('se') && word.length > 3) {
    return word.slice(0, -1);
  }
  return word;
}

function normalizeWord(w) {
  const lower = w.toLowerCase();
  return singularize(ALIASES[lower] || lower);
}

// Extracts letter-only tokens (covers accented letters like the ñ in
// "jalapeño") and normalizes each one, so comparisons are singular/alias
// tolerant on both sides regardless of how the source text is punctuated.
function tokenize(text) {
  return (text.match(/[a-zà-öø-ÿ]+/gi) || []).map(normalizeWord);
}

// True if `phrase` (one or more words) appears as a contiguous run of
// normalized tokens inside `text` -- a token-sequence match instead of a
// literal regex, so "diced onions" still matches "Diced Onion" and
// "guacamole" still matches "guac" via the alias map.
function wordBoundaryIncludes(text, phrase) {
  if (!phrase) return false;
  const phraseTokens = phrase.split(/\s+/).filter(Boolean).map(normalizeWord);
  if (phraseTokens.length === 0) return false;
  const textTokens = tokenize(text);
  for (let i = 0; i <= textTokens.length - phraseTokens.length; i++) {
    if (phraseTokens.every((t, j) => textTokens[i + j] === t)) return true;
  }
  return false;
}

// Strips parenthetical qualifiers (quantities, prep notes -- "Ground
// Turkey (93% lean)") and known packaging/prep descriptor words. Which
// words are "core" vs. "descriptor" is a judgment call -- "Garlic Powder"
// keeps "powder" since that's the actual ingredient, "Grated Parmesan"
// drops "grated" since that's just prep -- but it's tuned against the
// real recipe data, not guessed blind.
function coreWords(name) {
  const noParens = name.replace(/\s*\([^)]*\)/g, '').trim();
  const words = noParens.split(/\s+/).filter((w) => !STOPWORD_DESCRIPTORS.has(w.toLowerCase()));
  return words.length > 0 ? words : noParens.split(/\s+/);
}

// True if `componentName` is plausibly referenced in `stepText`. Tries the
// full core phrase first (best precision: "garlic powder", "egg white"),
// then falls back to any individual core word longer than 3 characters
// ("breadcrumbs" out of "Panko Breadcrumbs", "cod" out of "Cod Fillet").
// The fallback is deliberately loose -- a false positive here just shows
// one extra reference chip on a step (low cost), while a false negative
// hides an amount someone actually needs.
//
// `sharedWords` (optional) is a set of lowercased words that appear in
// more than one component's name within the same recipe -- e.g. "Beef"
// shows up in both "Ground Beef" and "Beef Stroganoff Sauce Mix". Matching
// on a shared word alone is unreliable: a step that just says "add ground
// beef" would wrongly also flag the stroganoff sauce mix as used in that
// step, even though the sauce isn't introduced until later. When a word is
// shared across components, only the full core phrase can confirm that
// specific component -- the lone word is skipped.
export function stepMentionsIngredient(stepText, componentName, sharedWords) {
  const words = coreWords(componentName);
  const corePhrase = words.join(' ');
  // Note: a corePhrase can collapse to a single word once descriptors are
  // stripped ("Diced Onions" loses "Diced" and becomes just "Onions"), so
  // it's possible for this to overlap with another component's shared word
  // (e.g. "Onion Powder") in a step that only mentions one of them. Tried
  // blocking that case the same way the fallback loop does, but it also
  // suppressed the correct match (a step that only says "jar onions" is
  // clearly about Diced Onions, not Onion Powder) -- and a false negative
  // (hiding an amount someone needs) is worse than the rare over-match this
  // allows, per the same tradeoff the fallback loop already accepts.
  if (wordBoundaryIncludes(stepText, corePhrase)) return true;
  return words.some((w) => {
    if (w.length <= 3) return false;
    if (sharedWords && sharedWords.has(normalizeWord(w))) return false;
    if (GENERIC_FORM_WORDS.has(normalizeWord(w))) return false;
    return wordBoundaryIncludes(stepText, w);
  });
}

// Returns the indices into `components` (preserving original index, so
// callers can look up unit-toggle state and overrides keyed by that same
// index) of every component plausibly used in this step.
export function matchIngredientsForStep(stepText, components) {
  // Words that recur across 2+ components in this recipe can't be trusted
  // as a lone matching signal (see stepMentionsIngredient above) -- compute
  // that set once per call. Normalized (singularized) so "Onion" (from
  // "Onion Powder") and "Onions" (from "Diced Onions") are recognized as
  // the same shared word -- otherwise the singular/plural mismatch would
  // hide the collision and let both cross-match each other's steps.
  const wordCounts = new Map();
  for (const c of components) {
    for (const w of new Set(coreWords(c.name).map((w) => normalizeWord(w)))) {
      wordCounts.set(w, (wordCounts.get(w) || 0) + 1);
    }
  }
  const sharedWords = new Set([...wordCounts.entries()].filter(([, count]) => count > 1).map(([w]) => w));

  return components
    .map((c, i) => (stepMentionsIngredient(stepText, c.name, sharedWords) ? i : null))
    .filter((i) => i !== null);
}
