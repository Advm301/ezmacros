import { resolveRecipeComponents } from './shoppingList';

// Estimated grocery cost engine -- NOT a live price feed. There is no
// public, self-serve API for real-time Walmart (or any single retailer's)
// prices; Walmart's own product/price APIs require an approved
// affiliate/partner relationship, and scraping walmart.com isn't something
// this app does. Instacart's Developer Platform API (see
// utils/instacartShoppingList.js) can hand off a real shopping list to a
// real retailer with real prices, but it's currently closed to new
// developer applications (see config.js's SHOPPING_LINK_ENABLED).
//
// So the actual "cost per meal" / "shopping list total" numbers shown in
// the app come from this category-price table instead: rough,
// hand-researched average US grocery prices (2026, national-chain
// ballpark, not any one store), matched against ingredient names by
// keyword. Always labeled "Est." / "estimated" wherever it's shown.
//
// TWO DIFFERENT NUMBERS, ON PURPOSE:
//
// 1. Per-recipe "~$X.XX/serving" (estimateRecipeCost) uses a smooth
//    per-gram/per-ml/per-each rate -- the standard recipe-costing
//    convention (ingredient cost = quantity used x unit price, where unit
//    price is itself just package price / package size). This answers
//    "how much of my grocery budget did this dish use," treating your
//    pantry as a shared pool -- e.g. a recipe using 1 tbsp of a $6 bottle
//    of soy sauce reasonably costs ~$0.35 toward that dish, not the whole
//    bottle, since the rest gets used elsewhere.
//
// 2. The shopping list TOTAL (estimateShoppingListCost) answers a
//    different, more literal question: "what do I actually need to spend
//    at checkout for this list." That one has to respect real package
//    sizes -- you can't buy 60g of ramen noodles, you buy a whole ~255g
//    pack whether you need all of it or not. So for shelf-stable/
//    packaged categories (grains, canned goods, sauces, spices, dairy
//    tubs, bread products, etc.) this rounds UP to whole packages using
//    each rule's `pkg` info, on the list's already-aggregated total
//    quantity for that ingredient (buildShoppingList sums matching
//    ingredients across every recipe in the list first, so this only
//    rounds up once per ingredient, not once per recipe). Fresh
//    proteins/produce stay smooth (perG etc.) since those really are
//    scale-priced in most stores -- you can buy close to the exact
//    amount you need.
//
// Rules are tested in order, first match wins -- more specific patterns
// (e.g. "ground turkey" before the generic "turkey") are listed first
// within each category so they don't get shadowed by a broader one below.
const PRICE_RULES = [
  // --- Proteins (scale-priced -- no pkg, smooth per-gram is realistic) ---
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
  { pattern: /canned chicken/i, perG: 0.0110, pkg: { size: 340, unit: 'g', price: 3.99 } },
  { pattern: /\bchicken\b/i, perG: 0.0077 },
  { pattern: /\bturkey\b/i, perG: 0.0099 },
  { pattern: /\bsalmon\b/i, perG: 0.0198 },
  { pattern: /\b(shrimp|prawn)\b/i, perG: 0.0176 },
  { pattern: /\b(tilapia|cod|white fish|halibut)\b/i, perG: 0.0132 },
  { pattern: /canned tuna/i, perG: 0.0106, pkg: { size: 142, unit: 'g', price: 1.79 } },
  { pattern: /\btuna\b/i, perG: 0.0132 },
  { pattern: /\bcrab\b/i, perG: 0.0220 },
  { pattern: /\begg(s)?\b/i, perEach: 0.29, perG: 0.0058 },

  // --- Dairy ---
  { pattern: /cottage cheese/i, perG: 0.0088, pkg: { size: 454, unit: 'g', price: 3.99 } },
  { pattern: /greek yogurt|skyr/i, perG: 0.0055, pkg: { size: 907, unit: 'g', price: 5.49 } },
  { pattern: /\byogurt\b/i, perG: 0.0044, pkg: { size: 907, unit: 'g', price: 4.49 } },
  { pattern: /cream cheese/i, perG: 0.0110, pkg: { size: 227, unit: 'g', price: 2.79 } },
  { pattern: /parmesan/i, perG: 0.0264, pkg: { size: 142, unit: 'g', price: 4.49 } },
  { pattern: /feta/i, perG: 0.0220, pkg: { size: 227, unit: 'g', price: 4.29 } },
  { pattern: /mozzarella|cheddar|american cheese|cheese slice|shredded cheese|block cheese/i, perG: 0.0176, pkg: { size: 227, unit: 'g', price: 3.99 } },
  { pattern: /\bcheese\b/i, perG: 0.0176, pkg: { size: 227, unit: 'g', price: 3.99 } },
  { pattern: /\bbutter\b/i, perG: 0.0099, pkg: { size: 454, unit: 'g', price: 4.49 } },
  { pattern: /sour cream/i, perG: 0.0066, pkg: { size: 454, unit: 'g', price: 2.49 } },
  { pattern: /almond milk|oat milk|soy milk/i, perMl: 0.0026, perG: 0.0026, pkg: { size: 1892, unit: 'ml', price: 4.29 } },
  { pattern: /\bmilk\b/i, perMl: 0.0021, perG: 0.0021, pkg: { size: 1892, unit: 'ml', price: 3.99 } },
  { pattern: /heavy cream/i, perMl: 0.0088, pkg: { size: 473, unit: 'ml', price: 4.29 } },
  { pattern: /protein powder/i, perG: 0.033, pkg: { size: 907, unit: 'g', price: 29.99 } },

  // --- Grains, starches, bread ---
  // Ramen specifically (fresh/instant-style noodle packs run pricier per
  // package than dry spaghetti, and recipes usually only call for one
  // pack's worth anyway) -- listed before the generic pasta/noodle rule
  // below so it isn't shadowed.
  { pattern: /ramen/i, perG: 0.0035, pkg: { size: 255, unit: 'g', price: 3.99 } },
  { pattern: /\brice\b/i, perG: 0.0035, pkg: { size: 907, unit: 'g', price: 3.49 } },
  { pattern: /quinoa/i, perG: 0.0088, pkg: { size: 454, unit: 'g', price: 5.49 } },
  { pattern: /\boats\b|oatmeal/i, perG: 0.0033, pkg: { size: 793, unit: 'g', price: 3.99 } },
  { pattern: /chickpea pasta|banza/i, perG: 0.0088, pkg: { size: 227, unit: 'g', price: 3.29 } },
  { pattern: /\bpasta\b|noodle/i, perG: 0.0035, pkg: { size: 454, unit: 'g', price: 1.79 } },
  { pattern: /tortilla/i, perEach: 0.35, pkg: { size: 10, unit: 'each', price: 3.49 } },
  { pattern: /\bbun\b|brioche|bagel|english muffin/i, perEach: 0.45, pkg: { size: 6, unit: 'each', price: 3.49 } },
  { pattern: /\bbread\b/i, perG: 0.0055, pkg: { size: 680, unit: 'g', price: 3.49 } },
  { pattern: /sweet potato/i, perG: 0.0033 },
  { pattern: /\bpotato/i, perG: 0.0026 },

  // --- Produce (scale-priced -- no pkg) ---
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
  { pattern: /frozen (veg|vegetable|broccoli|pea|corn|mix)/i, perG: 0.0044, pkg: { size: 340, unit: 'g', price: 2.49 } },

  // --- Legumes / plant proteins ---
  { pattern: /black bean|kidney bean|pinto bean|refried bean/i, perG: 0.0028, pkg: { size: 425, unit: 'g', price: 1.19 } },
  { pattern: /chickpea/i, perG: 0.0028, pkg: { size: 425, unit: 'g', price: 1.19 } },
  { pattern: /\btofu\b/i, perG: 0.0055, pkg: { size: 397, unit: 'g', price: 2.49 } },
  { pattern: /edamame/i, perG: 0.0055, pkg: { size: 340, unit: 'g', price: 2.99 } },
  { pattern: /lentil/i, perG: 0.0033, pkg: { size: 454, unit: 'g', price: 2.49 } },

  // --- Canned / jarred ---
  { pattern: /canned (diced |crushed |cherry )?tomato/i, perG: 0.0022, perMl: 0.0022, pkg: { size: 411, unit: 'g', price: 1.79 } },
  { pattern: /broth|stock/i, perG: 0.0018, perMl: 0.0018, pkg: { size: 946, unit: 'ml', price: 3.49 } },
  { pattern: /canned pineapple/i, perMl: 0.0033, perG: 0.0033, pkg: { size: 227, unit: 'g', price: 1.99 } },

  // --- Sauces, condiments, dressings (small usage per recipe, sold in
  //     whole bottles/jars -- exactly the "$4 pack of ramen" problem, so
  //     these all get pkg info too). ---
  { pattern: /hot honey|honey/i, perG: 0.0088, perMl: 0.0088, pkg: { size: 340, unit: 'g', price: 5.99 } },
  { pattern: /maple syrup/i, perMl: 0.0110, pkg: { size: 354, unit: 'ml', price: 7.99 } },
  { pattern: /sauce|dressing|marinade|vinaigrette|salsa|guacamole|mayo|mustard|ketchup/i, perMl: 0.0088, perG: 0.0088, pkg: { size: 354, unit: 'ml', price: 3.99 } },
  { pattern: /\boil\b/i, perMl: 0.0066, pkg: { size: 750, unit: 'ml', price: 6.99 } },
  { pattern: /vinegar/i, perMl: 0.0044, pkg: { size: 473, unit: 'ml', price: 2.99 } },
  { pattern: /peanut butter|almond butter/i, perG: 0.0110, pkg: { size: 454, unit: 'g', price: 4.49 } },
  { pattern: /hummus/i, perG: 0.0066, pkg: { size: 283, unit: 'g', price: 3.49 } },
  { pattern: /nuts|almonds|walnuts|pecans|pistachio|cashew/i, perG: 0.0220, pkg: { size: 227, unit: 'g', price: 4.99 } },
  { pattern: /seeds|chia|flax/i, perG: 0.0176, pkg: { size: 340, unit: 'g', price: 5.99 } },
  { pattern: /granola/i, perG: 0.0110, pkg: { size: 340, unit: 'g', price: 4.49 } },

  // --- Seasonings (tiny quantities per recipe, but the jar itself is
  //     $3+ -- the single biggest source of the "per-gram looks free"
  //     distortion, so all of these get pkg info too). ---
  { pattern: /seasoning|spice|powder|paprika|cumin|oregano|basil|cayenne|chili flake|black pepper|salt\b|cinnamon|caraway/i, perG: 0.0220, pkg: { size: 45, unit: 'g', price: 3.29 } },
  { pattern: /sugar\b/i, perG: 0.0022, pkg: { size: 907, unit: 'g', price: 2.49 } },
  { pattern: /flour/i, perG: 0.0022, pkg: { size: 1361, unit: 'g', price: 3.29 } },
  { pattern: /baking powder|baking soda/i, perG: 0.0044, pkg: { size: 227, unit: 'g', price: 1.99 } },
];

