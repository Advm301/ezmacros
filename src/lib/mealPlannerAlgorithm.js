import { RECIPES } from '../data/recipes.js';

/**
 * Calculate how closely a meal hits a macro target
 * Distance = abs distance to calorie target + (abs distance to protein target * 0.5)
 * Returns a number where lower = better
 */
function calculateMacroDistance(recipe, targetMacros) {
  const calDiff = Math.abs((recipe.cal || 0) - targetMacros.cal);
  const proteinDiff = Math.abs((recipe.protein || 0) - targetMacros.protein);

  // Weight calories more heavily than protein
  return calDiff + (proteinDiff * 0.5);
}

/**
 * Filter recipes based on user preferences
 */
function filterRecipesByPreferences(recipes, preferences, excludeRecipeIds = []) {
  return recipes.filter(recipe => {
    // Exclude already-selected recipes
    if (excludeRecipeIds.includes(recipe.id)) return false;

    // Filter by spice level
    if (preferences.spice_level !== 'any') {
      const spiceMap = { 'low': 0, 'medium': 1, 'medium-hot': 2, 'hot': 3 };
      const targetSpice = spiceMap[preferences.spice_level];
      if (targetSpice !== undefined && recipe.spiceLevel !== targetSpice) return false;
    }

    // Filter by protein preferences (check if recipe contains preferred protein)
    const proteinNames = (recipe.tags || []).map(tag => tag.toLowerCase());
    const hasPreferredProtein = preferences.protein_preferences.some(pref =>
      proteinNames.some(tag => tag.includes(pref.toLowerCase()))
    );
    if (!hasPreferredProtein && preferences.protein_preferences.length > 0) return false;

    return true;
  });
}

/**
 * Select the best recipe for a given meal slot
 * Returns the recipe closest to target macros within acceptable range
 */
function selectBestRecipe(recipes, targetMacros, preferences, excludeRecipeIds = []) {
  const filtered = filterRecipesByPreferences(recipes, preferences, excludeRecipeIds);

  if (filtered.length === 0) return null;

  // Sort by distance to target
  return filtered.reduce((best, recipe) => {
    const distance = calculateMacroDistance(recipe, targetMacros);
    const bestDistance = calculateMacroDistance(best, targetMacros);
    return distance < bestDistance ? recipe : best;
  });
}

/**
 * Get meal type from frequency setting
 * Returns array like ['breakfast', 'lunch', 'dinner'] or ['breakfast', 'lunch', 'dinner', 'snack']
 */
function getMealTypes(mealFrequency) {
  switch (mealFrequency) {
    case '2_plus_snacks':
      return ['breakfast', 'lunch_dinner', 'snack', 'snack'];
    case '3_meals':
      return ['breakfast', 'lunch', 'dinner'];
    case '4_meals':
      return ['breakfast', 'lunch', 'snack', 'dinner'];
    case '3_plus_snack':
      return ['breakfast', 'lunch', 'dinner', 'snack'];
    default:
      return ['breakfast', 'lunch', 'dinner'];
  }
}

/**
 * Calculate macro targets per meal based on daily goals and meal frequency
 */
