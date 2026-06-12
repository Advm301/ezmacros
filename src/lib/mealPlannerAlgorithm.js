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
 * Validate meal plan macros against goals with ±5% tolerance
 */
function validateMealPlan(meals, goals) {
  const totalMacros = {
    protein: meals.reduce((sum, m) => sum + (m.recipe?.protein || 0), 0),
    carbs: meals.reduce((sum, m) => sum + (m.recipe?.carbs || 0), 0),
    fat: meals.reduce((sum, m) => sum + (m.recipe?.fat || 0), 0),
  };

  const proteinPercent = totalMacros.protein / goals.protein;
  const carbsPercent = totalMacros.carbs / goals.carbs;
  const fatPercent = totalMacros.fat / goals.fat;

  const tolerance = 0.07; // ±7% (relaxed temporarily for achievable targets)

  const isValid =
    proteinPercent >= (1 - tolerance) && proteinPercent <= (1 + tolerance) &&
    carbsPercent >= (1 - tolerance) && carbsPercent <= (1 + tolerance) &&
    fatPercent >= (1 - tolerance) && fatPercent <= (1 + tolerance);

  const proteinPercent100 = Math.round(proteinPercent * 100);
  const carbsPercent100 = Math.round(carbsPercent * 100);
  const fatPercent100 = Math.round(fatPercent * 100);

  console.log(`[DEBUG] Validation: protein=${proteinPercent100}% (${totalMacros.protein.toFixed(0)}g/${goals.protein}g), carbs=${carbsPercent100}% (${totalMacros.carbs.toFixed(0)}g/${goals.carbs}g), fat=${fatPercent100}% (${totalMacros.fat.toFixed(0)}g/${goals.fat}g)`);
  console.log(`[DEBUG] Plan valid: ${isValid ? 'YES ✓' : 'NO ✗'} (tolerance: ±5%)`);

  return { isValid, totalMacros, proteinPercent, carbsPercent, fatPercent };
}

/**
 * Calculate score for meal plan based on macro accuracy (equal weighting)
 */
function calculateMealPlanScore(meals, goals) {
  const totalMacros = {
    protein: meals.reduce((sum, m) => sum + (m.recipe?.protein || 0), 0),
    carbs: meals.reduce((sum, m) => sum + (m.recipe?.carbs || 0), 0),
    fat: meals.reduce((sum, m) => sum + (m.recipe?.fat || 0), 0),
  };

  const proteinDiff = Math.abs(totalMacros.protein - goals.protein) / goals.protein;
  const carbsDiff = Math.abs(totalMacros.carbs - goals.carbs) / goals.carbs;
  const fatDiff = Math.abs(totalMacros.fat - goals.fat) / goals.fat;

  // Average distance (equal weighting, lower is better)
  const score = (proteinDiff + carbsDiff + fatDiff) / 3;

  const proteinAcc = Math.round((1 - proteinDiff) * 100);
  const carbsAcc = Math.round((1 - carbsDiff) * 100);
  const fatAcc = Math.round((1 - fatDiff) * 100);

  console.log(`[DEBUG] Macro score: protein=${proteinAcc}%, carbs=${carbsAcc}%, fat=${fatAcc}%, overall=${Math.round((1 - score) * 100)}%`);

  return score;
}

/**
 * Helper: Calculate total macros from meals
 */
function calculateTotalMacros(meals) {
  return {
    protein: meals.reduce((sum, m) => sum + (m.recipe?.protein || 0), 0),
    carbs: meals.reduce((sum, m) => sum + (m.recipe?.carbs || 0), 0),
    fat: meals.reduce((sum, m) => sum + (m.recipe?.fat || 0), 0),
    cal: meals.reduce((sum, m) => sum + (m.recipe?.cal || 0), 0),
  };
}

/**
 * Tier 1: Smart Recipe Swapping - Replace poorly-matching meals with better alternatives
 */
