# Meal Planner Debug Guide

## Issue: "Generate Meal Plan" Button Not Opening Modal

### What Was Added

Comprehensive debug logging has been added to trace the issue:

#### 1. **Button Click Logging** (`src/pages/Today.jsx`, line 721-727)
When you click the "⊕ Generate Meal Plan" button, you should see:
```
[DEBUG] Generate button clicked
[DEBUG] Current showGenerateMealModal: false (or true if previously opened)
[DEBUG] mealPlanner.loading: false (or true if generating)
```

#### 2. **State Change Logging** (New useEffect in `src/pages/Today.jsx`)
When the modal state changes, you should see:
```
[DEBUG] showGenerateMealModal changed to: true
```

#### 3. **Section Rendering Logging** (`src/pages/Today.jsx`, line 695)
When the meal planner section renders, you should see:
```
[DEBUG] Meal planner section rendering. mealPlan: null, showGenerateMealModal: false
```

#### 4. **Date Check Logging** (New useEffect in `src/pages/Today.jsx`)
Every render, you should see:
```
[DEBUG] Today.jsx render - selectedDate: 2026-06-06, today: 2026-06-06, isToday: true
```

#### 5. **Hook Initialization Logging** (New in `src/hooks/useMealPlanner.js`)
When the hook initializes, you should see:
```
[DEBUG] useMealPlanner hook initialized
[DEBUG] useMealPlanner initial state: { mealPlan: null, loading: false, error: null }
```

#### 6. **Hook Initialization Logging** (New in `src/hooks/useUserPreferences.js`)
```
[DEBUG] useUserPreferences hook initialized
[DEBUG] useUserPreferences initial state: { preferences: {...}, loading: true, error: null }
```

#### 7. **Meal Plan Loading Logging** (New in `src/hooks/useMealPlanner.js`)
When you navigate to today's date:
```
[DEBUG] loadMealPlan called with date: 2026-06-06
[DEBUG] loadMealPlan user: auth-user-id-here
[DEBUG] loadMealPlan dateStr: 2026-06-06
[DEBUG] loadMealPlan result: { plan: null, fetchError: "relation \"meal_plans\" does not exist" }
```
OR if table exists:
```
[DEBUG] loadMealPlan result: { plan: {...}, fetchError: null }
[DEBUG] loadMealPlan no plan found, setting to null
```

---

## How to Test

### Step 1: Open Browser Console
1. Press `F12` in your browser
2. Click the **"Console"** tab
3. Clear any existing logs

### Step 2: Navigate to Journal Tab
- Go to EZMacros → Journal tab
- You should see logs like:
  ```
  [DEBUG] useUserPreferences hook initialized
  [DEBUG] useMealPlanner hook initialized
  [DEBUG] Today.jsx render - selectedDate: 2026-06-06, today: 2026-06-06, isToday: true
  [DEBUG] Meal planner section rendering. mealPlan: null, showGenerateMealModal: false
  ```

### Step 3: Click "⊕ Generate Meal Plan" Button
When you click the button, look for:
1. **Button click logs**:
   ```
   [DEBUG] Generate button clicked
   [DEBUG] Current showGenerateMealModal: false
   [DEBUG] mealPlanner.loading: false
   ```

2. **State change logs**:
   ```
   [DEBUG] showGenerateMealModal changed to: true
   ```

3. **Modal should now appear** on screen

If the modal doesn't appear but you see the logs, the issue is in the modal component itself.

---

## Troubleshooting By Log Output

### Case 1: Button logs appear, but no state change logs
**Problem**: Button click is firing, but setState isn't working
**Solution**:
- Check if you're on today's date (not past/future)
- Try refreshing the page
- Check browser console for React errors

### Case 2: Button logs don't appear at all
**Problem**: Button click handler not firing
**Solution**:
- Button might be disabled (mealPlanner.loading = true)
- Try clicking again after page fully loads
- Check if you're looking at the right button

### Case 3: State logs appear, but modal doesn't show
**Problem**: Modal component rendering but not visible
**Solution**:
- Check browser DevTools: Elements tab
- Look for `<div style="position: fixed; ... z-index: 45">`
- If found, modal is rendering but hidden (CSS issue)
- If not found, modal component has an error

### Case 4: loadMealPlan logs show table doesn't exist error
**Problem**: Database tables not created yet
**Solution**:
- Run the SQL migration in Supabase SQL Editor
- From `/migrations/meal_planner_setup.sql`
- Refresh page after migration completes

### Case 5: All logs missing
**Problem**: Hooks not initializing
**Solution**:
- Check if you're logged in (other tabs might not work either)
- Clear browser cache
- Refresh page
- Check browser console for Supabase auth errors

---

## Expected Console Output (Complete Flow)

Here's what you should see when everything works:

```
[DEBUG] useUserPreferences hook initialized
[DEBUG] useUserPreferences initial state: {preferences: {...}, loading: true, error: null}
[DEBUG] useMealPlanner hook initialized
[DEBUG] useMealPlanner initial state: {mealPlan: null, loading: false, error: null}
[DEBUG] Today.jsx render - selectedDate: 2026-06-06, today: 2026-06-06, isToday: true
[DEBUG] Meal planner section rendering. mealPlan: null, showGenerateMealModal: false
[DEBUG] loadMealPlan called with date: 2026-06-06
[DEBUG] loadMealPlan user: user123abc...
[DEBUG] loadMealPlan dateStr: 2026-06-06
[DEBUG] loadMealPlan no plan found, setting to null
[DEBUG] Generate button clicked
[DEBUG] Current showGenerateMealModal: false
[DEBUG] mealPlanner.loading: false
[DEBUG] showGenerateMealModal changed to: true
```

Then the modal should appear on screen.

---

## What to Provide If Reporting Issue

If the modal still doesn't work, copy these from your console:
1. **All `[DEBUG]` messages** (right-click → Copy → Paste into issue)
2. **Any red error messages** (these are important!)
3. **Screenshot** of the console showing the logs
4. **What happened**: Did any logs appear? Which ones?

---

## Removing Debug Logging (Later)

Once the issue is fixed, you can remove the debug logging by:
1. Search for `console.log('[DEBUG]` in VSCode
2. Delete all those lines
3. Search for `console.log('[DEBUG]` to verify none remain
4. Rebuild with `npm run build`

But for now, **leave the logging in** to help diagnose the issue!
