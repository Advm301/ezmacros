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
  const distance = calDiff + (proteinDiff * 0.5);
  // Uncomment for very verbose logging:
  // console.log(`[DEBUG]   Distance for ${recipe.name}: cal_diff=${calDiff} + protein_diff=${proteinDiff}*0.5 = ${distance}`);
  return distance;
}

/**
 * Filter recipes based on user preferences
 */
function filterRecipesByPreferences(recipes, preferences, excludeRecipeIds = []) {
  console.log('[DEBUG] filterRecipesByPreferences called');
  console.log('[DEBUG]   Input recipes:', recipes.length);
  console.log('[DEBUG]   Preferences:', preferences);
  console.log('[DEBUG]   Exclude IDs:', excludeRecipeIds);

  const filtered = recipes.filter(recipe => {
    // Exclude already-selected recipes
    if (excludeRecipeIds.includes(recipe.id)) {
      console.log(`[DEBUG]   Recipe ${recipe.id} excluded (already used)`);
      return false;
    }

    // Filter by spice level
    if (preferences.spice_level !== 'any') {
      const spiceMap = { 'low': 0, 'medium': 1, 'medium-hot': 2, 'hot': 3 };
      const targetSpice = spiceMap[preferences.spice_level];
      if (targetSpice !== undefined && recipe.spiceLevel !== targetSpice) {
        console.log(`[DEBUG]   Recipe ${recipe.id} filtered out by spice (has ${recipe.spiceLevel}, want ${targetSpice})`);
        return false;
      }
    }

    // Filter by protein preferences (check recipe components, not tags)
    // Main protein is typically the first component
    if (preferences.protein_preferences.length > 0) {
      const mainComponent = recipe.components && recipe.components[0];

      if (!mainComponent) {
        console.log(`[DEBUG]   Recipe ${recipe.id} - no components found, filtering out`);
        return false;
      }

      // Extract protein name from component name (e.g., "Ground Beef (93% lean)" → "Ground Beef")
      const componentName = mainComponent.name || '';
      const proteinNameFromComponent = componentName.split('(')[0].trim();

      // Normalize to match preference format: "Ground Beef" → "ground_beef", "Eggs" → "eggs"
      const normalizedProtein = proteinNameFromComponent
        .toLowerCase()
        .replace(/\s+/g, '_');

      console.log(`[DEBUG]   Recipe ${recipe.id} - main component: "${componentName}" → normalized: "${normalizedProtein}"`);

      // Check if this protein matches any user preference
      const hasPreferredProtein = preferences.protein_preferences.some(pref => {
        const prefNormalized = pref.toLowerCase().replace(/\s+/g, '_');
        const matches = normalizedProtein === prefNormalized || normalizedProtein.includes(prefNormalized);
        if (matches) {
          console.log(`[DEBUG]   Recipe ${recipe.id} - protein match: "${normalizedProtein}" matches preference "${pref}"`);
        }
        return matches;
      });

      if (!hasPreferredProtein) {
        console.log(`[DEBUG]   Recipe ${recipe.id} (main protein: ${proteinNameFromComponent}) filtered out by protein (prefs: ${preferences.protein_preferences.join(', ')})`);
        return false;
      }
    }

    console.log(`[DEBUG]   Recipe ${recipe.id} - ${recipe.name} passed all filters`);
    return true;
  });

  console.log('[DEBUG] filterRecipesByPreferences result:', filtered.length, 'recipes passed');
  return filtered;
}

