// Common pantry staples used for 'what can I make with what I have' matching
// on the Kitchen tab. Each recipe is tagged (recipes.js `pantryTags`) with the
// staples its ingredients draw from. Grouped into categories so the picker on
// Kitchen reads more like a real pantry/fridge instead of one long list.
export const PANTRY_CATEGORIES = [
  {
    category: 'Grains & Starches',
    items: [
      { id: 'rice', label: 'Rice' },
      { id: 'pasta', label: 'Pasta & Noodles' },
      { id: 'bread', label: 'Bread & Bagels' },
      { id: 'tortillas', label: 'Tortillas' },
      { id: 'potatoes', label: 'Potatoes' },
      { id: 'oats', label: 'Oats' },
    ],
  },
  {
    category: 'Proteins',
    items: [
      { id: 'eggs', label: 'Eggs' },
      { id: 'ground_beef', label: 'Ground Beef' },
      { id: 'rotisserie_chicken', label: 'Rotisserie Chicken' },
      { id: 'bacon', label: 'Bacon' },
      { id: 'sausage', label: 'Sausage' },
      { id: 'deli_meat', label: 'Deli Meat' },
      { id: 'canned_fish', label: 'Canned & Pouched Fish' },
      { id: 'canned_beans', label: 'Canned Beans' },
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
    ],
  },
  {
    category: 'Produce',
    items: [
      { id: 'salad_greens', label: 'Salad Greens' },
      { id: 'onion_garlic', label: 'Onion & Garlic' },
      { id: 'bell_peppers', label: 'Bell Peppers' },
      { id: 'avocado', label: 'Avocado' },
      { id: 'frozen_veg', label: 'Frozen Vegetables' },
    ],
  },
  {
    category: 'Canned & Condiments',
    items: [
      { id: 'canned_tomatoes', label: 'Canned Tomatoes' },
      { id: 'salsa', label: 'Salsa' },
      { id: 'hot_sauce', label: 'Hot Sauce' },
      { id: 'soy_sauce', label: 'Soy Sauce' },
      { id: 'peanut_butter', label: 'Peanut Butter' },
      { id: 'broth', label: 'Broth & Stock' },
    ],
  },
];

// Flat list, kept for anything that just needs id/label pairs regardless of
// category (search filtering, id -> label lookups, etc.).
export const PANTRY_STAPLES = PANTRY_CATEGORIES.flatMap((c) => c.items);
