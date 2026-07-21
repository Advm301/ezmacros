// Highlights key ingredient/food words within a recipe's short description
// (e.g. "A spicy, high-protein taco-seasoned ground beef bowl with black
// beans, rice, and salsa.") so the actual food -- not the connecting prose
// -- is what jumps out at a glance. Same idea as utils/actionWords.js
// (which highlights command verbs in instructions), but for nouns: the
// list below was built by reading every one of this app's 140+ recipe
// descriptions (see data/recipes.js) and pulling out the food terms that
// actually appear, rather than guessing at a generic grocery-list
// vocabulary. Dish/format words ("bowl", "skillet", "sauce", "seasoning",
// "salad") are deliberately excluded -- those describe the dish, not an
// ingredient in it, so lighting them up would dilute the effect.
//
// Multi-word ingredients ("black beans", "ground beef", "sweet potato")
// are listed as whole phrases so they highlight as one unit instead of
// splitting into two separately-colored words. Longest phrases are tried
// first (see PHRASE/WORD merge + sort below) so e.g. "black beans" wins
// over a bare "beans", and "smoked paprika" wins over a bare "paprika".

const INGREDIENT_PHRASES = [
  'black beans', 'kidney beans', 'green beans', 'refried beans',
  'ground beef', 'ground turkey', 'ground chicken', 'ground pork',
  'chicken thighs', 'chicken tenders', 'chicken bites',
  'pork tenderloin', 'pork chops',
  'turkey sausage', 'turkey bacon', 'turkey pepperoni', 'turkey meatballs',
  'beef jerky',
  'smoked salmon',
  'rotisserie chicken',
  'deli turkey',
  'canned chicken',
  'imitation crab',
  'andouille sausage',
  'egg whites', 'egg white',
  'egg noodles',
  'hash browns', 'hash brown',
  'sweet potato noodles', 'sweet potato',
  'rice cakes',
  'string cheese',
  'cream cheese',
  'cottage cheese',
  'pepper jack',
  'american cheese',
  'sour cream',
  'greek yogurt',
  'peanut butter',
  'almond milk',
  'almond butter',
  'chia seeds',
  'protein powder',
  'hot sauce',
  'soy sauce',
  'bbq sauce',
  'enchilada sauce',
  'bang bang sauce',
  'caesar dressing',
  'salsa verde',
  'chili crisp',
  'red pepper flakes',
  'smoked paprika',
  'chili powder',
  'garlic powder',
  'brown sugar',
  'rice vinegar',
  'sesame oil',
  'sesame seeds',
  'cherry tomatoes',
  'sun-dried tomatoes',
  'stir-fry vegetables',
  'mixed berries',
  'mixed veg',
  'everything bagel seasoning',
  'italian seasoning',
  'chickpea pasta',
];

const INGREDIENT_WORDS = [
  'salmon', 'cod', 'shrimp', 'chicken', 'turkey', 'beef', 'pork', 'tuna',
  'egg', 'eggs',
  'bacon', 'sausage', 'chorizo',
  'rice', 'broccoli', 'spinach', 'arugula', 'romaine', 'lettuce', 'cucumber', 'avocado',
  'berries', 'blueberries', 'pineapple', 'tomatoes', 'tomato',
  'jalapeno', 'jalapeño', 'jalapenos', 'jalapeños',
  'pickles', 'capers', 'edamame', 'peas', 'coleslaw', 'granola',
  'cheddar', 'mozzarella', 'parmesan', 'feta', 'cheese',
  'mayo', 'mustard', 'dijon', 'ketchup', 'honey', 'butter', 'milk', 'yogurt', 'skyr', 'cocoa',
  'salsa', 'guacamole', 'tzatziki', 'pesto', 'ranch', 'gochujang', 'kimchi',
  'marinara', 'sriracha', 'buffalo', 'teriyaki',
  'chickpeas', 'chickpea', 'pasta', 'spaghetti', 'noodles',
  'naan', 'tortilla', 'tortillas', 'flatbread', 'sourdough', 'bagel', 'toast', 'bun', 'wrap', 'wraps',
  'cinnamon', 'vanilla', 'chili', 'cumin', 'oregano', 'paprika', 'garlic', 'ginger', 'sesame',
  'lemon', 'lime', 'dill', 'balsamic', 'chipotle', 'cayenne',
  'crackers', 'peanut', 'almond', 'quinoa',
];

// Longest-first so e.g. "black beans" wins over a bare "beans" match, and
// multi-word phrases claim their full span before any of their component
// words get a chance to match on their own.
const ALL_TERMS = [...INGREDIENT_PHRASES, ...INGREDIENT_WORDS].sort(
  (a, b) => b.length - a.length
);

const INGREDIENT_WORDS_REGEX = new RegExp(
  `\\b(${ALL_TERMS.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
  'gi'
);

// Splits a recipe description into an array of { text, ingredient }
// segments, in order, that concatenate back into the original string --
// `ingredient: true` segments are the recognized food terms to render
// highlighted. Mirrors utils/actionWords.js's splitActionWords shape.
export function splitIngredientWords(text) {
  if (!text) return [{ text: text || '', ingredient: false }];
  const parts = text.split(INGREDIENT_WORDS_REGEX);
  return parts
    .map((s, i) => ({ text: s, ingredient: i % 2 === 1 }))
    .filter((seg) => seg.text !== undefined && seg.text !== '');
}
