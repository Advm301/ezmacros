import { RECIPES } from '../data/recipes.js';

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Calculate how closely a meal hits a macro target
 * Distance = abs distance to calorie target + (abs distance to protein target * 0.5)
 * Returns a number where lower = better
 */
function calculateMacroDistance(recipe, targetMacros) {
  const calDiff = Math.abs((recipe.cal || 0) - targetMacros.cal);
  const proteinDiff = Math.abs((recipe.protein || 0) - targetMacros.protein);

  // Weight calories more heavily than protein
  const distance = calDiff + (proteinDiff * 0.5);
  // Uncomment for very verbose logging:
  // console.log(`[DEBUG]   Distance for ${recipe.name}: cal_diff=${calDiff} + protein_diff=${proteinDiff}*0.5 = ${distance}`);
  return distance;
}

/**
 * Filter recipes based on user preferences with progressive fallback for wider pool
 */
function filterRecipesByPreferences(recipes, preferences, excludeRecipeIds = []) {
  console.log('[DEBUG] filterRecipesByPreferences called');
  console.log('[DEBUG]   Input recipes:', recipes.length);
  console.log('[DEBUG]   Protein preferences:', preferences.protein_preferences.length, preferences.protein_preferences);

  // If user selected 8+ proteins (most of available), treat as "any protein"
  const skipProteinFilter = preferences.protein_preferences.length >= 8;
  if (skipProteinFilter) {
    console.log('[DEBUG]   8+ proteins selected - treating as "any protein"');
  }

  // Helper to apply all filters
  const applyAllFilters = (recipeList) => {
    return recipeList.filter(recipe => {
      if (excludeRecipeIds.includes(recipe.id)) return false;

      // Spice filter
      if (preferences.spice_level !== 'any') {
        const spiceMap = { 'low': 0, 'medium': 1, 'medium-hot': 2, 'hot': 3 };
        const targetSpice = spiceMap[preferences.spice_level];
        if (targetSpice !== undefined && recipe.spiceLevel !== targetSpice) return false;
      }

      // Protein filter (skip if user selected most proteins)
      if (!skipProteinFilter && preferences.protein_preferences.length > 0) {
        const mainComponent = recipe.components && recipe.components[0];
        if (!mainComponent) return false;

        const componentName = mainComponent.name || '';
        const proteinNameFromComponent = componentName.split('(')[0].trim();
        const normalizedProtein = proteinNameFromComponent.toLowerCase().replace(/\s+/g, '_');

        const hasPreferredProtein = preferences.protein_preferences.some(pref => {
          const prefNormalized = pref.toLowerCase().replace(/\s+/g, '_');
          return normalizedProtein === prefNormalized || normalizedProtein.includes(prefNormalized);
        });

        if (!hasPreferredProtein) return false;
      }

      return true;
    });
  };

  let filtered = applyAllFilters(recipes);
  console.log('[DEBUG] After all filters:', filtered.length, 'recipes');

  // Fallback 1: If fewer than 10, relax protein filter
  if (filtered.length < 10 && preferences.protein_preferences.length > 0) {
    console.log('[DEBUG] < 10 recipes, relaxing protein filter...');
    filtered = recipes.filter(recipe => {
      if (excludeRecipeIds.includes(recipe.id)) return false;
      if (preferences.spice_level !== 'any') {
        const spiceMap = { 'low': 0, 'medium': 1, 'medium-hot': 2, 'hot': 3 };
        const targetSpice = spiceMap[preferences.spice_level];
        if (targetSpice !== undefined && recipe.spiceLevel !== targetSpice) return false;
      }
      return true;
    });
    console.log('[DEBUG] After relaxing protein filter:', filtered.length, 'recipes');
  }

  // Fallback 2: If still fewer than 5, use only meal type filter (applied by caller)
  if (filtered.length < 5) {
    console.log('[DEBUG] < 5 recipes, returning all non-excluded for meal type caller to filter');
    filtered = recipes.filter(r => !excludeRecipeIds.includes(r.id));
    console.log('[DEBUG] After removing only excludes:', filtered.length, 'recipes');
  }

  return filtered;
}

