import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

  try {
    console.log('Downloading SKUAST logo...');
    const viewSourceSkuast = await page.goto('https://upload.wikimedia.org/wikipedia/en/thumb/5/5c/Sher-e-Kashmir_University_of_Agricultural_Sciences_and_Technology_of_Kashmir_logo.png/220px-Sher-e-Kashmir_University_of_Agricultural_Sciences_and_Technology_of_Kashmir_logo.png');
    const bufferSkuast = await viewSourceSkuast.buffer();
    fs.writeFileSync('public/skuast-emblem.png', bufferSkuast);
    console.log('SKUAST logo downloaded successfully.');
  } catch(e) {
    console.log('Error SKUAST:', e);
  }

  try {
    console.log('Downloading ICAR logo...');
    const viewSourceIcar = await page.goto('https://upload.wikimedia.org/wikipedia/en/thumb/2/29/ICAR_logo.svg/220px-ICAR_logo.svg.png');
    const bufferIcar = await viewSourceIcar.buffer();
    fs.writeFileSync('public/icar-logo.png', bufferIcar);
    console.log('ICAR logo downloaded successfully.');
  } catch(e) {
    console.log('Error ICAR:', e);
  }
  
  await browser.close();
})();
