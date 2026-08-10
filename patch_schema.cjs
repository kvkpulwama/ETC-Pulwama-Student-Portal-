const fs = require('fs');

let security = fs.readFileSync('src/lib/security.ts', 'utf8');
security = security.replace(
  /date_of_birth TEXT DEFAULT '2004-01-01',/,
  "date_of_birth TEXT DEFAULT '2004-01-01',\n  qualification TEXT,\n  enrollment_date TEXT,\n  status TEXT,"
);
fs.writeFileSync('src/lib/security.ts', security);

let supabase = fs.readFileSync('src/lib/supabase.ts', 'utf8');
supabase = supabase.replace(
  /address: student.address,/,
  "address: student.address,\n      qualification: student.qualification,\n      enrollment_date: student.enrollmentDate,\n      status: student.status,"
);
fs.writeFileSync('src/lib/supabase.ts', supabase);