/**
 * Select the best recipe for a given meal slot
 * Returns the recipe closest to target macros within acceptable range
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

  // Sort by distance to target
  const best = filtered.reduce((best, recipe) => {
    const distance = calculateMacroDistance(recipe, targetMacros);
    const bestDistance = calculateMacroDistance(best, targetMacros);
    const isBetter = distance < bestDistance;
    console.log(`[DEBUG]   Recipe ${recipe.id} - ${recipe.name}: distance=${distance} (${isBetter ? 'BETTER' : 'worse'} than current best)`);
    return isBetter ? recipe : best;
  });

  console.log('[DEBUG]   selectBestRecipe returning:', best.id, '-', best.name);
  return best;
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
    // Adjusted for recipe library: Breakfast 20%, Lunch/Dinner 33%, Snack 14% = 67% (realistic for 2 meals + 2 snacks)
    targets['breakfast'] = {
      cal: Math.round(dailyGoals.cal * 0.20),
      protein: Math.round(dailyGoals.protein * 0.20),
      carbs: Math.round(dailyGoals.carbs * 0.20),
      fat: Math.round(dailyGoals.fat * 0.20),
    };
    targets['lunch_dinner'] = {
      cal: Math.round(dailyGoals.cal * 0.33),
      protein: Math.round(dailyGoals.protein * 0.33),
      carbs: Math.round(dailyGoals.carbs * 0.33),
      fat: Math.round(dailyGoals.fat * 0.33),
    };
    targets['snack'] = {
      cal: Math.round(dailyGoals.cal * 0.14),
      protein: Math.round(dailyGoals.protein * 0.14),
      carbs: Math.round(dailyGoals.carbs * 0.14),
      fat: Math.round(dailyGoals.fat * 0.14),
    };
  } else if (mealFrequency === '3_meals') {
    // Adjusted for actual recipe calorie distribution (400-600 cal recipes)
    // Breakfast 20%, Lunch 28%, Dinner 28% = 76% (realistic for recipe library)
    targets['breakfast'] = {
      cal: Math.round(dailyGoals.cal * 0.20),
      protein: Math.round(dailyGoals.protein * 0.20),
      carbs: Math.round(dailyGoals.carbs * 0.20),
      fat: Math.round(dailyGoals.fat * 0.20),
    };
    targets['lunch'] = {
      cal: Math.round(dailyGoals.cal * 0.28),
      protein: Math.round(dailyGoals.protein * 0.28),
      carbs: Math.round(dailyGoals.carbs * 0.28),
      fat: Math.round(dailyGoals.fat * 0.28),
    };
    targets['dinner'] = {
      cal: Math.round(dailyGoals.cal * 0.28),
      protein: Math.round(dailyGoals.protein * 0.28),
      carbs: Math.round(dailyGoals.carbs * 0.28),
      fat: Math.round(dailyGoals.fat * 0.28),
    };
  } else if (mealFrequency === '4_meals') {
    // Adjusted for recipe library: Breakfast 18%, Lunch 27%, Snack 9%, Dinner 27% = 81%
    targets['breakfast'] = {
      cal: Math.round(dailyGoals.cal * 0.18),
      protein: Math.round(dailyGoals.protein * 0.18),
      carbs: Math.round(dailyGoals.carbs * 0.18),
      fat: Math.round(dailyGoals.fat * 0.18),
    };
    targets['lunch'] = {
      cal: Math.round(dailyGoals.cal * 0.27),
      protein: Math.round(dailyGoals.protein * 0.27),
      carbs: Math.round(dailyGoals.carbs * 0.27),
      fat: Math.round(dailyGoals.fat * 0.27),
    };
    targets['snack'] = {
      cal: Math.round(dailyGoals.cal * 0.09),
      protein: Math.round(dailyGoals.protein * 0.09),
      carbs: Math.round(dailyGoals.carbs * 0.09),
      fat: Math.round(dailyGoals.fat * 0.09),
    };
    targets['dinner'] = {
      cal: Math.round(dailyGoals.cal * 0.27),
      protein: Math.round(dailyGoals.protein * 0.27),
      carbs: Math.round(dailyGoals.carbs * 0.27),
      fat: Math.round(dailyGoals.fat * 0.27),
    };
  } else if (mealFrequency === '3_plus_snack') {
    // Adjusted for recipe library: Breakfast 18%, Lunch 27%, Dinner 27%, Snack 10% = 82%
    targets['breakfast'] = {
      cal: Math.round(dailyGoals.cal * 0.18),
      protein: Math.round(dailyGoals.protein * 0.18),
      carbs: Math.round(dailyGoals.carbs * 0.18),
      fat: Math.round(dailyGoals.fat * 0.18),
    };
    targets['lunch'] = {
      cal: Math.round(dailyGoals.cal * 0.27),
      protein: Math.round(dailyGoals.protein * 0.27),
      carbs: Math.round(dailyGoals.carbs * 0.27),
      fat: Math.round(dailyGoals.fat * 0.27),
    };
    targets['dinner'] = {
      cal: Math.round(dailyGoals.cal * 0.27),
      protein: Math.round(dailyGoals.protein * 0.27),
      carbs: Math.round(dailyGoals.carbs * 0.27),
      fat: Math.round(dailyGoals.fat * 0.27),
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
  console.log('[DEBUG] mealPlannerAlgorithm.selectMealsForDay called');
  console.log('[DEBUG] Input goals:', dailyGoals);
  console.log('[DEBUG] Input preferences:', preferences);

  const mealFrequency = preferences.meal_frequency || '3_meals';
  console.log('[DEBUG] Meal frequency:', mealFrequency);

  const mealTargets = calculateMealTargets(dailyGoals, mealFrequency);
  console.log('[DEBUG] Calculated meal targets:', mealTargets);

  const mealTypes = getMealTypes(mealFrequency);
  console.log('[DEBUG] Meal types to fill:', mealTypes);
  console.log('[DEBUG] Total recipes available:', RECIPES.length);

  const selectedRecipes = [];
  const excludedIds = [];
  let totalMacros = { cal: 0, protein: 0, carbs: 0, fat: 0 };

  // Filter recipes by meal type and select best match for each slot
  for (const mealType of mealTypes) {
    console.log(`[DEBUG] Processing meal type: ${mealType}`);
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
        console.log('[DEBUG] Shake generation enabled for snack');
        // Will be handled after selection
      }
    }

    console.log(`[DEBUG] ${mealType}: ${mealFilter.length} recipes available by meal type`);
    console.log(`[DEBUG] ${mealType}: recipe IDs: ${mealFilter.map(r => r.id).join(', ')}`);

    const targetForSlot = mealTargets[mealType];
    console.log(`[DEBUG] ${mealType}: target macros:`, targetForSlot);

    const bestRecipe = selectBestRecipe(mealFilter, targetForSlot, preferences, excludedIds);
    console.log(`[DEBUG] ${mealType}: selectBestRecipe returned:`, bestRecipe ? `${bestRecipe.name} (${bestRecipe.cal} cal, ${bestRecipe.protein}g P)` : 'null');

    if (bestRecipe) {
      console.log(`[DEBUG] ${mealType}: selected recipe ID ${bestRecipe.id} - ${bestRecipe.name}`);
      selectedRecipes.push({
        mealType,
        recipe: bestRecipe,
        targetMacros: targetForSlot,
        confirmed: false,
      });
      excludedIds.push(bestRecipe.id);
      totalMacros.cal += bestRecipe.cal || 0;
      totalMacros.protein += bestRecipe.protein || 0;
      totalMacros.carbs += bestRecipe.carbs || 0;
      totalMacros.fat += bestRecipe.fat || 0;
    } else {
      console.log(`[DEBUG] ${mealType}: NO RECIPE FOUND - skipping this meal slot`);
    }
  }

  console.log('[DEBUG] Total meals selected:', selectedRecipes.length);
  console.log('[DEBUG] Selected meals array:', selectedRecipes);

  const accuracy = calculateAccuracy(totalMacros, dailyGoals);
  console.log('[DEBUG] Final accuracy score:', accuracy);
  console.log('[DEBUG] Final total macros:', totalMacros);

  const result = {
    meals: selectedRecipes,
    totalMacros,
    accuracy,
    mealFrequency,
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
