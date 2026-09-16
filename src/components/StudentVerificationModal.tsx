import React from 'react';
import { StudentProfile } from '../types';
import { ShieldCheck, CheckCircle2, AlertTriangle, Calendar, Phone, Mail, Award, MapPin, ExternalLink, X } from 'lucide-react';
import { SKUAST_LOGO_DATA_URI } from '../assets/logoBase64';

interface StudentVerificationModalProps {
  student: StudentProfile | null;
  studentId?: string;
  error?: string | null;
  onClose: () => void;
}

export const StudentVerificationModal: React.FC<StudentVerificationModalProps> = ({
  student,
  studentId,
  error,
  onClose
}) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-emerald-800/30 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with SKUAST Emblem */}
        <div className="bg-gradient-to-r from-emerald-950 via-[#1b4332] to-[#081c15] text-white p-5 flex items-center justify-between border-b border-amber-400/40 relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center overflow-hidden shrink-0 border border-amber-300">
              <img src={SKUAST_LOGO_DATA_URI} alt="SKUAST-K" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-amber-300 text-[10px] font-black uppercase tracking-wider font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Official Digital Verification</span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-white font-serif">
                SKUAST-K Trainee Authentication
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {student ? (
            <>
              {/* Authenticated Verification Badge */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-emerald-900 text-sm">
                    Verified Trainee Record Active
                  </h4>
                  <p className="text-emerald-700 text-xs mt-0.5">
                    This identity card and enrolment status are authentic and verified in the SKUAST-Kashmir database.
                  </p>
                </div>
              </div>

              {/* Student Profile Overview */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {student.photoUrl && (
                  <img 
                    src={student.photoUrl} 
                    alt={student.name}
                    className="w-16 h-20 rounded-xl object-cover border-2 border-amber-400 shadow-xs shrink-0" 
                  />
                )}
                <div className="space-y-1 min-w-0">
                  <h4 className="font-black text-slate-900 text-base leading-tight truncate">
                    {student.name}
                  </h4>
                  <div className="inline-block bg-amber-100 text-amber-900 text-[11px] font-bold px-2 py-0.5 rounded">
                    Roll: <span className="font-mono font-bold">{student.rollNumber || '—'}</span>
                  </div>
                  <p className="text-xs text-slate-600 truncate">
                    {student.courseTitle || 'Basic Horticulture Training Course (BHT)'}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px] font-semibold uppercase">Registration No</span>
                  <span className="font-mono font-bold text-slate-900">{student.registrationNumber || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-semibold uppercase">Father's Name</span>
                  <span className="font-bold text-slate-900">{student.guardianName || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-semibold uppercase">Blood Group</span>
                  <span className="font-extrabold text-emerald-700">{student.bloodGroup || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-semibold uppercase">Valid Upto</span>
                  <span className="font-bold text-slate-900">{student.validUpto || '31/10/2027'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block text-[10px] font-semibold uppercase">Address</span>
                  <span className="font-semibold text-slate-900">{student.address || '—'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block text-[10px] font-semibold uppercase">Issuing Authority</span>
                  <span className="font-bold text-slate-900">
                    Extension Training Centre (ETC) Malangpora Pulwama, SKUAST-K
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center space-y-2">
              <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
              <h4 className="font-extrabold text-amber-900 text-sm">
                Student Record Verification
              </h4>
              <p className="text-amber-800 text-xs">
                {error || `Unable to load student profile with identifier "${studentId}". Please verify the QR code URL.`}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-500">
            SKUAST-K Security System • Verification Portal
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
