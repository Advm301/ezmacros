# EZ Selector Debugging Guide

## Quick Debugging Steps

### 1. Open the App & Console
```
1. Go to http://localhost:5173 (or your dev server)
2. Press F12 to open Developer Tools
3. Click "Console" tab
4. Make sure console is visible
```

### 2. Watch for Initial Logs
When the page loads, you should see:
```
[DEBUG] Session check: logged in
[DEBUG] Setting user: your-email@example.com
[DEBUG] No session yet, skipping ez_level fetch  (OR found saved ez_level: 2)
```

If you see errors instead, the app isn't initializing correctly.

### 3. Test Button Click on Journal Tab
```
1. Make sure you're on "Journal" tab
2. Click the EZ selector button (top right, shows ⚡⚡ Easy)
3. In Console, you should see:
   [DEBUG] EZ selector button clicked. Current openGoalsModal: false Current ezLevel: 2
   [DEBUG] GoalsModal rendering with props: {goals: {...}, user: true, openGoalsModal: true}
```

If GoalsModal doesn't appear:
- Check if you see the "[DEBUG] GoalsModal rendering" message
- If not, openGoalsModal state isn't being set
- If yes but modal doesn't show, GoalsModal component has an error (scroll down in Console for red errors)

### 4. Test Button Click on Kitchen Tab
```
1. Navigate to "Kitchen" tab
2. Click the EZ selector button
3. In Console, you should see:
   [DEBUG] EZ selector button clicked. Current openGoalsModal: false Current ezLevel: 2
   [DEBUG] GoalsModal rendering with props: {goals: {...}, user: true, openGoalsModal: true}
4. Modal should appear (same as Journal tab)
```

If GoalsModal doesn't open:
- Verify you see the "[DEBUG] EZ selector button clicked" message
- If not, onClick handler isn't firing - check button CSS (z-index issue?)
- If yes but no modal, check for errors in Console

### 5. Test Modal Save
```
1. With GoalsModal open
2. Scroll to bottom and change EZ level (click "Effortless" or "Relaxed")
3. Click "Save Goals" button
4. In Console, look for:
   [DEBUG] GoalsModal onSave called with: {ez_level: 1, ...other fields}
   [DEBUG] Calling updateEzLevel with levelName: Effortless
   [DEBUG] Setting ezLevel to: 1
5. Modal should close and header button should update
```

If modal won't save:
- Check for red errors in Console (validation errors?)
- Verify all required fields are filled
- Check Network tab for failed API calls

### 6. Verify Kitchen Updates
```
1. After changing EZ level to Effortless (1)
2. Go to Kitchen tab
3. Kitchen should show "EZ Effortless certified" (was "EZ Easy certified")
4. Generate a recipe - should be simpler (max 3 steps, 5 min)
```

## Expected Console Output for Successful Flow

### On Page Load:
```
[DEBUG] Session check: logged in
[DEBUG] Setting user: user@example.com
[DEBUG] Fetched goals data: {ez_level: 2, ...}
[DEBUG] Found saved ez_level: 2
[DEBUG] Setting ezLevel to: 2
```

### On Button Click:
```
[DEBUG] EZ selector button clicked. Current openGoalsModal: false Current ezLevel: 2
[DEBUG] GoalsModal rendering with props: {goals: {...}, user: true, openGoalsModal: true}
```

### On Modal Save:
```
[DEBUG] GoalsModal onSave called with: {user_id: "...", ez_level: 1, ...}
[DEBUG] Calling updateEzLevel with levelName: Effortless
[DEBUG] Setting ezLevel to: 1
[DEBUG] GoalsModal onClose called
```

## What Each Log Means

| Log Message | Meaning | If Missing |
|---|---|---|
| `[DEBUG] Session check: logged in` | User is authenticated | Login required |
| `[DEBUG] Setting user:` | User object captured | Auth issue |
| `[DEBUG] No session yet...` | Waiting for session | Fetching from DB will be skipped |
| `[DEBUG] Found saved ez_level` | User has saved goals | First time user - using default (2) |
| `[DEBUG] EZ selector button clicked` | Button onClick fired | Button may be blocked by another element |
| `[DEBUG] GoalsModal rendering` | Component is being rendered | Check for JS errors |
| `[DEBUG] GoalsModal onSave called` | Form submission succeeded | Validation failed or form error |
| `[DEBUG] Calling updateEzLevel` | State conversion working | Received invalid levelName |
| `[DEBUG] Setting ezLevel to` | State updated successfully | updateEzLevel rejected the value |
| `[DEBUG] GoalsModal onClose called` | Modal close handler triggered | Close button broken? |

## Common Issues & Solutions

### "EZ selector button clicked" doesn't appear
- **Problem**: onClick handler not firing
- **Solution**:
  - Check CSS z-index - button might be hidden behind another element
  - Try clicking elsewhere on the button
  - Check if button style is set correctly

### "GoalsModal rendering" doesn't appear but button click did
- **Problem**: openGoalsModal state isn't changing
- **Solution**:
  - Check if setOpenGoalsModal is imported correctly
  - Look for React errors about hooks in Console

### GoalsModal appears but save doesn't work
- **Problem**: onSave callback failing
- **Solution**:
  - Look for red errors in Console
  - Check Network tab (F12 → Network) for failed API calls
  - Ensure all required fields are filled
  - Check if user object is valid

### Kitchen still shows "Effortless" after changing to "Easy"
- **Problem**: ezLevel state not updating or Kitchen reading old state
- **Solution**:
  - Check for "[DEBUG] Setting ezLevel to: 2" in console after save
  - Navigate away from Kitchen tab and back
  - Hard refresh browser (Ctrl+Shift+R)
  - Check if Kitchen is receiving the ezLevel prop: add to Kitchen.jsx:
    ```javascript
    console.log('[DEBUG] Kitchen received ezLevel:', ezLevel);
    ```

## Network Issues

Check the Network tab (F12 → Network):
- Look for red X marks (failed requests)
- Check the Supabase API calls:
  - Should be calling `goals` table
  - Response should show `ez_level` value
- If requests fail:
  - Check Supabase connection/API key
  - Verify user_id is correct
  - Check CORS errors

## If Nothing Works

1. **Clear browser cache**: Ctrl+Shift+Delete → Clear all
2. **Check browser console** for ANY red errors
3. **Restart dev server**: Stop and restart `npm run dev`
4. **Check Git commits**: Run `git log --oneline -10` to verify changes are committed
5. **Run `npm install`**: Dependencies might be out of sync
6. **Check Node version**: Should be 16+ (run `node --version`)

## To Remove Debug Logs Later

When everything is working, remove the debug logs:
```bash
git log --oneline -1  # Find commit hash
git revert HASH  # Or manually remove [DEBUG] lines
```
