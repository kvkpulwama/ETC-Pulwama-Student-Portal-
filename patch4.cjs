const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');

const regex = /<td className="px-6 py-3\.5">\s*<div className="space-y-1">\s*<div className="w-24 h-1\.5 bg-slate-200 rounded-full overflow-hidden">\s*<div\s*className="h-full bg-\[#005E38\] rounded-full"\s*><\/div>\s*<\/div>\s*<p className="text-\[10px\] text-slate-500 font-bold">CGPA: \{student\.cgpa\}<\/p>\s*<\/div>\s*<\/td>/;

code = code.replace(regex, `<td className="px-6 py-3.5"><p className="font-bold text-slate-900">{student.cgpa}</p></td>`);

fs.writeFileSync('src/pages/AdminPage.tsx', code);
