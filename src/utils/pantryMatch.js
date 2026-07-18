import { PANTRY_CATEGORIES } from '../data/pantryStaples.js';

// Straight "matches ANY of your picks" was surfacing recipes that shared
// only a side ingredient (rice, bell peppers, hot sauce) with a completely
// different protein than the one actually selected -- picking Chicken
// Breast alongside a couple of pantry basics would still return cod, ground
// beef, and pork recipes, because they also happened to use rice. Proteins
// are the actual entree, not just another ingredient to tally, so they get
// a harder rule: if you've picked one or more proteins, a recipe MUST use
// at least one of them to show up at all. Everything else you've picked
// stays a soft "nice to have" signal that only affects ranking.
const PROTEIN_IDS = new Set(
  (PANTRY_CATEGORIES.find((c) => c.category === 'Proteins')?.items || []).map((i) => i.id)
);

// Shared by Kitchen.jsx's pantry search and App.jsx's onboarding "plan my
// day" flow (see utils/fullDayPlan.js), so both draw from the exact same
// matching rule rather than two copies drifting apart.
//
// With no staples selected, every recipe is an equally valid match (there's
// nothing to rank against), so this just returns the full list -- Kitchen's
// Surprise Me uses that to mean "pick anything."
export function filterRecipes(recipes, selectedStaples) {
  if (selectedStaples.length === 0) return recipes;

  const selectedProteins = selectedStaples.filter((id) => PROTEIN_IDS.has(id));
  const pool = selectedProteins.length > 0
    ? recipes.filter((r) => (r.pantryTags || []).some((t) => selectedProteins.includes(t)))
    : recipes;

  return pool
    .filter((r) => (r.pantryTags || []).some((t) => selectedStaples.includes(t)))
    .map((r) => ({ ...r, _matchCount: (r.pantryTags || []).filter((t) => selectedStaples.includes(t)).length }))
    .sort((a, b) => b._matchCount - a._matchCount);
}
