import { getEffortTier } from './effortLevel';

// The single "what are you optimizing for" question asked on the first
// onboarding screen (see components/Onboarding.jsx) -- deliberately just
// three options, each mapping directly onto data the recipes already
// carry (effort tier, the high_protein tag, servings) rather than
// introducing a new field. The goal is a soft ranking boost, not a hard
// filter -- see rankForGoal below -- so picking one can never result in
// an empty first-session recommendation, only a better-ordered one.
export const ONBOARDING_GOALS = [
  { id: 'quick', label: 'Quick & Easy', description: 'The fastest, least-fuss options' },
  { id: 'high_protein', label: 'High Protein', description: 'Recipes built around hitting your protein' },
  { id: 'meal_prep', label: 'Meal Prep', description: 'Batch-cook once, eat all week' },
];

// Whether a recipe fits the chosen goal -- used only to bias ordering
// (see rankForGoal), never to exclude a recipe outright.
export function matchesGoal(recipe, goal) {
  if (!goal) return true;
  if (goal === 'quick') return getEffortTier(recipe) === 1;
  if (goal === 'high_protein') return (recipe.tags || []).includes('high_protein');
  if (goal === 'meal_prep') return recipe.servings > 1;
  return true;
}

// Stable-sorts an already-ranked recipe list (e.g. Kitchen's pantry-match
// results, highest _matchCount first) so goal-matching recipes float to
// the top of the list without disturbing the relative order within each
// group -- a recipe using 3 of your picks still outranks one using 1
// within the same goal-match bucket, since Array.prototype.sort is a
// stable sort in every modern JS engine. No goal selected (onboarding
// skipped, or Kitchen's normal pantry search with nothing else to go on)
// just returns the list untouched.
export function rankForGoal(recipes, goal) {
  if (!goal) return recipes;
  return [...recipes].sort((a, b) => {
    const aMatch = matchesGoal(a, goal) ? 0 : 1;
    const bMatch = matchesGoal(b, goal) ? 0 : 1;
    return aMatch - bMatch;
  });
}
