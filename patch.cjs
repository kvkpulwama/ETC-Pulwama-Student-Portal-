const fs = require('fs');
let code = fs.readFileSync('src/pages/StudentDashboard.tsx', 'utf8');

const start = code.indexOf('{/* Quick Metrics Grid */}');
const end = code.indexOf('{/* Enrolled Course Card */}');

if (start !== -1 && end !== -1) {
  const newMetrics = `          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Academic Performance
              </span>
              <p className="text-2xl font-black text-slate-900">{student.cgpa}</p>
              <p className="text-[11px] text-emerald-700 font-semibold">Sem I & II Score</p>
            </div>
          </div>\n\n          `;
  
  code = code.substring(0, start) + newMetrics + code.substring(end);
  fs.writeFileSync('src/pages/StudentDashboard.tsx', code);
}
