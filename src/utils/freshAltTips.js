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
const FRESH_ALT_HINTS = [
  {
    nameMatch: /sweet potato noodle|spiraliz/i,
    stepMatch: /sweet potato noodle|zoodle|spiraliz/i,
    note: 'Using a fresh sweet potato instead? Spiralize it into noodles (or julienne thin with a knife) first.',
  },
  {
    nameMatch: /sweet potato/i,
    stepMatch: /sweet potato/i,
    note: 'Using a fresh sweet potato instead? Peel and dice into ½-inch cubes first.',
  },
  {
    nameMatch: /green beans/i,
    stepMatch: /\bbeans?\b/i,
    note: 'Using fresh green beans instead? Trim the ends first.',
  },
  {
    nameMatch: /broccoli/i,
    stepMatch: /broccoli/i,
    note: 'Using fresh broccoli instead? Cut into small florets first -- cook time stays about the same.',
  },
  {
    nameMatch: /holy trinity|seasoning blend/i,
    stepMatch: /seasoning blend/i,
    note: 'No frozen blend on hand? Dice fresh onion, celery, and bell pepper instead.',
  },
  {
    nameMatch: /hash brown/i,
    stepMatch: /hash brown/i,
    note: 'Using fresh potatoes instead? Shred them and pan-fry until golden before adding.',
  },
  {
    nameMatch: /mixed veg|stir fry vegetables/i,
    stepMatch: /\bveg\w*/i,
    note: 'Using fresh vegetables instead? Dice into bite-sized pieces first.',
  },
];

// Only components that are actually the frozen/pre-cut convenience version
// get a note -- this guard keeps the hints from misfiring on an unrelated
// component that happens to share a word (e.g. "Beef & Broccoli Stir-Fry
// Sauce" isn't a vegetable at all, and a hypothetical fresh-broccoli side
// ingredient wouldn't need a tip telling people to use fresh broccoli).
const FROZEN_GUARD_RE = /\b(frozen|steam-bag|microwave bag)\b/i;

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
