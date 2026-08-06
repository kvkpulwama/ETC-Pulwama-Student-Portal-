const fs = require('fs');

const updateFile = (path) => {
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(/src="\/skuast-logo-final\.jpg"/g, 'src="https://upload.wikimedia.org/wikipedia/en/5/5c/Sher-e-Kashmir_University_of_Agricultural_Sciences_and_Technology_of_Kashmir_logo.png"');
  code = code.replace(/src="\/icar-logo-final\.jpg"/g, 'src="https://upload.wikimedia.org/wikipedia/en/2/29/ICAR_logo.svg"');
  
  // Also replace any other leftover paths just in case
  code = code.replace(/src="\/skuast-logo\.png"/g, 'src="https://upload.wikimedia.org/wikipedia/en/5/5c/Sher-e-Kashmir_University_of_Agricultural_Sciences_and_Technology_of_Kashmir_logo.png"');
  code = code.replace(/src="\/icar-logo-hd\.png"/g, 'src="https://upload.wikimedia.org/wikipedia/en/2/29/ICAR_logo.svg"');

  fs.writeFileSync(path, code);
};

updateFile('src/components/Header.tsx');
updateFile('src/pages/AboutPage.tsx');
