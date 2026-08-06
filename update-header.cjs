const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace(/import skuastEmblemImg from '\.\.\/assets\/images\/skuast-emblem\.png';/g, '');
code = code.replace(/import icarLogoImg from '\.\.\/assets\/images\/icar-logo\.png';/g, '');

code = code.replace(/src=\{skuastEmblemImg\}/g, 'src="/skuast-emblem.png"');
code = code.replace(/src=\{icarLogoImg\}/g, 'src="/icar-logo.png"');

fs.writeFileSync('src/components/Header.tsx', code);
