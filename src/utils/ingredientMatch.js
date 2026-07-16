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

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function wordBoundaryIncludes(text, phrase) {
  if (!phrase) return false;
  return new RegExp(`\\b${escapeRegExp(phrase)}\\b`, 'i').test(text);
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
  if (wordBoundaryIncludes(stepText, corePhrase)) return true;
  return words.some((w) => {
    if (w.length <= 3) return false;
    if (sharedWords && sharedWords.has(w.toLowerCase())) return false;
    return wordBoundaryIncludes(stepText, w);
  });
}

// Returns the indices into `components` (preserving original index, so
// callers can look up unit-toggle state and overrides keyed by that same
// index) of every component plausibly used in this step.
export function matchIngredientsForStep(stepText, components) {
  // Words that recur across 2+ components in this recipe can't be trusted
  // as a lone matching signal (see stepMentionsIngredient above) -- compute
  // that set once per call.
  const wordCounts = new Map();
  for (const c of components) {
    for (const w of new Set(coreWords(c.name).map((w) => w.toLowerCase()))) {
      wordCounts.set(w, (wordCounts.get(w) || 0) + 1);
    }
  }
  const sharedWords = new Set([...wordCounts.entries()].filter(([, count]) => count > 1).map(([w]) => w));

  return components
    .map((c, i) => (stepMentionsIngredient(stepText, c.name, sharedWords) ? i : null))
    .filter((i) => i !== null);
}
