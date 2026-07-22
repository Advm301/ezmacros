import { RECIPES } from '../data/recipes.js';
import { getFreshAltHint, readPreferFresh } from './freshAltTips';

// Strips a trailing parenthetical descriptor (e.g. "Garlic Powder (1 tsp)"
// -> "Garlic Powder") so quantities of the same base ingredient across
// different recipes get grouped into one shopping-list line instead of
// showing up as separate near-duplicate entries. Also used on a fresh-alt
// hint's freshName below -- those carry a prep-method parenthetical (e.g.
// "Rice (freshly cooked)") that's useful on the recipe's own ingredient
// list but irrelevant on a grocery list (you buy "rice," not "freshly-
// cooked rice"), so it gets stripped the same way.
function baseIngredientName(name) {
  return name.replace(/\s*\([^)]*\)\s*$/, '').trim();
}

// Builds an aggregated shopping list from a day's diary entries. Only
// required components are included -- optional toppings are left out since
// they're "if you feel like it," not part of the core grocery need.
//
// Reads the device's current Prefer Fresh preference (see
// utils/freshAltTips.js's readPreferFresh) at build time and swaps any
// matching convenience component (rice pouches, frozen veg, etc.) over to
// its fresh grocery name -- e.g. a rice pouch becomes a plain "Rice" line
// instead of "White Rice Pouch." This is the single device-wide
// remembered preference, not a per-meal record of which toggle state was
// actually chosen when each entry was added -- so a day mixing a fresh-
// prepped meal with a frozen-convenience one will show whichever way the
// preference is currently set for everything, not a precise per-recipe
// mix. Good enough for "I generally cook fresh, shop accordingly"; a
// precise per-entry version would need the fresh/frozen choice stored on
// the diary entry itself.
export function buildShoppingList(dayEntries) {
  const preferFresh = readPreferFresh();
  const map = {};
  for (const entry of dayEntries) {
    const recipe = RECIPES.find((r) => r.id === entry.recipe_id);
    if (!recipe) continue;
    for (const c of recipe.components || []) {
      const hint = preferFresh ? getFreshAltHint(c.name) : null;
      const base = baseIngredientName(hint ? hint.freshName : c.name);
      const key = `${base}__${c.unit}`;
      if (!map[key]) map[key] = { name: base, unit: c.unit, quantity: 0 };
      map[key].quantity += c.quantity;
    }
  }
  return Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
}

// Readable quantity string for a shopping-list line, reusing the same
// egg-count convention as the recipe modal (count + name containing "egg"
// means quantity/50 whole eggs).
export function formatShoppingQuantity(item) {
  const { name, unit, quantity } = item;
  if (unit === 'count') {
    if (name.toLowerCase().includes('egg')) {
      const eggs = Math.round(quantity / 50);
      return `${eggs} egg${eggs === 1 ? '' : 's'}`;
    }
    return `${Math.round(quantity)}`;
  }
  if (unit === 'spray') return `${Math.round(quantity)} spray${quantity === 1 ? '' : 's'}`;
  if (unit === 'each') return `${Math.round(quantity)}`;
  if (unit === 'g') return `${Math.round(quantity)}g`;
  if (unit === 'ml') return `${Math.round(quantity)}ml`;
  return `${Math.round(quantity)}`;
}
