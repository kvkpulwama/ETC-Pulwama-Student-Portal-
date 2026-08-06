const fs = require('fs');
let code = fs.readFileSync('src/pages/StudentAuthPage.tsx', 'utf8');

// Remove Google Button and Divider
code = code.replace(/\{\/\*\ Google Sign In Button \*\/\}(.|\n)*?<span className="bg-white px-2">Or with Email \/ Roll No<\/span>\n                <\/div>\n              <\/div>/, '');

fs.writeFileSync('src/pages/StudentAuthPage.tsx', code);
