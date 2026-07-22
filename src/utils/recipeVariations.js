import { RECIPES } from '../data/recipes.js';

// A handful of recipe "families" are deliberate reskins of the same base
// dish across different proteins (e.g. Saucy Tomato Chicken/Beef/Pork/
// Turkey Bowl) -- tagged in recipes.js via variationGroup/variationLabel.
// This lets someone who opens one variant quickly hop to a sibling made
// with whatever protein they actually have, instead of re-searching Browse
// for the same dish under a different name.

// All recipes sharing a variationGroup, sorted by primary protein so the
// picker lists them in a stable, predictable order (chicken, beef, pork,
// turkey, fish, eggs -- whichever proteins that family actually uses).
const PROTEIN_SORT_ORDER = ['chicken', 'beef', 'pork', 'turkey', 'fish', 'eggs'];

export function getVariationSiblings(recipe) {
  if (!recipe?.variationGroup) return [];
  return RECIPES
    .filter((r) => r.variationGroup === recipe.variationGroup)
    .sort((a, b) => {
      const ai = PROTEIN_SORT_ORDER.indexOf(a.proteins?.[0]);
      const bi = PROTEIN_SORT_ORDER.indexOf(b.proteins?.[0]);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
}

// A short label for a sibling's distinguishing protein, shown in the
// picker next to its full name (e.g. "Chicken", "Ground Beef") --
// capitalizes the recipe's primary protein tag rather than needing a
// separate hand-maintained label per recipe.
export function getVariationProteinLabel(recipe) {
  const p = recipe.proteins?.[0];
  if (!p) return '';
  return p.charAt(0).toUpperCase() + p.slice(1);
}
