import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { GALLERY_ITEMS } from '../data/mockData';
import { Image as ImageIcon, MapPin, Calendar, Maximize2 } from 'lucide-react';

interface GalleryPageProps {
  onSelectItem: (item: GalleryItem) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onSelectItem }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Field Visits', 'Practical Sessions', 'Campus & Orchard', 'Labs & Research', 'Events & Ceremonies'];

  const filteredItems = GALLERY_ITEMS.filter((item) =>
    selectedCategory === 'All' ? true : item.category === selectedCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800 space-y-4">
        <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/60 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>VISUAL ARCHIVES & CAMPUS LIFE</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Media Gallery & Practical Field Work
        </h1>

        <p className="text-sm sm:text-base text-emerald-100 max-w-3xl leading-relaxed">
          Glimpse into life at ETC Pulwama—from high-density orchard pruning and soil testing labs to exposure field trips and graduation ceremonies.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectItem(item)}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-1 space-y-3"
          >
            <div className="relative h-56 overflow-hidden bg-slate-900">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

              <div className="absolute top-3 left-3 bg-slate-900/90 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase font-mono">
                {item.category}
              </div>

              <div className="absolute bottom-3 right-3 p-2 bg-emerald-900/90 text-white rounded-xl group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>

            <div className="p-4 pt-1 space-y-2">
              <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-700" />
                  <span>{item.date}</span>
                </span>

                <span className="flex items-center gap-1 truncate max-w-[160px]">
                  <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
