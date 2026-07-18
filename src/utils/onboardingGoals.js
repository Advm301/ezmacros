import { getEffortTier } from './effortLevel';

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
  { id: 'high_protein', label: 'High Protein', description: 'Recipes built around hitting your protein' },
];

// The "how do you want your meals sized" question, onboarding's second
// screen -- independent of the goal question above.
export const SERVING_PREFS = [
  { id: 'single', label: 'Single Serving', description: "Recipes sized for just you, right now" },
  { id: 'meal_prep', label: 'Meal Prep', description: 'Batch-cook once, eat all week' },
];

// Whether a recipe fits the chosen goal -- used only to bias ordering
// (see rankForPreferences), never to exclude a recipe outright.
export function matchesGoal(recipe, goal) {
  if (!goal) return true;
  if (goal === 'quick') return getEffortTier(recipe) === 1;
  if (goal === 'high_protein') return (recipe.tags || []).includes('high_protein');
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

// Stable-sorts an already-ranked recipe list (e.g. Kitchen's pantry-match
// results, highest _matchCount first, or a full-day plan's candidate pool
// -- see utils/fullDayPlan.js) so recipes matching more of the chosen
// preferences float to the top without disturbing relative order within
// each score bucket -- a recipe using 3 of your pantry picks still
// outranks one using 1 within the same preference-match bucket, since
// Array.prototype.sort is a stable sort in every modern JS engine.
// `{ goal, servingsPref }` are read off whatever object is passed (e.g.
// onboarding's picks directly) -- either or both can be missing/null, in
// which case that axis just doesn't affect ordering.
export function rankForPreferences(recipes, { goal, servingsPref } = {}) {
  if (!goal && !servingsPref) return recipes;
  return [...recipes].sort((a, b) => {
    const aScore = (matchesGoal(a, goal) ? 0 : 1) + (matchesServingsPref(a, servingsPref) ? 0 : 1);
    const bScore = (matchesGoal(b, goal) ? 0 : 1) + (matchesServingsPref(b, servingsPref) ? 0 : 1);
    return aScore - bScore;
  });
}
