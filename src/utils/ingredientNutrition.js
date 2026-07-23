import { resolveRecipeComponents } from './shoppingList';

// Real protein-gram estimation -- unlike utils/ingredientPricing.js (which
// has no authoritative public price source to draw from), protein content
// of whole foods is stable, well-established data: standard USDA
// FoodData Central reference values, raw/as-purchased weight (matching
// how recipe component quantities are actually recorded -- e.g. "Chicken
// Breast (170g)" means 170g raw, the amount you'd buy and weigh out, not
// a post-cooking yield). Rice is the one exception treated as
// cooked/ready-to-eat weight rather than dry, since this app's own
// Prefer Fresh mechanism already treats rice quantities that way (see
// freshAltTips.js's rice-pouch <-> fresh-cooked-rice swap).
//
// This directly replaces recipes.js's manually-applied `high_protein` tag
// as the source of truth for the High Protein filter/badge (see
// Browse.jsx and onboardingGoals.js) -- that tag had no gram threshold
// backing it at all (grep the codebase for "35g": there's nothing).
// Recipes keep the tag in their data for now (harmless, just unread by
// the filter going forward) rather than a large low-value data cleanup.
//
// Rules are tested in order, first match wins -- same convention as
// ingredientPricing.js, more specific patterns listed before broader ones
// in the same category.
const PROTEIN_RULES = [
  // --- Broths/stocks MUST come before the raw-meat rules below. A name
  // like "Chicken Broth" or "Beef Broth" would otherwise match the raw
  // /\bchicken\b/i or /\bbeef\b/i pattern first (first-match-wins) and get
  // priced as if it were solid raw meat at that quantity -- e.g. 2000ml of
  // "Chicken Broth" was computing as 420g of protein (2000 x 0.21 raw-
  // chicken rate) instead of the correct ~30g (2000 x 0.015 broth rate).
  // Caught via the Gumbo/Birria Tacos outlier investigation below.
  { pattern: /broth|stock|bouillon/i, perG: 0.015, perMl: 0.015 },
  // Same reasoning: a prepped vegetable mix like "Frozen Seasoning Blend
  // (Holy Trinity: onion, celery, bell pepper)" would otherwise match the
  // /bell pepper/i produce rule further down purely because that word
  // appears in the description, wildly overcounting a 1200g bag of diced
  // veg at bell-pepper's per-each/per-g rate. Route these to the frozen-mix
  // vegetable rate instead.
  { pattern: /seasoning blend|holy trinity|mirepoix|veggie mix/i, perG: 0.014 },

  // --- Proteins (g protein per g of ingredient, raw/as-purchased) ---
  { pattern: /ground turkey/i, perG: 0.19 },
  { pattern: /ground (beef|chuck)/i, perG: 0.17 },
  { pattern: /ground chicken/i, perG: 0.18 },
  { pattern: /\b(steak|sirloin|flank|ribeye)\b/i, perG: 0.21 },
  // Dried/jerky forms are far more protein-dense per gram than raw beef
  // (most of the weight loss in drying is water) -- without this, "Beef
  // Jerky" fell through to the raw-beef rate below and badly undercounted
  // a snack that's specifically marketed as high-protein.
  { pattern: /jerky/i, perG: 0.33 },
  { pattern: /\bbeef\b/i, perG: 0.20 },
  { pattern: /\b(bacon)\b/i, perG: 0.12 },
  { pattern: /\b(sausage|kielbasa|bratwurst|andouille|chorizo|pepperoni)\b/i, perG: 0.13 },
  { pattern: /\bham\b/i, perG: 0.18 },
  { pattern: /pork (chop|tenderloin|loin)/i, perG: 0.20 },
  { pattern: /\bpork\b/i, perG: 0.19 },
  { pattern: /chicken (breast|tender|cutlet)/i, perG: 0.225 },
  { pattern: /chicken thigh/i, perG: 0.18 },
  { pattern: /canned chicken/i, perG: 0.20 },
  { pattern: /\bchicken\b/i, perG: 0.21 },
  { pattern: /\bturkey\b/i, perG: 0.19 },
  { pattern: /\bsalmon\b/i, perG: 0.20 },
  { pattern: /\b(shrimp|prawn)\b/i, perG: 0.18 },
  { pattern: /\b(tilapia|cod|white fish|halibut)\b/i, perG: 0.18 },
  { pattern: /canned tuna/i, perG: 0.26 },
  { pattern: /\btuna\b/i, perG: 0.24 },
  { pattern: /\bcrab\b/i, perG: 0.19 },
  { pattern: /sardine/i, perG: 0.24 },
  { pattern: /\begg(s)?\b/i, perEach: 6.3, perG: 0.125 },

  // --- Dairy ---
  { pattern: /cottage cheese/i, perG: 0.11 },
  { pattern: /greek yogurt|skyr/i, perG: 0.10 },
  { pattern: /\byogurt\b/i, perG: 0.05 },
  { pattern: /cream cheese/i, perG: 0.06 },
  { pattern: /parmesan/i, perG: 0.38 },
  { pattern: /feta/i, perG: 0.14 },
  { pattern: /mozzarella|cheddar|american cheese|cheese slice|shredded cheese|block cheese/i, perG: 0.24 },
  { pattern: /\bcheese\b/i, perG: 0.24 },
  { pattern: /\bbutter\b/i, perG: 0.009 },
  { pattern: /sour cream/i, perG: 0.024 },
  { pattern: /soy milk/i, perMl: 0.033, perG: 0.033 },
  { pattern: /almond milk|oat milk/i, perMl: 0.006, perG: 0.006 },
  { pattern: /\bmilk\b/i, perMl: 0.034, perG: 0.034 },
  { pattern: /heavy cream/i, perMl: 0.021 },
  { pattern: /protein powder/i, perG: 0.75 },
  // Protein pancake/waffle mixes are formulated with added whey/pea
  // protein, well above a plain flour pancake mix -- without this pattern
  // a recipe literally named "Protein Pancakes" fell through to the
  // unmatched fallback rate and undercounted its own headline ingredient.
  { pattern: /protein pancake|protein waffle/i, perG: 0.20 },

  // --- Grains, starches, bread ---
  { pattern: /ramen/i, perG: 0.10 },
  // perEach covers "1 rice pouch" style quantities -- a microwave rice
  // pouch is ~250g cooked, so 250 x 0.027 =~ 6.75g, more accurate than the
  // generic each-fallback's assume-100g heuristic used elsewhere below.
  { pattern: /\brice\b/i, perG: 0.027, perEach: 6.75 },
  { pattern: /quinoa/i, perG: 0.044 },
  { pattern: /\boats\b|oatmeal/i, perG: 0.13 },
  { pattern: /chickpea pasta|banza/i, perG: 0.20 },
  { pattern: /\bpasta\b|noodle/i, perG: 0.13 },
  { pattern: /tortilla/i, perEach: 3.5 },
  { pattern: /bagel/i, perEach: 10 },
  { pattern: /\bbun\b|brioche|english muffin/i, perEach: 5 },
  { pattern: /\bbread\b/i, perG: 0.09 },
  { pattern: /sweet potato/i, perG: 0.016 },
  { pattern: /\bpotato/i, perG: 0.02 },

  // --- Produce ---
  { pattern: /avocado/i, perEach: 4, perG: 0.02 },
  { pattern: /banana/i, perEach: 1.3, perG: 0.011 },
  { pattern: /\bapple\b/i, perEach: 0.4, perG: 0.003 },
  { pattern: /berries|berry/i, perG: 0.007 },
  { pattern: /lemon|lime/i, perEach: 0.4 },
  { pattern: /bell pepper/i, perEach: 1.5, perG: 0.01 },
  { pattern: /onion|shallot/i, perG: 0.011 },
  { pattern: /garlic/i, perG: 0.064 },
  { pattern: /broccoli|cauliflower/i, perG: 0.028 },
  { pattern: /spinach|arugula|kale/i, perG: 0.029 },
  { pattern: /lettuce|salad kit/i, perG: 0.014 },
  { pattern: /tomato\b/i, perG: 0.009 },
  { pattern: /cucumber/i, perG: 0.0065 },
  { pattern: /mushroom/i, perG: 0.031 },
  { pattern: /zucchini|squash/i, perG: 0.012 },
  { pattern: /corn\b/i, perG: 0.033 },
  { pattern: /frozen (veg|vegetable|broccoli|pea|corn|mix)/i, perG: 0.025 },

  // --- Legumes / plant proteins ---
  { pattern: /black bean|kidney bean|pinto bean|refried bean/i, perG: 0.089 },
  { pattern: /chickpea/i, perG: 0.089 },
  { pattern: /\btofu\b/i, perG: 0.08 },
  { pattern: /edamame/i, perG: 0.11 },
  { pattern: /lentil/i, perG: 0.09 },

  // --- Canned / jarred ---
  { pattern: /canned (diced |crushed |cherry )?tomato/i, perG: 0.011, perMl: 0.011 },
  { pattern: /canned pineapple/i, perMl: 0.005, perG: 0.005 },

  // --- Sauces, condiments, spreads ---
  { pattern: /hot honey|honey/i, perG: 0.003, perMl: 0.003 },
  { pattern: /maple syrup/i, perMl: 0 },
  { pattern: /sauce|dressing|marinade|vinaigrette|salsa|guacamole|mayo|mustard|ketchup/i, perMl: 0.01, perG: 0.01 },
  { pattern: /\boil\b/i, perMl: 0 },
  { pattern: /vinegar/i, perMl: 0 },
  { pattern: /peanut butter|almond butter/i, perG: 0.25 },
  { pattern: /hummus/i, perG: 0.08 },
  { pattern: /nuts|almonds|walnuts|pecans|pistachio|cashew/i, perG: 0.21 },
  { pattern: /seeds|chia|flax/i, perG: 0.18 },
  { pattern: /granola/i, perG: 0.10 },

  // --- Seasonings / baking (negligible at typical quantities, included
  //     for completeness rather than impact) ---
  { pattern: /seasoning|spice|powder|paprika|cumin|oregano|basil|cayenne|chili flake|black pepper|salt\b|cinnamon|caraway/i, perG: 0.12 },
  { pattern: /sugar\b/i, perG: 0 },
  { pattern: /flour/i, perG: 0.10 },
  { pattern: /baking powder|baking soda/i, perG: 0 },
];

