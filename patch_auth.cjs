const fs = require('fs');
let code = fs.readFileSync('src/pages/StudentAuthPage.tsx', 'utf8');

code = code.replace(
  /await saveStudentProfileToSupabase\(newStudent\);/,
  "const saveRes = await saveStudentProfileToSupabase(newStudent);\n      if (!saveRes.success && saveRes.error !== 'Record saved locally') {\n        console.warn('Supabase Sync Failed:', saveRes.error);\n      }"
);

code = code.replace(
  /setRegSuccessMsg\(`Supabase Account Registration Successful! Assigned Roll No: \$\{formattedRoll\}`\);/,
  "setRegSuccessMsg(saveRes.success && saveRes.data ? `Supabase Account Registration Successful! Assigned Roll No: ${formattedRoll}` : `Offline Registration Successful (Supabase Sync Failed). Assigned Roll No: ${formattedRoll}`);"
);

fs.writeFileSync('src/pages/StudentAuthPage.tsx', code);
