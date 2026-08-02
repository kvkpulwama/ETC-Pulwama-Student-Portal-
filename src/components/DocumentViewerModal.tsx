import React, { useState } from 'react';
import { DownloadItem } from '../types';
import { generateDocumentPDF } from '../lib/pdfGenerator';
import { X, FileText, Download, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';

interface DocumentViewerModalProps {
  document: DownloadItem | null;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({ document, onClose }) => {
  const [downloaded, setDownloaded] = useState(false);

  if (!document) return null;

  const handleDownload = () => {
    // Generate actual valid binary PDF document
    generateDocumentPDF(
      document.title,
      document.category,
      document.contentPreview || 'Official Extension Training Centre Malangpora Pulwama document publication.',
      document.title
    );

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden border border-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-900 text-amber-300 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                {document.category} • {document.fileType}
              </span>
              <h3 className="font-extrabold text-sm sm:text-base leading-tight mt-1 text-slate-100">
                {document.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Metadata Bar */}
        <div className="bg-slate-50 p-3 px-6 border-b border-slate-200/80 flex items-center justify-between text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-4">
            <span>Size: <strong>{document.fileSize}</strong></span>
            <span>Uploaded: <strong>{document.uploadDate}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Government Document</span>
          </div>
        </div>

        {/* Document Content Simulation */}
        <div className="p-6 bg-slate-100/70 overflow-y-auto max-h-[50vh] font-mono text-xs text-slate-800 space-y-3">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 whitespace-pre-line leading-relaxed">
            {document.contentPreview || 'Sample document contents.'}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Downloaded <strong>{document.downloadsCount + (downloaded ? 1 : 0)}</strong> times by applicants.
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>

            <button
              onClick={handleDownload}
              className={`flex-1 sm:flex-initial px-5 py-2 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${
                downloaded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-800 hover:bg-emerald-900 text-white'
              }`}
            >
              {downloaded ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download {document.fileType} ({document.fileSize})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
