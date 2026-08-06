const fs = require('fs');

const updateFile = (path) => {
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(/src="\/skuast-logo\.png"/g, 'src="/skuast-logo-final.jpg"');
  code = code.replace(/src="\/icar-logo-hd\.png"/g, 'src="/icar-logo-final.jpg"');
  code = code.replace(/src="\/prof-mugloo\.png"/g, 'src="/prof-mugloo-final.jpg"');
  fs.writeFileSync(path, code);
};

updateFile('src/components/Header.tsx');
updateFile('src/pages/AboutPage.tsx');

let mockData = fs.readFileSync('src/data/mockData.ts', 'utf8');
mockData = mockData.replace(/'\/prof-mugloo\.png'/g, "'/prof-mugloo-final.jpg'");
fs.writeFileSync('src/data/mockData.ts', mockData);