// Generic fallback -- keeps every line item computable without pretending
// to know an unrecognized ingredient's protein content. Low rather than
// mid-range (unlike the price fallback): most unmatched ingredients in
// this catalog are likely garnishes/produce/seasonings, not proteins, so
// erring low avoids inflating an estimate off an unmatched item.
const FALLBACK_PER_G = 0.02;

function proteinForUnit(rule, unit) {
  if (unit === 'g') return rule.perG;
  if (unit === 'ml') return rule.perMl ?? rule.perG;
  if (unit === 'each') return rule.perEach ?? (rule.perG != null ? rule.perG * 100 : undefined);
  if (unit === 'count') return rule.perEach;
  if (unit === 'spray') return 0;
  return rule.perG;
}

// Grams of protein in one { name, unit, quantity } component. `quantity`
// for 'count' eggs follows shoppingList.js's /50-per-egg convention.
function estimateItemProtein({ name, unit, quantity }) {
  const rule = PROTEIN_RULES.find((r) => r.pattern.test(name));
  if (unit === 'count' && /egg/i.test(name) && rule?.perEach != null) {
    return (quantity / 50) * rule.perEach;
  }
  const perUnit = rule ? proteinForUnit(rule, unit) : null;
  if (perUnit != null) return quantity * perUnit;
  // No rule matched at all -- fall back to the conservative per-gram
  // default (only meaningful for g/ml units; an unmatched 'each'/'count'
  // item is assumed protein-negligible rather than guessed at).
  if (unit === 'g' || unit === 'ml') return quantity * FALLBACK_PER_G;
  return 0;
}

