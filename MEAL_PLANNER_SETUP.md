# Smart Daily Meal Planner Setup Guide

## Overview
The meal planner is **99% implemented and ready to test**. You need to run one SQL migration to activate it.

## Step 1: Run Database Migration

1. Go to your **Supabase Dashboard** → SQL Editor
2. Click **"New Query"**
3. Copy **ALL** the SQL from `/migrations/meal_planner_setup.sql`
4. Paste into the editor
5. Click **"Run"**

This creates 3 new tables + extends meal_logs + adds RLS policies.

**Expected output**: No errors, just success messages.

## Step 2: Test the Feature

1. **Start your dev server**: `npm run dev`
2. **Navigate to Journal tab**
3. **Click "⚙️ Preferences"** button in header
   - Set your spice level, protein preferences, meal frequency, variety level
   - Toggle "Include Shakes"
   - Click **[Save Preferences]**
4. **Click "⊕ Generate Meal Plan"** button
   - Modal appears → Click **[Generate]**
   - Plan appears with 3-4 meals + accuracy indicator
5. **Test interactions:**
   - Hover over [Swap] button → Click → Select alternative recipe → Plan updates
   - Click [View Recipe] → Full recipe opens → Close
   - Check meal checkboxes → See which meals are "confirmed"
   - Click [Confirm All Meals] → All check at once
   - Click [Clear Plan] → Plan disappears
   - Click "⊕ Generate Meal Plan" again → New plan with different recipes

## Step 3: What You'll See

### Preferences Modal
- Spice Level: Low / Medium / High / Any
- Protein Options: 10 checkboxes (chicken, beef, fish, ground proteins, vegetarian, eggs)
- Meal Frequency: 3 meals / 4 meals / 3+snack / 2+snacks
- Recipe Variety: Same daily / Some repeat / Always different
- Toggle: "Include Shakes in Snack Slots"

### Meal Plan Display
- **Accuracy Indicator** (top): Shows 98% accuracy with per-macro breakdown
  - Green = 95%+ (good)
  - Yellow/Red = Below target

- **Meal Cards** (breakfast, lunch, dinner, snack):
  - Emoji + recipe name
  - Calories, protein, carbs, fat
  - Accuracy bars (how close to target)
  - [Swap] button - pick from 5 alternatives
  - [View Recipe] button - see full recipe
  - Checkbox (left) - confirm you'll eat this

- **Action Buttons**:
  - [Confirm All Meals] - check all at once
  - [Clear Plan] - delete plan for today
  - [Generate New Plan] - create fresh plan (only if no meals confirmed)

## Step 4: How It Works

### Meal Selection Algorithm
1. Calculates per-meal macro targets based on meal frequency
   - 3 meals: Breakfast 25%, Lunch 35%, Dinner 40%
   - 4 meals: Breakfast 20%, Lunch 35%, Snack 10%, Dinner 35%
   - etc.

2. Filters recipe pool by:
   - Meal type (breakfast recipes for breakfast, etc.)
   - Spice level preference
   - Protein preferences
   - Variety level (no repeats if "always different")

3. Selects best recipe using distance scoring:
   - `distance = abs(recipe.cal - target.cal) + (abs(recipe.protein - target.protein) * 0.5)`
   - Picks recipe with lowest distance
   - Avoids repeats within same plan

4. Calculates accuracy:
   - Per-macro: `100 - (abs(planned - goal) / goal * 100)%`
   - Overall: Average of calories, protein, carbs, fat accuracies

### Shake Generation
- Auto-generates if snack slot + include_shakes=true
- Combines: protein powder + liquid + fruit + optional add-ons
- Produces: ~160 cal, ~27g protein, ~18g carbs, ~3g fat
- 8 templates: Vanilla, Berry Blast, PB & Banana, Tropical, etc.

### Swap Modal
- Shows 5 alternative recipes for the meal
- Filtered by same meal type + preferences
- Within ±50 cal of original target
- Sorted by distance (best match first)
- Click one → Plan updates, confirmation resets

## Step 5: Known Limitations (V1.0)

⚠️ **Not yet persisted to database:**
- Meal confirmations (checkboxes toggle UI but don't save to database yet)
- Only shows on today's view (past dates hidden)

⚠️ **Partial implementation:**
- Variety level "always different" doesn't check past 7 days yet
- Progress bars show all meals, not just confirmed (will be filtered in V1.1)
- Shake macros are generic (could be customized per-meal in V1.1)

## Step 6: Troubleshooting

**"No preferences found" error:**
- Database migration didn't run
- Check Supabase SQL for errors
- Retry migration

**"Preferences modal won't open":**
- Check browser console (F12) for errors
- Make sure auth is working (sign in works, other tabs work)

**"Plan shows but meals are incorrect:"**
- Preferences may not match recipe pool
- Try changing spice level or protein preferences
- Generate new plan

**"Swap modal shows 0 alternatives:**
- No recipes match combined filters (meal type + spice + proteins)
- Try relaxing spice level to "any"
- Ensure at least 3-4 proteins checked

## Files to Know

| File | Purpose |
|------|---------|
| `/migrations/meal_planner_setup.sql` | Database schema (run in Supabase) |
| `/src/hooks/useUserPreferences.js` | Load/save preferences |
| `/src/hooks/useMealPlanner.js` | Generate plans, swap recipes |
| `/src/lib/mealPlannerAlgorithm.js` | Core algorithm |
| `/src/lib/shakeGenerator.js` | Shake recipe generation |
| `/src/pages/Today.jsx` | Journal tab (integrated all components) |
| `/src/components/MealPlanCard.jsx` | Single meal display |
| `/src/components/MealPlanDisplay.jsx` | Full plan view |
| `/src/components/AccuracyIndicator.jsx` | Accuracy visualization |
| `/src/components/MealSwapModal.jsx` | Swap interface |
| `/src/components/UserPreferencesModal.jsx` | Settings |
| `/src/components/GenerateMealPlanModal.jsx` | Generation confirmation |

## Next Steps (V1.1)

- [ ] Persist meal confirmations to `meal_logs.confirmed_at`
- [ ] Filter progress bars to only count confirmed meals
- [ ] Implement "always different" variety level (check past 7 days)
- [ ] Add calendar indicators showing plan status
- [ ] Allow users to customize shake components
- [ ] Export meal plan as text/image
- [ ] Weekly compliance analytics

## Questions?

Check the browser console (F12) for detailed error messages. Most issues are:
1. Database migration not run
2. Supabase RLS policies blocking queries
3. User not authenticated
