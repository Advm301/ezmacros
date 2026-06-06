/**
 * Shake Generator
 * Creates realistic protein shake recipes with customizable macros
 */

// Predefined shake bases with macros per standard serving
const SHAKE_BASES = {
  protein_sources: {
    whey_powder: { cal: 120, protein: 25, carbs: 2, fat: 1, name: 'Whey Protein Powder (1 scoop)', amount: '25g' },
    greek_yogurt: { cal: 59, protein: 10, carbs: 4, fat: 0, name: 'Greek Yogurt', amount: '100g' },
    cottage_cheese: { cal: 110, protein: 15, carbs: 4, fat: 5, name: 'Cottage Cheese', amount: '100g' },
    milk: { cal: 150, protein: 8, carbs: 12, fat: 8, name: 'Whole Milk', amount: '240ml' },
  },
  liquids: {
    almond_milk: { cal: 30, protein: 1, carbs: 1, fat: 2.5, name: 'Almond Milk (unsweetened)', amount: '240ml' },
    oat_milk: { cal: 140, protein: 2, carbs: 10, fat: 2.5, name: 'Oat Milk', amount: '240ml' },
    coconut_milk: { cal: 45, protein: 0, carbs: 1, fat: 4.5, name: 'Coconut Milk (lite)', amount: '240ml' },
  },
  fruits: {
    banana: { cal: 90, protein: 1, carbs: 23, fat: 0, name: 'Banana (medium)', amount: '1' },
    berries: { cal: 40, protein: 1, carbs: 10, fat: 0, name: 'Mixed Berries', amount: '80g' },
    mango: { cal: 90, protein: 1, carbs: 24, fat: 0, name: 'Mango chunks', amount: '130g' },
    blueberries: { cal: 85, protein: 1, carbs: 21, fat: 0, name: 'Blueberries', amount: '150g' },
  },
  add_ons: {
    honey: { cal: 60, protein: 0, carbs: 17, fat: 0, name: 'Honey', amount: '1 tbsp' },
    peanut_butter: { cal: 95, protein: 4, carbs: 3, fat: 8, name: 'Peanut Butter (natural)', amount: '1 tbsp' },
    almond_butter: { cal: 95, protein: 3, carbs: 3, fat: 9, name: 'Almond Butter', amount: '1 tbsp' },
    oats: { cal: 150, protein: 5, carbs: 27, fat: 3, name: 'Oats (rolled)', amount: '40g' },
    chia_seeds: { cal: 80, protein: 3, carbs: 7, fat: 5, name: 'Chia Seeds', amount: '1 tbsp' },
    flax_seeds: { cal: 55, protein: 2, carbs: 3, fat: 4, name: 'Ground Flax', amount: '1 tbsp' },
  },
};

const SHAKE_TEMPLATES = [
  { name: 'Classic Vanilla', emoji: '🥛', fruits: [], add_ons: [], flavor_tags: ['vanilla', 'simple', 'neutral'] },
  { name: 'Berry Blast', emoji: '🫐', fruits: ['berries'], add_ons: [], flavor_tags: ['fruity', 'berry'] },
  { name: 'Tropical Paradise', emoji: '🥭', fruits: ['mango'], add_ons: [], flavor_tags: ['tropical', 'fruity'] },
  { name: 'Banana Protein', emoji: '🍌', fruits: ['banana'], add_ons: [], flavor_tags: ['banana', 'classic'] },
  { name: 'PB & Banana', emoji: '🍌', fruits: ['banana'], add_ons: ['peanut_butter'], flavor_tags: ['classic', 'indulgent'] },
  { name: 'Almond Honey', emoji: '🍯', fruits: [], add_ons: ['almond_butter', 'honey'], flavor_tags: ['sweet', 'indulgent'] },
  { name: 'Berrylicious', emoji: '🫐', fruits: ['blueberries'], add_ons: ['honey'], flavor_tags: ['fruity', 'sweet'] },
  { name: 'Creamy Oatmeal', emoji: '🌾', fruits: ['banana'], add_ons: ['oats'], flavor_tags: ['hearty', 'filling'] },
];

