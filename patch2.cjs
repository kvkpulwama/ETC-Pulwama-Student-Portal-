const fs = require('fs');
let code = fs.readFileSync('src/pages/StudentDashboard.tsx', 'utf8');

code = code.replace(/<span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">\s*Attendance: \{student.attendancePercentage\}%\s*<\/span>/, '');

code = code.replace(/\{ id: 'timetable', label: 'Timetable & Attendance', icon: <Calendar className="w-4 h-4" \/> \},/, '{ id: "timetable", label: "Timetable", icon: <Calendar className="w-4 h-4" /> },');

fs.writeFileSync('src/pages/StudentDashboard.tsx', code);
