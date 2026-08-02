import React, { useState } from 'react';
import { Course } from '../types';
import { 
  X, 
  Clock, 
  Users, 
  Award, 
  CheckCircle, 
  FileText, 
  Send, 
  GraduationCap, 
  UserCheck, 
  Sparkles,
  BookOpen
} from 'lucide-react';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  onApplySuccess?: (courseName: string, applicantName: string) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  onClose,
  onApplySuccess
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'syllabus' | 'apply'>('overview');
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantQualification, setApplicantQualification] = useState('10+2 Science');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appliedSubmitted, setAppliedSubmitted] = useState(false);

  if (!course) return null;

  const handleApplyFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setAppliedSubmitted(true);
      if (onApplySuccess) {
        onApplySuccess(course.title, applicantName);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-emerald-950/60 hover:bg-emerald-950 text-slate-200 hover:text-white p-1.5 rounded-full transition-colors border border-emerald-700/50"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-amber-400 text-slate-950 font-bold font-mono text-xs px-2.5 py-0.5 rounded-md">
              {course.code}
            </span>
            <span className="bg-emerald-800 text-emerald-200 text-xs px-2.5 py-0.5 rounded-md font-medium border border-emerald-700">
              {course.category}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight pr-8">
            {course.title}
          </h2>
          <p className="text-xs text-emerald-300 font-medium mt-1">
            Extension Training Centre (ETC) Pulwama • J&K Govt
          </p>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 border-b border-emerald-800/80 pt-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-emerald-200 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Course Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('syllabus')}
              className={`pb-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'syllabus'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-emerald-200 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Syllabus & Modules</span>
            </button>

            <button
              onClick={() => setActiveTab('apply')}
              className={`pb-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'apply'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-emerald-200 hover:text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Apply / Enroll</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-800">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Quick Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Duration</span>
                  </div>
                  <p className="font-extrabold text-sm text-slate-900">{course.duration}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
                    <Users className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Total Intake</span>
                  </div>
                  <p className="font-extrabold text-sm text-slate-900">{course.seats} Trainee Seats</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 col-span-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>Stipend / Fee Support</span>
                  </div>
                  <p className="font-extrabold text-xs text-amber-900">{course.stipendOrFee}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  About The Training Program
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {course.description}
                </p>
              </div>

              {/* Objectives */}
              <div>
                <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  Key Learning Objectives
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {course.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 text-slate-700">
                      <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Eligibility & Faculty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1">
                  <h5 className="font-bold text-xs uppercase text-amber-900 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-amber-700" />
                    <span>Eligibility Requirements</span>
                  </h5>
                  <p className="text-xs text-slate-700 font-medium">{course.eligibility}</p>
                </div>

                <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-1">
                  <h5 className="font-bold text-xs uppercase text-emerald-900 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-700" />
                    <span>Course Director</span>
                  </h5>
                  <p className="text-xs font-bold text-slate-900">{course.instructor.name}</p>
                  <p className="text-[11px] text-slate-600">{course.instructor.designation}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'syllabus' && (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-900 text-white rounded-xl text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-amber-300 block">Curriculum Standard</span>
                  <span>Designed as per J&K Agriculture Extension Board regulations</span>
                </div>
                <button
                  onClick={() => setActiveTab('apply')}
                  className="px-3 py-1.5 bg-amber-400 text-slate-950 font-extrabold rounded-lg hover:bg-amber-300 transition-colors"
                >
                  Apply Now
                </button>
              </div>

              {course.modules.map((mod, index) => (
                <div key={index} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2.5 font-bold text-xs text-slate-800 border-b border-slate-200 flex items-center justify-between">
                    <span>{mod.semesterOrTerm}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                      {mod.subjects.length} Core Subjects
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {mod.subjects.map((sub, sIdx) => (
                      <div key={sIdx} className="p-3.5 hover:bg-slate-50 transition-colors space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">{sub.name}</span>
                          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {sub.code} • {sub.creditsOrHours}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{sub.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'apply' && (
            <div>
              {appliedSubmitted ? (
                <div className="py-10 text-center space-y-4 animate-in fade-in duration-200">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Application Pre-Registration Successful!
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{applicantName}</strong>. Your pre-registration application for <strong>{course.title}</strong> has been logged in the ETC Pulwama portal.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-w-md mx-auto text-xs font-mono text-slate-700 space-y-1 text-left">
                    <p>Reference Code: <strong className="text-emerald-700">ETC-APP-2026-{Math.floor(1000 + Math.random() * 9000)}</strong></p>
                    <p>Course: {course.title}</p>
                    <p>Batch: {course.batchDates}</p>
                  </div>
                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={onClose}
                      className="px-5 py-2.5 bg-emerald-800 text-white font-bold text-xs rounded-xl hover:bg-emerald-900"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApplyFormSubmit} className="space-y-4">
                  <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900">
                    <strong>Note:</strong> This pre-registration reserves your inquiry slot for the upcoming <strong>{course.batchDates}</strong>. Final admission is subject to document verification at ETC Pulwama.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name of Applicant *
                      </label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="e.g. Aamir Ahmad Bhat"
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        placeholder="+91 9797XXXXXX"
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        placeholder="applicant@gmail.com"
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Highest Qualification
                      </label>
                      <select
                        value={applicantQualification}
                        onChange={(e) => setApplicantQualification(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      >
                        <option value="10th Pass">10th Pass</option>
                        <option value="10+2 Science">10+2 Science / Agri</option>
                        <option value="10+2 Arts/Commerce">10+2 Arts/Commerce</option>
                        <option value="Graduate (B.Sc Agri/Horti/General)">Graduate</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('overview')}
                      className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
                    >
                      Back to Overview
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
                    >
                      {isSubmitting ? 'Submitting Application...' : 'Submit Application Form'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Batch Date: {course.batchDates}</span>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
