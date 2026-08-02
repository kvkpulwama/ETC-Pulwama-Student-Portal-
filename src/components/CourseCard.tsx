import React from 'react';
import { Course } from '../types';
import { Clock, Users, Award, BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
  onApply: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect, onApply }) => {
  return (
    <div className="bg-white border border-[#1A1A1A]/10 hover:border-[#1A1A1A] transition-all flex flex-col justify-between space-y-4 p-5 group">
      {/* Course Header & Image */}
      <div className="space-y-3">
        <div className="relative h-44 overflow-hidden bg-[#E8E6E1] border border-[#1A1A1A]/5">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 bg-[#2D4739] text-white text-[9px] uppercase font-bold tracking-widest px-2.5 py-1">
            {course.category}
          </div>
          <div className="absolute top-3 right-3 bg-[#1A1A1A] text-white font-mono text-[9px] font-bold px-2 py-1">
            {course.code}
          </div>
        </div>

        <div>
          <h3 className="font-serif italic text-xl font-bold text-[#1A1A1A] group-hover:text-[#2D4739] transition-colors">
            {course.title}
          </h3>
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#2D4739] mt-1">
            Government Extension Diploma
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-[#1A1A1A]/80 bg-[#F5F5F0] p-3 border border-[#1A1A1A]/10">
          <div>
            <span className="text-[9px] uppercase tracking-widest font-bold text-[#1A1A1A]/50 block">Duration</span>
            <span className="font-medium text-xs">{course.duration.split('(')[0]}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-widest font-bold text-[#1A1A1A]/50 block">Sanctioned Seats</span>
            <span className="font-medium text-xs">{course.seats} Trainees</span>
          </div>
        </div>

        <p className="text-xs text-[#1A1A1A]/70 leading-relaxed line-clamp-2">
          {course.description}
        </p>

        {/* Highlight Banner */}
        <div className="bg-[#2D4739]/5 border-l-2 border-[#2D4739] p-2.5 text-xs text-[#2D4739] font-medium">
          {course.stipendOrFee}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-[#1A1A1A]/10 flex items-center gap-2">
        <button
          onClick={() => onSelect(course)}
          className="flex-1 py-2 px-3 border border-[#1A1A1A] text-[10px] uppercase font-bold tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-all text-center"
        >
          View Syllabus
        </button>

        <button
          onClick={() => onApply(course)}
          className="py-2 px-4 bg-[#2D4739] text-white text-[10px] uppercase font-bold tracking-widest hover:bg-[#1A3A2A] transition-all flex items-center gap-1 shrink-0"
        >
          <span>Apply</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