// Generic fallback when nothing above matches -- keeps every line item
// priceable (never $0, never a crash) without pretending to know exactly
// what an unrecognized ingredient costs. Deliberately mid-range rather
// than high or low, so an unmatched item nudges a total slightly rather
// than skewing it. No pkg info -- an unrecognized ingredient falls back
// to the smooth rate even in the shopping list total, rather than
// guessing at a package size for something we couldn't even identify.
const FALLBACK = { perG: 0.0066, perMl: 0.0066, perEach: 0.60, perCount: 0.30, perSpray: 0.02 };

function priceForUnit(rule, unit) {
  if (unit === 'g') return rule.perG;
  if (unit === 'ml') return rule.perMl;
  if (unit === 'each') return rule.perEach ?? rule.perG;
  if (unit === 'count') return rule.perEach ?? rule.perCount;
  if (unit === 'spray') return rule.perSpray;
  return rule.perG ?? rule.perEach;
}

function fallbackUnitPrice(unit) {
  if (unit === 'g') return FALLBACK.perG;
  if (unit === 'ml') return FALLBACK.perMl;
  if (unit === 'each') return FALLBACK.perEach;
  if (unit === 'spray') return FALLBACK.perSpray;
  return FALLBACK.perCount;
}

// Smooth, prorated cost in USD for one { name, unit, quantity } line item
// (same shape buildShoppingList produces, see utils/shoppingList.js).
// Used for per-recipe "~$X.XX/serving" -- see the file header for why this
// intentionally does NOT round up to whole packages. `quantity` for
// 'count' eggs follows shoppingList.js's /50-per-egg convention.
export function estimateItemCost({ name, unit, quantity }) {
  const rule = PRICE_RULES.find((r) => r.pattern.test(name));
  // Eggs are stored as quantity/50 = whole-egg count -- perEach above is
  // already priced per whole egg, so undo that /50 scaling here rather
  // than pricing per gram-unit.
  if (unit === 'count' && /egg/i.test(name) && rule?.perEach != null) {
    return (quantity / 50) * rule.perEach;
  }
  const unitPrice = (rule ? priceForUnit(rule, unit) : null) ?? fallbackUnitPrice(unit);
  return quantity * unitPrice;
}

