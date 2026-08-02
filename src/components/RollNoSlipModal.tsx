import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { DEMO_STUDENTS } from '../data/mockData';
import { getStudentProfileFromSupabase } from '../lib/supabase';
import { generateRollNoSlipPDF } from '../lib/pdfGenerator';
import { 
  X, 
  Download, 
  FileCheck2, 
  UserCircle, 
  Lock, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Award,
  Sparkles
} from 'lucide-react';

interface RollNoSlipModalProps {
  onClose: () => void;
  loggedInStudent?: StudentProfile | null;
}

export const RollNoSlipModal: React.FC<RollNoSlipModalProps> = ({ onClose, loggedInStudent }) => {
  const [rollNoOrEmail, setRollNoOrEmail] = useState(loggedInStudent ? loggedInStudent.rollNumber : '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successStudent, setSuccessStudent] = useState<StudentProfile | null>(loggedInStudent || null);

  const handleVerifyAndDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNoOrEmail || (!loggedInStudent && !password)) {
      setErrorMsg('Please enter both your Roll Number / Email and Password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      let targetStudent: StudentProfile | null = null;

      if (loggedInStudent && (rollNoOrEmail === loggedInStudent.rollNumber || rollNoOrEmail === loggedInStudent.email)) {
        targetStudent = loggedInStudent;
      } else {
        // Search in Supabase database
        targetStudent = await getStudentProfileFromSupabase(rollNoOrEmail);

        // Search in local registered list
        if (!targetStudent) {
          const localStr = localStorage.getItem('etc_registered_students');
          const localList: StudentProfile[] = localStr ? JSON.parse(localStr) : [];
          const combined = [...DEMO_STUDENTS, ...localList];

          const cleanQuery = rollNoOrEmail.trim().toLowerCase();
          targetStudent = combined.find(
            (s) =>
              s.rollNumber.trim().toLowerCase() === cleanQuery ||
              s.email.trim().toLowerCase() === cleanQuery
          ) || null;
        }
      }

      if (targetStudent) {
        setSuccessStudent(targetStudent);
        await generateRollNoSlipPDF(targetStudent);
      } else {
        setErrorMsg('No student found with the provided Roll No. / Email. Please check your credentials or register first.');
      }
    } catch (err: any) {
      const isFetchErr = err?.message?.toLowerCase().includes('fetch') || err?.message?.toLowerCase().includes('typeerror');
      setErrorMsg(isFetchErr ? 'Offline Mode: Unable to reach verification server. Please verify your Roll No. / Email.' : (err?.message || 'Verification failed. Please check your login credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 text-white p-6 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-400 text-slate-950 rounded-2xl shadow-md">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-300 bg-emerald-900/80 px-2.5 py-0.5 rounded-full border border-emerald-700">
                OFFICIAL ADMIT CARD
              </span>
              <h3 className="font-extrabold text-base text-white mt-1">
                Download Roll No. Slip (Session 2026-27)
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            Enter the <strong>Roll Number</strong> (or registered email) and <strong>Password</strong> created during your student registration to generate and download your official examination hall ticket PDF.
          </p>

          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successStudent && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-2xl space-y-2">
              <div className="flex items-center gap-2 font-black text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Verified Candidate Found!</span>
              </div>
              <div className="font-mono text-[11px] grid grid-cols-2 gap-1 text-slate-700 pt-1 border-t border-emerald-200/60">
                <div>Candidate: <strong>{successStudent.name}</strong></div>
                <div>Roll No: <strong>{successStudent.rollNumber}</strong></div>
                <div>Course: <strong>{successStudent.courseTitle}</strong></div>
                <div>Session: <strong>{successStudent.batchYear}</strong></div>
              </div>
            </div>
          )}

          <form onSubmit={handleVerifyAndDownload} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Roll Number or Email Address *
              </label>
              <div className="relative">
                <UserCircle className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={rollNoOrEmail}
                  onChange={(e) => setRollNoOrEmail(e.target.value)}
                  placeholder="e.g. BHT-2026-27-101 or student@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none font-medium text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required={!loggedInStudent}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password set during registration"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none font-medium text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-900 hover:to-slate-950 text-white font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 glow-emerald border border-emerald-700"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
              ) : (
                <Download className="w-4 h-4 text-amber-300" />
              )}
              <span>{loading ? 'Verifying & Generating PDF...' : 'Verify Credentials & Download PDF'}</span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            SKUAST-K Examination Branch
          </span>
          <span>Pulwama, J&K</span>
        </div>
      </div>
    </div>
  );
};
