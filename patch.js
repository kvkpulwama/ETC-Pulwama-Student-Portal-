import fs from 'fs';

// 1. Update mockData.ts
let mockData = fs.readFileSync('src/data/mockData.ts', 'utf8');
mockData = mockData.replace(
  "principalName: 'Dr. Ghulam Hassan Mir',",
  "principalName: 'Dr. Javeed Ahmad Mugloo',"
);
mockData = mockData.replace(
  "principalDesignation: 'Principal Training Officer & Joint Director (Extension)',",
  "principalDesignation: 'Prof. & Head',"
);
mockData = mockData.replace(
  "name: 'Dr. Ghulam Hassan Mir',",
  "name: 'Dr. Javeed Ahmad Mugloo',"
);
mockData = mockData.replace(
  "designation: 'Principal Training Officer',",
  "designation: 'Prof. & Head',"
);
mockData = mockData.replace(
  "qualification: 'Ph.D. in Horticulture (SKUAST-K)',",
  "qualification: 'Ph.D. in Agro-Forestry (SKUAST-K)',"
);
mockData = mockData.replace(
  "image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',",
  "image: '/prof-mugloo.jpg'," // Assuming users will upload it
);
fs.writeFileSync('src/data/mockData.ts', mockData);

// 2. Update HomePage.tsx
let homePage = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');
homePage = homePage.replace(
  "Principal & Head",
  "Prof. & Head"
);
fs.writeFileSync('src/pages/HomePage.tsx', homePage);

// 3. Update StudentIdCard.tsx
let idCard = fs.readFileSync('src/components/StudentIdCard.tsx', 'utf8');
idCard = idCard.replace(
  "Principal Training Officer",
  "Prof. & Head"
);
fs.writeFileSync('src/components/StudentIdCard.tsx', idCard);
