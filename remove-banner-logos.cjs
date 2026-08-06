const fs = require('fs');
let code = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

code = code.replace(/\{\/\*\ Logos \*\/\}[\s\S]*?<\/div>\n          <\/div>/g, '');
fs.writeFileSync('src/pages/HomePage.tsx', code);
