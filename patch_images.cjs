const fs = require('fs');

let header = fs.readFileSync('src/components/Header.tsx', 'utf8');
header = header.replace(/src="\/skuast-logo-final\.(png|jpg)"/g, 'src="/skuast-logo-final.jpg"');
fs.writeFileSync('src/components/Header.tsx', header);

let about = fs.readFileSync('src/pages/AboutPage.tsx', 'utf8');
about = about.replace(/src="\/skuast-logo-final\.(png|jpg)"/g, 'src="/skuast-logo-final.jpg"');
fs.writeFileSync('src/pages/AboutPage.tsx', about);

let home = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');
home = home.replace(/bg-\[url\('\/campus_banner_kashmir\.jpg'\)\]/g, "bg-[url('/home.jpg')]");
fs.writeFileSync('src/pages/HomePage.tsx', home);
