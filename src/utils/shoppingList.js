import { RECIPES } from '../data/recipes.js';

// Strips a trailing parenthetical descriptor (e.g. "Garlic Powder (1 tsp)"
// -> "Garlic Powder") so quantities of the same base ingredient across
// different recipes get grouped into one shopping-list line instead of
// showing up as separate near-duplicate entries.
function baseIngredientName(name) {
  return name.replace(/\s*\([^)]*\)\s*$/, '').trim();
}

// Builds an aggregated shopping list from a day's diary entries. Only
// required components are included -- optional toppings are left out since
// they're "if you feel like it," not part of the core grocery need.
export function buildShoppingList(dayEntries) {
  const map = {};
  for (const entry of dayEntries) {
    const recipe = RECIPES.find((r) => r.id === entry.recipe_id);
    if (!recipe) continue;
    for (const c of recipe.components || []) {
      const base = baseIngredientName(c.name);
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