/**
 * Select a random recipe for a given meal slot from all qualifying recipes
 * Filters by preferences and randomly selects from matches to ensure variety
 */
function selectBestRecipe(recipes, targetMacros, preferences, excludeRecipeIds = []) {
  console.log('[DEBUG] selectBestRecipe called');
  console.log('[DEBUG]   Input recipes:', recipes.length);
  console.log('[DEBUG]   Target macros:', targetMacros);

  const filtered = filterRecipesByPreferences(recipes, preferences, excludeRecipeIds);
  console.log('[DEBUG]   After preference filtering:', filtered.length);

  if (filtered.length === 0) {
    console.log('[DEBUG]   No recipes passed filter - returning null');
    return null;
  }

  // Shuffle to randomize selection
  const shuffled = shuffleArray(filtered);

  // Pick a random recipe from the shuffled list
  const selectedIndex = Math.floor(Math.random() * shuffled.length);
  const selected = shuffled[selectedIndex];

  console.log('[DEBUG]   selectBestRecipe randomly selected index', selectedIndex, ':', selected.id, '-', selected.name);
  return selected;
}

/**
 * Calculate accuracy of a meal plan vs daily goals
 * Returns object with overall accuracy % and per-macro breakdowns
 */
function calculateAccuracy(planMacros, dailyGoals) {
  const macroAccuracy = {
    calories: Math.max(0, 100 - Math.abs((planMacros.cal - dailyGoals.cal) / dailyGoals.cal * 100)),
    protein: Math.max(0, 100 - Math.abs((planMacros.protein - dailyGoals.protein) / dailyGoals.protein * 100)),
    carbs: Math.max(0, 100 - Math.abs((planMacros.carbs - dailyGoals.carbs) / dailyGoals.carbs * 100)),
    fat: Math.max(0, 100 - Math.abs((planMacros.fat - dailyGoals.fat) / dailyGoals.fat * 100)),
  };

  const overallAccuracy = Math.round(
    (macroAccuracy.calories + macroAccuracy.protein + macroAccuracy.carbs + macroAccuracy.fat) / 4
  );

  return {
    overall: overallAccuracy,
    calories: Math.round(macroAccuracy.calories),
    protein: Math.round(macroAccuracy.protein),
    carbs: Math.round(macroAccuracy.carbs),
    fat: Math.round(macroAccuracy.fat),
  };
}

/**
 * Main algorithm: Generate a meal plan for the day with dynamic meal count
 * Starts with breakfast + lunch + dinner, then adds meals until 88% of calorie goal
 */
