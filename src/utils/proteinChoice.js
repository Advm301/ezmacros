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
// Used on description text and as the last step of resolveProteinInstructions
// below -- a plain token swap, not the flavor differentiation itself.
export function resolveProteinText(text, proteinOption) {
  if (!text || !proteinOption) return text;
  return text
    .replace(/\{\{Protein\}\}/g, proteinOption.label)
    .replace(/\{\{protein\}\}/g, proteinOption.id);
}

// Builds the full ingredient list for the chosen protein: that protein's
// own components (the meat itself, plus whatever real flavor accent it
// carries -- e.g. beef's balsamic vinegar vs. pork's fennel seed, see
// recipes.js's proteinOptions) prepended to the shared components every
// protein has in common. Every proteinOption in a family contributes the
// same number of components (enforced when this data was authored), so the
// shared list's own indices -- what ingredientOverrides/scaling key off of
// -- never shift just because the picker changed.
export function resolveProteinComponents(sharedComponents, proteinOption) {
  if (!proteinOption) return sharedComponents;
  return [...proteinOption.components, ...sharedComponents];
}

// Builds the full instruction list for the chosen protein: wherever that
// protein needs real differentiation (a shorter cook time for leaner
// poultry, mentioning its own flavor accent), proteinOption.instructions
// carries a full replacement for that step's index; every other step falls
// back to the shared, {{protein}}-tokenized text. Either way the result
// still gets run through resolveProteinText, since overrides themselves
// may still reference {{protein}} for the plain name mentions that don't
// need their own rewrite.
export function resolveProteinInstructions(sharedInstructions, proteinOption) {
  return sharedInstructions.map((step, i) => {
    const override = proteinOption?.instructions?.[i];
    return resolveProteinText(override !== undefined ? override : step, proteinOption);
  });
}
