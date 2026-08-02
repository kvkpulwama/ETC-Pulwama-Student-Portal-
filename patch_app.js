import fs from 'fs';

let appTsx = fs.readFileSync('src/App.tsx', 'utf8');
appTsx = appTsx.replace(
  "const [currentPage, setCurrentPage] = useState<NavigationPage>('auth');",
  "const [currentPage, setCurrentPage] = useState<NavigationPage>('home');"
);
fs.writeFileSync('src/App.tsx', appTsx);
