import { RECIPES } from '../data/recipes.js';

// Diary slot -> the recipe mealType pool it should draw from. Lunch and
// Dinner share the same 'lunch_dinner' pool (see data/recipes.js's schema
// comment) -- same mapping Saved.jsx's own "Surprise Me" full-day
// generator uses, kept as its own small copy here rather than importing
// from a page component, since a util shouldn't reach into a page file.
const SLOT_MEAL_TYPE = { breakfast: 'breakfast', lunch: 'lunch_dinner', dinner: 'lunch_dinner' };
const FULL_DAY_SLOTS = ['breakfast', 'lunch', 'dinner'];

// Builds a { breakfast?, lunch?, dinner? } map of recipes for onboarding's
// "plan my day" option (see components/Onboarding.jsx + App.jsx) --
// picking randomly from `preferredPool` (the pantry/goal/servings-narrowed
// candidates, see utils/pantryMatch.js + utils/onboardingGoals.js) when it
// has something for that meal type, but falling back to the full RECIPES
// catalog when it doesn't -- so a narrow pantry pick (say, just "Shrimp")
// never leaves breakfast empty just because there's no shrimp breakfast
// recipe. Never repeats the same recipe across two slots in one day.
export function buildFullDayPlan(preferredPool) {
  const usedIds = [];
  const plan = {};
  for (const slot of FULL_DAY_SLOTS) {
    const mealType = SLOT_MEAL_TYPE[slot];
    const narrow = preferredPool.filter((r) => r.mealType === mealType && !usedIds.includes(r.id));
    const broad = RECIPES.filter((r) => r.mealType === mealType && !usedIds.includes(r.id));
    const pool = narrow.length > 0 ? narrow : broad;
    if (pool.length === 0) continue;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    usedIds.push(pick.id);
    plan[slot] = pick;
  }
  return plan;
}