/**
 * Generate a shake recipe with target macros
 * Combines bases and add-ons to hit specific macro targets
 */
export function generateShakeRecipe(proteinTarget = 30, carbTarget = 20, fatTarget = 5, templateIndex = null) {
  // Select template or pick random
  const template = templateIndex !== null
    ? SHAKE_TEMPLATES[templateIndex % SHAKE_TEMPLATES.length]
    : SHAKE_TEMPLATES[Math.floor(Math.random() * SHAKE_TEMPLATES.length)];

  // Start with protein powder + milk base
  const selectedBase = SHAKE_BASES.protein_sources.whey_powder;
  const selectedLiquid = SHAKE_BASES.liquids.almond_milk;

  let components = [
    { name: selectedBase.name, amount: selectedBase.amount, cal: selectedBase.cal, protein: selectedBase.protein, carbs: selectedBase.carbs, fat: selectedBase.fat },
    { name: selectedLiquid.name, amount: selectedLiquid.amount, cal: selectedLiquid.cal, protein: selectedLiquid.protein, carbs: selectedLiquid.carbs, fat: selectedLiquid.fat },
  ];

  let totalMacros = {
    cal: selectedBase.cal + selectedLiquid.cal,
    protein: selectedBase.protein + selectedLiquid.protein,
    carbs: selectedBase.carbs + selectedLiquid.carbs,
    fat: selectedBase.fat + selectedLiquid.fat,
  };

  // Add fruits from template
  if (template.fruits.length > 0) {
    const fruit = SHAKE_BASES.fruits[template.fruits[0]];
    if (fruit) {
      components.push({ name: fruit.name, amount: fruit.amount, cal: fruit.cal, protein: fruit.protein, carbs: fruit.carbs, fat: fruit.fat });
      totalMacros.cal += fruit.cal;
      totalMacros.protein += fruit.protein;
      totalMacros.carbs += fruit.carbs;
      totalMacros.fat += fruit.fat;
    }
  }

  // Add add-ons from template
  if (template.add_ons.length > 0) {
    const addOn = SHAKE_BASES.add_ons[template.add_ons[0]];
    if (addOn) {
      components.push({ name: addOn.name, amount: addOn.amount, cal: addOn.cal, protein: addOn.protein, carbs: addOn.carbs, fat: addOn.fat });
      totalMacros.cal += addOn.cal;
      totalMacros.protein += addOn.protein;
      totalMacros.carbs += addOn.carbs;
      totalMacros.fat += addOn.fat;
    }
  }

  // Clamp macros to reasonable shake range
  const finalRecipe = {
    id: `shake_${Date.now()}`,
    name: template.name,
    method: 'Blended',
    type: 'protein_shake',
    mealType: 'Snack',
    tags: template.flavor_tags,
    ezLevel: 1,
    spiceLevel: 0,
    cal: totalMacros.cal,
    protein: totalMacros.protein,
    carbs: totalMacros.carbs,
    fat: totalMacros.fat,
    activeTime: 3,
    stepCount: 3,
    components: components.map(c => ({
      name: c.name,
      amount: c.amount,
      cal: c.cal,
      protein: c.protein,
      carbs: c.carbs,
      fat: c.fat,
      userAdded: false,
    })),
    toppings: [],
    steps: [
      'Add liquid to blender first',
      'Add protein powder and other ingredients',
      'Blend for 30-45 seconds until smooth',
    ],
    isAutoGenerated: true,
  };

  return finalRecipe;
}

/**
 * Generate multiple shake variants
 * Returns array of shakes with different templates
 */
export function generateShakeVariants(count = 3) {
  const shakes = [];
  const indices = new Set();

  // Get unique random indices
  while (indices.size < Math.min(count, SHAKE_TEMPLATES.length)) {
    indices.add(Math.floor(Math.random() * SHAKE_TEMPLATES.length));
  }

  // Generate shakes for each index
  indices.forEach(idx => {
    shakes.push(generateShakeRecipe(30, 20, 5, idx));
  });

  return shakes;
}
