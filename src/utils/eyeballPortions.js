// "Easy Mode" -- describes each ingredient amount in relatable kitchen
// terms (a palm-sized piece of chicken, a pinch of paprika, a splash of
// soy sauce) alongside its precise gram/ml amount, for anyone cooking
// without a scale or measuring spoons. Built on the "hand portion" method,
// a real, widely-used nutrition-coaching heuristic -- palm =~ a protein
// portion, fist =~ a grain/starch portion, cupped hand =~ a produce
// portion -- rather than invented language, so the phrasing reads as a
// genuine technique instead of a vague guess.
//
// Takes the SAME { name, unit, quantity } shape as
// utils/ingredientPricing.js/ingredientNutrition.js, and deliberately
// expects the caller to pass an already-scaled quantity (see
// RecipeModal.jsx's `components`, which already accounts for the chosen
// batch size and any proteinOption/manual override) -- this file has no
// opinion on servings math, it just turns whatever real quantity it's
// given into a phrase, which is what makes it correctly rescale for any
// serving count for free: double the batch, the quantity passed in
// doubles, and "about 1 palm-sized piece" naturally becomes "about 2".
//
// Same device-remembered toggle pattern as freshAltTips.js's
// readPreferFresh/savePreferFresh.

const STORAGE_KEY = 'quickprep_easy_mode';

export function readEasyMode() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function saveEasyMode(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value ? '1' : '0');
  } catch {
    // Device storage unavailable -- toggle just won't persist, not fatal.
  }
}

