// Splits a recipe's ingredient list into "core" items (protein, produce,
// dairy, grains, sauces, canned goods -- the stuff that makes up the bulk
// and identity of the dish) versus "seasonings" (the spice-rack shakers,
// dried herbs, and salt/pepper used in small pinch/tsp amounts purely for
// flavor). The recipe modal renders these as two separate tables so a long
// ingredient list doesn't read as one undifferentiated wall of items --
// the seasoning line-up is a different kind of decision (do I have this
// spice?) than the core ingredient line-up (do I have this food?).
//
// This is a name-based heuristic, not a data field, since retrofitting a
// "type" onto all 365 unique ingredient strings across recipes.js wasn't
// worth the churn -- the naming conventions already used throughout the
// file (very consistently: "X Powder", "X Seasoning", "Dried X", shaker
// spices) are regular enough to classify reliably from the string alone.
const SEASONING_PATTERNS = [
  /\bseasoning\b/i,
  /\bsalt\b/i,
  /\bpepper\b/i,
  /\bpaprika\b/i,
  /\bcumin\b/i,
  /\boregano\b/i,
  /\bcinnamon\b/i,
  /\bpowder\b/i,
  /^dill\s*\(dried/i,
  /\bsesame seeds\b/i,
];

// Exceptions that would otherwise false-positive on the patterns above --
// these are real food components (cheese, produce, macro powders), not
// spice-rack seasonings, despite containing a matching word.
const CORE_EXCEPTIONS = [
  /pepper jack/i, // cheese, not a "pepper" seasoning
  /protein powder/i,
  /\bpb2\b/i,
  /peanut butter powder/i,
  /cocoa powder/i,
  /holy trinity/i, // chopped onion/celery/bell pepper veg blend, not a shaker seasoning
  /sauce mix/i, // e.g. stroganoff sauce mix -- a sauce base, not a spice
  /no seasoning packet/i, // ramen noodles' "no seasoning packet" caveat, not an actual seasoning
];

export function isSeasoning(name) {
  if (CORE_EXCEPTIONS.some((re) => re.test(name))) return false;
  return SEASONING_PATTERNS.some((re) => re.test(name));
}

// Splits a components array into { core, seasonings }, preserving each
// item's original index (from the source array) so callers that need to
// address components positionally -- e.g. the recipe modal's tap-to-edit
// quantity handlers, which key off index into the *original* array -- keep
// working after the list has been split into two tables.
export function splitIngredients(components) {
  const core = [];
  const seasonings = [];
  (components || []).forEach((c, index) => {
    (isSeasoning(c.name) ? seasonings : core).push({ ...c, index });
  });
  return { core, seasonings };
}
