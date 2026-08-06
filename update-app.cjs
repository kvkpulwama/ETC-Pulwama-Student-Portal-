const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove <NoticeTicker />
code = code.replace(/<NoticeTicker \/>\n/g, '');

fs.writeFileSync('src/App.tsx', code);
