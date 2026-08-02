import React, { useState } from 'react';
import { Bell, ChevronRight, X, AlertCircle, FileText } from 'lucide-react';
import { NOTICES } from '../data/mockData';
import { NoticeItem } from '../types';

interface NoticeTickerProps {
  onSelectNotice?: (notice: NoticeItem) => void;
}

export const NoticeTicker: React.FC<NoticeTickerProps> = ({ onSelectNotice }) => {
  const [activeModalNotice, setActiveModalNotice] = useState<NoticeItem | null>(null);

  const handleItemClick = (notice: NoticeItem) => {
    setActiveModalNotice(notice);
    if (onSelectNotice) {
      onSelectNotice(notice);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-[#022c1e] via-[#064e3b] to-[#022c1e] text-white text-xs py-2.5 px-4 border-b border-emerald-800/80 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Label Badge with Pulsing Live Indicator */}
          <div className="flex items-center gap-2 bg-emerald-950/80 text-amber-300 px-3 py-1 text-[10px] uppercase font-black tracking-widest shrink-0 border border-emerald-700/60 rounded-full shadow-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <Bell className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>FLASH NOTICES 2026</span>
          </div>

          {/* Marquee / Ticker text */}
          <div className="overflow-hidden relative w-full flex-1">
            <div className="flex items-center space-x-10 animate-marquee whitespace-nowrap hover:[animation-play-state:paused] cursor-pointer text-emerald-100">
              {NOTICES.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleItemClick(n)}
                  className="inline-flex items-center gap-2 hover:text-amber-300 transition-colors text-xs text-left font-medium group"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 group-hover:scale-125 transition-transform inline-block shadow-sm"></span>
                  <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-mono font-bold">[{n.date}]</span>
                  <span className="group-hover:underline">{n.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400 inline group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notice Detail Modal */}
      {activeModalNotice && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFCFB] max-w-lg w-full overflow-hidden border border-[#1A1A1A]/20 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="bg-[#2D4739] text-white p-6 flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 text-amber-300 border border-white/15">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-emerald-200 bg-white/10 px-2 py-0.5 border border-white/15 font-bold">
                    {activeModalNotice.category} Notice
                  </span>
                  <p className="text-[10px] uppercase tracking-wider text-emerald-200 mt-1 font-mono">Issued: {activeModalNotice.date}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModalNotice(null)}
                className="text-emerald-200 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="text-xl font-serif font-light text-[#1A1A1A] leading-snug">
                {activeModalNotice.title}
              </h3>

              <div className="p-4 bg-[#F5F5F0] border border-[#1A1A1A]/10 text-xs text-[#1A1A1A]/80 leading-relaxed">
                <p>
                  This official notice was published by the Administrative Office of Extension Training Centre (ETC) Pulwama. Candidates and trainees are advised to review all guidelines or visit the campus office for further clarifications.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#1A1A1A]/10 text-[10px] uppercase tracking-widest text-[#1A1A1A]/60">
                <span>Ref: ETC/PUB/{activeModalNotice.id.toUpperCase()}/2026</span>
                <span className="flex items-center gap-1 font-bold text-[#2D4739]">
                  <FileText className="w-3.5 h-3.5" /> Official Gazette
                </span>
              </div>
            </div>

            <div className="bg-[#F5F5F0] p-4 border-t border-[#1A1A1A]/10 flex justify-end">
              <button
                onClick={() => setActiveModalNotice(null)}
                className="px-5 py-2 bg-[#2D4739] hover:bg-[#1A3A2A] text-white text-[10px] uppercase font-bold tracking-widest transition-all"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

