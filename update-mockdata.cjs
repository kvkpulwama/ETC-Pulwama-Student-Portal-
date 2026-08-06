const fs = require('fs');
let code = fs.readFileSync('src/data/mockData.ts', 'utf8');

code = code.replace(/Organic Farming & Vermicomposting Certification/g, 'Departmental Trainings');

fs.writeFileSync('src/data/mockData.ts', code);