// Package-aware cost for the shopping list TOTAL -- rounds up to whole
// packages for categories with `pkg` info (see file header), falls back
// to the smooth per-unit rate for everything else (fresh proteins/
// produce, or an unmatched ingredient). Only sensible on an
// already-aggregated quantity (buildShoppingList sums the same
// ingredient across every recipe in the list before this runs), so this
// rounds up once per ingredient for the whole list, not once per recipe.
function estimateListItemCost({ name, unit, quantity }) {
  const rule = PRICE_RULES.find((r) => r.pattern.test(name));
  if (rule?.pkg && rule.pkg.unit === unit && quantity > 0) {
    const packagesNeeded = Math.ceil(quantity / rule.pkg.size);
    return packagesNeeded * rule.pkg.price;
  }
  return estimateItemCost({ name, unit, quantity });
}

// Sums estimateListItemCost across a whole shopping list (buildShoppingList's
// output). Returns a plain number, USD. This is the "Est. $X.XX" total
// shown on the Diary's shopping list -- package-aware, see file header.
export function estimateShoppingListCost(items) {
  return items.reduce((sum, item) => sum + estimateListItemCost(item), 0);
}

export function formatUsd(amount) {
  return `$${amount.toFixed(2)}`;
}

// Estimated cost for one full recipe batch and per single serving --
// "per serving" is what's shown as "~$X.XX/serving" on recipe
// cards/modal, since one serving is one meal. Deliberately uses the
// smooth per-item rate (estimateItemCost), not the shopping list's
// package-rounded one -- see file header for why these two are meant to
// differ.
export function estimateRecipeCost(recipe) {
  const components = resolveRecipeComponents(recipe);
  const total = components.reduce((sum, item) => sum + estimateItemCost(item), 0);
  const servings = recipe.servings > 0 ? recipe.servings : 1;
  return { total, perServing: total / servings };
}
