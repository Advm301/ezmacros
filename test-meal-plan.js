const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Listen to console logs (where [DEBUG] messages go)
  page.on('console', msg => {
    if (msg.text().includes('[DEBUG]')) {
      console.log('LOG:', msg.text());
    }
  });

  // Navigate to app
  await page.goto('http://localhost:5173');
  console.log('✓ App loaded');

  // Wait for auth loading
  await page.waitForTimeout(2000);

  // Try to login (assumes test user exists)
  const emailInput = await page.$('input[type="email"]');
  if (emailInput) {
    console.log('✓ Found login form');
    // You would normally fill in test credentials here
  } else {
    console.log('✓ Already logged in or different state');
  }

  // Wait a bit and close
  await page.waitForTimeout(1000);
  await browser.close();
  console.log('✓ Test complete');
})().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
