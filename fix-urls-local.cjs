const fs = require('fs');

const updateFile = (path) => {
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(/src="https:\/\/upload\.wikimedia\.org\/wikipedia\/en\/5\/5c\/Sher-e-Kashmir_University_of_Agricultural_Sciences_and_Technology_of_Kashmir_logo\.png"/g, 'src="/skuast-logo-final.jpg"');
  code = code.replace(/src="https:\/\/upload\.wikimedia\.org\/wikipedia\/en\/2\/29\/ICAR_logo\.svg"/g, 'src="/icar-logo-final.jpg"');
  fs.writeFileSync(path, code);
};

updateFile('src/components/Header.tsx');
updateFile('src/pages/AboutPage.tsx');