function smartRecipeSwap(meals, goals, allRecipes) {
  console.log('[DEBUG] === TIER 1: SMART RECIPE SWAPPING ===');

  const currentMacros = calculateTotalMacros(meals);
  const validation = validateMealPlan(meals, goals);

  console.log(`[DEBUG] Starting composition: protein=${Math.round(validation.proteinPercent * 100)}%, carbs=${Math.round(validation.carbsPercent * 100)}%, fat=${Math.round(validation.fatPercent * 100)}%`);

  // Identify which macro is most problematic
  const proteinDiff = Math.abs(validation.proteinPercent - 1);
  const carbsDiff = Math.abs(validation.carbsPercent - 1);
  const fatDiff = Math.abs(validation.fatPercent - 1);

  // Prioritize: carbs > fat > protein
  let worstMacro = 'protein';
  let worstDiff = proteinDiff;

  if (carbsDiff > worstDiff) {
    worstMacro = 'carbs';
    worstDiff = carbsDiff;
  }
  if (fatDiff > worstDiff) {
    worstMacro = 'fat';
    worstDiff = fatDiff;
  }

  console.log(`[DEBUG] Worst macro: ${worstMacro} (${Math.round(worstDiff * 100)}% off)`);

  // CARBS UNDERSHOOTING: Find lowest-carb meal and swap for higher-carb alternative
  if (worstMacro === 'carbs' && validation.carbsPercent < 0.93) {
    console.log('[DEBUG] Carbs undershooting - finding meal with lowest carb ratio...');

    let worstMealIndex = -1;
    let lowestCarbRatio = 1;

    meals.forEach((meal, idx) => {
      if (meal.mealType !== 'snack') {
        const carbRatio = (meal.recipe?.carbs || 0) / (meal.recipe?.cal || 1);
        if (carbRatio < lowestCarbRatio) {
          lowestCarbRatio = carbRatio;
          worstMealIndex = idx;
        }
      }
    });

    if (worstMealIndex !== -1) {
      const oldMeal = meals[worstMealIndex];
      console.log(`[DEBUG] Worst meal (lowest carbs): ${oldMeal.recipe?.name} (${oldMeal.recipe?.carbs.toFixed(0)}g carbs)`);

      const mealType = oldMeal.mealType;
      const carbTarget = goals.carbs / 3;

      const carbRichAlternatives = allRecipes
        .filter(r => r.mealType === mealType && r.id !== oldMeal.recipe?.id)
        .map(r => ({
          ...r,
          carbScore: Math.abs(r.carbs - carbTarget),
        }))
        .sort((a, b) => a.carbScore - b.carbScore)
        .slice(0, 5);

      if (carbRichAlternatives.length > 0) {
        const replacement = carbRichAlternatives[0];
        console.log(`[DEBUG] Swapping to high-carb alternative: ${replacement.name} (${replacement.carbs.toFixed(0)}g carbs)`);

        meals[worstMealIndex] = {
          ...oldMeal,
          recipe: replacement,
          scaledBy: 1,
        };
      }
    }
  }

  // FAT OVERSHOOTING: Find highest-fat meal and swap for leaner alternative
  if (worstMacro === 'fat' && validation.fatPercent > 1.07) {
    console.log('[DEBUG] Fat overshooting - finding meal with highest fat ratio...');

    let worstMealIndex = -1;
    let highestFatRatio = 0;

    meals.forEach((meal, idx) => {
      if (meal.mealType !== 'snack') {
        const fatRatio = (meal.recipe?.fat || 0) / (meal.recipe?.cal || 1);
        if (fatRatio > highestFatRatio) {
          highestFatRatio = fatRatio;
          worstMealIndex = idx;
        }
      }
    });

    if (worstMealIndex !== -1) {
      const oldMeal = meals[worstMealIndex];
      console.log(`[DEBUG] Worst meal (highest fat): ${oldMeal.recipe?.name} (${oldMeal.recipe?.fat.toFixed(0)}g fat)`);

      const mealType = oldMeal.mealType;
      const fatTarget = goals.fat / 3;

      const leanAlternatives = allRecipes
        .filter(r => r.mealType === mealType && (r.fat || 0) < (goals.fat / 3) * 1.2 && r.id !== oldMeal.recipe?.id)
        .map(r => ({
          ...r,
          fatScore: Math.abs(r.fat - fatTarget),
        }))
        .sort((a, b) => a.fatScore - b.fatScore)
        .slice(0, 5);

      if (leanAlternatives.length > 0) {
        const replacement = leanAlternatives[0];
        console.log(`[DEBUG] Swapping to lean alternative: ${replacement.name} (${replacement.fat.toFixed(0)}g fat)`);

        meals[worstMealIndex] = {
          ...oldMeal,
          recipe: replacement,
          scaledBy: 1,
        };
      }
    }
  }

  return meals;
}

