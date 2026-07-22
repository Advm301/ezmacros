// Common pantry staples used for 'what can I make with what I have' matching
// on the Kitchen tab. Each recipe is tagged (recipes.js `pantryTags`) with the
// staples its ingredients draw from. Grouped into categories so the picker on
// Kitchen reads more like a real pantry/fridge instead of one long list.
//
// Expanded from the original ~27 items to ~50 after an ingredient audit
// across all 144 recipes turned up real gaps -- most notably, raw protein
// cuts (chicken breast, chicken thighs, ground turkey/chicken/pork, pork
// chops, salmon, cod, shrimp) had no pantry tag at all despite being the
// literal main ingredient in dozens of recipes, because the original list
// only covered shelf-stable/freezer staples (rotisserie chicken, ground
// beef, canned fish) rather than fresh cuts. Kept "general" on purpose --
// e.g. one "Mayo" item rather than separately listing "Chipotle Mayo" and
// "Light Mayo" -- so this stays a reasonable picker rather than growing
// toward one entry per exact ingredient string. Everyday seasoning shakers
// (garlic powder, italian seasoning, taco seasoning, etc.) are deliberately
// left out even though they appear often -- they're assumed-available flavor
// basics rather than something that meaningfully changes which recipes you
// can make, matching how the original list already excluded oil/salt/pepper.
export const PANTRY_CATEGORIES = [
  {
    category: 'Grains & Starches',
    items: [
      { id: 'rice', label: 'Rice' },
      { id: 'pasta', label: 'Pasta & Noodles' },
      { id: 'bread', label: 'Bread & Bagels' },
      { id: 'buns_rolls', label: 'Buns, Rolls & Muffins' },
      { id: 'tortillas', label: 'Tortillas' },
      { id: 'potatoes', label: 'Potatoes & Sweet Potatoes' },
      { id: 'oats', label: 'Oats' },
    ],
  },
  {
    category: 'Proteins',
    items: [
      { id: 'eggs', label: 'Eggs' },
      { id: 'chicken_breast', label: 'Chicken Breast' },
      { id: 'chicken_thighs', label: 'Chicken Thighs' },
      { id: 'ground_beef', label: 'Ground Beef' },
      { id: 'ground_turkey', label: 'Ground Turkey' },
      { id: 'ground_chicken', label: 'Ground Chicken' },
      { id: 'ground_pork', label: 'Ground Pork' },
      { id: 'pork', label: 'Pork Chops & Tenderloin' },
      { id: 'salmon', label: 'Salmon' },
      { id: 'white_fish', label: 'Cod & White Fish' },
      { id: 'shrimp', label: 'Shrimp & Seafood' },
      { id: 'rotisserie_chicken', label: 'Rotisserie & Canned Chicken' },
      { id: 'bacon', label: 'Bacon' },
      { id: 'sausage', label: 'Sausage & Meatballs' },
      { id: 'deli_meat', label: 'Deli Meat' },
      { id: 'canned_fish', label: 'Canned & Pouched Fish' },
      { id: 'canned_beans', label: 'Canned Beans' },
      { id: 'protein_powder', label: 'Protein Powder' },
    ],
  },
  {
    category: 'Dairy & Fridge',
    items: [
      { id: 'cheese', label: 'Cheese' },
      { id: 'greek_yogurt', label: 'Greek Yogurt' },
      { id: 'cottage_cheese', label: 'Cottage Cheese' },
      { id: 'milk', label: 'Milk' },
      { id: 'butter', label: 'Butter' },
      { id: 'sour_cream', label: 'Sour Cream' },
      { id: 'cream_cheese', label: 'Cream Cheese' },
    ],
  },
  {
    category: 'Produce',
    items: [
      { id: 'salad_greens', label: 'Salad Greens' },
      { id: 'onion_garlic', label: 'Onion & Garlic' },
      { id: 'bell_peppers', label: 'Bell Peppers' },
      { id: 'avocado', label: 'Avocado & Guacamole' },
      { id: 'cucumber', label: 'Cucumber' },
      { id: 'frozen_veg', label: 'Frozen Vegetables' },
      { id: 'mushroom', label: 'Mushrooms' },
      { id: 'fruit', label: 'Fresh & Frozen Fruit' },
    ],
  },
  {
    category: 'Canned & Condiments',
    items: [
      { id: 'canned_tomatoes', label: 'Canned Tomatoes' },
      { id: 'marinara', label: 'Marinara & Pasta Sauce' },
      { id: 'salsa', label: 'Salsa & Enchilada Sauce' },
      { id: 'hot_sauce', label: 'Hot Sauce & Spicy Condiments' },
      { id: 'bbq_sauce', label: 'BBQ Sauce' },
      { id: 'teriyaki_sauce', label: 'Teriyaki Sauce' },
      { id: 'soy_sauce', label: 'Soy Sauce' },
      { id: 'mayo', label: 'Mayo' },
      { id: 'mustard', label: 'Mustard' },
      { id: 'peanut_butter', label: 'Peanut Butter' },
      { id: 'broth', label: 'Broth & Stock' },
      { id: 'salad_dressing', label: 'Salad Dressing' },
    ],
  },
];

// Flat list, kept for anything that just needs id/label pairs regardless of
// category (search filtering, id -> label lookups, etc.).
export const PANTRY_STAPLES = PANTRY_CATEGORIES.flatMap((c) => c.items);

// One-tap shortcuts for the most common "what's actually in the fridge"
// picks -- shown both on the idle Kitchen screen (see Kitchen.jsx's Quick
// Picks row) and in the onboarding flow's "what do you usually have?" step
// (see components/Onboarding.jsx), so both places offer the exact same
// list rather than two hand-maintained copies drifting apart. Mostly
// proteins, since a protein is the hard filter that actually narrows down
// what you can make, plus the two most common carb staples.
export const QUICK_PICK_IDS = [
  'chicken_breast', 'ground_beef', 'eggs', 'chicken_thighs', 'ground_turkey',
  'salmon', 'shrimp', 'rotisserie_chicken', 'rice', 'pasta',
];
export const QUICK_PICKS = QUICK_PICK_IDS
  .map((id) => PANTRY_STAPLES.find((s) => s.id === id))
  .filter(Boolean);
