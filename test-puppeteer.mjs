import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({ 
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
    
    console.log("Navigating...");
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    console.log("BODY HTML length:", bodyHTML.length);
    if (bodyHTML.length < 1000) {
       console.log("BODY HTML:", bodyHTML);
    }
    
    await browser.close();
  } catch(e) {
    console.error(e);
  }
})();