// Total + per-serving protein (grams) for a recipe, resolving
// proteinOptions/Prefer Fresh the same way the cost estimator does (see
// utils/shoppingList.js's resolveRecipeComponents).
export function estimateRecipeProtein(recipe) {
  const components = resolveRecipeComponents(recipe);
  const total = components.reduce((sum, item) => sum + estimateItemProtein(item), 0);
  const servings = recipe.servings > 0 ? recipe.servings : 1;
  return { total, perServing: total / servings };
}

// The real, computed threshold for "High Protein" -- see
// utils/ingredientNutrition.js's header comment and Browse.jsx for where
// this replaces the old unbacked `high_protein` tag. Calibrated against
// the actual distribution across the full recipe catalog (166 recipes,
// median ~37g/serving, average ~36.8g/serving -- this catalog skews
// protein-heavy since it's built around that goal). 30g qualified 72% of
// recipes, which makes the badge nearly meaningless as a filter; 40g
// qualifies ~35% (a real top slice) and is also a widely recognized
// per-meal protein target on its own, so it was picked over the
// median-adjacent 35-38g range for being a cleaner, more legible number.
export const HIGH_PROTEIN_THRESHOLD_G = 40;

export function isHighProtein(recipe) {
  return estimateRecipeProtein(recipe).perServing >= HIGH_PROTEIN_THRESHOLD_G;
}

export function formatProtein(grams) {
  return `${Math.round(grams)}g protein`;
}
