import { resolveRecipeComponents } from './shoppingList';

// Estimated grocery cost engine -- NOT a live price feed. There is no
// public, self-serve API for real-time Walmart (or any single retailer's)
// prices; Walmart's own product/price APIs require an approved
// affiliate/partner relationship, and scraping walmart.com isn't something
// this app does. Instacart's Developer Platform API (see
// utils/instacartShoppingList.js) can hand off a real shopping list to a
// real retailer with real prices, but its public tier doesn't expose a
// price-lookup response for computing an in-app number -- it only returns
// a checkout link.
//
// So the actual "cost per meal" / "shopping list total" numbers shown in
// the app come from this category-price table instead: a set of rough,
// hand-researched average US grocery prices (2026, national-chain
// ballpark, not any one store) matched against ingredient names by
// keyword, with a unit-based fallback for anything unmatched. Always
// labeled "Est." / "estimated" wherever it's shown -- this is a ballpark
// for comparing recipes against each other, not a receipt prediction.
//
// Rules are tested in order, first match wins -- more specific patterns
// (e.g. "ground turkey" before the generic "turkey") are listed first
// within each category so they don't get shadowed by a broader one below.
const PRICE_RULES = [
  // --- Proteins ---
  { pattern: /ground turkey/i, perG: 0.0099 },
  { pattern: /ground (beef|chuck)/i, perG: 0.0121 },
  { pattern: /ground chicken/i, perG: 0.0108 },
  { pattern: /\b(steak|sirloin|flank|ribeye)\b/i, perG: 0.0165 },
  { pattern: /\bbeef\b/i, perG: 0.0130 },
  { pattern: /\b(bacon)\b/i, perG: 0.0154 },
  { pattern: /\b(sausage|kielbasa|bratwurst|andouille|chorizo|pepperoni)\b/i, perG: 0.0121 },
  { pattern: /\bham\b/i, perG: 0.0110 },
  { pattern: /pork (chop|tenderloin|loin)/i, perG: 0.0088 },
  { pattern: /\bpork\b/i, perG: 0.0088 },
  { pattern: /chicken (breast|thigh|tender|cutlet)/i, perG: 0.0077 },
  { pattern: /canned chicken/i, perG: 0.0110 },
  { pattern: /\bchicken\b/i, perG: 0.0077 },
  { pattern: /\bturkey\b/i, perG: 0.0099 },
  { pattern: /\bsalmon\b/i, perG: 0.0198 },
  { pattern: /\b(shrimp|prawn)\b/i, perG: 0.0176 },
  { pattern: /\b(tilapia|cod|white fish|halibut)\b/i, perG: 0.0132 },
  { pattern: /canned tuna/i, perG: 0.0106 },
  { pattern: /\btuna\b/i, perG: 0.0132 },
  { pattern: /\bcrab\b/i, perG: 0.0220 },
  { pattern: /\begg(s)?\b/i, perEach: 0.29, perG: 0.0058 },

  // --- Dairy ---
  { pattern: /cottage cheese/i, perG: 0.0088 },
  { pattern: /greek yogurt|skyr/i, perG: 0.0055 },
  { pattern: /\byogurt\b/i, perG: 0.0044 },
  { pattern: /cream cheese/i, perG: 0.0110 },
  { pattern: /parmesan/i, perG: 0.0264 },
  { pattern: /feta/i, perG: 0.0220 },
  { pattern: /mozzarella|cheddar|american cheese|cheese slice|shredded cheese|block cheese/i, perG: 0.0176 },
  { pattern: /\bcheese\b/i, perG: 0.0176 },
  { pattern: /\bbutter\b/i, perG: 0.0099 },
  { pattern: /sour cream/i, perG: 0.0066 },
  { pattern: /almond milk|oat milk|soy milk/i, perMl: 0.0026, perG: 0.0026 },
  { pattern: /\bmilk\b/i, perMl: 0.0021, perG: 0.0021 },
  { pattern: /heavy cream/i, perMl: 0.0088 },
  { pattern: /protein powder/i, perG: 0.033 },

  // --- Grains, starches, bread ---
  { pattern: /\brice\b/i, perG: 0.0035 },
  { pattern: /quinoa/i, perG: 0.0088 },
  { pattern: /\boats\b|oatmeal/i, perG: 0.0033 },
  { pattern: /chickpea pasta|banza/i, perG: 0.0088 },
  { pattern: /\bpasta\b|noodle/i, perG: 0.0035 },
  { pattern: /tortilla/i, perEach: 0.35 },
  { pattern: /\bbun\b|brioche|bagel|english muffin/i, perEach: 0.45 },
  { pattern: /\bbread\b/i, perG: 0.0055 },
  { pattern: /sweet potato/i, perG: 0.0033 },
  { pattern: /\bpotato/i, perG: 0.0026 },

  // --- Produce ---
  { pattern: /avocado/i, perEach: 1.20, perG: 0.0075 },
  { pattern: /banana/i, perEach: 0.25, perG: 0.0022 },
  { pattern: /\bapple\b/i, perEach: 0.65, perG: 0.0044 },
  { pattern: /berries|berry/i, perG: 0.0110 },
  { pattern: /lemon|lime/i, perEach: 0.50 },
  { pattern: /bell pepper/i, perEach: 1.00, perG: 0.0066 },
  { pattern: /onion|shallot/i, perG: 0.0033 },
  { pattern: /garlic/i, perG: 0.0088 },
  { pattern: /broccoli|cauliflower/i, perG: 0.0044 },
  { pattern: /spinach|arugula|kale/i, perG: 0.0066 },
  { pattern: /lettuce|salad kit/i, perG: 0.0044 },
  { pattern: /tomato\b/i, perG: 0.0044 },
  { pattern: /cucumber/i, perG: 0.0033 },
  { pattern: /mushroom/i, perG: 0.0088 },
  { pattern: /zucchini|squash/i, perG: 0.0044 },
  { pattern: /corn\b/i, perG: 0.0044 },
  { pattern: /frozen (veg|vegetable|broccoli|pea|corn|mix)/i, perG: 0.0044 },

  // --- Legumes / plant proteins ---
  { pattern: /black bean|kidney bean|pinto bean|refried bean/i, perG: 0.0028 },
  { pattern: /chickpea/i, perG: 0.0028 },
  { pattern: /\btofu\b/i, perG: 0.0055 },
  { pattern: /edamame/i, perG: 0.0055 },
  { pattern: /lentil/i, perG: 0.0033 },

  // --- Canned / jarred ---
  { pattern: /canned (diced |crushed |cherry )?tomato/i, perG: 0.0022, perMl: 0.0022 },
  { pattern: /broth|stock/i, perG: 0.0018, perMl: 0.0018 },
  { pattern: /canned pineapple/i, perMl: 0.0033, perG: 0.0033 },

  // --- Sauces, condiments, dressings (used in small amounts, mid unit cost) ---
  { pattern: /hot honey|honey/i, perG: 0.0088, perMl: 0.0088 },
  { pattern: /maple syrup/i, perMl: 0.0110 },
  { pattern: /sauce|dressing|marinade|vinaigrette|salsa|guacamole|mayo|mustard|ketchup/i, perMl: 0.0088, perG: 0.0088 },
  { pattern: /\boil\b/i, perMl: 0.0066 },
  { pattern: /vinegar/i, perMl: 0.0044 },
  { pattern: /peanut butter|almond butter/i, perG: 0.0110 },
  { pattern: /hummus/i, perG: 0.0066 },
  { pattern: /nuts|almonds|walnuts|pecans|pistachio|cashew/i, perG: 0.0220 },
  { pattern: /seeds|chia|flax/i, perG: 0.0176 },
  { pattern: /granola/i, perG: 0.0110 },

  // --- Seasonings (small quantities, low unit cost relative to weight) ---
  { pattern: /seasoning|spice|powder|paprika|cumin|oregano|basil|cayenne|chili flake|black pepper|salt\b|cinnamon|caraway/i, perG: 0.0220 },
  { pattern: /sugar\b/i, perG: 0.0022 },
  { pattern: /flour/i, perG: 0.0022 },
  { pattern: /baking powder|baking soda/i, perG: 0.0044 },
];