// Rules are tested in order, first match wins -- same convention as
// ingredientPricing.js/ingredientNutrition.js, most of these patterns
// reused directly from ingredientNutrition.js since "what kind of
// ingredient is this" is the same question either way.
//
// style:
//   'hand'   -- scales as "about N <noun>(s)" against a reference weight
//               (baseG). Used for palm/fist/cupped-hand/small-handful
//               portions -- the noun pair is what actually distinguishes
//               them (see HAND_STYLES below for the shared implementation).
//   'volume' -- a continuous drizzle -> tablespoons -> cups ladder, for
//               anything spoonable or pourable (oils, sauces, broth,
//               milk). Works off either ml or g -- for spoonable items
//               recorded in grams (butter, sour cream, honey) grams are
//               treated as roughly ml-equivalent, which is close enough
//               at "eyeball" precision.
//   'pinch'  -- a separate threshold ladder for small dry seasoning
//               amounts, since "a pinch" doesn't scale as "N pinches" the
//               way a handful does -- it graduates pinch -> sprinkle ->
//               tsp -> tbsp instead.
//   'none'   -- already intuitive as-is (whole eggs, a tortilla, a whole
//               banana) -- no phrase is shown, rather than stating the
//               obvious.
const RULES = [
  // Broths/stocks and anything explicitly named as a seasoning/spice
  // product MUST come first. Two failure modes, same root cause
  // (first-match-wins picking up an incidental substring instead of the
  // real category): "Chicken Broth" would otherwise match the /\bchicken\b/i
  // palm-portion rule further down and then get rejected as a unit
  // mismatch (broth is ml, that rule only accepts g) -- silently producing
  // no phrase for a 2000ml carton. "Lemon Pepper Seasoning" would match
  // /lemon/i in the produce 'none' list below and get treated as a whole
  // lemon; "Everything Bagel Seasoning" would match /bagel/i and get
  // treated as a whole bagel. Both are real product names in this catalog,
  // not hypothetical. Putting broth and any *Seasoning/*Powder/*Spice
  // product name ahead of everything else fixes all three.
  { pattern: /broth|stock|bouillon/i, style: 'volume' },
  { pattern: /seasoning|spice blend|\bspice\b/i, style: 'pinch' },

  // --- Proteins (hand: palm) ---
  { pattern: /ground turkey/i, style: 'hand', baseG: 110, singular: 'palm-sized portion', plural: 'palm-sized portions' },
  { pattern: /ground (beef|chuck)/i, style: 'hand', baseG: 110, singular: 'palm-sized portion', plural: 'palm-sized portions' },
  { pattern: /ground chicken/i, style: 'hand', baseG: 110, singular: 'palm-sized portion', plural: 'palm-sized portions' },
  { pattern: /\b(steak|sirloin|flank|ribeye)\b/i, style: 'hand', baseG: 110, singular: 'palm-sized piece', plural: 'palm-sized pieces' },
  { pattern: /jerky/i, style: 'hand', baseG: 28, singular: 'small handful', plural: 'small handfuls' },
  { pattern: /\bbeef\b/i, style: 'hand', baseG: 110, singular: 'palm-sized piece', plural: 'palm-sized pieces' },
  { pattern: /\b(bacon)\b/i, style: 'hand', baseG: 60, singular: 'small handful', plural: 'small handfuls' },
  { pattern: /\b(sausage|kielbasa|bratwurst|andouille|chorizo|pepperoni)\b/i, style: 'hand', baseG: 110, singular: 'palm-sized piece', plural: 'palm-sized pieces' },
  { pattern: /\bham\b/i, style: 'hand', baseG: 110, singular: 'palm-sized piece', plural: 'palm-sized pieces' },
  { pattern: /pork (chop|tenderloin|loin)/i, style: 'hand', baseG: 110, singular: 'palm-sized piece', plural: 'palm-sized pieces' },
  { pattern: /\bpork\b/i, style: 'hand', baseG: 110, singular: 'palm-sized piece', plural: 'palm-sized pieces' },
  { pattern: /chicken (breast|tender|cutlet)/i, style: 'hand', baseG: 110, singular: 'palm-sized piece', plural: 'palm-sized pieces' },
  { pattern: /chicken thigh/i, style: 'hand', baseG: 110, singular: 'palm-sized piece', plural: 'palm-sized pieces' },
  { pattern: /canned chicken/i, style: 'hand', baseG: 110, singular: 'palm-sized portion', plural: 'palm-sized portions' },
  { pattern: /\bchicken\b/i, style: 'hand', baseG: 110, singular: 'palm-sized piece', plural: 'palm-sized pieces' },
  { pattern: /\bturkey\b/i, style: 'hand', baseG: 110, singular: 'palm-sized piece', plural: 'palm-sized pieces' },
  { pattern: /\bsalmon\b/i, style: 'hand', baseG: 110, singular: 'palm-sized fillet', plural: 'palm-sized fillets' },
  { pattern: /\b(shrimp|prawn)\b/i, style: 'hand', baseG: 110, singular: 'palm-sized portion', plural: 'palm-sized portions' },
  { pattern: /\b(tilapia|cod|white fish|halibut)\b/i, style: 'hand', baseG: 110, singular: 'palm-sized fillet', plural: 'palm-sized fillets' },
  { pattern: /canned tuna/i, style: 'hand', baseG: 85, singular: 'small handful', plural: 'small handfuls' },
  { pattern: /\btuna\b/i, style: 'hand', baseG: 110, singular: 'palm-sized portion', plural: 'palm-sized portions' },
  { pattern: /\bcrab\b/i, style: 'hand', baseG: 110, singular: 'palm-sized portion', plural: 'palm-sized portions' },
  { pattern: /sardine/i, style: 'hand', baseG: 85, singular: 'small handful', plural: 'small handfuls' },
  // Liquid egg whites (poured from a carton, recorded in ml) still
  // benefit from a phrase -- only whole/count eggs are already obvious
  // enough to skip, so this has to be checked before the blanket egg
  // pattern below.
  { pattern: /egg white/i, style: 'volume' },
  { pattern: /\begg(s)?\b/i, style: 'none' },

  // --- Dairy ---
  { pattern: /cottage cheese|greek yogurt|skyr|\byogurt\b/i, style: 'hand', baseG: 110, singular: 'cupped handful', plural: 'cupped handfuls' },
  { pattern: /cream cheese/i, style: 'volume' },
  { pattern: /parmesan|feta|mozzarella|cheddar|pepper jack|american cheese|cheese slice|shredded cheese|block cheese|\bcheese\b/i, style: 'hand', baseG: 30, singular: 'small handful', plural: 'small handfuls' },
  { pattern: /\bbutter\b/i, style: 'volume' },
  { pattern: /sour cream/i, style: 'volume' },
  { pattern: /soy milk|almond milk|oat milk|\bmilk\b|heavy cream/i, style: 'volume' },
  { pattern: /protein powder|whey protein|protein pancake|protein waffle/i, style: 'hand', baseG: 30, singular: 'small scoop', plural: 'small scoops' },

  // --- Grains, starches, bread ---
  { pattern: /ramen|\brice\b|quinoa|\boats\b|oatmeal|chickpea pasta|banza|\bpasta\b|noodle/i, style: 'hand', baseG: 150, singular: 'fist-sized portion', plural: 'fist-sized portions' },
  { pattern: /tortilla|bagel|\bbun\b|brioche|english muffin|\bbread\b/i, style: 'none' },
  { pattern: /sweet potato|\bpotato/i, style: 'hand', baseG: 150, singular: 'fist-sized portion', plural: 'fist-sized portions' },

  // --- Produce ---
  { pattern: /avocado|banana|\bapple\b|lemon|lime/i, style: 'none' },
  { pattern: /berries|berry/i, style: 'hand', baseG: 70, singular: 'cupped handful', plural: 'cupped handfuls' },
  { pattern: /garlic/i, style: 'pinch' },
  {
    // `tomato` without a trailing \b so this also matches the plural
    // "Tomatoes" (Cherry Tomatoes, Diced Tomatoes) -- `tomato\b` alone
    // requires a word boundary immediately after "tomato", which the
    // plural's "-es" doesn't have.
    pattern: /bell pepper|onion|shallot|celery|green bean|broccoli|cauliflower|spinach|arugula|kale|lettuce|salad kit|tomato|cucumber|mushroom|zucchini|squash|corn\b|frozen (veg|vegetable|broccoli|pea|corn|mix)/i,
    style: 'hand', baseG: 80, singular: 'cupped handful', plural: 'cupped handfuls',
  },

  // --- Legumes / plant proteins ---
  { pattern: /black bean|kidney bean|pinto bean|refried bean|chickpea|edamame|lentil/i, style: 'hand', baseG: 130, singular: 'cupped handful', plural: 'cupped handfuls' },
  { pattern: /\btofu\b/i, style: 'hand', baseG: 110, singular: 'palm-sized piece', plural: 'palm-sized pieces' },

  // --- Canned / jarred / broths ---
  { pattern: /canned (diced |crushed |cherry )?tomato|canned pineapple/i, style: 'volume' },

  // --- Sauces, condiments, spreads ---
  { pattern: /hot honey|honey|maple syrup|sauce|dressing|marinade|vinaigrette|salsa|guacamole|mayo|mustard|ketchup|sriracha|chili crisp|pesto|tzatziki|\boil\b|vinegar|peanut butter|almond butter|hummus|\bwater\b/i, style: 'volume' },
  { pattern: /nuts|almonds|walnuts|pecans|pistachio|cashew|seeds|chia|flax|granola|crackers|breadcrumbs/i, style: 'hand', baseG: 28, singular: 'small handful', plural: 'small handfuls' },

  // --- Seasonings / baking / fresh herbs & aromatics ---
  { pattern: /powder|paprika|cumin|oregano|\bbasil\b|cayenne|chili flake|\bpepper\b|salt\b|cinnamon|caraway|sugar\b|flour|baking powder|baking soda|\bdill\b|\bginger\b|cilantro|parsley|thyme|rosemary/i, style: 'pinch' },
];

