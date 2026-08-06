const fs = require('fs');
let code = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

// Remove Section 4 (Principal)
code = code.replace(/\{\/\*\ 4\.\ Principal \& Leadership Desk(.|\n)*?\/\*\ 5\.\ Featured Academic Programs Section \*\/\}/g, '{/* 5. Featured Academic Programs Section */}');

// Remove Section 6 and 7
code = code.replace(/\{\/\*\ 6\.\ Important Announcements \& Notice Board Section \*\/\}(.|\n)*?<\/div>\n  \);\n};\n/g, '    </div>\n  );\n};\n');

// Add logos above Eyebrow badge
code = code.replace(/\{\/\*\ Eyebrow Badge \*\/\}/g, `
          {/* Institution Logos */}
          <div className="flex items-center gap-4 pb-4">
            <div className="bg-white/90 p-2 rounded-xl backdrop-blur-sm border border-white/20">
              <img src="/skuast-logo.png" alt="SKUAST Kashmir" className="h-12 w-auto" />
            </div>
            <div className="bg-white/90 p-2 rounded-xl backdrop-blur-sm border border-white/20">
              <img src="/icar-logo.png" alt="ICAR" className="h-12 w-auto" />
            </div>
          </div>
          {/* Eyebrow Badge */}`);

fs.writeFileSync('src/pages/HomePage.tsx', code);