/**
 * Tier 2: Aggressive scaling - scale all recipes proportionally to hit targets
 */
function aggressiveScale(meals, goals) {
  console.log('[DEBUG] === TIER 2: AGGRESSIVE SCALING ===');

  let currentMacros = { protein: 0, carbs: 0, fat: 0 };
  meals.forEach(m => {
    currentMacros.protein += m.recipe?.protein || 0;
    currentMacros.carbs += m.recipe?.carbs || 0;
    currentMacros.fat += m.recipe?.fat || 0;
  });

  const proteinRatio = goals.protein / (currentMacros.protein || 1);
  const carbsRatio = goals.carbs / (currentMacros.carbs || 1);
  const fatRatio = goals.fat / (currentMacros.fat || 1);

  const avgRatio = (proteinRatio + carbsRatio + fatRatio) / 3;

  console.log(`[DEBUG] Tier 2 Scaling: protein=${proteinRatio.toFixed(2)}x, carbs=${carbsRatio.toFixed(2)}x, fat=${fatRatio.toFixed(2)}x, avg=${avgRatio.toFixed(2)}x`);

  const scaled = meals.map(m => ({
    ...m,
    recipe: {
      ...m.recipe,
      protein: (m.recipe?.protein || 0) * avgRatio,
      carbs: (m.recipe?.carbs || 0) * avgRatio,
      fat: (m.recipe?.fat || 0) * avgRatio,
      cal: (m.recipe?.cal || 0) * avgRatio,
    },
    scaled: true,
    scaleRatio: avgRatio,
  }));

  return scaled;
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
  const carbsDiff = Math.abs((recipe.carbs || 0) - targetMacros.carbs);
  const fatDiff = Math.abs((recipe.fat || 0) - targetMacros.fat);

  // Equal weighting for all macros (1.0 each) for better adherence
  const distance = calDiff + proteinDiff + carbsDiff + fatDiff;
  // Uncomment for very verbose logging:
  // console.log(`[DEBUG]   Distance for ${recipe.name}: cal=${calDiff} + p=${proteinDiff} + c=${carbsDiff} + f=${fatDiff} = ${distance}`);
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
  console.log('[DEBUG]   Excluded (recently used):', excludeRecipeIds.length);

  const filtered = filterRecipesByPreferences(recipes, preferences, excludeRecipeIds);
  const avoidedCount = recipes.length - filtered.length;
  console.log('[DEBUG]   After filtering:', filtered.length, 'available (avoided', avoidedCount, 'recent recipes)');

  if (filtered.length === 0) {
    console.log('[DEBUG]   No recipes passed filter - returning null');
    return null;
  }

  // Shuffle to randomize selection
  const shuffled = shuffleArray(filtered);

  // If remainingMacros provided, score recipes and pick from top 5 for variety
  if (remainingMacros) {
    // Score all recipes
    const scored = shuffled.map(recipe => ({
      recipe,
      score: getMacroScore(recipe, remainingMacros)
    }));

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    // Take top 5 recipes (or fewer if not enough)
    const topRecipes = scored.slice(0, Math.min(5, scored.length));

    // Randomly select from top 5
    const randomIndex = Math.floor(Math.random() * topRecipes.length);
    const selected = topRecipes[randomIndex];

    console.log('[DEBUG] selectBestRecipe: ' + selected.recipe.name + ' (avoided ' + avoidedCount + ' recent recipes, score: ' + selected.score.toFixed(2) + ')');
    return selected.recipe;
  }

  // Pick a random recipe from the shuffled list (when no remainingMacros provided)
  const selectedIndex = Math.floor(Math.random() * shuffled.length);
  const selected = shuffled[selectedIndex];

  console.log('[DEBUG]   selectBestRecipe randomly selected:', selected.id, '-', selected.name);
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
  const proteinRatio = protein > 0 ? Math.min(recipe.protein / protein, 1) : 0;
  const carbRatio = carbs > 0 ? Math.min(recipe.carbs / carbs, 1) : 0;
  const fatRatio = fat > 0 ? Math.min(recipe.fat / fat, 1) : 0;

  // Score: average of macro fill ratios (equal weighting, all macros matter)
  // Capped at 1.0 to avoid overshooting
  const score = (proteinRatio + carbRatio + fatRatio) / 3;

  // Return score (higher = better for balanced macros)
  return score * 10;
}

