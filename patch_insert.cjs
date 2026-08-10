const fs = require('fs');

let supabase = fs.readFileSync('src/lib/supabase.ts', 'utf8');
supabase = supabase.replace(
  /course_id: student\.courseId,/,
  "course_id: student.courseId,\n        qualification: student.qualification,\n        enrollment_date: student.enrollmentDate,\n        status: student.status,"
);
fs.writeFileSync('src/lib/supabase.ts', supabase);
