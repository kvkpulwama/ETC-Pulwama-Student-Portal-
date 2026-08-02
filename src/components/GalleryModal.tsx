import React from 'react';
import { GalleryItem } from '../types';
import { X, MapPin, Calendar, Tag } from 'lucide-react';

interface GalleryModalProps {
  item: GalleryItem | null;
  onClose: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full my-8 overflow-hidden border border-slate-800 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Tag className="w-3.5 h-3.5" />
            <span>{item.category}</span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Image Stage */}
        <div className="relative bg-black flex items-center justify-center max-h-[65vh] overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="max-h-[65vh] w-auto object-contain"
          />
        </div>

        {/* Details Caption */}
        <div className="p-6 bg-slate-900 text-white space-y-3">
          <h3 className="font-extrabold text-lg sm:text-xl text-slate-100">
            {item.title}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            {item.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-400 pt-2 border-t border-slate-800 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{item.date}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{item.location}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