function formatHalves(n) {
  const whole = Math.floor(n);
  const half = n - whole >= 0.5;
  if (whole === 0) return '½';
  return half ? `${whole}½` : `${whole}`;
}

// Shared implementation for every hand-portion style (palm/fist/cupped/
// small handful/scoop) -- they only differ in reference weight and noun.
function describeHandPortion(quantity, baseG, singular, plural) {
  const units = Math.max(0.5, Math.round((quantity / baseG) * 2) / 2);
  if (units === 0.5) return `about half a ${singular}`;
  if (units === 1) return `about 1 ${singular}`;
  return `about ${formatHalves(units)} ${plural}`;
}

// A single continuous ladder from "a drizzle" up through whole cups --
// covers everything spoonable/pourable, whether it starts as a teaspoon
// of hot sauce or a full carton of broth. `amount` is ml for ml-unit
// ingredients, or grams treated as roughly ml-equivalent for spoonable
// gram-recorded ones (butter, sour cream) -- close enough at the level of
// precision this feature is aiming for.
function describeVolume(amount) {
  // Real tsp/tbsp math for the small end instead of one wide named bucket
  // -- the old "5-15ml -> a splash (about a tablespoon)" range mislabeled
  // anything as small as 1 tsp (5ml) as "about a tablespoon" (3x over),
  // which is what made Skyr & Berries' Honey (1 tsp) read as "about a
  // tablespoon" in Easy Mode even once the stored 5ml amount itself was
  // correct. tsp/tbsp are used as unit abbreviations here, not full nouns,
  // so unlike "cup(s)" they don't need separate singular/plural handling.
  if (amount <= 3) return 'a drizzle';
  if (amount <= 12) {
    const tsp = Math.max(0.5, Math.round((amount / 5) * 2) / 2);
    return `about ${formatHalves(tsp)} tsp`;
  }
  if (amount <= 55) {
    const tbsp = Math.max(1, Math.round((amount / 15) * 2) / 2);
    return `about ${formatHalves(tbsp)} tbsp`;
  }
  if (amount <= 125) return 'about ½ cup';
  if (amount <= 200) return 'about ¾ cup';
  if (amount <= 300) return 'about 1 cup';
  const cups = Math.max(1, Math.round((amount / 240) * 2) / 2);
  return `about ${formatHalves(cups)} cups`;
}

