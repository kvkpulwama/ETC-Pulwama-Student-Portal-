import React, { useState } from 'react';
import { Course, NavigationPage } from '../types';
import { COURSES } from '../data/mockData';
import { CourseCard } from '../components/CourseCard';
import { BookOpen, Search, Filter, Sparkles, Award, ArrowRight } from 'lucide-react';

interface CoursesPageProps {
  onSelectCourse: (course: Course) => void;
  onApplyCourse: (course: Course) => void;
  onNavigate: (page: NavigationPage) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({
  onSelectCourse,
  onApplyCourse,
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Long-Term Diploma', 'Short-Term Training', 'Vocational Certificate'];

  const filteredCourses = COURSES.filter((course) => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header (SKIIE Template Hero) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-[#03301D] to-slate-950 text-white p-8 sm:p-12 shadow-2xl border border-emerald-800/70 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-emerald-900/90 border border-emerald-600/60 text-amber-300 text-xs font-bold font-mono px-3.5 py-1.5 rounded-full shadow-sm">
            <BookOpen className="w-3.5 h-3.5" />
            <span>ACADEMIC CATALOG 2026-27</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-white/10 text-emerald-100 text-xs font-bold px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-sm">
            <span>SKUAST-Kashmir Recognized</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
          Diploma &amp; Skill Training Directory
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed font-normal">
          Explore flagship government diploma programs including the <strong>Basic Horticulture Training Course (BHT)</strong>, <strong>Basic Agriculture Training Course (BAT)</strong>, and specialized high-density orchard skill certificates at Malangpora, Pulwama.
        </p>
      </div>

      {/* Controls Bar: Search & Category Filter */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full sm:w-88">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search diploma, subject or module..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-bold text-xs transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-900 text-amber-300 shadow-sm border border-emerald-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 border-t border-slate-100 gap-2">
          <span>Showing <strong>{filteredCourses.length}</strong> academic programmes</span>
          <span className="text-emerald-800 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Session 2026-27 Government Enrolment Active
          </span>
        </div>
      </div>

      {/* Course Cards Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-slate-50 p-12 text-center rounded-3xl border border-slate-200 space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No courses match your search</h3>
          <p className="text-xs text-slate-500">Try adjusting your search terms or select 'All' categories.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="px-5 py-2.5 bg-emerald-800 text-white font-bold text-xs rounded-full hover:bg-emerald-900 transition-all shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onSelect={onSelectCourse}
              onApply={onApplyCourse}
            />
          ))}
        </div>
      )}
    </div>
  );
};