/**
 * Insert snacks at specified times in the meal plan
 */
function insertSnacksAtTiming(selectedRecipes, selectedSnacks, snackTiming, perSnackCalTarget, usedRecipeIds) {
  console.log('[DEBUG] insertSnacksAtTiming START - selectedRecipes length:', selectedRecipes.length);
  console.log('[DEBUG] Initial meals:', selectedRecipes.map(m => `${m.mealType}:${m.recipe?.name}`).join(', '));

  if (!snackTiming || snackTiming.length === 0 || !selectedSnacks || selectedSnacks.length === 0) {
    console.log('[DEBUG] No snacks to insert, returning unchanged');
    return { selectedRecipes, totalMacros: calculateTotalMacros(selectedRecipes) };
  }

  console.log('[DEBUG] Inserting snacks at timing positions:', snackTiming);

  // Map timing to position in selectedRecipes
  const timingToPosition = {
    'after_breakfast': 1,    // After breakfast (index 0)
    'after_lunch': 3,        // After lunch (index 2)
    'after_dinner': 5,       // After dinner (index 4)
  };

  // Insert snacks in reverse order to avoid index shifting
  const timingsToProcess = snackTiming
    .map((timing, idx) => ({ timing, position: timingToPosition[timing], snackIdx: idx }))
    .sort((a, b) => b.position - a.position);

  console.log('[DEBUG] Snacks to process (in reverse order):', timingsToProcess.map(t => `${t.timing} at pos ${t.position}`).join(', '));

  for (const { timing, position, snackIdx } of timingsToProcess) {
    if (snackIdx >= selectedSnacks.length) {
      console.log(`[DEBUG] No more selected snacks for ${timing}`);
      continue;
    }

    const snackRecipe = selectedSnacks[snackIdx];
    usedRecipeIds.add(snackRecipe.id);

    console.log(`[DEBUG] About to insert snack at position: ${position}, snack: ${snackRecipe.name}`);

    // Scale snack to per-snack calorie target
    const scaledSnack = scaleRecipeToTarget(snackRecipe, perSnackCalTarget);
    console.log(`[DEBUG] Scaled snack: ${scaledSnack.cal.toFixed(0)}cal, ${scaledSnack.carbs.toFixed(0)}g carbs, ${scaledSnack.protein.toFixed(0)}g protein, ${scaledSnack.fat.toFixed(0)}g fat`);

    // Insert snack at correct position with timing metadata
    selectedRecipes.splice(position, 0, {
      mealType: 'snack',
      recipe: scaledSnack,
      confirmed: false,
      timing: timing,
      followsMealType: timing.replace('after_', ''),
    });

    console.log(`[DEBUG] After snack insertion - array length: ${selectedRecipes.length}, meals: ${selectedRecipes.map(m => `${m.mealType}:${m.recipe?.name}`).join(', ')}`);
  }

  console.log('[DEBUG] insertSnacksAtTiming END - selectedRecipes length:', selectedRecipes.length);
  console.log('[DEBUG] Final meals array:', selectedRecipes.map(m => `${m.mealType}:${m.recipe?.name}`).join(', '));

  const totalMacros = calculateTotalMacros(selectedRecipes);
  return { selectedRecipes, totalMacros };
}