// A separate ladder for small dry seasoning amounts -- "a pinch" doesn't
// scale as "2 pinches, 3 pinches"; it graduates into sprinkle, then real
// tsp/tbsp math as the quantity grows (e.g. a chili recipe's whole
// tablespoon of chili powder vs. a pinch of salt). ~4.2g/tsp and 12.5g/tbsp
// are rough averages across ground seasonings/spices -- not exact for any
// one of them, but consistent with the rest of this file rounding to
// clean, nameable amounts rather than a precise-but-unreadable decimal.
function describePinch(grams) {
  if (grams <= 1.5) return 'a pinch';
  if (grams <= 3) return 'a small sprinkle';
  if (grams <= 5) return 'a generous sprinkle';
  if (grams <= 8) {
    const tsp = Math.max(0.5, Math.round((grams / 4.2) * 2) / 2);
    return `about ${formatHalves(tsp)} tsp`;
  }
  const tbsp = Math.max(1, Math.round((grams / 12.5) * 2) / 2);
  return `about ${formatHalves(tbsp)} tbsp`;
}

// The eyeball phrase for one { name, unit, quantity } component, or null
// if this ingredient has no useful hand-portion translation (already-
// intuitive whole items like an egg or a tortilla, or anything with no
// matching rule at all -- silence is safer than a confidently wrong
// guess, same philosophy as ingredientNutrition.js's fallback).
export function estimateEyeballPhrase({ name, unit, quantity }) {
  const rule = RULES.find((r) => r.pattern.test(name));
  if (!rule || rule.style === 'none') return null;

  if (rule.style === 'volume') {
    if (unit !== 'ml' && unit !== 'g') return null;
    return describeVolume(quantity);
  }
  if (rule.style === 'pinch') {
    if (unit !== 'g') return null;
    return describePinch(quantity);
  }
  // 'hand' styles only make sense for weighed amounts -- an 'each'/'count'
  // quantity (already a whole-item number) doesn't need translating. Some
  // dairy-ish 'hand' ingredients (Greek yogurt, milk) are recorded in ml
  // rather than g depending on the recipe -- close enough to treat the
  // same as grams at this precision, so both are accepted here.
  if (unit !== 'g' && unit !== 'ml') return null;
  return describeHandPortion(quantity, rule.baseG, rule.singular, rule.plural);
}
