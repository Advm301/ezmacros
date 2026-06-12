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
  if (!recipe || !recipe.cal) {
    console.log('[DEBUG] calculateMacroDistance: invalid recipe (undefined or missing cal), returning Infinity');
    return Infinity;
  }

  const calDiff = Math.abs((recipe.cal || 0) - targetMacros.cal);
  const proteinDiff = Math.abs((recipe.protein || 0) - targetMacros.protein);

  // Weight calories more heavily than protein
  const distance = calDiff + (proteinDiff * 0.5);
  // Uncomment for very verbose logging:
  // console.log(`[DEBUG]   Distance for ${recipe.name}: cal_diff=${calDiff} + protein_diff=${proteinDiff}*0.5 = ${distance}`);
  return distance;
}

/**
 * Scale recipe components proportionally to hit target calories
 * With macro limits to prevent overshooting protein/fat/carbs
 * Only scales if difference is >10% from target
 * Caps scaling between 0.6x and 1.75x to avoid unrealistic portions
 */
function scaleRecipeToTarget(recipe, targetCal, macroLimits = {}) {
  if (!recipe || !targetCal || targetCal <= 0) return recipe;

  const currentCal = recipe.cal;
  if (!currentCal || currentCal <= 0) return recipe;

  // Only scale if difference is more than 10%
  let ratio = targetCal / currentCal;
  if (ratio > 0.9 && ratio < 1.1) {
    console.log(`[DEBUG] Recipe ${recipe.id} within 10% of target (${currentCal} → ${targetCal}), no scaling needed`);
    return recipe;
  }

  // Cap scaling: never scale more than 1.75x or less than 0.6x
  ratio = Math.min(1.75, Math.max(0.6, ratio));

  // Check if scaling would overshoot any macro limits
  const scaledFat = recipe.fat * ratio;
  const scaledProtein = recipe.protein * ratio;
  const scaledCarbs = recipe.carbs * ratio;

  // If fat would overshoot, reduce ratio to respect fat limit
  if (macroLimits?.maxFat && scaledFat > macroLimits.maxFat) {
    const fatRatio = macroLimits.maxFat / recipe.fat;
    const newRatio = Math.min(ratio, fatRatio);
    console.log(`[DEBUG] Recipe ${recipe.id} fat overshoot (${Math.round(scaledFat)}g > ${macroLimits.maxFat}g limit), reducing ratio from ${ratio.toFixed(2)} to ${newRatio.toFixed(2)}`);
    ratio = newRatio;
  }

  // If protein would overshoot, reduce ratio to respect protein limit
  if (macroLimits?.maxProtein && scaledProtein > macroLimits.maxProtein) {
    const proteinRatio = macroLimits.maxProtein / recipe.protein;
    const newRatio = Math.min(ratio, proteinRatio);
    console.log(`[DEBUG] Recipe ${recipe.id} protein overshoot (${Math.round(scaledProtein)}g > ${macroLimits.maxProtein}g limit), reducing ratio from ${ratio.toFixed(2)} to ${newRatio.toFixed(2)}`);
    ratio = newRatio;
  }

  const clampedRatio = ratio;

  console.log(`[DEBUG] Scaling recipe ${recipe.id} from ${currentCal} cal (ratio: ${(targetCal / currentCal).toFixed(2)}, clamped: ${clampedRatio.toFixed(2)})`);

  // Scale all macros proportionally
  const scaledRecipe = {
    ...recipe,
    cal: Math.round(recipe.cal * clampedRatio),
    protein: Math.round(recipe.protein * clampedRatio),
    carbs: Math.round(recipe.carbs * clampedRatio),
    fat: Math.round(recipe.fat * clampedRatio),
    scaled: clampedRatio !== 1,
    scaleRatio: Math.round(clampedRatio * 100) / 100,
    scaledFrom: currentCal,
    // Scale each component quantity proportionally
    components: recipe.components?.map(component => ({
      ...component,
      quantity: component.quantity
        ? Math.round(component.quantity * clampedRatio * 10) / 10
        : component.quantity
    })) || recipe.components
  };

  console.log(`[DEBUG] Scaled recipe macros: cal=${scaledRecipe.cal}, protein=${scaledRecipe.protein}, carbs=${scaledRecipe.carbs}, fat=${scaledRecipe.fat}`);

  return scaledRecipe;
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
function selectBestRecipe(recipes, targetMacros, preferences, excludeRecipeIds = [], remainingMacros = null) {
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

  // If remainingMacros provided, pick the highest-scoring recipe (best for macro balance)
  if (remainingMacros) {
    let bestRecipe = shuffled[0];
    let bestScore = getMacroScore(bestRecipe, remainingMacros);

    for (let i = 1; i < shuffled.length; i++) {
      const score = getMacroScore(shuffled[i], remainingMacros);
      if (score > bestScore) {
        bestScore = score;
        bestRecipe = shuffled[i];
      }
    }

    console.log('[DEBUG]   selectBestRecipe selected by macro score:', bestRecipe.id, '-', bestRecipe.name, '(score:', bestScore.toFixed(2), ')');
    return bestRecipe;
  }

  // Pick a random recipe from the shuffled list (when no remainingMacros provided)
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
 * Score a recipe based on how well it fills the most deficient macro
 */
function getMacroScore(recipe, remainingMacros) {
  const { protein, carbs, fat } = remainingMacros;

  // Calculate how much each macro contributes relative to remaining budget
  const proteinRatio = protein > 0 ? recipe.protein / protein : 0;
  const carbRatio = carbs > 0 ? recipe.carbs / carbs : 0;
  const fatRatio = fat > 0 ? recipe.fat / fat : 0;

  // Reward recipes that contribute to the most needed macro
  const mostNeededRatio = Math.max(proteinRatio, carbRatio, fatRatio);

  // Return score (higher = better for balancing macros)
  return mostNeededRatio * 10;
}

/**
 * Insert snacks at specified times in the meal plan
 */
function insertSnacksAtTiming(selectedRecipes, snackTiming, calorieGoal, dailyGoals, usedRecipeIds, totalMacros) {
  console.log('[DEBUG] insertSnacksAtTiming START - selectedRecipes length:', selectedRecipes.length);
  console.log('[DEBUG] Initial meals:', selectedRecipes.map(m => `${m.mealType}:${m.recipe?.name}`).join(', '));

  if (!snackTiming || snackTiming.length === 0) {
    console.log('[DEBUG] No snack timing specified, returning unchanged');
    return { selectedRecipes, totalMacros };
  }

  console.log('[DEBUG] Inserting snacks at timing positions:', snackTiming);

  // Get snack recipes: calories < 400, and (protein > 15 OR carbs > 40)
  const snackCandidates = RECIPES.filter(r =>
    r.cal < 400 && (r.protein > 15 || r.carbs > 40)
  );
  console.log(`[DEBUG] Snack pool after filtering: ${snackCandidates.length} candidates`);

  if (snackCandidates.length === 0) {
    console.log('[DEBUG] No snack candidates available');
    return { selectedRecipes, totalMacros };
  }

  // Shuffle snack pool for randomization
  const shuffledSnacks = shuffleArray(snackCandidates);
  let snackIndex = 0;
  const snackTarget = 325; // ~300-350 cal target

  // Map timing to position in selectedRecipes
  const timingToPosition = {
    'after_breakfast': 1,    // After breakfast (index 0)
    'after_lunch': 3,        // After lunch (index 2)
    'after_dinner': 5,       // After dinner (index 4)
  };

  // Insert snacks in reverse order to avoid index shifting
  const timingsToProcess = snackTiming
    .map(timing => ({ timing, position: timingToPosition[timing] }))
    .sort((a, b) => b.position - a.position);

  console.log('[DEBUG] Snacks to process (in reverse order):', timingsToProcess.map(t => `${t.timing} at pos ${t.position}`).join(', '));

  for (const { timing, position } of timingsToProcess) {
    console.log(`[DEBUG] About to insert snack at position: ${position}, current array length: ${selectedRecipes.length}`);

    // Find next snack that hasn't been used
    let snackRecipe = null;
    while (snackIndex < shuffledSnacks.length) {
      const candidate = shuffledSnacks[snackIndex];
      snackIndex++;
      if (!usedRecipeIds.has(candidate.id)) {
        snackRecipe = candidate;
        break;
      }
    }

    if (!snackRecipe) {
      console.log(`[DEBUG] No more snacks available for ${timing}`);
      continue;
    }

    usedRecipeIds.add(snackRecipe.id);

    // Scale snack to 300-350 cal target
    const scaledSnack = scaleRecipeToTarget(snackRecipe, snackTarget);

    // Insert snack at correct position
    selectedRecipes.splice(position, 0, {
      mealType: 'snack',
      recipe: scaledSnack,
      confirmed: false,
    });

    // Update macros
    totalMacros.cal += scaledSnack.cal || 0;
    totalMacros.protein += scaledSnack.protein || 0;
    totalMacros.carbs += scaledSnack.carbs || 0;
    totalMacros.fat += scaledSnack.fat || 0;

    const scaledNote = scaledSnack.scaled ? ` [scaled ${scaledSnack.scaleRatio.toFixed(2)}x]` : '';
    console.log(`[DEBUG] After snack insertion - array length: ${selectedRecipes.length}, meals: ${selectedRecipes.map(m => `${m.mealType}:${m.recipe?.name}`).join(', ')}`);
    console.log(`[DEBUG] Inserted snack at ${timing}: ${snackRecipe.name} (${scaledSnack.cal} cal)${scaledNote}`);
  }

  console.log('[DEBUG] insertSnacksAtTiming END - selectedRecipes length:', selectedRecipes.length);
  console.log('[DEBUG] Final meals array:', selectedRecipes.map(m => `${m.mealType}:${m.recipe?.name}`).join(', '));

  return { selectedRecipes, totalMacros };
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
  const selectMeal = (mealType, remainingFat = null, remainingMacros = null) => {
    const mealTypeMap = {
      breakfast: 'Breakfast',
      lunch: 'Lunch/Dinner',
      dinner: 'Lunch/Dinner',
      snack: 'Snack',
    };

    let recipesByMealType = RECIPES.filter(r => r.mealType === mealTypeMap[mealType]);
    console.log(`[DEBUG] ${mealType}: ${recipesByMealType.length} recipes available`);

    // When fat budget is tight, prefer low-fat recipes
    if (remainingFat !== null && remainingFat < 15) {
      const lowFatCandidates = recipesByMealType.filter(r => r.fat < 10);
      if (lowFatCandidates.length >= 3) {
        console.log(`[DEBUG] Fat budget tight (${remainingFat}g remaining), filtering to ${lowFatCandidates.length} low-fat recipes`);
        recipesByMealType = lowFatCandidates;
      }
    }

    // When carbs are under 85% of goal, prioritize high-carb recipes
    if (remainingMacros && remainingMacros.carbs > 0) {
      const carbProgress = (dailyGoals.carbs - remainingMacros.carbs) / dailyGoals.carbs;
      if (carbProgress < 0.85) {
        const highCarbCandidates = recipesByMealType.filter(r => {
          const carbCalRatio = (r.carbs * 4) / r.cal;
          return carbCalRatio > 0.40;
        });
        if (highCarbCandidates.length >= 3) {
          console.log(`[DEBUG] Carbs under 85% (${Math.round(carbProgress * 100)}%), filtering to ${highCarbCandidates.length} high-carb recipes`);
          recipesByMealType = highCarbCandidates;
        }
      }
    }

    // For dynamic meals, just aim for general calorie target (calorie goal / 4 as rough estimate)
    const estimatedTarget = { cal: Math.round(calorieGoal / 4), protein: Math.round(dailyGoals.protein / 4) };

    const recipe = selectBestRecipe(recipesByMealType, estimatedTarget, preferences, Array.from(usedRecipeIds), remainingMacros);
    return recipe;
  };

  // Always add breakfast, lunch, dinner first
  const requiredMeals = ['breakfast', 'lunch', 'dinner'];
  // Rough meal targets: breakfast 20%, lunch 27%, dinner 27% of TDEE
  const mealTargets = {
    breakfast: Math.round(calorieGoal * 0.20),
    lunch: Math.round(calorieGoal * 0.27),
    dinner: Math.round(calorieGoal * 0.27)
  };

  for (const mealType of requiredMeals) {
    console.log(`[DEBUG] Adding required meal: ${mealType}`);
    const remainingFat = dailyGoals.fat - totalMacros.fat;
    const remainingMacros = {
      protein: dailyGoals.protein - totalMacros.protein,
      carbs: dailyGoals.carbs - totalMacros.carbs,
      fat: remainingFat,
    };
    const recipe = selectMeal(mealType, remainingFat, remainingMacros);

    if (recipe) {
      usedRecipeIds.add(recipe.id);

      // Calculate remaining macro budget with tolerance
      const macroLimits = {
        maxProtein: (dailyGoals.protein + 8) - totalMacros.protein,   // +8g tolerance (TIGHTENED)
        maxCarbs: (dailyGoals.carbs + 5) - totalMacros.carbs,          // +5g tolerance
        maxFat: (dailyGoals.fat + 7) - totalMacros.fat,                // +7g tolerance (STRICT)
      };
      console.log(`[DEBUG] Macro limits for ${mealType}: P=${macroLimits.maxProtein}g, C=${macroLimits.maxCarbs}g, F=${macroLimits.maxFat}g`);

      // Scale recipe to match this meal slot's calorie target with macro guardrails
      const mealTarget = mealTargets[mealType] || Math.round(calorieGoal / 3);
      const scaledRecipe = scaleRecipeToTarget(recipe, mealTarget, macroLimits);

      selectedRecipes.push({
        mealType,
        recipe: scaledRecipe,
        confirmed: false,
      });
      totalMacros.cal += scaledRecipe.cal || 0;
      totalMacros.protein += scaledRecipe.protein || 0;
      totalMacros.carbs += scaledRecipe.carbs || 0;
      totalMacros.fat += scaledRecipe.fat || 0;

      const scaledNote = scaledRecipe.scaled ? ` [scaled ${(scaledRecipe.scaleRatio).toFixed(2)}x]` : '';
      console.log(`[DEBUG] Added ${mealType}: ${recipe.name} (${scaledRecipe.cal} cal)${scaledNote}. Running total: ${totalMacros.cal} cal`);
    } else {
      console.log(`[DEBUG] NO RECIPE FOUND for required meal: ${mealType}`);
    }
  }

  // Insert snacks at specified timing if enabled
  console.log('[DEBUG] Before snack insertion - selectedRecipes length:', selectedRecipes.length, 'meals:', selectedRecipes.map(m => `${m.mealType}:${m.recipe?.name}`).join(', '));
  if (preferences?.include_snacks === true) {
    console.log('[DEBUG] Calling insertSnacksAtTiming with timing:', preferences.snack_timing);
    const snackResult = insertSnacksAtTiming(
      selectedRecipes,
      preferences.snack_timing,
      calorieGoal,
      dailyGoals,
      usedRecipeIds,
      totalMacros
    );
    console.log('[DEBUG] snackResult.selectedRecipes length:', snackResult.selectedRecipes.length, 'meals:', snackResult.selectedRecipes.map(m => `${m.mealType}:${m.recipe?.name}`).join(', '));
    // NOTE: snackResult.selectedRecipes is the SAME reference as selectedRecipes because splice() mutates in place
    // So we do NOT need to clear and repush - the array is already mutated!
    totalMacros = snackResult.totalMacros;
    console.log('[DEBUG] After snack insertion - selectedRecipes length:', selectedRecipes.length, 'meals:', selectedRecipes.map(m => `${m.mealType}:${m.recipe?.name}`).join(', '));
  }

  // Add snacks/meals until goal reached or max meals hit
  console.log('[DEBUG] Starting dynamic meals loop - mealCount:', selectedRecipes.length);
  let mealCount = selectedRecipes.length;
  while (totalMacros.cal < targetMin && mealCount < MAX_MEALS) {
    const remainingCal = calorieGoal - totalMacros.cal;
    const remainingFat = dailyGoals.fat - totalMacros.fat;
    const remainingMacros = {
      protein: dailyGoals.protein - totalMacros.protein,
      carbs: dailyGoals.carbs - totalMacros.carbs,
      fat: remainingFat,
    };

    // Pick meal type that best fills remaining gap
    const mealType = remainingCal > 400 ? 'lunch' : 'snack';
    console.log(`[DEBUG] Adding additional meal: ${mealType} (remaining cal: ${remainingCal}, remaining fat: ${remainingFat}g)`);

    const recipe = selectMeal(mealType, remainingFat, remainingMacros);
    if (!recipe) {
      console.log(`[DEBUG] No more matching recipes available, stopping`);
      break;
    }

    usedRecipeIds.add(recipe.id);

    // Calculate remaining macro budget with tolerance
    const macroLimits = {
      maxProtein: (dailyGoals.protein + 8) - totalMacros.protein,   // +8g tolerance (TIGHTENED)
      maxCarbs: (dailyGoals.carbs + 5) - totalMacros.carbs,          // +5g tolerance
      maxFat: (dailyGoals.fat + 7) - totalMacros.fat,                // +7g tolerance (STRICT)
    };
    console.log(`[DEBUG] Macro limits for additional meal: P=${macroLimits.maxProtein}g, C=${macroLimits.maxCarbs}g, F=${macroLimits.maxFat}g`);

    // Scale additional meal to fill the exact remaining calorie gap with macro guardrails
    const scaledRecipe = scaleRecipeToTarget(recipe, remainingCal, macroLimits);

    selectedRecipes.push({
      mealType,
      recipe: scaledRecipe,
      confirmed: false,
    });
    totalMacros.cal += scaledRecipe.cal || 0;
    totalMacros.protein += scaledRecipe.protein || 0;
    totalMacros.carbs += scaledRecipe.carbs || 0;
    totalMacros.fat += scaledRecipe.fat || 0;
    mealCount++;

    const scaledNote = scaledRecipe.scaled ? ` [scaled ${(scaledRecipe.scaleRatio).toFixed(2)}x]` : '';
    console.log(`[DEBUG] Added ${mealType}: ${recipe.name} (${scaledRecipe.cal} cal)${scaledNote}. Running total: ${totalMacros.cal} cal (${Math.round(totalMacros.cal / calorieGoal * 100)}% of goal)`);
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
  console.log('[DEBUG] getAlternatives called for mealType:', mealType);
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

  // Filter out any null/undefined recipes before sorting
  const validRecipes = filtered.filter(r => {
    if (!r || !r.cal) {
      console.log('[DEBUG] Filtered out invalid recipe: undefined or missing cal');
      return false;
    }
    return true;
  });

  console.log('[DEBUG] Filtered recipes - before:', filtered.length, 'after filtering nulls:', validRecipes.length);

  // Sort by distance to target
  const sorted = validRecipes.sort((a, b) => {
    const distA = calculateMacroDistance(a, targetMacros);
    const distB = calculateMacroDistance(b, targetMacros);
    return distA - distB;
  });

  console.log('[DEBUG] Top 5 alternatives found for swap');

  return sorted.slice(0, limit).map(recipe => ({
    recipe,
    distance: calculateMacroDistance(recipe, targetMacros),
  }));
}
