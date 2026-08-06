const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');

// The original code uses an empty array:
//       // Base: Demo Students
//       [].forEach(s => {
//         if (s.email) studentMap.set(s.email.toLowerCase().trim(), s);
//       });

code = code.replace(/\/\/ Base: Demo Students\s*\[\]\.forEach\(s => \{\s*if \(s\.email\) studentMap\.set\(s\.email\.toLowerCase\(\)\.trim\(\), s\);\s*\}\);/, '');
fs.writeFileSync('src/pages/AdminPage.tsx', code);
