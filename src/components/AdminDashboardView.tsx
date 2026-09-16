import React from 'react';
import { StudentProfile } from '../types';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Award, 
  MapPin, 
  TrendingUp, 
  Sparkles,
  PieChart as PieIcon,
  Layers,
  CheckCircle2,
  Calendar,
  Download,
  FileSpreadsheet
} from 'lucide-react';

interface AdminDashboardViewProps {
  students: StudentProfile[];
  totalCount: number;
  bhtCount: number;
  batCount: number;
  shortTermCount: number;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  students,
  totalCount,
  bhtCount,
  batCount,
  shortTermCount
}) => {
  // 1. CSV Download of Entire Student Database
  const handleDownloadFullDatabaseCSV = () => {
    if (students.length === 0) {
      alert("No students in the database to download.");
      return;
    }

    const headers = [
      'Roll Number',
      'Registration No',
      'Full Name',
      'Father or Guardian Name',
      'Email Address',
      'Mobile Phone',
      'Emergency Contact',
      'Course ID',
      'Course Program Title',
      'Designation',
      'Academic Division / Department',
      'Blood Group',
      'Date of Birth',
      'Gender',
      'District',
      'Permanent Home Address',
      'Batch/Session Year',
      'Current Semester',
      'CGPA / Merit Score',
      'ID Card Validity'
    ];

    const escapeCSV = (val: any) => {
      if (val === undefined || val === null) return '""';
      let str = String(val).trim();
      str = str.replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = students.map(s => [
      escapeCSV(s.rollNumber),
      escapeCSV(s.registrationNumber),
      escapeCSV(s.name),
      escapeCSV(s.guardianName),
      escapeCSV(s.email),
      escapeCSV(s.phone),
      escapeCSV(s.emergencyContact),
      escapeCSV(s.courseId),
      escapeCSV(s.courseTitle),
      escapeCSV(s.designation),
      escapeCSV(s.division),
      escapeCSV(s.bloodGroup),
      escapeCSV(s.dateOfBirth),
      escapeCSV(s.gender),
      escapeCSV(s.district),
      escapeCSV(s.address),
      escapeCSV(s.batchYear),
      escapeCSV(s.semester),
      escapeCSV(s.cgpa),
      escapeCSV(s.validUpto)
    ]);

    // Use standard CSV carriage return + line feed for cross-platform excel support
    const csvString = [headers.join(','), ...rows.map(row => row.join(','))].join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ETC_Pulwama_Complete_Student_Database_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 2. Calculate Gender Ratio
  const maleCount = students.filter(s => s.gender?.toLowerCase() === 'male').length;
  const femaleCount = students.filter(s => s.gender?.toLowerCase() === 'female').length;
  const otherGenderCount = totalCount - maleCount - femaleCount;

  const malePercent = totalCount > 0 ? Math.round((maleCount / totalCount) * 100) : 0;
  const femalePercent = totalCount > 0 ? Math.round((femaleCount / totalCount) * 100) : 0;

  // 2. Aggregate District Distribution
  const districtCounts: Record<string, number> = {};
  students.forEach((s) => {
    let dist = s.district?.trim();
    if (!dist && s.address) {
      const J_K_DISTRICTS = [
        'Pulwama', 'Srinagar', 'Budgam', 'Anantnag', 'Baramulla', 
        'Kupwara', 'Ganderbal', 'Shopian', 'Kulgam', 'Bandipora', 
        'Pampore', 'Tral', 'Awantipora', 'Sopore', 'Jammu'
      ];
      for (const d of J_K_DISTRICTS) {
        if (s.address.toLowerCase().includes(d.toLowerCase())) {
          dist = d === 'Pampore' || d === 'Tral' || d === 'Awantipora' ? 'Pulwama' : d;
          break;
        }
      }
    }
    if (!dist) dist = 'Other District';
    // Titlecase
    dist = dist.charAt(0).toUpperCase() + dist.slice(1).toLowerCase();
    districtCounts[dist] = (districtCounts[dist] || 0) + 1;
  });

  const sortedDistricts = Object.entries(districtCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Max district count for calculating percentage bars
  const maxDistrictCount = sortedDistricts.length > 0 ? Math.max(...sortedDistricts.map(d => d.count)) : 1;

  // 3. Batch Distribution
  const batchCounts: Record<string, number> = {};
  students.forEach(s => {
    const b = s.batchYear || '2025 - 2026';
    batchCounts[b] = (batchCounts[b] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Dashboard Control Deck Header & CSV Export */}
      <div className="bg-[#005E38]/5 border border-[#005E38]/15 p-5 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-serif font-black text-[#005E38] tracking-tight">
            ETC COMMAND DECK &amp; ANALYTICAL METRICS
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Real-time visual tracking of trainees, regional outreach statistics, program capacities, and secure database exports.
          </p>
        </div>
        <button
          onClick={handleDownloadFullDatabaseCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#005E38] hover:bg-[#004d2e] active:scale-[0.98] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
          <span>Download Database (CSV)</span>
          <Download className="w-3.5 h-3.5 text-white/80 border-l border-white/20 pl-1" />
        </button>
      </div>

      {/* Overview Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-emerald-100/80 text-[#005E38] rounded-xl shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 leading-tight">{totalCount}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Enrolled</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-amber-100/80 text-amber-900 rounded-xl shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 leading-tight">{bhtCount}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">BHT Diploma</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-blue-100/80 text-blue-900 rounded-xl shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 leading-tight">{batCount}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">BAT Diploma</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-purple-100/80 text-purple-900 rounded-xl shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 leading-tight">{shortTermCount}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Short-Term/Others</p>
          </div>
        </div>
      </div>

      {/* Main Analytical Visual Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Course Enrollment Breakdown: Flagship visual bar charts */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <h3 className="font-serif font-black text-slate-900 text-sm tracking-tight uppercase">
                Enrollments Distribution &amp; Capacity
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-emerald-600" /> Flagship Programs
            </span>
          </div>

          <div className="space-y-6">
            {/* 1. Basic Horticulture Training (BHT) Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5 text-slate-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  Basic Horticulture Training (BHT)
                </span>
                <span className="font-mono text-slate-900">
                  {bhtCount} <span className="text-slate-400 font-normal">/ 40 Seats Filled</span>
                </span>
              </div>
              <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40">
                <div 
                  className="absolute top-0 left-0 h-full bg-amber-400 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                  style={{ width: `${Math.min((bhtCount / 40) * 100, 100)}%` }}
                >
                  {bhtCount > 3 && (
                    <span className="text-[8.5px] font-black text-amber-950 font-mono">
                      {Math.round((bhtCount / 40) * 100)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                <span>0</span>
                <span>20 (Half Capacity)</span>
                <span>40 (Max Intake)</span>
              </div>
            </div>

            {/* 2. Basic Agriculture Training (BAT) Bar */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5 text-slate-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  Basic Agriculture Training (BAT)
                </span>
                <span className="font-mono text-slate-900">
                  {batCount} <span className="text-slate-400 font-normal">/ 40 Seats Filled</span>
                </span>
              </div>
              <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40">
                <div 
                  className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                  style={{ width: `${Math.min((batCount / 40) * 100, 100)}%` }}
                >
                  {batCount > 3 && (
                    <span className="text-[8.5px] font-black text-white font-mono">
                      {Math.round((batCount / 40) * 100)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                <span>0</span>
                <span>20 (Half Capacity)</span>
                <span>40 (Max Intake)</span>
              </div>
            </div>

            {/* 3. Short-Term & Other Certificate Courses Bar */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5 text-slate-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  Short-Term Certificate Programs (Mushroom, Beekeeping, etc.)
                </span>
                <span className="font-mono text-slate-900">
                  {shortTermCount} <span className="text-slate-400 font-normal">Registered</span>
                </span>
              </div>
              <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40">
                <div 
                  className="absolute top-0 left-0 h-full bg-purple-500 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                  style={{ width: `${totalCount > 0 ? Math.min((shortTermCount / totalCount) * 100, 100) : 0}%` }}
                >
                  {shortTermCount > 0 && totalCount > 0 && (
                    <span className="text-[8.5px] font-black text-white font-mono">
                      {Math.round((shortTermCount / totalCount) * 100)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                <span>0% Share</span>
                <span>50% Share</span>
                <span>100% Share</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/60 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Dynamic visual bars represent actual active registrations.
            </span>
            <div className="flex items-center gap-4 text-[10.5px] font-black uppercase tracking-wider">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> BHT</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> BAT</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> SHORT-TERM</span>
            </div>
          </div>
        </div>

        {/* Demographics Ratio - Gender & Interactive Stats */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <PieIcon className="w-4 h-4 text-emerald-700" />
              <h3 className="font-serif font-black text-slate-900 text-sm tracking-tight uppercase">
                Gender Composition
              </h3>
            </div>

            {totalCount === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-bold">
                No trainee records found to compute demographics.
              </div>
            ) : (
              <div className="space-y-6 py-2">
                {/* Visual Comparative Split Bar */}
                <div className="relative h-8 w-full bg-slate-100 rounded-2xl overflow-hidden flex border border-slate-200/50">
                  {maleCount > 0 && (
                    <div 
                      className="bg-sky-500 h-full flex items-center justify-center text-white text-[10px] font-black transition-all duration-1000"
                      style={{ width: `${malePercent}%` }}
                    >
                      {malePercent >= 15 ? `Male ${malePercent}%` : `${malePercent}%`}
                    </div>
                  )}
                  {femaleCount > 0 && (
                    <div 
                      className="bg-rose-400 h-full flex items-center justify-center text-white text-[10px] font-black transition-all duration-1000 border-l border-white/20"
                      style={{ width: `${femalePercent}%` }}
                    >
                      {femalePercent >= 15 ? `Female ${femalePercent}%` : `${femalePercent}%`}
                    </div>
                  )}
                  {otherGenderCount > 0 && (
                    <div 
                      className="bg-slate-400 h-full flex items-center justify-center text-white text-[10px] font-black transition-all duration-1000 border-l border-white/20"
                      style={{ width: `${100 - malePercent - femalePercent}%` }}
                    >
                      Other
                    </div>
                  )}
                </div>

                {/* Legend details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-sky-50/50 p-3 rounded-xl border border-sky-100/50 text-center space-y-1">
                    <p className="text-xs font-bold text-sky-900">Male Trainees</p>
                    <p className="text-xl font-black text-sky-950">{maleCount}</p>
                    <p className="text-[10px] font-bold text-sky-600 uppercase tracking-widest">{malePercent}% Ratio</p>
                  </div>

                  <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100/50 text-center space-y-1">
                    <p className="text-xs font-bold text-rose-900">Female Trainees</p>
                    <p className="text-xl font-black text-rose-950">{femaleCount}</p>
                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">{femalePercent}% Ratio</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 text-[10px] font-black uppercase tracking-wider rounded-lg">
              <TrendingUp className="w-3 h-3 text-amber-600" />
              Empowering J&amp;K Youth in Agri-sectors
            </span>
          </div>
        </div>
      </div>

      {/* District & Location Distribution Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <h3 className="font-serif font-black text-slate-900 text-sm tracking-tight uppercase">
              District/Regional Distribution
            </h3>
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider font-mono">
            {sortedDistricts.length} Distinct Regions Represented
          </span>
        </div>

        {sortedDistricts.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs font-bold">
            No district demographics recorded. Add student address or district details.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column of District list */}
            <div className="space-y-4">
              {sortedDistricts.slice(0, Math.ceil(sortedDistricts.length / 2)).map((dist, index) => {
                const percent = Math.round((dist.count / totalCount) * 100);
                const progressWidth = (dist.count / maxDistrictCount) * 100;
                return (
                  <div key={dist.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-emerald-50 text-emerald-800 font-mono font-black text-[10px] flex items-center justify-center shadow-xs">
                          {index + 1}
                        </span>
                        {dist.name}
                      </span>
                      <span className="font-mono text-slate-900">
                        {dist.count} {dist.count === 1 ? 'student' : 'students'}{' '}
                        <span className="text-slate-400 font-normal">({percent}%)</span>
                      </span>
                    </div>
                    <div className="relative h-3 bg-slate-50 rounded-full border border-slate-100">
                      <div 
                        className="absolute top-0 left-0 h-full bg-emerald-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressWidth}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column of District list */}
            <div className="space-y-4">
              {sortedDistricts.slice(Math.ceil(sortedDistricts.length / 2)).map((dist, index) => {
                const globalIndex = index + Math.ceil(sortedDistricts.length / 2);
                const percent = Math.round((dist.count / totalCount) * 100);
                const progressWidth = (dist.count / maxDistrictCount) * 100;
                return (
                  <div key={dist.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-emerald-50 text-emerald-800 font-mono font-black text-[10px] flex items-center justify-center shadow-xs">
                          {globalIndex + 1}
                        </span>
                        {dist.name}
                      </span>
                      <span className="font-mono text-slate-900">
                        {dist.count} {dist.count === 1 ? 'student' : 'students'}{' '}
                        <span className="text-slate-400 font-normal">({percent}%)</span>
                      </span>
                    </div>
                    <div className="relative h-3 bg-slate-50 rounded-full border border-slate-100">
                      <div 
                        className="absolute top-0 left-0 h-full bg-emerald-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressWidth}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
