import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function test() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });

  try {
    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const loginButton = await page.locator('text=Login with Google').isVisible().catch(() => false);
    if (loginButton) {
      console.log('App requires login - skipping full test');
      const initialScreenshot = path.join(__dirname, 'screenshot_login.png');
      await page.screenshot({ path: initialScreenshot });
      console.log(`Screenshot saved: ${initialScreenshot}`);
    } else {
      const todayTab = page.locator('button:has-text("Today")').first();
      if (await todayTab.isVisible()) {
        await todayTab.click();
        await page.waitForTimeout(1000);
      }

      const generateBtn = page.locator('button:has-text("Generate Meal Plan"), button:has-text("Generate New Plan")').first();
      if (await generateBtn.isVisible()) {
        console.log('Clicking generate meal plan button...');
        await generateBtn.click();
        await page.waitForTimeout(3000);
        
        const fillerSection = page.locator('text=Close Your Macro Gaps');
        const fillerVisible = await fillerSection.isVisible().catch(() => false);
        console.log(`Macro filler suggestions visible: ${fillerVisible}`);
      }

      const screenshotPath = path.join(__dirname, 'screenshot_meal_plan.png');
      await page.screenshot({ path: screenshotPath });
      console.log(`Screenshot saved: ${screenshotPath}`);
    }

    console.log('\n=== Console Logs ===');
    consoleLogs.forEach(log => console.log(log));

  } catch (error) {
    console.error('Test error:', error.message);
  } finally {
    await browser.close();
  }
}

test().catch(console.error);
