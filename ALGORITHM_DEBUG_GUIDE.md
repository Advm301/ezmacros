# Meal Planner Algorithm Debug Guide

## Issue: Empty Meals Array

When generating a meal plan, the algorithm returns `meals: Array(0)` (empty array) instead of selecting recipes.

## Added Logging Points

Comprehensive logging has been added to trace the entire recipe selection process:

### 1. Algorithm Entry Point
```
[DEBUG] mealPlannerAlgorithm.selectMealsForDay called
[DEBUG] Input goals: { cal: 2200, protein: 180, carbs: 220, fat: 60 }
[DEBUG] Input preferences: { spice_level: 'any', protein_preferences: [...], ... }
[DEBUG] Meal frequency: 3_meals
[DEBUG] Calculated meal targets: { breakfast: {...}, lunch: {...}, dinner: {...} }
[DEBUG] Meal types to fill: [ 'breakfast', 'lunch', 'dinner' ]
[DEBUG] Total recipes available: 123
```

**What to check:**
- Are goals and preferences being passed correctly?
- Is meal frequency recognized? (should be one of: 3_meals, 4_meals, 3_plus_snack, 2_plus_snacks)
- Are meal targets calculated? (should show calorie/protein targets for each slot)
- Are meal types correct?

### 2. Meal Type Processing Loop
For each meal slot (breakfast, lunch, dinner):
```
[DEBUG] Processing meal type: breakfast
[DEBUG] breakfast: 31 recipes available by meal type
[DEBUG] breakfast: recipe IDs: 1, 5, 12, 23, 45, ...
[DEBUG] breakfast: target macros: { cal: 550, protein: 45, carbs: 55, fat: 15 }
[DEBUG] breakfast: selectBestRecipe returned: Scrambled Eggs with Toast (520 cal, 48g P)
[DEBUG] breakfast: selected recipe ID 1 - Scrambled Eggs with Toast
```

**What to check:**
- Are recipes available for this meal type? (number > 0)
- Do recipe IDs and names look correct?
- Are target macros reasonable?
- Did selectBestRecipe return a recipe or null?

### 3. Recipe Filtering by Preferences
When selectBestRecipe is called:
```
[DEBUG] selectBestRecipe called
[DEBUG]   Input recipes: 31
[DEBUG]   Target macros: { cal: 550, protein: 45, carbs: 55, fat: 15 }
[DEBUG] filterRecipesByPreferences called
[DEBUG]   Input recipes: 31
[DEBUG]   Preferences: { spice_level: 'any', protein_preferences: [...] }
[DEBUG]   Exclude IDs: []
[DEBUG]   Recipe 1 - Scrambled Eggs with Toast passed all filters
[DEBUG]   Recipe 5 - Oatmeal with Berries passed all filters
[DEBUG]   Recipe 12 filtered out by protein (tags: [beef, dairy], prefs: [chicken, pork])
[DEBUG] filterRecipesByPreferences result: 28 recipes passed
[DEBUG]   After preference filtering: 28
```

**What to check:**
- Do preferences filter out too many recipes? (28 out of 31 is good)
- Are protein tags matching preferences correctly?
- If filtered count is 0, something is wrong with preferences or recipe tags

### 4. Best Recipe Selection
After filtering, for each recipe:
```
[DEBUG]   Recipe 1 - Scrambled Eggs: distance=30 (BETTER than current best)
[DEBUG]   Recipe 5 - Oatmeal with Berries: distance=45 (worse than current best)
[DEBUG]   selectBestRecipe returning: 1 - Scrambled Eggs with Toast
```

**What to check:**
- Are distance calculations happening for each recipe?
- Is one recipe selected as "best"?
- If no recipes compared, filtering removed all of them

### 5. Final Result
After all meals selected:
```
[DEBUG] Total meals selected: 3
[DEBUG] Selected meals array: [ breakfast meal, lunch meal, dinner meal ]
[DEBUG] Final accuracy score: { overall: 94, calories: 95, protein: 92, ... }
[DEBUG] Final total macros: { cal: 1680, protein: 158, carbs: 185, fat: 52 }
[DEBUG] selectMealsForDay returning: { meals: [3 items], totalMacros: {...}, ... }
```

**What to check:**
- Is meals array populated? (should show 3 items for 3_meals)
- If empty, check logs above to see where selection failed

---

## Troubleshooting by Symptom

### Symptom 1: Meals Array is Empty (0 items)

**Check logs for:**
1. **No "Processing meal type" logs** → Issue in getMealTypes() or main loop
2. **"0 recipes available by meal type"** → Recipes might not have mealType field
3. **"No recipe passed filter - returning null"** → Preferences filtering all recipes
4. **"NO RECIPE FOUND - skipping"** → selectBestRecipe returned null

