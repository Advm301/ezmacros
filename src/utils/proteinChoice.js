// Which protein someone last picked for a recipe that offers more than one
// (recipes.js `proteinOptions` -- e.g. Saucy Tomato Bowl in beef/chicken/
// pork/turkey), remembered per-recipe on this device -- same "remembered
// device preference" pattern as utils/freshAltTips.js's Prefer Fresh
// toggle, not per-account/Supabase-backed, since this is a kitchen habit
// ("I always make this one with chicken"), not account data.
const PROTEIN_CHOICE_KEY_PREFIX = 'quickprep_protein_choice_';

export function readProteinChoice(recipeId, fallbackId) {
  try {
    return localStorage.getItem(PROTEIN_CHOICE_KEY_PREFIX + recipeId) || fallbackId;
  } catch {
    return fallbackId;
  }
}

export function saveProteinChoice(recipeId, proteinId) {
  try {
    localStorage.setItem(PROTEIN_CHOICE_KEY_PREFIX + recipeId, proteinId);
  } catch {
    // Not worth blocking the picker on -- it just won't be remembered next
    // time if storage is unavailable.
  }
}

// Resolves a recipe's {{protein}} / {{Protein}} placeholder tokens (see
// recipes.js's proteinOptions doc comment) against a chosen proteinOption.
// Used on description + every instruction string; components[] is handled
// separately (see resolveProteinComponents below) since that's a plain name
// swap rather than a token embedded in a longer sentence.
export function resolveProteinText(text, proteinOption) {
  if (!text || !proteinOption) return text;
  return text
    .replace(/\{\{Protein\}\}/g, proteinOption.label)
    .replace(/\{\{protein\}\}/g, proteinOption.id);
}

// Swaps the one components[] entry flagged `proteinSlot: true` over to the
// chosen protein's real ingredient name (e.g. "Ground Beef (93% lean)" ->
// "Ground Chicken (93% lean)") -- everything else in the list is untouched.
export function resolveProteinComponents(components, proteinOption) {
  if (!proteinOption) return components;
  return components.map((c) => (
    c.proteinSlot ? { ...c, name: proteinOption.componentName } : c
  ));
}
