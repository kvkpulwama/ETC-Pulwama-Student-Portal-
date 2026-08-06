const fs = require('fs');
let code = fs.readFileSync('src/pages/AboutPage.tsx', 'utf8');

code = code.replace(/src="\/skuast-emblem\.png"/g, 'src="https://upload.wikimedia.org/wikipedia/en/5/5c/Sher-e-Kashmir_University_of_Agricultural_Sciences_and_Technology_of_Kashmir_logo.png"');
code = code.replace(/src="\/icar-logo\.png"/g, 'src="https://upload.wikimedia.org/wikipedia/en/2/29/ICAR_logo.svg"');

fs.writeFileSync('src/pages/AboutPage.tsx', code);
