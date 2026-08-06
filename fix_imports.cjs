const fs = require('fs');
const files = ['src/pages/AdminPage.tsx', 'src/pages/StudentAuthPage.tsx', 'src/components/RollNoSlipModal.tsx', 'src/App.tsx'];
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/import\s*\{\s*DEMO_STUDENTS\s*\}\s*from\s*['"]\.\.\/data\/mockData['"];/g, '');
  content = content.replace(/import\s*\{\s*DEMO_STUDENTS\s*\}\s*from\s*['"]\.\/data\/mockData['"];/g, '');
  content = content.replace(/,\s*DEMO_STUDENTS/g, '');
  content = content.replace(/DEMO_STUDENTS,\s*/g, '');
  
  // Replace usage of DEMO_STUDENTS
  content = content.replace(/DEMO_STUDENTS\.forEach/g, '[].forEach');
  content = content.replace(/setStudents\(DEMO_STUDENTS\)/g, 'setStudents([])');
  content = content.replace(/student = DEMO_STUDENTS\[0\]/g, 'student = null');
  content = content.replace(/\.\.\.DEMO_STUDENTS,/g, '');
  
  fs.writeFileSync(file, content);
}