// Generic fallback when nothing above matches -- keeps every line item
// priceable (never $0, never a crash) without pretending to know exactly
// what an unrecognized ingredient costs. Deliberately mid-range rather
// than high or low, so an unmatched item nudges a total slightly rather
// than skewing it.
const FALLBACK = { perG: 0.0066, perMl: 0.0066, perEach: 0.60, perCount: 0.30, perSpray: 0.02 };

function priceForUnit(rule, unit) {
  if (unit === 'g') return rule.perG;
  if (unit === 'ml') return rule.perMl;
  if (unit === 'each') return rule.perEach ?? rule.perG;
  if (unit === 'count') return rule.perEach ?? rule.perCount;
  if (unit === 'spray') return rule.perSpray;
  return rule.perG ?? rule.perEach;
}

// Estimated cost in USD for one { name, unit, quantity } line item (same
// shape buildShoppingList produces, see utils/shoppingList.js). `quantity`
// for 'count' eggs follows that same file's /50-per-egg convention.
export function estimateItemCost({ name, unit, quantity }) {
  const rule = PRICE_RULES.find((r) => r.pattern.test(name));
  let unitPrice = rule ? priceForUnit(rule, unit) : null;
  if (unitPrice == null) {
    if (unit === 'g') unitPrice = FALLBACK.perG;
    else if (unit === 'ml') unitPrice = FALLBACK.perMl;
    else if (unit === 'each') unitPrice = FALLBACK.perEach;
    else if (unit === 'spray') unitPrice = FALLBACK.perSpray;
    else unitPrice = FALLBACK.perCount;
  }
  // Eggs are stored as quantity/50 = whole-egg count (see
  // formatShoppingQuantity) -- perEach above is already priced per whole
  // egg, so undo that /50 scaling here rather than pricing per gram-unit.
  if (unit === 'count' && /egg/i.test(name) && rule?.perEach != null) {
    return (quantity / 50) * rule.perEach;
  }
  return quantity * unitPrice;
}

// Sums estimateItemCost across a whole shopping list (buildShoppingList's
// output). Returns a plain number, USD.
export function estimateShoppingListCost(items) {
  return items.reduce((sum, item) => sum + estimateItemCost(item), 0);
}

export function formatUsd(amount) {
  return `$${amount.toFixed(2)}`;
}

// Estimated cost for one full recipe batch and per single serving --
// "per serving" is what's shown as "~$X.XX/serving" on recipe
// cards/modal, since one serving is one meal.
export function estimateRecipeCost(recipe) {
  const components = resolveRecipeComponents(recipe);
  const total = estimateShoppingListCost(components);
  const servings = recipe.servings > 0 ? recipe.servings : 1;
  return { total, perServing: total / servings };
}
