const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');

// Replace table headers
code = code.replace('<th className="px-6 py-3">Hostel & Stipend</th>\n                  <th className="px-6 py-3">Attendance / CGPA</th>', '<th className="px-6 py-3">CGPA</th>');

// Replace table cells (we'll just use string replacement or regex)
// We'll need to remove the td elements for these.