**Solution by case:**
```
Case A: No "Processing meal type" at all
→ Check getMealTypes() function
→ Check mealFrequency value

Case B: "0 recipes available by meal type"
→ Check recipe data: recipe.mealType must be 'Breakfast', 'Lunch/Dinner', or 'Snack'
→ Run in browser console: RECIPES.filter(r => r.mealType === 'Breakfast').length

Case C: "Filtered down from 30 to 0"
→ Protein preferences too restrictive
→ Spice level doesn't match any recipes
→ Check recipe tags match preference format

Case D: selectBestRecipe returns null
→ After filtering, no recipes remained
→ Same as Case C above
```

### Symptom 2: Preferences Filtering Out All Recipes

**Check these logs:**
```
[DEBUG] filterRecipesByPreferences called
[DEBUG]   Input recipes: 31
[DEBUG]   Preferences: { spice_level: 'low', protein_preferences: ['chicken'], ... }
[DEBUG]   Recipe 12 filtered out by protein (tags: [beef, dairy], prefs: [chicken])
[DEBUG]   Recipe 45 filtered out by protein (tags: [pork, vegetables], prefs: [chicken])
[DEBUG] filterRecipesByPreferences result: 0 recipes passed ← PROBLEM HERE
```

**Why this happens:**
- Protein preference is too restrictive (e.g., only 'chicken' but few chicken recipes)
- Recipe tags don't match preference format (e.g., 'ground_beef' vs 'groundbeef')
- Spice level mismatch

**Check your preferences:**
- Default should be 'any' spice level (not 'low')
- Default proteins should include multiple types, not just one
- Protein names should match RECIPES array tags

### Symptom 3: Only Some Meals Selected (e.g., 1 instead of 3)

**Check logs for:**
```
[DEBUG] Processing meal type: breakfast
[DEBUG] breakfast: selectBestRecipe returned: Scrambled Eggs (520 cal, 48g P)
[DEBUG] breakfast: selected recipe ID 1 - Scrambled Eggs with Toast

[DEBUG] Processing meal type: lunch
[DEBUG] lunch: selectBestRecipe returned: null ← STOPPED HERE
[DEBUG] lunch: NO RECIPE FOUND - skipping this meal slot

[DEBUG] Total meals selected: 1 ← Only breakfast was selected
```

**Why:** One meal type doesn't have recipes matching all preferences

**Solution:**
- Check what's filtering out lunch/dinner recipes
- Relax preferences (use 'any' spice, add more protein types)
- Verify recipes exist for that meal type

---

## Complete Log Sequence (Healthy Plan)

When everything works correctly, you should see this pattern:

```
[DEBUG] selectMealsForDay called
[DEBUG] Total recipes available: 123
[DEBUG] Meal frequency: 3_meals
[DEBUG] Meal types to fill: ['breakfast', 'lunch', 'dinner']

[DEBUG] Processing meal type: breakfast
[DEBUG] breakfast: 30 recipes available by meal type
[DEBUG] filterRecipesByPreferences called ... (filters down)
[DEBUG] After preference filtering: 25
[DEBUG] selectBestRecipe returning: Recipe ID X - Name
[DEBUG] breakfast: selected recipe ID X - Name

[DEBUG] Processing meal type: lunch
[DEBUG] lunch: 60 recipes available by meal type
[DEBUG] filterRecipesByPreferences called ... (filters down)
[DEBUG] After preference filtering: 50
[DEBUG] selectBestRecipe returning: Recipe ID Y - Name
[DEBUG] lunch: selected recipe ID Y - Name

[DEBUG] Processing meal type: dinner
[DEBUG] dinner: 60 recipes available by meal type
[DEBUG] filterRecipesByPreferences called ... (filters down)
[DEBUG] After preference filtering: 48
[DEBUG] selectBestRecipe returning: Recipe ID Z - Name
[DEBUG] dinner: selected recipe ID Z - Name

[DEBUG] Total meals selected: 3
[DEBUG] Selected meals array: [3 items]
[DEBUG] selectMealsForDay returning: { meals: [3 items], ... }
```

---

## How to Debug

### Step 1: Open Console
Press `F12` → Console tab

### Step 2: Navigate to Journal → Click Generate Meal Plan
Watch the console during generation

### Step 3: Copy All Debug Logs
Right-click console → "Save as..." or manually select/copy all logs starting with `[DEBUG] selectMealsForDay`

### Step 4: Analyze Log Sequence
1. Find where meals stop being selected
2. Check what happened just before that point
3. Look for filter/preference messages

### Step 5: Share Logs if Needed
If meals array is still empty:
- Copy entire log sequence from "selectMealsForDay called" to "returning"
- Include the preferences that were saved
- Include your goals (calories, protein, etc.)

---

## Performance Notes

**Verbose logging adds:**
- ~100-200 console logs for a 3-meal plan
- Minimal performance impact (logging is synchronous but fast)
- Can be disabled in production by removing console.log calls

---

## Removing Debug Logging

Once the issue is fixed:
1. Search for `console.log('[DEBUG]` in `src/lib/mealPlannerAlgorithm.js`
2. Remove all those lines
3. Rebuild with `npm run build`

For now, **keep the logging in place** - it's critical for debugging!
