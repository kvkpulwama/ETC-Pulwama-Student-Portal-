import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { COURSES } from '../data/mockData';
import { 
  Mail, 
  Send, 
  Users, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Search, 
  AlertTriangle, 
  FileText, 
  Sparkles, 
  ArrowRight,
  Info,
  Layers,
  CheckCircle2,
  Trash2
} from 'lucide-react';

interface BulkAnnouncementViewProps {
  students: StudentProfile[];
}

interface SentHistoryItem {
  id: string;
  subject: string;
  body: string;
  category: string;
  targetCourseId: string;
  targetCourseLabel: string;
  recipientCount: number;
  timestamp: string;
  status: 'sent' | 'sending' | 'failed';
}

const TEMPLATES = [
  {
    id: 'exam',
    name: '📚 Examination Notice',
    subject: 'IMPORTANT: Announcement of Term-End Theoretical and Practical Examinations',
    body: `Dear Trainee,

This is to formally inform you that the Term-End Theoretical and Practical Examinations for the current academic term have been scheduled to commence shortly. 

Kindly review your Roll Number Slip and Exam Timetable on the Student Dashboard. 

Important guidelines to follow:
1. Carrying a printed copy of your official SKUAST-K Student Identity Card is MANDATORY.
2. Please report to the examination hall 30 minutes prior to the scheduled time.
3. Any electronic devices, including smartwatches and phones, are strictly prohibited.

We wish you the very best of luck in your preparations.

Regards,
Controller of Examinations
Extension Training Centre, Malangpora Pulwama
SKUAST Kashmir`
  },
  {
    id: 'holiday',
    name: '🌾 Harvest Festival Circular',
    subject: 'NOTICE: Annual Apple Harvest & Grading Festival Participation',
    body: `Dear Trainee,

We are delighted to announce that the Annual Apple Harvest and Grading Festival is scheduled to be held on campus in the main exhibition grounds.

As part of your course practical curriculum, participation in this festival is compulsory. Trainees will be graded on high-density apple selection, grading precision, and modern packing demonstrations.

Date: September 28, 2026
Venue: Main Exhibition Grounds, ETC Pulwama

Please coordinate with your respective batch leaders to collect presentation materials.

Regards,
Program Coordinator
Extension Training Centre (ETC), Malangpora`
  },
  {
    id: 'stipend',
    name: '💰 Stipend Release & Attendance Alert',
    subject: 'ALERT: Stipend Release Compliance & Minimum Attendance Requirement',
    body: `Dear Trainee,

This is a reminder regarding the monthly stipend disbursement of Rs. 1,500/- for government-sponsored candidates.

Please note that as per SKUAST-K guidelines, the release of your monthly stipend is strictly contingent upon:
1. Maintaining a minimum of 85% attendance across all theoretical and field practical sessions.
2. Satisfactory conduct in the hostels and orchards.
3. Timely submission of field assignments.

Trainees with short attendance must immediately report to the office of the Director with a valid explanation.

Regards,
Administrative Desk
ETC Malangpora Pulwama`
  }
];

