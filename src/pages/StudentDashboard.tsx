import React, { useState } from 'react';
import { StudentProfile, NavigationPage, StudentMark } from '../types';
import { DEMO_MARKS, DEMO_ASSIGNMENTS, DEMO_TIMETABLE } from '../data/mockData';
import { StudentIdCard } from '../components/StudentIdCard';
import { printStudentIdCard } from '../lib/idCardPrint';
import { RollNoSlipModal } from '../components/RollNoSlipModal';
import { CertificateModal } from '../components/CertificateModal';
import { EventsCalendar } from '../components/EventsCalendar';
import { 
  UserCircle, 
  Award, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Download, 
  Upload, 
  DollarSign, 
  Home as HomeIcon, 
  LogOut, 
  Printer, 
  Sparkles,
  ShieldCheck,
  Building,
  IdCard
} from 'lucide-react';

interface StudentDashboardProps {
  student: StudentProfile;
  onLogout: () => void;
  onNavigate: (page: NavigationPage) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  onLogout,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'idcard' | 'marksheet' | 'timetable' | 'assignments' | 'hostel' | 'calendar'
  >('overview');

  const [showRollNoModal, setShowRollNoModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [assignmentSubmitted, setAssignmentSubmitted] = useState<Record<string, boolean>>({});

  // FAB Print ID Card State & Handler
  const [isFabPrinting, setIsFabPrinting] = useState(false);
  const [fabPrintStatus, setFabPrintStatus] = useState<string>('');

  const handleFabPrint = async (sideToPrint: 'front' | 'back' | 'both' = 'both') => {
    setIsFabPrinting(true);
    setFabPrintStatus('Preparing ID Card for print...');
    try {
      const frontEl = document.getElementById('skuast-export-front') || document.getElementById('skuast-card-front');
      const backEl = document.getElementById('skuast-export-back') || document.getElementById('skuast-card-back');

      await printStudentIdCard(
        frontEl || 'skuast-export-front',
        sideToPrint,
        backEl || 'skuast-export-back',
        'card',
        student.name
      );
      setFabPrintStatus('Print dialog launched!');
      setTimeout(() => setFabPrintStatus(''), 4000);
    } catch (err) {
      console.error('Floating Print ID Card error:', err);
      setFabPrintStatus('Printing card...');
      setTimeout(() => setFabPrintStatus(''), 3000);
    } finally {
      setIsFabPrinting(false);
    }
  };

  const marksList: StudentMark[] = DEMO_MARKS[student.rollNumber] || [
    { subjectCode: 'BHT-11', subjectName: 'Principles of Temperate Fruit Production', maxMarks: 100, obtainedMarks: 88, grade: 'A+', status: 'Pass' },
    { subjectCode: 'BHT-12', subjectName: 'Plant Nursery & Canopy Management', maxMarks: 100, obtainedMarks: 91, grade: 'O', status: 'Pass' },
    { subjectCode: 'BHT-13', subjectName: 'Horticultural Entomology & Pathology', maxMarks: 100, obtainedMarks: 82, grade: 'A', status: 'Pass' },
    { subjectCode: 'BHT-21', subjectName: 'Commercial Vegetable Science & Greenhouse Tech', maxMarks: 100, obtainedMarks: 86, grade: 'A+', status: 'Pass' }
  ];

  const handleAssignmentUpload = (id: string) => {
    setAssignmentSubmitted((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Profile Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="relative shrink-0">
            <img
              src={student.photoUrl}
              alt={student.name}
              className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
            />
            <span className="absolute -bottom-2 -right-1 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full font-mono shadow">
              {student.bloodGroup}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 font-bold font-mono text-[10px] px-2 py-0.5 rounded">
                {student.rollNumber}
              </span>
              <span className="bg-emerald-950/80 text-emerald-200 text-[10px] px-2 py-0.5 rounded font-mono border border-emerald-700">
                {student.semester}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {student.name}
            </h1>

            <p className="text-xs text-emerald-300 font-semibold">{student.courseTitle}</p>
            <p className="text-[11px] text-slate-300">
              Session: {student.batchYear} • Reg No: {student.registrationNumber}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 border-emerald-800/80 pt-4 md:pt-0">
          <button
            onClick={() => setShowCertModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 border border-amber-300 hover:scale-105"
            title="Download official Course Completion Certificate"
          >
            <Award className="w-4 h-4 text-slate-950" />
            <span>Download Certificate</span>
          </button>

          <button
            onClick={() => setShowRollNoModal(true)}
            className="px-3.5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow border border-emerald-600 flex items-center gap-1.5"
            title="Download official Examination Hall Ticket PDF"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Roll No. Slip</span>
          </button>

          <button
            onClick={() => setActiveTab('idcard')}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all border border-white/20 flex items-center gap-1.5"
          >
            <IdCard className="w-4 h-4 text-amber-300" />
            <span>Student I-Card</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-red-300 hover:text-red-200 font-bold text-xs rounded-xl border border-red-900/50 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-1.5 overflow-x-auto text-xs font-bold">
        {[
          { id: 'overview', label: 'Overview & Stats', icon: <HomeIcon className="w-4 h-4" /> },
          { id: 'idcard', label: 'Student I-Card', icon: <IdCard className="w-4 h-4 text-amber-600" /> },
          { id: 'marksheet', label: 'Marksheet & Grades', icon: <Award className="w-4 h-4" /> },
          { id: 'calendar', label: 'Events Calendar', icon: <Calendar className="w-4 h-4 text-amber-500" /> },
          { id: "timetable", label: "Timetable", icon: <Calendar className="w-4 h-4" /> },
          { id: 'assignments', label: 'Assignments & Notes', icon: <FileText className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === tab.id
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
                    {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Academic Performance
              </span>
              <p className="text-2xl font-black text-slate-900">{student.cgpa}</p>
              <p className="text-[11px] text-emerald-700 font-semibold">Sem I & II Score</p>
            </div>
          </div>

          {/* Enrolled Course Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-800" />
                <h3 className="font-extrabold text-base text-slate-900">Enrolled Course Curriculum</h3>
              </div>
              <button
                onClick={() => onNavigate('courses')}
                className="text-xs text-emerald-800 font-bold hover:underline"
              >
                View Full Syllabus
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
              <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-slate-500 uppercase font-bold text-[10px] block">Current Phase</span>
                <p className="font-extrabold text-slate-900">{student.semester} - Field Practicals & Exams</p>
                <p className="text-[11px] text-slate-600">High-Density Apple Grafting & Canopy Management</p>
              </div>

              <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-slate-500 uppercase font-bold text-[10px] block">Department & Campus</span>
                <p className="font-extrabold text-slate-900">ETC Pulwama Main Orchard Block</p>
                <p className="text-[11px] text-slate-600">Koil Road, District Pulwama, J&K</p>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-base text-slate-900">Recent Activity Log</h3>
            </div>
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Logged into Student Portal</p>
                  <p className="text-[10px] text-slate-500">Today, just now</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-slate-300 shrink-0"></div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Viewed Semester I Marksheet</p>
                  <p className="text-[10px] text-slate-500">Yesterday, 10:45 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-slate-300 shrink-0"></div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Downloaded BHT-101 Syllabus PDF</p>
                  <p className="text-[10px] text-slate-500">3 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-slate-300 shrink-0"></div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Course Admission Approved by Admin</p>
                  <p className="text-[10px] text-slate-500">{student.enrollmentDate} (Initial Registration)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Digital Student ID Card (Always mounted so FAB can print from any view) */}
      <div className={activeTab === 'idcard' ? 'bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm' : 'hidden'} aria-hidden={activeTab !== 'idcard'}>
        <StudentIdCard student={student} />
      </div>

      {/* Tab 3: Marksheet & Grades */}
      {activeTab === 'marksheet' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Official Semester Marksheet</h3>
              <p className="text-xs text-slate-500">Subject-wise marks and grades issued by ETC Pulwama Examination Board.</p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Print Official Result Sheet</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium text-slate-700">
              <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">Code</th>
                  <th className="p-3">Subject Name</th>
                  <th className="p-3">Max Marks</th>
                  <th className="p-3">Obtained Marks</th>
                  <th className="p-3">Grade</th>
                  <th className="p-3 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {marksList.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900">{m.subjectCode}</td>
                    <td className="p-3 font-bold text-slate-900">{m.subjectName}</td>
                    <td className="p-3">{m.maxMarks}</td>
                    <td className="p-3 font-bold text-emerald-800">{m.obtainedMarks}</td>
                    <td className="p-3">
                      <span className="bg-amber-100 text-amber-900 font-extrabold font-mono px-2 py-0.5 rounded text-[10px]">
                        {m.grade}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        <span>{m.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Events & Training Calendar */}
      {activeTab === 'calendar' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <EventsCalendar />
        </div>
      )}

      {/* Tab 4: Timetable & Attendance */}
      {activeTab === 'timetable' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Weekly Schedule & Field Practicals</h3>
              <p className="text-xs text-slate-500">Lectures, laboratory exercises, and orchard field work schedule.</p>
            </div>
            
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEMO_TIMETABLE.map((item, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-emerald-800 uppercase font-mono">{item.day}</span>
                  <span className="text-slate-500 font-mono text-[11px]">{item.time}</span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">{item.subject}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200/80">
                  <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">{item.type}</span>
                  <span>Venue: {item.venue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Assignments */}
      {activeTab === 'assignments' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="font-extrabold text-lg text-slate-900">Assignments & Digital Submissions</h3>
            <p className="text-xs text-slate-500">View upcoming practical tasks and upload completed reports.</p>
          </div>

          <div className="space-y-4">
            {DEMO_ASSIGNMENTS.map((asg) => {
              const isDone = assignmentSubmitted[asg.id] || asg.status !== 'Pending';
              return (
                <div key={asg.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {asg.subject}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900">{asg.title}</h4>
                    <p className="text-xs text-slate-500">Due Date: <strong>{asg.dueDate}</strong></p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    {isDone ? (
                      <span className="px-3.5 py-1.5 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>{asg.marksObtained ? `Score: ${asg.marksObtained}` : 'Submitted'}</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAssignmentUpload(asg.id)}
                        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5 text-amber-300" />
                        <span>Upload Report PDF</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {showRollNoModal && (
        <RollNoSlipModal onClose={() => setShowRollNoModal(false)} loggedInStudent={student} />
      )}

      {showCertModal && (
        <CertificateModal 
          initialCourse={student.courseId?.toLowerCase().includes('bat') ? 'BAT' : 'BHT'}
          onClose={() => setShowCertModal(false)} 
          loggedInStudent={student} 
        />
      )}

      {/* Floating Action Button: Print ID Card */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 group">
        {/* Status Toast */}
        {fabPrintStatus && (
          <div className="bg-slate-900/95 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl border border-amber-400/50 flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{fabPrintStatus}</span>
          </div>
        )}

        {/* FAB Trigger Button & Hover Popover */}
        <div className="relative flex flex-col items-end">
          {/* Quick Side Selection Popover Menu */}
          <div className="hidden group-hover:flex group-focus-within:flex flex-col gap-1 mb-2 bg-slate-900/95 backdrop-blur-md p-2 rounded-2xl border border-emerald-500/30 shadow-2xl text-xs text-white transition-all">
            <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-300 font-mono">
              Print Format Options
            </div>
            <button
              onClick={() => handleFabPrint('both')}
              disabled={isFabPrinting}
              className="px-3 py-1.5 rounded-xl hover:bg-emerald-800/80 transition-colors text-left font-bold flex items-center justify-between gap-3 text-emerald-100"
            >
              <span>Both Sides (CR80)</span>
              <span className="text-[10px] font-mono text-amber-300 bg-emerald-950 px-1.5 py-0.5 rounded">2-Page</span>
            </button>
            <button
              onClick={() => handleFabPrint('front')}
              disabled={isFabPrinting}
              className="px-3 py-1.5 rounded-xl hover:bg-emerald-800/80 transition-colors text-left font-bold flex items-center justify-between gap-3 text-slate-200"
            >
              <span>Front Side Only</span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">1-Page</span>
            </button>
            <button
              onClick={() => handleFabPrint('back')}
              disabled={isFabPrinting}
              className="px-3 py-1.5 rounded-xl hover:bg-emerald-800/80 transition-colors text-left font-bold flex items-center justify-between gap-3 text-slate-200"
            >
              <span>Back Side Only</span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">1-Page</span>
            </button>
          </div>

          {/* Main Floating Button */}
          <button
            onClick={() => handleFabPrint('both')}
            disabled={isFabPrinting}
            className="px-5 py-3.5 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 hover:from-emerald-800 hover:to-teal-800 text-white font-black text-xs sm:text-sm rounded-full shadow-2xl border-2 border-amber-400/80 hover:border-amber-300 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer group-hover:shadow-emerald-900/50"
            title="Print Official SKUAST-K Student ID Card directly without leaving this view"
          >
            {isFabPrinting ? (
              <div className="w-5 h-5 border-2 border-amber-300 border-t-transparent rounded-full animate-spin shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                <Printer className="w-4 h-4" />
              </div>
            )}
            <div className="text-left">
              <div className="text-amber-300 uppercase tracking-widest text-[9px] font-mono leading-none">
                CR80 PVC Format
              </div>
              <div className="font-extrabold text-white text-xs sm:text-sm leading-tight flex items-center gap-1.5">
                <span>{isFabPrinting ? 'Preparing Card...' : 'Print ID Card'}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
