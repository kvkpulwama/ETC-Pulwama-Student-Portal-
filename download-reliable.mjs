import https from 'https';
import fs from 'fs';

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(dest))
           .on('finish', resolve)
           .on('error', reject);
      } else {
        reject(new Error(`Status: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
};

(async () => {
  try {
    await download('https://upload.wikimedia.org/wikipedia/en/5/5c/Sher-e-Kashmir_University_of_Agricultural_Sciences_and_Technology_of_Kashmir_logo.png', 'public/skuast-emblem.png');
    console.log('SKUAST success');
  } catch(e) { console.error('SKUAST fail', e); }
  
  try {
    await download('https://upload.wikimedia.org/wikipedia/en/2/29/ICAR_logo.svg', 'public/icar-logo.svg');
    console.log('ICAR success');
  } catch(e) { console.error('ICAR fail', e); }
})();