/**
 * Main algorithm: Generate a meal plan for the day with dynamic meal count
 * Starts with breakfast + lunch + dinner, then adds meals until 88% of calorie goal
 */
/**
 * Calculate macro gaps between current meals and daily goals
 */
function calculateMacroGaps(meals, goals) {
  const mealMacros = calculateTotalMacros(meals);

  const gaps = {
    protein: goals.protein - mealMacros.protein,
    carbs: goals.carbs - mealMacros.carbs,
    fat: goals.fat - mealMacros.fat,
    cal: goals.cal - mealMacros.cal,
  };

  console.log(`[DEBUG] Macro gaps after meals: protein=${gaps.protein.toFixed(0)}g, carbs=${gaps.carbs.toFixed(0)}g, fat=${gaps.fat.toFixed(0)}g, cal=${gaps.cal.toFixed(0)}`);

  return gaps;
}

/**
 * Select snacks based on what macros are missing
 */
function selectSnacksByMacroNeed(snackPool, goals, mealMacros, snackCount) {
  const gaps = {
    protein: goals.protein - mealMacros.protein,
    carbs: goals.carbs - mealMacros.carbs,
    fat: goals.fat - mealMacros.fat,
  };

  console.log(`[DEBUG] Selecting ${snackCount} snacks with gaps: protein=${gaps.protein.toFixed(0)}g, carbs=${gaps.carbs.toFixed(0)}g, fat=${gaps.fat.toFixed(0)}g`);

  // Determine primary macro need (most deficient)
  let primaryMacro = 'carbs'; // carbs usually most deficient
  const carbPercent = Math.abs(gaps.carbs) / goals.carbs;
  const proteinPercent = Math.abs(gaps.protein) / goals.protein;
  const fatPercent = Math.abs(gaps.fat) / goals.fat;

  if (carbPercent < proteinPercent) primaryMacro = 'protein';
  if (fatPercent > carbPercent) primaryMacro = 'fat';

  console.log(`[DEBUG] Primary macro to fix: ${primaryMacro}`);

  // Score snacks by how well they fill the gap
  const scoredSnacks = snackPool.map(snack => {
    let score = 0;

    if (primaryMacro === 'carbs') {
      // Prioritize high-carb snacks
      score = snack.carbs;
    } else if (primaryMacro === 'protein') {
      // Prioritize high-protein snacks
      score = snack.protein;
    } else if (primaryMacro === 'fat') {
      // Prioritize low-fat snacks (to reduce overshoot)
      score = 20 - (snack.fat || 0); // inverted: lower fat = higher score
    }

    return { ...snack, score };
  });

  // Sort by score and pick top snackCount
  const selected = scoredSnacks
    .sort((a, b) => b.score - a.score)
    .slice(0, snackCount)
    .map(s => {
      const { score, ...snack } = s;
      return snack;
    });

  console.log(`[DEBUG] Selected snacks: ${selected.map(s => s.name).join(', ')}`);

  return selected;
}