export const BulkAnnouncementView: React.FC<BulkAnnouncementViewProps> = ({ students }) => {
  const [targetCourse, setTargetCourse] = useState<string>('all');
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [category, setCategory] = useState<string>('academic');
  const [sendEmailCopy, setSendEmailCopy] = useState<boolean>(true);
  const [publishToFeed, setPublishToFeed] = useState<boolean>(true);

  // Sending progress simulation state
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendingProgress, setSendingProgress] = useState<number>(0);
  const [sendingRecipients, setSendingRecipients] = useState<StudentProfile[]>([]);
  const [currentSendingName, setCurrentSendingName] = useState<string>('');
  const [successfullySentCount, setSuccessfullySentCount] = useState<number>(0);

  // History state
  const [history, setHistory] = useState<SentHistoryItem[]>(() => {
    const cached = localStorage.getItem('etc_sent_announcements');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { return []; }
    }
    return [
      {
        id: 'hist-1',
        subject: 'IMPORTANT: Mid-Semester Theoretical Examination Dates Sheet Released',
        body: 'Dear Trainees, please note that the Mid-Semester exams for BHT & BAT courses start on September 22, 2026. Hall tickets are available in the dashboard.',
        category: 'exam',
        targetCourseId: 'all',
        targetCourseLabel: 'All Registered Courses',
        recipientCount: students.length || 15,
        timestamp: '2026-09-14 11:30 AM',
        status: 'sent'
      },
      {
        id: 'hist-2',
        subject: 'Circular: Mandatory Field Practical Dress Code Guidelines',
        body: 'Trainees are advised to carry their respective laboratory coats and wear appropriate security boots during orchard and polyhouse practical exercises.',
        category: 'academic',
        targetCourseId: 'bht-101',
        targetCourseLabel: 'One Year Basic Horticulture Training Course (BHT)',
        recipientCount: students.filter(s => s.courseId === 'bht-101').length || 8,
        timestamp: '2026-09-15 02:15 PM',
        status: 'sent'
      }
    ];
  });

  const getFilteredRecipients = () => {
    if (targetCourse === 'all') {
      return students;
    }
    return students.filter(student => student.courseId === targetCourse);
  };

  const matchedRecipients = getFilteredRecipients();

  const applyTemplate = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setBody(template.body);
    }
  };

  const handleSendAnnouncements = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) {
      alert('Please fill out both the Subject and Body of the announcement.');
      return;
    }

    if (matchedRecipients.length === 0) {
      alert('No students match the chosen course. Please select a different filter.');
      return;
    }

    // Start Sending Simulation
    setIsSending(true);
    setSendingProgress(0);
    setSuccessfullySentCount(0);
    setSendingRecipients(matchedRecipients);

    const targetCourseLabel = targetCourse === 'all' 
      ? 'All Enrolled Courses' 
      : COURSES.find(c => c.id === targetCourse)?.title || targetCourse;

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    // Chunked progress simulation to look realistic and high-fidelity
    for (let i = 0; i < matchedRecipients.length; i++) {
      const recipient = matchedRecipients[i];
      setCurrentSendingName(`${recipient.name} (${recipient.email || recipient.rollNumber})`);
      setSendingProgress(Math.round(((i + 1) / matchedRecipients.length) * 100));
      setSuccessfullySentCount(i + 1);
      await delay(250); // realistic network delay per student
    }

    // Done sending
    const newHistoryItem: SentHistoryItem = {
      id: `ann-${Date.now()}`,
      subject,
      body,
      category,
      targetCourseId: targetCourse,
      targetCourseLabel,
      recipientCount: matchedRecipients.length,
      timestamp: new Date().toLocaleString('en-US', { hour12: true }),
      status: 'sent'
    };

    const updatedHistory = [newHistoryItem, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('etc_sent_announcements', JSON.stringify(updatedHistory));

    // Simultaneously publish to global announcements feed
    if (publishToFeed) {
      const currentFeed = JSON.parse(localStorage.getItem('etc_announcements_feed') || '[]');
      const newFeedItem = {
        id: `feed-${Date.now()}`,
        title: subject,
        content: body,
        date: '2026-09-16', // current system date
        courseId: targetCourse,
        category: category === 'exam' ? 'Exam Notice' : category === 'urgent' ? 'Urgent Alert' : 'General Notice',
        badgeColor: category === 'urgent' ? 'red' : category === 'exam' ? 'amber' : 'emerald'
      };
      localStorage.setItem('etc_announcements_feed', JSON.stringify([newFeedItem, ...currentFeed]));
    }

    setIsSending(false);
    alert(`Successfully broadcasted announcement & sent ${matchedRecipients.length} emails!`);
    
    // Clear form
    setSubject('');
    setBody('');
  };

  const handleDeleteHistory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement history log?')) {
      const filtered = history.filter(h => h.id !== id);
      setHistory(filtered);
      localStorage.setItem('etc_sent_announcements', JSON.stringify(filtered));
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#00482B] via-[#005E38] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 bg-emerald-950 text-amber-300 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-emerald-700/60 tracking-wider">
            <Mail className="w-3.5 h-3.5 animate-pulse" />
            <span>BULK EMAIL BROADCRAFTER</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Administrative Bulk Mail & Notification Portal
          </h2>
          <p className="text-xs text-emerald-100 leading-relaxed">
            Draft academic announcements, exam schedules, or hostel alerts. Send targeted emails directly to specific trainee courses or publish campus-wide circulars.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Draft Form (7 Columns) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-800" />
              <span>Compose Targeted Broadcast</span>
            </h3>

            {/* Quick Templates Dropdown */}
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    applyTemplate(e.target.value);
                    e.target.value = ''; // Reset selector
                  }
                }}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-extrabold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-800"
              >
                <option value="">⚡ Load Quick Template...</option>
                {TEMPLATES.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <form onSubmit={handleSendAnnouncements} className="space-y-4">
            
            {/* Target Course and Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-slate-700 font-bold text-xs">
                  Target Trainee Group <span className="text-red-500">*</span>
                </label>
                <select
                  value={targetCourse}
                  onChange={(e) => setTargetCourse(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-800"
                >
                  <option value="all">All Enrolled Courses ({students.length} Recipient(s))</option>
                  {COURSES.map(course => {
                    const count = students.filter(s => s.courseId === course.id).length;
                    return (
                      <option key={course.id} value={course.id}>
                        {course.title} ({count} Recipient(s))
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700 font-bold text-xs">
                  Notice Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-800"
                >
                  <option value="academic">Academic Circular</option>
                  <option value="exam">Examination Notice</option>
                  <option value="urgent">Urgent Alert</option>
                  <option value="hostel">Hostel & Accommodation</option>
                </select>
              </div>
            </div>

            {/* Email Subject / Title */}
            <div className="space-y-1">
              <label className="block text-slate-700 font-bold text-xs">
                Email Subject Line <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. IMPORTANT: Release of Semester Term-End Examination Timetable"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>

            {/* Email Content / Body */}
            <div className="space-y-1">
              <label className="block text-slate-700 font-bold text-xs flex justify-between">
                <span>Announcement Message Body <span className="text-red-500">*</span></span>
                <span className="text-[10px] text-slate-400 font-medium">Text and structured lists supported</span>
              </label>
              <textarea
                required
                rows={10}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write clear, professional guidelines for your trainees..."
                className="w-full px-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 font-sans focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>

            {/* Channels & Action Buttons */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">Select Delivery Channels</h4>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendEmailCopy}
                    onChange={(e) => setSendEmailCopy(e.target.checked)}
                    className="rounded text-emerald-800 focus:ring-emerald-800 w-4 h-4"
                  />
                  <span className="text-xs font-bold text-slate-700">Send direct Email copies</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={publishToFeed}
                    onChange={(e) => setPublishToFeed(e.target.checked)}
                    className="rounded text-emerald-800 focus:ring-emerald-800 w-4 h-4"
                  />
                  <span className="text-xs font-bold text-slate-700">Publish in Dashboard Feed</span>
                </label>
              </div>
            </div>

            {isSending ? (
              /* Sending Active Progress Window */
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-700 animate-spin" />
                    <span>Broadcasting messages...</span>
                  </span>
                  <span>{sendingProgress}% Complete</span>
                </div>

                <div className="w-full bg-emerald-200 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#00482B] h-full transition-all duration-200" 
                    style={{ width: `${sendingProgress}%` }}
                  />
                </div>

                <div className="text-[10px] text-emerald-700 space-y-0.5">
                  <p>Matches: <strong>{sendingRecipients.length} Recipient(s)</strong></p>
                  <p className="truncate">Currently delivering to: <strong className="font-mono text-emerald-950">{currentSendingName}</strong></p>
                </div>
              </div>
            ) : (
              <button
                type="submit"
                disabled={matchedRecipients.length === 0}
                className={`w-full py-3 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-all ${
                  matchedRecipients.length === 0 
                    ? 'bg-slate-300 cursor-not-allowed' 
                    : 'bg-emerald-800 hover:bg-emerald-900 hover:scale-[1.01]'
                }`}
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>Broadcast Bulk Email & Notification ({matchedRecipients.length} Recipient(s))</span>
              </button>
            )}
          </form>
        </div>

        {/* Right Side: High-Fidelity Preview Box (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-100 p-4 rounded-t-2xl border-t border-x border-slate-200 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#00482B]" />
            <h4 className="font-bold text-xs text-slate-700">Real-time Email Client Preview</h4>
          </div>

          <div className="bg-white border border-slate-200 rounded-b-2xl shadow-sm overflow-hidden animate-fadeIn">
            {/* Email client header */}
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 space-y-1 font-mono text-[11px] text-slate-500">
              <div><strong className="text-slate-800">From:</strong> ETC Administrative Desk &lt;support@etc-pulwama.in&gt;</div>
              <div><strong className="text-slate-800">To:</strong> [List of {matchedRecipients.length} Matched Trainees]</div>
              <div className="truncate"><strong className="text-slate-800">Subject:</strong> {subject || '(Please enter a subject...)'}</div>
            </div>

            {/* Email Body Frame */}
            <div className="p-6 space-y-6">
              {/* Institutional Header Banner */}
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center text-amber-300 font-black text-xs">
                  ETC
                </div>
                <div>
                  <h5 className="font-black text-xs text-slate-900 leading-none">EXTENSION TRAINING CENTRE</h5>
                  <p className="text-[10px] text-emerald-800 font-bold">SKUAST Kashmir • Malangpora Pulwama</p>
                </div>
              </div>

              {/* Dynamic Greetings and Body */}
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
                {body || `Dear Trainee,

This is a draft preview of your official bulletin. Once sent, each matching registered trainee enrolled in the chosen category will receive this communication in their primary email inbox and dashboard notifications feed.

Select "Load Quick Template" above to populate realistic examples of SKUAST-K official circulars.`}
              </div>

              {/* Institutional Footer */}
              <div className="border-t border-slate-200 pt-4 text-center space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Official Extension Training Centre Communication Portal</p>
                <p className="text-[9px] text-slate-400">If you have questions, contact the office coordinator of ETC Pulwama, J&K.</p>
              </div>
            </div>
          </div>

          {/* Recipient Roster Sneak Peek */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
              Matched Recipient List ({matchedRecipients.length})
            </h4>

            <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
              {matchedRecipients.length === 0 ? (
                <div className="text-center py-4 text-slate-400 text-xs flex flex-col items-center justify-center gap-1">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <span>No matching students found for this group</span>
                </div>
              ) : (
                matchedRecipients.map(s => (
                  <div key={s.id || s.rollNumber} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-xl border border-slate-200/50">
                    <span className="font-bold text-slate-800 truncate max-w-[140px]">{s.name}</span>
                    <span className="font-mono text-[10.5px] text-slate-500">{s.rollNumber || s.email}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sent Broadcast History Section */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-800" />
            <span>Circular & Broadcast Logs ({history.length})</span>
          </h3>
          <p className="text-xs text-slate-500">
            History of circular bulletins and automated email digests disseminated across our training classes.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="text-[10px] text-slate-400 uppercase font-black tracking-wider bg-slate-50">
              <tr>
                <th className="p-3">Sent Timestamp</th>
                <th className="p-3">Recipient Group</th>
                <th className="p-3">Notice Subject Line</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((hist) => (
                <tr key={hist.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 font-mono font-medium text-slate-500 whitespace-nowrap">{hist.timestamp}</td>
                  <td className="p-3">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800">{hist.targetCourseLabel}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{hist.recipientCount} Student(s) notified</p>
                    </div>
                  </td>
                  <td className="p-3 font-medium text-slate-900 truncate max-w-[280px]" title={hist.subject}>{hist.subject}</td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      <span>Sent</span>
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDeleteHistory(hist.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
