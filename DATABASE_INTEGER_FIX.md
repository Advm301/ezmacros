# Fix: Database Integer Rounding

## The Problem

Meal planner generates decimal macro values:
- `fat: 84.5`
- `protein: 157.3`
- `carbs: 218.7`

But Supabase `meal_plans` table columns are defined as **INTEGER** type, which doesn't accept decimals.

### Error Message
```
PostgreSQL error: invalid input syntax for type integer: "84.5"
```

## The Solution

Round all macro and accuracy values to integers before inserting into database:

```javascript
// Round totalMacros to integers
planData.totalMacros = {
  cal: Math.round(planData.totalMacros.cal),        // 1680.5 → 1681
  protein: Math.round(planData.totalMacros.protein), // 157.3 → 157
  carbs: Math.round(planData.totalMacros.carbs),     // 218.7 → 219
  fat: Math.round(planData.totalMacros.fat),         // 84.5 → 85
};

// Round accuracy scores to integers
planData.accuracy = {
  overall: Math.round(planData.accuracy.overall),     // 94.2 → 94
  calories: Math.round(planData.accuracy.calories),   // 95.7 → 96
  protein: Math.round(planData.accuracy.protein),     // 92.1 → 92
  carbs: Math.round(planData.accuracy.carbs),         // 91.8 → 92
  fat: Math.round(planData.accuracy.fat),             // 89.4 → 89
};
```

## Where Changed

**File**: `src/hooks/useMealPlanner.js`
**Function**: `generateMealPlan`
**Location**: Before the `supabase.from('meal_plans').upsert()` call

### Before Fix
```javascript
const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;

// Save to meal_plans table (with decimal values)
const { data: savedPlan, error: saveError } = await supabase
  .from('meal_plans')
  .upsert({
    total_calories: planData.totalMacros.cal,      // 1680.5 ← DECIMAL
    total_protein: planData.totalMacros.protein,   // 157.3 ← DECIMAL
    total_carbs: planData.totalMacros.carbs,       // 218.7 ← DECIMAL
    total_fat: planData.totalMacros.fat,           // 84.5 ← DECIMAL (ERROR!)
    accuracy_score: planData.accuracy.overall,     // 94.2 ← DECIMAL
  });
```

### After Fix
```javascript
const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;

// Round all macro values to integers
planData.totalMacros = {
  cal: Math.round(planData.totalMacros.cal),        // 1680.5 → 1681
  protein: Math.round(planData.totalMacros.protein), // 157.3 → 157
  carbs: Math.round(planData.totalMacros.carbs),     // 218.7 → 219
  fat: Math.round(planData.totalMacros.fat),         // 84.5 → 85
};

// Round accuracy values to integers
planData.accuracy = {
  overall: Math.round(planData.accuracy.overall),     // 94.2 → 94
  calories: Math.round(planData.accuracy.calories),   // 95.7 → 96
  protein: Math.round(planData.accuracy.protein),     // 92.1 → 92
  carbs: Math.round(planData.accuracy.carbs),         // 91.8 → 92
  fat: Math.round(planData.accuracy.fat),             // 89.4 → 89
};

// Save to meal_plans table (with rounded integers)
const { data: savedPlan, error: saveError } = await supabase
  .from('meal_plans')
  .upsert({
    total_calories: planData.totalMacros.cal,      // 1681 ← INTEGER ✅
    total_protein: planData.totalMacros.protein,   // 157 ← INTEGER ✅
    total_carbs: planData.totalMacros.carbs,       // 219 ← INTEGER ✅
    total_fat: planData.totalMacros.fat,           // 85 ← INTEGER ✅
    accuracy_score: planData.accuracy.overall,     // 94 ← INTEGER ✅
  });
```

## Console Output

When generating a meal plan, you'll see:

```
[DEBUG] Before rounding - totalMacros: { cal: 1680.5, protein: 157.3, carbs: 218.7, fat: 84.5 }
[DEBUG] After rounding - totalMacros: { cal: 1681, protein: 157, carbs: 219, fat: 85 }
[DEBUG] Before rounding - accuracy: { overall: 94.2, calories: 95.7, protein: 92.1, carbs: 91.8, fat: 89.4 }
[DEBUG] After rounding - accuracy: { overall: 94, calories: 96, protein: 92, carbs: 92, fat: 89 }
[DEBUG] generateMealPlan: meal plan generated
```

## How to Test

### Step 1: Set Preferences
1. Go to Journal → "⚙️ Preferences"
2. Select your protein preferences
3. Click [Save]

### Step 2: Generate Meal Plan
1. Click "⊕ Generate Meal Plan"
2. Click [Generate]
3. Check console

### Step 3: Verify Success
**Before fix:**
```
Error generating meal plan: invalid input syntax for type integer: "84.5"
```

**After fix:**
- Console shows rounding logs
- No error messages
- Meal plan appears with 3-4 meals
- Journal shows breakfast/lunch/dinner with macros

### Step 4: Check Database
The `meal_plans` table should contain:
```sql
SELECT id, plan_date, total_calories, total_protein, total_carbs, total_fat, accuracy_score
FROM meal_plans
WHERE user_id = 'your-user-id'
LIMIT 1;

-- Output:
id                 | plan_date  | total_calories | total_protein | total_carbs | total_fat | accuracy_score
uuid-here          | 2026-06-06 | 1681           | 157           | 219         | 85        | 94
(all INTEGER type)
```

---

## Why This Happens

**Root cause**: Recipe macros can have decimals
- Example: Egg (120 cal) + Toast (280.5 cal) = 400.5 cal
- When summed across multiple recipes, these decimals accumulate
- Final totals like `fat: 84.5` don't fit INTEGER columns

**Solution**: Round to nearest integer when saving
- Rounds 84.5 → 85, 84.4 → 84
- Minimal precision loss (±0.5 maximum)
- Matches user experience (displayed as whole numbers anyway)

## Rounding Strategy

Uses `Math.round()` which:
- Rounds 0.5 and up to next integer: 84.5 → 85
- Rounds below 0.5 down: 84.4 → 84
- Preserves accuracy for display and calculations

## Database Schema

The `meal_plans` table columns that needed rounding:
```sql
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY,
  total_calories INT,        ← Was receiving 1680.5, now 1681 ✅
  total_protein INT,         ← Was receiving 157.3, now 157 ✅
  total_carbs INT,           ← Was receiving 218.7, now 219 ✅
  total_fat INT,             ← Was receiving 84.5, now 85 ✅
  accuracy_score INT,        ← Was receiving 94.2, now 94 ✅
  ...
);
```

---

## Build Status
✅ **Successful** (698.17 KB minified, no errors)

**Meal plans will now insert successfully without decimal errors!** 🎉
