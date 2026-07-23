import { getEffortTier } from './effortLevel';
import { isHighProtein } from './ingredientNutrition';

// The "what are you optimizing for" question asked on onboarding's first
// screen (see components/Onboarding.jsx) -- deliberately just two options,
// each mapping directly onto data the recipes already carry (effort tier,
// the high_protein tag) rather than introducing a new field. Portion size
// used to be a third option here ("Meal Prep"), but that's really a
// separate question from "what matters most" -- see SERVING_PREFS below,
// which asks it on its own screen so someone can answer both independently
// (e.g. "High Protein" AND "Meal Prep" at once) instead of being forced to
// pick only one. Both goal and servingsPref are soft ranking boosts, not
// hard filters -- see rankForPreferences below -- so answering either can
// never result in an empty first-session recommendation, only a
// better-ordered one.
export const ONBOARDING_GOALS = [
  { id: 'quick', label: 'Quick & Easy', description: 'The fastest, least-fuss options' },
  { id: 'high_protein', label: 'High Protein', description: 'Recipes built around maximizing your protein intake' },
];

// The "how do you want your meals sized" question, onboarding's second
// screen -- independent of the goal question above. This is still worth
// asking even now that the recipe modal lets you scale any recipe's
// servings up or down on the fly (see RecipeModal.jsx's batch-size
// picker): the two jobs don't overlap. This question steers WHICH recipes
// get recommended first -- and recipes actually written at servings > 1
// carry real batch-cooking instructions (container/fridge-life guidance,
// technique adjusted for a bigger pan) that a single-serving recipe
// merely scaled up doesn't have. The in-modal scaler just handles "a bit
// more or less of this one, right now." Worded below as a soft steer
// ("prioritize"), not a hard promise about serving size, since either
// preference can still open any recipe and resize it there.
export const SERVING_PREFS = [
  { id: 'single', label: 'Single Serving', description: "We'll prioritize recipes built for a quick, single portion" },
  { id: 'meal_prep', label: 'Meal Prep', description: "We'll prioritize recipes built for batch-cooking and leftovers" },
];

// The "what kind of meal" question -- only asked when onboarding's
// mealCountPref is "one" (see components/Onboarding.jsx), since a
// "full_day" plan already covers breakfast, lunch, and dinner by
// definition and this question wouldn't add any information there. Ids
// map directly onto recipe.mealType (see data/recipes.js's schema
// comment) so matchesMealType below is a one-line lookup, same pattern
// as matchesServingsPref.
export const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', description: 'Morning-friendly recipes' },
  { id: 'lunch_dinner', label: 'Lunch & Dinner', description: 'Heartier, any-time-of-day meals' },
  { id: 'snack', label: 'A Snack', description: 'Something small to tide you over' },
];

// A fourth, catch-all option on the same screen -- `id: null` rather than
// a real mealType, since matchesMealType already treats a null mealType
// as "no preference, matches everything" (see below). That's exactly
// "doesn't matter" for free, without needing a fake mealType value that
// would never equal any real recipe.mealType and would therefore wrongly
// exclude every recipe from pickBestMatch's exact-match pass instead of
// truly meaning "no opinion here."
export const MEAL_TYPE_SURPRISE = { id: null, label: 'Surprise Me', description: "We'll pick whatever fits best" };

// Whether a recipe fits the chosen goal -- used only to bias ordering
// (see rankForPreferences), never to exclude a recipe outright.
export function matchesGoal(recipe, goal) {
  if (!goal) return true;
  if (goal === 'quick') return getEffortTier(recipe) === 1;
  // Computed from real ingredient quantities (utils/ingredientNutrition.js)
  // rather than the old hand-applied `high_protein` tag -- see Browse.jsx
  // for the same replacement.
  if (goal === 'high_protein') return isHighProtein(recipe);
  return true;
}

// Whether a recipe fits the chosen servings preference -- same soft-bias
// role as matchesGoal above, just along the orthogonal "how many servings"
// axis instead of the "what matters most" one.
export function matchesServingsPref(recipe, servingsPref) {
  if (!servingsPref) return true;
  if (servingsPref === 'meal_prep') return recipe.servings > 1;
  if (servingsPref === 'single') return !(recipe.servings > 1);
  return true;
}

// Whether a recipe fits the chosen meal type -- same soft-bias role as
// the two above, along the "when would you eat this" axis.
export function matchesMealType(recipe, mealType) {
  if (!mealType) return true;
  return recipe.mealType === mealType;
}

// Stable-sorts an already-ranked recipe list (e.g. Kitchen's pantry-match
// results, highest _matchCount first, or a full-day plan's candidate pool
// -- see utils/fullDayPlan.js) so recipes matching more of the chosen
// preferences float to the top without disturbing relative order within
// each score bucket -- a recipe using 3 of your pantry picks still
// outranks one using 1 within the same preference-match bucket, since
// Array.prototype.sort is a stable sort in every modern JS engine.
// `{ goal, servingsPref, mealType }` are read off whatever object is
// passed (e.g. onboarding's picks directly) -- any of the three can be
// missing/null, in which case that axis just doesn't affect ordering.
// None of these are hard filters, so this can never turn a non-empty
// list into an empty one -- only reorder it.
export function rankForPreferences(recipes, { goal, servingsPref, mealType } = {}) {
  if (!goal && !servingsPref && !mealType) return recipes;
  const score = (r) =>
    (matchesGoal(r, goal) ? 0 : 1) +
    (matchesServingsPref(r, servingsPref) ? 0 : 1) +
    (matchesMealType(r, mealType) ? 0 : 1);
  return [...recipes].sort((a, b) => score(a) - score(b));
}

// Picks one random recipe out of `pool`, preferring one that fully
// matches every preference that was actually set (goal, servingsPref,
// mealType), and only falling back to any recipe in `pool` if nothing
// matches all of them at once. Used by Kitchen.jsx to seed a single
// result when onboarding hands off preferences but no pantry staples
// were ever picked ("I'll Add These Later") -- without this, that combo
// used to land on Kitchen's normal empty state instead of generating
// anything, even though real preferences (like a chosen meal type) had
// been collected. Same graceful-relaxation shape as
// utils/fullDayPlan.js's per-slot picker: never returns nothing just
// because the ideal match doesn't exist, only ever null if `pool` itself
// was already empty.
export function pickBestMatch(pool, { goal, servingsPref, mealType } = {}) {
  if (pool.length === 0) return null;
  const bestMatches = pool.filter(
    (r) => matchesGoal(r, goal) && matchesServingsPref(r, servingsPref) && matchesMealType(r, mealType)
  );
  const finalPool = bestMatches.length > 0 ? bestMatches : pool;
  return finalPool[Math.floor(Math.random() * finalPool.length)];
}
