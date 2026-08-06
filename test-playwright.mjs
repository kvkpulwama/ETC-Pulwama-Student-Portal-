import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(3000);
  
  const bodyText = await page.textContent('body');
  console.log("BODY TEXT:", bodyText.substring(0, 500));
  
  await browser.close();
})();
