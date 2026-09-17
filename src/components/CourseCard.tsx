import React from 'react';
import { Course } from '../types';
import { Clock, Users, Award, BookOpen, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
  onApply: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect, onApply }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-600/60 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between p-5 sm:p-6 group relative overflow-hidden">
      {/* Top Accent Line on Hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Course Header & Image */}
      <div className="space-y-4">
        <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 bg-emerald-900/90 backdrop-blur-sm text-amber-300 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border border-emerald-700/50">
            {course.category}
          </div>
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-slate-900 font-mono text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200 shadow-sm">
            {course.code}
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>SKUAST-K Recognized Diploma</span>
          </div>
          <h3 className="font-serif font-black text-xl text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
            {course.title}
          </h3>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Duration</span>
            <span className="font-bold text-slate-900 text-xs">{course.duration.split('(')[0]}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Sanctioned Seats</span>
            <span className="font-bold text-slate-900 text-xs">{course.seats} Trainees</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
          {course.description}
        </p>

        {/* Stipend Banner */}
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-2.5 text-xs text-emerald-900 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="truncate">{course.stipendOrFee}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 mt-2 border-t border-slate-100 flex items-center gap-2.5">
        <button
          onClick={() => onSelect(course)}
          className="flex-1 py-2.5 px-3 rounded-full border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 hover:border-slate-400 transition-all text-center"
        >
          Syllabus &amp; Modules
        </button>

        <button
          onClick={() => onApply(course)}
          className="py-2.5 px-5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-full transition-all flex items-center gap-1.5 shrink-0 shadow-sm hover:shadow group/btn"
        >
          <span>Apply</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-300 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

