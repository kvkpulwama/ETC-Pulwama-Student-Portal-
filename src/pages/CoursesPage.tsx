import React, { useState } from 'react';
import { Course, NavigationPage } from '../types';
import { COURSES } from '../data/mockData';
import { CourseCard } from '../components/CourseCard';
import { BookOpen, Search, Filter, Sparkles, Award } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800 space-y-4">
        <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/60 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
          <BookOpen className="w-3.5 h-3.5" />
          <span>ACADEMIC CATALOG 2026-27</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Courses & Skill Training Directory
        </h1>

        <p className="text-sm sm:text-base text-emerald-100 max-w-3xl leading-relaxed">
          Explore flagship government-sponsored diploma programs including the <strong>Basic Horticulture Training Course (BHT)</strong>, <strong>Basic Agriculture Training Course (BAT)</strong>, and specialized skill certificates.
        </p>
      </div>

      {/* Controls Bar: Search & Category Filter */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course name or keyword..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
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

        <div className="text-xs text-slate-500 font-medium flex items-center justify-between pt-2 border-t border-slate-100">
          <span>Showing <strong>{filteredCourses.length}</strong> available programs</span>
          <span className="text-emerald-800 font-semibold">Session 2026-27 Admissions Active</span>
        </div>
      </div>

      {/* Course Cards Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-slate-50 p-12 text-center rounded-2xl border border-slate-200 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No courses match your search</h3>
          <p className="text-xs text-slate-500">Try adjusting your keyword filter or select 'All' categories.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="px-4 py-2 bg-emerald-800 text-white font-bold text-xs rounded-xl hover:bg-emerald-900"
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
