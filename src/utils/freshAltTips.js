// Frozen, pre-cut convenience produce (steam-bag broccoli, bagged diced
// sweet potato, etc.) saves the peeling/dicing/chopping labor that fresh
// versions of the same ingredient require. Some people prefer to buy fresh
// and do that prep themselves -- this maps a component name to a short,
// supportive note on how to substitute fresh for frozen, shown in the cook
// wizard right where that ingredient comes into play.
//
// Each hint carries two regexes: `nameMatch` identifies the component itself
// (checked against the ingredient's name), and `stepMatch` finds which
// instruction step actually calls for it. These are deliberately separate
// from the general-purpose ingredientMatch.js matcher used for "For This
// Step" chips -- that matcher skips short/generic words like "veg" as too
// unreliable across arbitrary ingredient names, but here we already know
// exactly which ingredient we're looking for from the component itself, so
// a plainer, more permissive regex on the step text is safe (recipes with a
// frozen-veg component consistently just say "veg" in the step, e.g.
// "Microwave frozen veg 3 min").
//
// Checked in order, most specific first (e.g. "sweet potato noodle" before
// the more general "sweet potato"), so a single component only ever matches
// one hint.
//
// `freshName` is what the ingredient list displays in place of the
// original frozen/convenience name when someone's flipped on "Prefer
// Fresh" for this recipe (see RecipeModal's useFresh state below) --
// deliberately just a name swap, not a recalculated quantity: there's no
// reliable universal fresh-to-frozen conversion ratio across every one of
// these, so the amount stays what the recipe wrote and the note (already
// shown on the matching cook step) covers the prep difference instead of
// pretending to know an exact number.
const FRESH_ALT_HINTS = [
  {
    // Matches "White Rice Pouch (...)" and "Rice Pouch (...)" in all their
    // parenthetical variants (microwaveable, 1 per meal, day-old cooked,
    // etc.) without also catching unrelated components that just happen to
    // contain the word "rice" elsewhere, like "Rice Vinegar" or "Rice
    // Cakes" (a snack, not a starch swap-in) -- this is the single most
    // common convenience ingredient across the catalog, and the one
    // explicitly called out alongside frozen veg in the original feedback
    // this feature is based on.
    nameMatch: /rice pouch/i,
    // Broader than "rice pouch" on purpose -- plenty of recipes' actual
    // instruction steps just say "Microwave rice 90 sec" or "build bowl
    // with rice" without ever repeating the word "pouch" (the component
    // list is what confirms it's the pouch/convenience version; this only
    // needs to find a step that's *about* rice at all). Safe to be this
    // broad since nameMatch has already confirmed the recipe actually has
    // a rice-pouch component before this is ever checked.
    stepMatch: /\brice\b/i,
    freshName: 'Rice (freshly cooked)',
    // Real stovetop instructions, not just "use about the same amount" --
    // most people don't own a rice cooker, so that's the default method
    // spelled out here rather than assumed.
    note: 'Using freshly-cooked rice instead of the pouch? Stovetop method: 1 part rice to 1½–2 parts water in a pot, bring to a boil, cover, turn to low, and simmer 15–18 min until the water\'s absorbed. Rest covered off the heat for 5 min, then fluff with a fork. Use about the same amount as the pouch calls for.',
  },
  {
    nameMatch: /sweet potato noodle|spiraliz/i,
    stepMatch: /sweet potato noodle|zoodle|spiraliz/i,
    freshName: 'Sweet Potato (fresh, spiralized)',
    note: 'Using a fresh sweet potato instead? Spiralize it into noodles (or julienne thin with a knife) first.',
  },
  {
    nameMatch: /sweet potato/i,
    stepMatch: /sweet potato/i,
    freshName: 'Sweet Potato (fresh)',
    note: 'Using a fresh sweet potato instead? Peel and dice into ½-inch cubes first.',
  },
  {
    nameMatch: /green beans/i,
    stepMatch: /\bbeans?\b/i,
    freshName: 'Green Beans (fresh)',
    note: 'Using fresh green beans instead? Trim the ends first.',
  },
  {
    nameMatch: /broccoli/i,
    stepMatch: /broccoli/i,
    freshName: 'Broccoli (fresh florets)',
    note: 'Using fresh broccoli instead? Cut into small florets first -- cook time stays about the same.',
  },
  {
    nameMatch: /holy trinity|seasoning blend/i,
    stepMatch: /seasoning blend/i,
    freshName: 'Onion, Celery & Bell Pepper (fresh, diced)',
    note: 'No frozen blend on hand? Dice fresh onion, celery, and bell pepper instead.',
  },
  {
    nameMatch: /hash brown/i,
    stepMatch: /hash brown/i,
    freshName: 'Potatoes (fresh, shredded)',
    note: 'Using fresh potatoes instead? Shred them and pan-fry until golden before adding.',
  },
  {
    nameMatch: /mixed veg|stir fry vegetables/i,
    stepMatch: /\bveg\w*/i,
    freshName: 'Mixed Vegetables (fresh, diced)',
    note: 'Using fresh vegetables instead? Dice into bite-sized pieces first.',
  },
];

// Whether someone prefers fresh ingredients over the recipe's written
// frozen/convenience default -- a single device-wide "remembered" value
// (not per-recipe), seeding each newly-opened recipe's own toggle so it
// doesn't reset back to off every time (see RecipeModal's useFresh state).
// Deliberately not per-account/Supabase-backed -- this is a kitchen habit,
// not account data, and doesn't need to survive a device switch to be
// useful.
const PREFER_FRESH_KEY = 'quickprep_prefer_fresh';

export function readPreferFresh() {
  try {
    return localStorage.getItem(PREFER_FRESH_KEY) === '1';
  } catch {
    return false;
  }
}

export function savePreferFresh(value) {
  try {
    localStorage.setItem(PREFER_FRESH_KEY, value ? '1' : '0');
  } catch {
    // Not worth blocking the toggle on -- it just won't be remembered
    // next time if storage is unavailable.
  }
}

// Only components that are actually the frozen/pre-made convenience version
// get a note -- this guard keeps the hints from misfiring on an unrelated
// component that happens to share a word (e.g. "Beef & Broccoli Stir-Fry
// Sauce" isn't a vegetable at all, and a hypothetical fresh-broccoli side
// ingredient wouldn't need a tip telling people to use fresh broccoli).
// Covers shelf-stable microwaveable pouches (rice) as well as actually-
// frozen items -- "convenience format" is the real category here, not
// "frozen" specifically, and rice pouches say "microwaveable"/"pouch" in
// their name rather than "frozen".
const FROZEN_GUARD_RE = /\b(frozen|steam-bag|microwave bag|pouch|microwaveable)\b/i;

// Returns the hint object (not just the note) for a component name, or null.
// Exported separately from the note text so callers can also use
// `stepMatch` to locate the right instruction step.
export function getFreshAltHint(componentName) {
  if (!componentName || !FROZEN_GUARD_RE.test(componentName)) return null;
  return FRESH_ALT_HINTS.find((h) => h.nameMatch.test(componentName)) || null;
}

export function getFreshAltNote(componentName) {
  return getFreshAltHint(componentName)?.note || null;
}
