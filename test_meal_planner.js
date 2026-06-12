const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function test() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capture console logs
  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });

  try {
    // Navigate to the app
    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Check if we need to log in
    const loginButton = await page.locator('text=Login with Google').isVisible().catch(() => false);
    if (loginButton) {
      console.log('App requires login - skipping full test');
      const initialScreenshot = path.join(__dirname, 'screenshot_login.png');
      await page.screenshot({ path: initialScreenshot });
      console.log(`Screenshot saved: ${initialScreenshot}`);
    } else {
      // Look for the Today tab and click it if needed
      const todayTab = page.locator('button:has-text("Today")').first();
      if (await todayTab.isVisible()) {
        await todayTab.click();
        await page.waitForTimeout(1000);
      }

      // Look for generate meal plan button
      const generateBtn = page.locator('button:has-text("Generate Meal Plan"), button:has-text("Generate New Plan")').first();
      if (await generateBtn.isVisible()) {
        console.log('Clicking generate meal plan button...');
        await generateBtn.click();
        
        // Wait for meal plan to generate (max 10 seconds)
        await page.waitForTimeout(3000);
        
        // Check if macro fillers section appeared
        const fillerSection = page.locator('text=Close Your Macro Gaps');
        const fillerVisible = await fillerSection.isVisible().catch(() => false);
        
        console.log(`Macro filler suggestions visible: ${fillerVisible}`);
      }

      // Take screenshot
      const screenshotPath = path.join(__dirname, 'screenshot_meal_plan.png');
      await page.screenshot({ path: screenshotPath });
      console.log(`Screenshot saved: ${screenshotPath}`);
    }

    // Print console logs
    console.log('\n=== Console Logs ===');
    consoleLogs.forEach(log => console.log(log));

  } catch (error) {
    console.error('Test error:', error.message);
  } finally {
    await browser.close();
  }
}

test().catch(console.error);
