import { RECIPES } from '../data/recipes.js';
import { matchesGoal, matchesServingsPref } from './onboardingGoals';

// Diary slot -> the recipe mealType pool it should draw from. Lunch and
// Dinner share the same 'lunch_dinner' pool (see data/recipes.js's schema
// comment) -- same mapping Saved.jsx's own "Surprise Me" full-day
// generator uses, kept as its own small copy here rather than importing
// from a page component, since a util shouldn't reach into a page file.
const SLOT_MEAL_TYPE = { breakfast: 'breakfast', lunch: 'lunch_dinner', dinner: 'lunch_dinner' };
const FULL_DAY_SLOTS = ['breakfast', 'lunch', 'dinner'];

// Builds a { breakfast?, lunch?, dinner? } map of recipes for onboarding's
// "plan my day" option (see components/Onboarding.jsx + App.jsx).
// `preferredPool` (the pantry-matched candidates, see utils/pantryMatch.js)
// arrives already sorted best-match-first by rankForPreferences, but a
// sort order alone doesn't do anything unless something here actually
// reads it -- picking uniformly at random over that whole list (the old
// behavior) threw the ordering away entirely, so choosing "Meal Prep" or
// "High Protein" during onboarding never actually changed which recipes
// a full day plan landed on -- see the goal/servingsPref filtering added
// below. Each slot now narrows to recipes that actually match BOTH
// `goal` and `servingsPref` first, and only relaxes one step at a time --
// to any pantry/mealType match regardless of goal/servings, then to the
// full RECIPES catalog -- so a narrow pantry pick (say, just "Ground
// Beef") or a preference with few matching recipes for that meal type
// still never leaves a slot empty. Never repeats the same recipe across
// two slots in one day.
export function buildFullDayPlan(preferredPool, { goal, servingsPref } = {}) {
  const usedIds = [];
  const plan = {};
  for (const slot of FULL_DAY_SLOTS) {
    const mealType = SLOT_MEAL_TYPE[slot];
    const forSlot = (list) => list.filter((r) => r.mealType === mealType && !usedIds.includes(r.id));

    const bestMatch = forSlot(preferredPool).filter(
      (r) => matchesGoal(r, goal) && matchesServingsPref(r, servingsPref)
    );
    const anyPantryMatch = forSlot(preferredPool);
    const broad = forSlot(RECIPES);

    const pool = bestMatch.length > 0 ? bestMatch : (anyPantryMatch.length > 0 ? anyPantryMatch : broad);
    if (pool.length === 0) continue;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    usedIds.push(pick.id);
    plan[slot] = pick;
  }
  return plan;
}