function calculateMealTargets(dailyGoals, mealFrequency) {
  const meals = getMealTypes(mealFrequency);
  const targets = {};

  if (mealFrequency === '2_plus_snacks') {
    // Breakfast 20%, Lunch/Dinner 35%, Snack 10%
    targets['breakfast'] = {
      cal: Math.round(dailyGoals.cal * 0.25),
      protein: Math.round(dailyGoals.protein * 0.25),
      carbs: Math.round(dailyGoals.carbs * 0.25),
      fat: Math.round(dailyGoals.fat * 0.25),
    };
    targets['lunch_dinner'] = {
      cal: Math.round(dailyGoals.cal * 0.40),
      protein: Math.round(dailyGoals.protein * 0.40),
      carbs: Math.round(dailyGoals.carbs * 0.40),
      fat: Math.round(dailyGoals.fat * 0.40),
    };
    targets['snack'] = {
      cal: Math.round(dailyGoals.cal * 0.15),
      protein: Math.round(dailyGoals.protein * 0.15),
      carbs: Math.round(dailyGoals.carbs * 0.15),
      fat: Math.round(dailyGoals.fat * 0.15),
    };
  } else if (mealFrequency === '3_meals') {
    // Breakfast 25%, Lunch 35%, Dinner 40%
    targets['breakfast'] = {
      cal: Math.round(dailyGoals.cal * 0.25),
      protein: Math.round(dailyGoals.protein * 0.25),
      carbs: Math.round(dailyGoals.carbs * 0.25),
      fat: Math.round(dailyGoals.fat * 0.25),
    };
    targets['lunch'] = {
      cal: Math.round(dailyGoals.cal * 0.35),
      protein: Math.round(dailyGoals.protein * 0.35),
      carbs: Math.round(dailyGoals.carbs * 0.35),
      fat: Math.round(dailyGoals.fat * 0.35),
    };
    targets['dinner'] = {
      cal: Math.round(dailyGoals.cal * 0.40),
      protein: Math.round(dailyGoals.protein * 0.40),
      carbs: Math.round(dailyGoals.carbs * 0.40),
      fat: Math.round(dailyGoals.fat * 0.40),
    };
  } else if (mealFrequency === '4_meals') {
    // Breakfast 20%, Lunch 35%, Snack 10%, Dinner 35%
    targets['breakfast'] = {
      cal: Math.round(dailyGoals.cal * 0.20),
      protein: Math.round(dailyGoals.protein * 0.20),
      carbs: Math.round(dailyGoals.carbs * 0.20),
      fat: Math.round(dailyGoals.fat * 0.20),
    };
    targets['lunch'] = {
      cal: Math.round(dailyGoals.cal * 0.35),
      protein: Math.round(dailyGoals.protein * 0.35),
      carbs: Math.round(dailyGoals.carbs * 0.35),
      fat: Math.round(dailyGoals.fat * 0.35),
    };
    targets['snack'] = {
      cal: Math.round(dailyGoals.cal * 0.10),
      protein: Math.round(dailyGoals.protein * 0.10),
      carbs: Math.round(dailyGoals.carbs * 0.10),
      fat: Math.round(dailyGoals.fat * 0.10),
    };
    targets['dinner'] = {
      cal: Math.round(dailyGoals.cal * 0.35),
      protein: Math.round(dailyGoals.protein * 0.35),
      carbs: Math.round(dailyGoals.carbs * 0.35),
      fat: Math.round(dailyGoals.fat * 0.35),
    };
  } else if (mealFrequency === '3_plus_snack') {
    // Breakfast 25%, Lunch 30%, Dinner 35%, Snack 10%
    targets['breakfast'] = {
      cal: Math.round(dailyGoals.cal * 0.25),
      protein: Math.round(dailyGoals.protein * 0.25),
      carbs: Math.round(dailyGoals.carbs * 0.25),
      fat: Math.round(dailyGoals.fat * 0.25),
    };
    targets['lunch'] = {
      cal: Math.round(dailyGoals.cal * 0.30),
      protein: Math.round(dailyGoals.protein * 0.30),
      carbs: Math.round(dailyGoals.carbs * 0.30),
      fat: Math.round(dailyGoals.fat * 0.30),
    };
    targets['dinner'] = {
      cal: Math.round(dailyGoals.cal * 0.35),
      protein: Math.round(dailyGoals.protein * 0.35),
      carbs: Math.round(dailyGoals.carbs * 0.35),
      fat: Math.round(dailyGoals.fat * 0.35),
    };
    targets['snack'] = {
      cal: Math.round(dailyGoals.cal * 0.10),
      protein: Math.round(dailyGoals.protein * 0.10),
      carbs: Math.round(dailyGoals.carbs * 0.10),
      fat: Math.round(dailyGoals.fat * 0.10),
    };
  }

  return targets;
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
 * Main algorithm: Generate a meal plan for the day
 * Input: daily macro goals, user preferences
 * Output: array of selected recipes for each meal slot with accuracy score
 */
export function selectMealsForDay(dailyGoals, preferences, includeShakeGenerator = null) {
  const mealFrequency = preferences.meal_frequency || '3_meals';
  const mealTargets = calculateMealTargets(dailyGoals, mealFrequency);
  const mealTypes = getMealTypes(mealFrequency);
  const selectedRecipes = [];
  const excludedIds = [];
  let totalMacros = { cal: 0, protein: 0, carbs: 0, fat: 0 };

  // Filter recipes by meal type and select best match for each slot
  for (const mealType of mealTypes) {
    let mealFilter = [];

    if (mealType === 'breakfast') {
      mealFilter = RECIPES.filter(r => r.mealType === 'Breakfast');
    } else if (mealType === 'lunch') {
      mealFilter = RECIPES.filter(r => r.mealType === 'Lunch/Dinner');
    } else if (mealType === 'lunch_dinner') {
      mealFilter = RECIPES.filter(r => r.mealType === 'Lunch/Dinner');
    } else if (mealType === 'dinner') {
      mealFilter = RECIPES.filter(r => r.mealType === 'Lunch/Dinner');
    } else if (mealType === 'snack') {
      mealFilter = RECIPES.filter(r => r.mealType === 'Snack');

      // Add shake as option if requested and callback provided
      if (preferences.include_shakes && includeShakeGenerator) {
        // Will be handled after selection
      }
    }

    const targetForSlot = mealTargets[mealType];
    const bestRecipe = selectBestRecipe(mealFilter, targetForSlot, preferences, excludedIds);

    if (bestRecipe) {
      selectedRecipes.push({
        mealType,
        recipe: bestRecipe,
        targetMacros: targetForSlot,
      });
      excludedIds.push(bestRecipe.id);
      totalMacros.cal += bestRecipe.cal || 0;
      totalMacros.protein += bestRecipe.protein || 0;
      totalMacros.carbs += bestRecipe.carbs || 0;
      totalMacros.fat += bestRecipe.fat || 0;
    }
  }

  const accuracy = calculateAccuracy(totalMacros, dailyGoals);

  return {
    meals: selectedRecipes,
    totalMacros,
    accuracy,
    mealFrequency,
  };
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
