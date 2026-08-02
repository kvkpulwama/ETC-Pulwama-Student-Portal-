import fs from 'fs';
let file = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');

// Add Supabase import
file = file.replace(
  "import { \n  auth, ",
  "import { supabase } from '../lib/supabase';\nimport { \n  auth, "
);

// Update fetchAllStudents
const fetchRegex = /const fetchAllStudents = async \(\) => \{[\s\S]*?\}\;/;
const newFetch = `const fetchAllStudents = async () => {
    setIsLoadingStudents(true);
    try {
      // Fetch from Supabase
      const { data: supabaseStudents, error } = await supabase.from('students').select('*');
      
      if (error) {
        console.warn('Supabase fetch error:', error);
      }
      
      const studentsList: StudentProfile[] = (supabaseStudents || []).map(row => ({
        id: row.id,
        rollNumber: row.roll_number,
        registrationNumber: \`JK-ETC-2026-\${Math.floor(1000 + Math.random() * 9000)}\`, // Mocked since not in table
        name: row.name,
        email: row.email,
        phone: row.phone || '',
        guardianName: row.guardian_name || 'Guardian',
        address: row.address || 'J&K',
        courseId: row.course_id || 'bht-101',
        courseTitle: COURSES.find(c => c.id === row.course_id)?.title || 'Basic Horticulture Training Course (BHT)',
        batchYear: row.batch_year || '2026 - 2027',
        gender: 'Male',
        dateOfBirth: '2004-01-15',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        bloodGroup: 'A +ve',
        attendancePercentage: 100,
        cgpa: 'Enrolled (Semester I)',
        hostelStatus: 'Under Verification',
        stipendStatus: 'Application Registered',
        semester: 'Semester I'
      }));

      // Combine with local mock/firestore as fallback if needed, but lets just use Supabase to keep it clean, and add DEMO if empty
      setStudents(studentsList.length > 0 ? studentsList : DEMO_STUDENTS);
    } catch (err) {
      console.warn("Failed fetching students list:", err);
      setStudents(DEMO_STUDENTS);
    } finally {
      setIsLoadingStudents(false);
    }
  };`;
file = file.replace(fetchRegex, newFetch);


// Update handleSaveStudent
const saveRegex = /\/\/ 1\. Save to Firestore[\s\S]*?setStudents\(prev => \{/s;
const newSave = `// 1. Save to Supabase
    try {
      const { error } = await supabase.from('students').upsert({
        id: updatedStudent.id,
        roll_number: updatedStudent.rollNumber,
        name: updatedStudent.name,
        email: updatedStudent.email,
        phone: updatedStudent.phone,
        guardian_name: updatedStudent.guardianName,
        address: updatedStudent.address,
        course_id: updatedStudent.courseId,
        batch_year: updatedStudent.batchYear,
        district: 'Pulwama'
      });
      if (error) console.warn('Supabase upsert error:', error);
    } catch (sbErr) {
      console.warn('Supabase Error:', sbErr);
    }

    // 2. Update Local State
    setStudents(prev => {`;
file = file.replace(saveRegex, newSave);

const deleteRegex = /\/\/ 1\. Delete from Firestore[\s\S]*?await deleteStudentFromFirestore\(student\.id\);/s;
const newDelete = `// 1. Delete from Supabase
    try {
      const { error } = await supabase.from('students').delete().eq('id', student.id);
      if (error) console.warn('Supabase delete error:', error);
    } catch (sbErr) {
      console.warn('Supabase Error:', sbErr);
    }`;
file = file.replace(deleteRegex, newDelete);

fs.writeFileSync('src/pages/AdminPage.tsx', file);