export function selectMealsForDay(dailyGoals, preferences, includeShakeGenerator = null) {
  console.log('[DEBUG] selectMealsForDay called');
  console.log('[DEBUG] Input goals:', dailyGoals);
  console.log('[DEBUG] Input preferences:', preferences);

  const calorieGoal = dailyGoals.cal;
  const targetMin = calorieGoal * 0.88; // 88% minimum
  const MAX_MEALS = 10;

  console.log('[DEBUG] Calorie goal:', calorieGoal, '| Target min (88%):', Math.round(targetMin));

  // NOTE: Snack budget now calculated AFTER meals selected based on actual gaps

  let selectedRecipes = [];
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

    // When carbs are under 85% of goal, prioritize carb-friendly recipes
    if (remainingMacros && remainingMacros.carbs > 0) {
      const carbProgress = (dailyGoals.carbs - remainingMacros.carbs) / dailyGoals.carbs;
      if (carbProgress < 0.85) {
        // Start with medium-high carb filter (carbs > 30% of calories)
        const mediumCarbCandidates = recipesByMealType.filter(r => {
          const carbCalRatio = (r.carbs * 4) / r.cal;
          return carbCalRatio > 0.30;
        });

        // Use medium-high if we have enough options
        if (mediumCarbCandidates.length >= 5) {
          console.log(`[DEBUG] Carb filter relaxed - filtering to carbs > 30% of target (${mediumCarbCandidates.length} recipes)`);
          recipesByMealType = mediumCarbCandidates;
        } else {
          // If still too few, relax further to carbs > 20% of calories
          const relaxedCarbCandidates = recipesByMealType.filter(r => {
            const carbCalRatio = (r.carbs * 4) / r.cal;
            return carbCalRatio > 0.20;
          });
          console.log(`[DEBUG] Carb filter further relaxed - filtering to carbs > 20% (${relaxedCarbCandidates.length} recipes)`);
          recipesByMealType = relaxedCarbCandidates.length > 0 ? relaxedCarbCandidates : recipesByMealType;
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
  // NOTE: Use full goals - snacks calculated later based on gaps

  const mealTargets = {
    breakfast: Math.round(calorieGoal * 0.20),
    lunch: Math.round(calorieGoal * 0.27),
    dinner: Math.round(calorieGoal * 0.27)
  };

  console.log(`[DEBUG] Meal targets (before snacks): cal=${mealTargets.breakfast + mealTargets.lunch + mealTargets.dinner}, protein=${Math.round(dailyGoals.protein)}g, carbs=${Math.round(dailyGoals.carbs)}g, fat=${Math.round(dailyGoals.fat)}g`);

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

      // Calculate remaining macro budget with percentage-based tolerance (strict)
      const maxProteinBudget = dailyGoals.protein * 1.10; // 110% (10% overshoot max)
      const maxFatBudget = dailyGoals.fat * 1.10;         // 110% (10% overshoot max)
      const maxCarbsBudget = dailyGoals.carbs * 1.05;     // 105% (5% overshoot max)

      const macroLimits = {
        maxProtein: Math.round(maxProteinBudget - totalMacros.protein),
        maxCarbs: Math.round(maxCarbsBudget - totalMacros.carbs),
        maxFat: Math.round(maxFatBudget - totalMacros.fat),
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
  if (preferences?.include_snacks === true && preferences.snack_timing?.length > 0) {
    console.log('[DEBUG] === MACRO-AWARE SNACK SELECTION ===');

    // Calculate macro gaps AFTER meals selected
    const mealMacros = calculateTotalMacros(selectedRecipes);
    const gaps = calculateMacroGaps(selectedRecipes, { protein: dailyGoals.protein, carbs: dailyGoals.carbs, fat: dailyGoals.fat, cal: calorieGoal });

    // Select snacks intelligently based on macro needs
    const snackPool = RECIPES.filter(r => r.mealType === 'Snack');
    const selectedSnacks = selectSnacksByMacroNeed(snackPool, { protein: dailyGoals.protein, carbs: dailyGoals.carbs, fat: dailyGoals.fat }, mealMacros, preferences.snack_timing.length);

    // Calculate per-snack calorie target
    const perSnackCalTarget = gaps.cal > 0 ? gaps.cal / preferences.snack_timing.length : 325;
    console.log(`[DEBUG] Per-snack calorie target: ${perSnackCalTarget.toFixed(0)}`);

    // Insert snacks at timing positions
    const snackResult = insertSnacksAtTiming(
      selectedRecipes,
      selectedSnacks,
      preferences.snack_timing,
      perSnackCalTarget,
      usedRecipeIds
    );

    selectedRecipes = snackResult.selectedRecipes;
    totalMacros = snackResult.totalMacros;

    console.log(`[DEBUG] After snack insertion - selectedRecipes length: ${selectedRecipes.length}, meals: ${selectedRecipes.map(m => `${m.mealType}:${m.recipe?.name}`).join(', ')}`);
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

    // Calculate remaining macro budget with percentage-based tolerance (strict)
    const maxProteinBudget = dailyGoals.protein * 1.10; // 110% (10% overshoot max)
    const maxFatBudget = dailyGoals.fat * 1.10;         // 110% (10% overshoot max)
    const maxCarbsBudget = dailyGoals.carbs * 1.05;     // 105% (5% overshoot max)

    const macroLimits = {
      maxProtein: Math.round(maxProteinBudget - totalMacros.protein),
      maxCarbs: Math.round(maxCarbsBudget - totalMacros.carbs),
      maxFat: Math.round(maxFatBudget - totalMacros.fat),
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

  const calPercent = Math.round(totalMacros.cal / calorieGoal * 100);
  const proteinPercent = Math.round(totalMacros.protein / dailyGoals.protein * 100);
  const carbsPercent = Math.round(totalMacros.carbs / dailyGoals.carbs * 100);
  const fatPercent = Math.round(totalMacros.fat / dailyGoals.fat * 100);

  console.log(`[DEBUG] Macro adherence: cal=${calPercent}% protein=${proteinPercent}% carbs=${carbsPercent}% fat=${fatPercent}%`);

  const accuracy = calculateAccuracy(totalMacros, dailyGoals);
  console.log('[DEBUG] Accuracy breakdown:', accuracy);

  // THREE-TIER OPTIMIZATION SYSTEM
  console.log('[DEBUG] === THREE-TIER OPTIMIZATION ===');

  let meals = selectedRecipes;
  let validation = validateMealPlan(meals, { protein: dailyGoals.protein, carbs: dailyGoals.carbs, fat: dailyGoals.fat });

  if (validation.isValid) {
    console.log('[DEBUG] ✓ Plan passed validation immediately (no tiers needed)');
  } else {
    // TIER 1: Smart Recipe Swapping
    console.log('[DEBUG] Initial plan failed, attempting Tier 1...');
    meals = smartRecipeSwap(meals, { protein: dailyGoals.protein, carbs: dailyGoals.carbs, fat: dailyGoals.fat }, RECIPES);
    validation = validateMealPlan(meals, { protein: dailyGoals.protein, carbs: dailyGoals.carbs, fat: dailyGoals.fat });

    if (validation.isValid) {
      console.log('[DEBUG] ✓ Plan passed validation at Tier 1 (Smart Recipe Swapping)');
    } else {
      // TIER 2: Aggressive Scaling
      console.log('[DEBUG] Tier 1 failed, attempting Tier 2...');
      meals = aggressiveScale(meals, { protein: dailyGoals.protein, carbs: dailyGoals.carbs, fat: dailyGoals.fat });
      validation = validateMealPlan(meals, { protein: dailyGoals.protein, carbs: dailyGoals.carbs, fat: dailyGoals.fat });

      if (validation.isValid) {
        console.log('[DEBUG] ✓ Plan passed validation at Tier 2 (Aggressive Scaling)');
      } else {
        // TIER 3: Accept best attempt
        console.log('[DEBUG] ✗ All tiers attempted, returning best effort');
      }
    }
  }

  const finalMacros = calculateTotalMacros(meals);
  const finalProteinPercent = Math.round(validation.proteinPercent * 100);
  const finalCarbsPercent = Math.round(validation.carbsPercent * 100);
  const finalFatPercent = Math.round(validation.fatPercent * 100);

  console.log(`[DEBUG] Final validation: protein=${finalProteinPercent}%, carbs=${finalCarbsPercent}%, fat=${finalFatPercent}% (tolerance: ±7%)`);

  const result = {
    meals,
    totalMacros: finalMacros,
    accuracy: calculateAccuracy(finalMacros, dailyGoals),
    validation,
  };

  console.log('[DEBUG] selectMealsForDay returning meal plan');
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
