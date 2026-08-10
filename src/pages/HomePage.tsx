import React from 'react';
import { NavigationPage, Course } from '../types';
import { COURSES } from '../data/mockData';
import { CourseCard } from '../components/CourseCard';
import { 
  BookOpen, 
  Sparkles, 
  ChevronRight, 
  Download, 
  FileSpreadsheet,
  Clock,
  ClipboardList
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: NavigationPage) => void;
  onSelectCourse: (course: Course) => void;
  onApplyCourse: (course: Course) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectCourse,
  onApplyCourse
}) => {
  return (
    <div className="space-y-12 pb-16 bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white pt-24 pb-32 px-4 sm:px-8 overflow-hidden min-h-[500px] flex items-center justify-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 bg-[url('/campus_banner_kashmir.jpg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#005E38]/80 to-slate-900/90"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center space-y-6">
          

          <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight leading-[1.1] max-w-3xl text-white py-12">
            LEARN • GROW • LEAD
          </h1>

          

          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-sm uppercase tracking-wide rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Student Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('courses')}
              className="px-8 py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-600 font-bold text-sm uppercase tracking-wide rounded-xl transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <BookOpen className="w-5 h-5 text-amber-300" />
              <span>View Programmes</span>
            </button>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              title: 'Course Materials',
              sub: 'Notes & resources',
              icon: <FileSpreadsheet className="w-6 h-6 text-[#005E38]" />,
              page: 'downloads' as NavigationPage,
              badge: 'Study'
            },
            {
              title: 'Class Schedule',
              sub: 'Weekly timetable',
              icon: <Clock className="w-6 h-6 text-[#005E38]" />,
              page: 'downloads' as NavigationPage,
              badge: 'Timetable'
            },
            {
              title: 'Examination',
              sub: 'Results & notices',
              icon: <ClipboardList className="w-6 h-6 text-[#005E38]" />,
              page: 'downloads' as NavigationPage,
              badge: 'Exams'
            },
            {
              title: 'Downloads',
              sub: 'Forms & documents',
              icon: <Download className="w-6 h-6 text-[#005E38]" />,
              page: 'downloads' as NavigationPage,
              badge: 'PDF Desk'
            }
          ].map((card, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate(card.page)}
              className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group cursor-pointer flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-[#005E38] transition-colors duration-300">
                {React.cloneElement(card.icon, {
                  className: "w-6 h-6 text-[#005E38] group-hover:text-amber-400 transition-colors"
                })}
              </div>
              <div className="space-y-0.5 flex-1 pr-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#005E38] transition-colors">
                    {card.title}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#005E38] transition-colors" />
                </div>
                <p className="text-xs text-slate-500">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              Featured Programmes
            </h2>
            <p className="text-sm text-slate-600">Explore our diploma and training courses</p>
          </div>
          <button
            onClick={() => onNavigate('courses')}
            className="text-sm font-bold text-[#005E38] hover:text-emerald-800 flex items-center gap-1 hover:underline"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.slice(0, 3).map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onSelect={onSelectCourse}
              onApply={onApplyCourse}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
