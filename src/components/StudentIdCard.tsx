import React from 'react';
import { StudentProfile } from '../types';
import { INSTITUTION_INFO } from '../data/mockData';
import { ShieldCheck, Printer, QrCode, Award } from 'lucide-react';

interface StudentIdCardProps {
  student: StudentProfile;
}

export const StudentIdCard: React.FC<StudentIdCardProps> = ({ student }) => {
  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
            Digital Trainee Identity Card
          </h4>
          <p className="text-xs text-slate-500">
            Official government issued student identity pass for ETC Pulwama campus access.
          </p>
        </div>

        <button
          onClick={handlePrintCard}
          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4 text-amber-300" />
          <span>Print / Download Card</span>
        </button>
      </div>

      {/* ID Card Front Frame */}
      <div className="max-w-md mx-auto bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl shadow-xl border-2 border-amber-400/80 overflow-hidden relative font-sans print:border-slate-900 print:shadow-none">
        {/* Top Header Seal */}
        <div className="bg-emerald-950/80 p-4 border-b border-emerald-700/50 text-center relative">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-xs sm:text-sm tracking-wide text-amber-300 uppercase">
              EXTENSION TRAINING CENTRE PULWAMA
            </h3>
          </div>
          <p className="text-[10px] text-emerald-200 font-medium uppercase tracking-wider">
            Dept. of Agriculture Production & Farmers Welfare, J&K Govt.
          </p>
          <div className="absolute top-2 right-2 text-[9px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded font-mono">
            TRAINEE ID
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex gap-4 items-start">
          {/* Student Photo */}
          <div className="shrink-0 space-y-2 text-center">
            <div className="w-24 h-28 rounded-xl overflow-hidden border-2 border-amber-400 bg-slate-800 shadow-md">
              <img
                src={student.photoUrl}
                alt={student.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="inline-block text-[10px] font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
              {student.bloodGroup}
            </span>
          </div>

          {/* Student Information Fields */}
          <div className="flex-1 space-y-2 text-xs">
            <div>
              <span className="text-[10px] uppercase text-emerald-300 font-bold tracking-wider block">
                Student Name
              </span>
              <p className="font-extrabold text-sm text-white tracking-wide">{student.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] uppercase text-emerald-300 font-bold tracking-wider block">
                  Roll Number
                </span>
                <p className="font-mono font-bold text-amber-300 text-xs">{student.rollNumber}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase text-emerald-300 font-bold tracking-wider block">
                  Reg Number
                </span>
                <p className="font-mono text-xs text-slate-200">{student.registrationNumber}</p>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase text-emerald-300 font-bold tracking-wider block">
                Course Enrolled
              </span>
              <p className="font-bold text-xs text-emerald-100">{student.courseTitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-[10px] uppercase text-emerald-300 font-bold tracking-wider block">
                  Batch Session
                </span>
                <p className="text-slate-200">{student.batchYear}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase text-emerald-300 font-bold tracking-wider block">
                  Mobile
                </span>
                <p className="text-slate-200 font-mono">{student.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer with QR & Signature */}
        <div className="bg-slate-950 p-3 px-5 border-t border-emerald-800/60 flex items-center justify-between text-[10px] text-slate-400">
          <div className="flex items-center gap-2">
            <div className="bg-white p-1 rounded">
              <QrCode className="w-7 h-7 text-slate-900" />
            </div>
            <div>
              <span className="block font-mono text-emerald-400 font-bold">VERIFIED TRAINEE</span>
              <span>Valid for Academic Session {student.batchYear}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="border-b border-amber-400/60 pb-1 font-serif italic text-amber-300 font-bold">
              Dr. G. H. Mir
            </div>
            <span className="text-[9px] text-slate-400 uppercase font-mono">Prof. & Head</span>
          </div>
        </div>

        {/* Bottom Barcode Simulation */}
        <div className="bg-amber-400 text-slate-950 text-center py-1 font-mono text-[9px] tracking-widest font-extrabold uppercase">
          ||||| ||| ||||||| |||| |||||| ||||| ||| ||||||
        </div>
      </div>
    </div>
  );
};
