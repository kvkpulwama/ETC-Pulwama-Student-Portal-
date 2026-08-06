const fs = require('fs');

const updateFile = (path) => {
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(/src="https:\/\/upload\.wikimedia\.org.*?_logo\.png"/g, 'src="/skuast-logo.png"');
  code = code.replace(/src="https:\/\/upload\.wikimedia\.org.*?ICAR_logo\.svg"/g, 'src="/icar-logo-hd.png"');
  code = code.replace(/src="\/skuast-emblem\.png"/g, 'src="/skuast-logo.png"');
  code = code.replace(/src="\/icar-logo\.png"/g, 'src="/icar-logo-hd.png"');
  
  fs.writeFileSync(path, code);
};

updateFile('src/components/Header.tsx');
updateFile('src/pages/AboutPage.tsx');

