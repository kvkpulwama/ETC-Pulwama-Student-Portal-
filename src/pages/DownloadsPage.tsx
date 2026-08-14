import React, { useState } from 'react';
import { DownloadItem, StudentProfile } from '../types';
import { DOWNLOADS_LIST } from '../data/mockData';
import { RollNoSlipModal } from '../components/RollNoSlipModal';
import { CertificateModal } from '../components/CertificateModal';
import { 
  Download, 
  Search, 
  FileText, 
  Eye, 
  ShieldCheck, 
  FileSpreadsheet, 
  Calendar,
  CheckCircle2,
  FileCheck2,
  Award,
  Sparkles,
  Sprout,
  Apple,
  Stamp,
  Check,
  ChevronRight
} from 'lucide-react';

interface DownloadsPageProps {
  onPreviewDocument: (doc: DownloadItem) => void;
  loggedInStudent?: StudentProfile | null;
}

export const DownloadsPage: React.FC<DownloadsPageProps> = ({ onPreviewDocument, loggedInStudent }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showRollNoModal, setShowRollNoModal] = useState<boolean>(false);
  const [showCertModal, setShowCertModal] = useState<boolean>(false);
  const [certCourseType, setCertCourseType] = useState<'BHT' | 'BAT'>('BHT');

  const categories = ['All', 'Admission Forms', 'Syllabus & Curricula', 'Exam Date Sheets', 'Study Material', 'Certificates & Requests'];

  const handleOpenCertificate = (type: 'BHT' | 'BAT') => {
    setCertCourseType(type);
    setShowCertModal(true);
  };

  const handleDocumentAction = (doc: DownloadItem) => {
    if (doc.id === 'd-cert-bht') {
      handleOpenCertificate('BHT');
    } else if (doc.id === 'd-cert-bat') {
      handleOpenCertificate('BAT');
    } else {
      onPreviewDocument(doc);
    }
  };

  const filteredDocs = DOWNLOADS_LIST.filter((doc) => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800 space-y-4 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/60 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
          <Download className="w-3.5 h-3.5" />
          <span>OFFICIAL DOCUMENT &amp; CERTIFICATION REPOSITORY</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Downloads Center &amp; Certificate Portal
        </h1>

        <p className="text-sm sm:text-base text-emerald-100 max-w-3xl leading-relaxed">
          Download official BHT &amp; BAT course completion certificates, application forms, academic syllabi, examination date sheets, technical apple handbooks, and Roll No. examination admit slips.
        </p>
      </div>

      {/* Prominent Quick Access: Download Official Certificates Section (BHT & BAT) */}
      <div className="bg-gradient-to-br from-amber-50 via-white to-amber-100/60 rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-amber-300 space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/80 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider font-mono shadow-sm mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>OFFICIAL UNIVERSITY CERTIFICATE DOWNLOAD</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-950 tracking-tight">
              Download Course Completion Certificate
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl leading-relaxed">
              Official SKUAST-K Kashmir institutional certificate format complete with candidate details, parentage, residence, district, session, division, date of issue, and three authentic examination board signatures with stamps.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-200/80 border border-amber-300 px-3.5 py-2 rounded-2xl self-start md:self-auto shrink-0 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-800" />
            <span>SKUAST-K / ETC Pulwama Format</span>
          </div>
        </div>

        {/* Certificate Features Summary Pill List */}
        <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-slate-700">
          <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1 shadow-2xs">
            <Check className="w-3.5 h-3.5 text-emerald-600" /> Candidate Name &amp; Parentage
          </span>
          <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1 shadow-2xs">
            <Check className="w-3.5 h-3.5 text-emerald-600" /> Address / Residence &amp; District
          </span>
          <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1 shadow-2xs">
            <Check className="w-3.5 h-3.5 text-emerald-600" /> Academic Session &amp; Division Result
          </span>
          <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1 shadow-2xs">
            <Check className="w-3.5 h-3.5 text-emerald-600" /> Date of Issue &amp; Regd. No.
          </span>
          <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1 shadow-2xs">
            <Check className="w-3.5 h-3.5 text-emerald-600" /> 3 Signatures: Checked by (I/c Academics), Secretary &amp; Chairman
          </span>
        </div>

        {/* Separate Download Options for BHT & BAT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          
          {/* 1. BHT Certificate Download Card */}
          <div className="bg-white rounded-2xl p-6 border-2 border-emerald-700/40 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group hover:border-emerald-700">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full font-mono flex items-center gap-1.5 border border-emerald-300">
                  <Apple className="w-3.5 h-3.5 text-emerald-700" />
                  <span>HORTICULTURE COURSE (BHT)</span>
                </span>
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  1-Year Diploma
                </span>
              </div>

              <h3 className="font-serif font-extrabold text-slate-950 text-lg sm:text-xl group-hover:text-emerald-900 transition-colors">
                Basic Horticulture Training Certificate (BHT)
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Official certificate for candidates declared successful in the <strong>One Year Basic Horticulture Training Course</strong> at Extension Training Centre Pulwama (SKUAST-K).
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-700 font-serif space-y-1">
                <div className="font-bold text-slate-900">Certificate Title:</div>
                <div className="italic text-emerald-900 font-semibold">
                  &ldquo;One Year Basic Horticulture Training Course&rdquo;
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => handleOpenCertificate('BHT')}
                className="w-full py-3 bg-gradient-to-r from-emerald-800 to-teal-900 hover:from-emerald-900 hover:to-teal-950 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>Download BHT Certificate</span>
              </button>
            </div>
          </div>

          {/* 2. BAT Certificate Download Card */}
          <div className="bg-white rounded-2xl p-6 border-2 border-amber-500/50 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group hover:border-amber-600">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-950 px-3 py-1 rounded-full font-mono flex items-center gap-1.5 border border-amber-300">
                  <Sprout className="w-3.5 h-3.5 text-amber-700" />
                  <span>AGRICULTURE COURSE (BAT)</span>
                </span>
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  1-Year Diploma
                </span>
              </div>

              <h3 className="font-serif font-extrabold text-slate-950 text-lg sm:text-xl group-hover:text-amber-950 transition-colors">
                Basic Agriculture Training Certificate (BAT)
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Official certificate for candidates declared successful in the <strong>One Year Basic Agriculture Training Course</strong> at Extension Training Centre Pulwama (SKUAST-K).
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-700 font-serif space-y-1">
                <div className="font-bold text-slate-900">Certificate Title:</div>
                <div className="italic text-amber-900 font-semibold">
                  &ldquo;One Year Basic Agriculture Training Course&rdquo;
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => handleOpenCertificate('BAT')}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>Download BAT Certificate</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Prominent Quick Access: Download Roll No. Slip (Hall Ticket) */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-900/80 text-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider font-mono shadow-sm border border-emerald-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>EXAMINATION PORTAL 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Download Examination Hall Ticket / Roll No. Slip
          </h2>
          <p className="text-xs sm:text-sm font-normal text-emerald-100 max-w-xl">
            Download your official SKUAST-K admit card by providing your student Roll Number (or email) and Password registered during application.
          </p>
        </div>

        <button
          onClick={() => setShowRollNoModal(true)}
          className="px-7 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl transition-all shadow-2xl flex items-center gap-2 shrink-0 border border-amber-300 hover:scale-105 active:scale-95"
        >
          <FileCheck2 className="w-5 h-5 text-slate-950" />
          <span>Download Roll No. Slip PDF</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search document title or certificate..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Document Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => {
          const isCertDoc = doc.id === 'd-cert-bht' || doc.id === 'd-cert-bat';
          return (
            <div
              key={doc.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 ${
                isCertDoc ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200/90'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md font-mono ${
                    isCertDoc ? 'bg-amber-200 text-amber-950 font-black' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {doc.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {doc.fileType} • {doc.fileSize}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                  {doc.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {doc.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  Uploaded: <strong>{doc.uploadDate}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDocumentAction(doc)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-800" />
                    <span>{isCertDoc ? 'Open Generator' : 'Preview'}</span>
                  </button>

                  <button
                    onClick={() => handleDocumentAction(doc)}
                    className={`px-3.5 py-1.5 font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-1 ${
                      isCertDoc
                        ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 font-black'
                        : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                    }`}
                  >
                    <Download className={`w-3.5 h-3.5 ${isCertDoc ? 'text-slate-950' : 'text-amber-300'}`} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Roll No Slip Modal */}
      {showRollNoModal && (
        <RollNoSlipModal 
          onClose={() => setShowRollNoModal(false)} 
          loggedInStudent={loggedInStudent}
        />
      )}

      {/* Certificate Modal */}
      {showCertModal && (
        <CertificateModal
          initialCourse={certCourseType}
          onClose={() => setShowCertModal(false)}
          loggedInStudent={loggedInStudent}
        />
      )}
    </div>
  );
};