export function selectMealsForDay(dailyGoals, preferences, includeShakeGenerator = null) {
  console.log('[DEBUG] selectMealsForDay called');
  console.log('[DEBUG] Input goals:', dailyGoals);
  console.log('[DEBUG] Input preferences:', preferences);

  const calorieGoal = dailyGoals.cal;
  const targetMin = calorieGoal * 0.88; // 88% minimum
  const MAX_MEALS = 10;

  console.log('[DEBUG] Calorie goal:', calorieGoal, '| Target min (88%):', Math.round(targetMin));

  const selectedRecipes = [];
  const usedRecipeIds = new Set();
  let totalMacros = { cal: 0, protein: 0, carbs: 0, fat: 0 };

  // Helper to select meal of a given type
  const selectMeal = (mealType) => {
    const mealTypeMap = {
      breakfast: 'Breakfast',
      lunch: 'Lunch/Dinner',
      dinner: 'Lunch/Dinner',
      snack: 'Snack',
    };

    const recipesByMealType = RECIPES.filter(r => r.mealType === mealTypeMap[mealType]);
    console.log(`[DEBUG] ${mealType}: ${recipesByMealType.length} recipes available`);

    // For dynamic meals, just aim for general calorie target (calorie goal / 4 as rough estimate)
    const estimatedTarget = { cal: Math.round(calorieGoal / 4), protein: Math.round(dailyGoals.protein / 4) };

    const recipe = selectBestRecipe(recipesByMealType, estimatedTarget, preferences, Array.from(usedRecipeIds));
    return recipe;
  };

  // Always add breakfast, lunch, dinner first
  const requiredMeals = ['breakfast', 'lunch', 'dinner'];
  for (const mealType of requiredMeals) {
    console.log(`[DEBUG] Adding required meal: ${mealType}`);
    const recipe = selectMeal(mealType);

    if (recipe) {
      usedRecipeIds.add(recipe.id);
      selectedRecipes.push({
        mealType,
        recipe: { ...recipe },
        confirmed: false,
      });
      totalMacros.cal += recipe.cal || 0;
      totalMacros.protein += recipe.protein || 0;
      totalMacros.carbs += recipe.carbs || 0;
      totalMacros.fat += recipe.fat || 0;
      console.log(`[DEBUG] Added ${mealType}: ${recipe.name} (${recipe.cal} cal). Running total: ${totalMacros.cal} cal`);
    } else {
      console.log(`[DEBUG] NO RECIPE FOUND for required meal: ${mealType}`);
    }
  }

  // Add snacks/meals until goal reached or max meals hit
  let mealCount = selectedRecipes.length;
  while (totalMacros.cal < targetMin && mealCount < MAX_MEALS) {
    const remainingCal = calorieGoal - totalMacros.cal;
    // Pick meal type that best fills remaining gap
    const mealType = remainingCal > 400 ? 'lunch' : 'snack';
    console.log(`[DEBUG] Adding additional meal: ${mealType} (remaining cal: ${remainingCal})`);

    const recipe = selectMeal(mealType);
    if (!recipe) {
      console.log(`[DEBUG] No more matching recipes available, stopping`);
      break;
    }

    usedRecipeIds.add(recipe.id);
    selectedRecipes.push({
      mealType,
      recipe: { ...recipe },
      confirmed: false,
    });
    totalMacros.cal += recipe.cal || 0;
    totalMacros.protein += recipe.protein || 0;
    totalMacros.carbs += recipe.carbs || 0;
    totalMacros.fat += recipe.fat || 0;
    mealCount++;
    console.log(`[DEBUG] Added ${mealType}: ${recipe.name} (${recipe.cal} cal). Running total: ${totalMacros.cal} cal (${Math.round(totalMacros.cal / calorieGoal * 100)}% of goal)`);
  }

  console.log('[DEBUG] Final meal count:', selectedRecipes.length);
  console.log('[DEBUG] Final total macros:', totalMacros);
  console.log('[DEBUG] Accuracy:', Math.round(totalMacros.cal / calorieGoal * 100) + '%');

  const accuracy = calculateAccuracy(totalMacros, dailyGoals);
  console.log('[DEBUG] Accuracy breakdown:', accuracy);

  const result = {
    meals: selectedRecipes,
    totalMacros,
    accuracy,
  };

  console.log('[DEBUG] selectMealsForDay returning:', result);
  return result;
}

/**
 * Find alternative recipes for a given meal slot
 * Returns up to 5 recipes that fit within ±50 cal of target
 */
export function findAlternateRecipes(mealType, targetMacros, preferences, excludeRecipeIds = [], limit = 5) {
  let candidates = [];

  if (mealType === 'breakfast') {
    candidates = RECIPES.filter(r => r.mealType === 'Breakfast');
  } else if (mealType === 'lunch' || mealType === 'lunch_dinner') {
    candidates = RECIPES.filter(r => r.mealType === 'Lunch/Dinner');
  } else if (mealType === 'dinner') {
    candidates = RECIPES.filter(r => r.mealType === 'Lunch/Dinner');
  } else if (mealType === 'snack') {
    candidates = RECIPES.filter(r => r.mealType === 'Snack');
  }

  const filtered = filterRecipesByPreferences(candidates, preferences, excludeRecipeIds);

  // Sort by distance to target
  const sorted = filtered.sort((a, b) => {
    const distA = calculateMacroDistance(a, targetMacros);
    const distB = calculateMacroDistance(b, targetMacros);
    return distA - distB;
  });

  return sorted.slice(0, limit).map(recipe => ({
    recipe,
    distance: calculateMacroDistance(recipe, targetMacros),
  }));
}
