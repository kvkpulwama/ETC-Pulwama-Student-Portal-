import React, { useState } from 'react';
import { DownloadItem } from '../types';
import { DOWNLOADS_LIST } from '../data/mockData';
import { RollNoSlipModal } from '../components/RollNoSlipModal';
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
  Sparkles
} from 'lucide-react';

interface DownloadsPageProps {
  onPreviewDocument: (doc: DownloadItem) => void;
}

export const DownloadsPage: React.FC<DownloadsPageProps> = ({ onPreviewDocument }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showRollNoModal, setShowRollNoModal] = useState<boolean>(false);

  const categories = ['All', 'Admission Forms', 'Syllabus & Curricula', 'Exam Date Sheets', 'Study Material', 'Certificates & Requests'];

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
          <span>OFFICIAL DOCUMENT REPOSITORY</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Downloads Center & Publications
        </h1>

        <p className="text-sm sm:text-base text-emerald-100 max-w-3xl leading-relaxed">
          Download official application forms, BHT/BAT course syllabi, examination date sheets, technical apple handbooks, and Roll No. examination slips.
        </p>
      </div>

      {/* Prominent Quick Access: Download Roll No. Slip (Hall Ticket) */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-300 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-6 glow-amber">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-slate-950 text-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider font-mono shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>EXAMINATION PORTAL 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            Download Examination Hall Ticket / Roll No. Slip
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-900 max-w-xl">
            Download your official SKUAST-K admit card by providing your student Roll Number (or email) and Password registered during application.
          </p>
        </div>

        <button
          onClick={() => setShowRollNoModal(true)}
          className="px-7 py-3.5 bg-slate-950 hover:bg-emerald-950 text-amber-300 font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl transition-all shadow-2xl flex items-center gap-2 shrink-0 border border-amber-400/40 hover:scale-105 active:scale-95"
        >
          <FileCheck2 className="w-5 h-5 text-amber-400" />
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
              placeholder="Search document title or form name..."
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
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md font-mono">
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
                  onClick={() => onPreviewDocument(doc)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => onPreviewDocument(doc)}
                  className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showRollNoModal && (
        <RollNoSlipModal onClose={() => setShowRollNoModal(false)} />
      )}
    </div>
  );
};
