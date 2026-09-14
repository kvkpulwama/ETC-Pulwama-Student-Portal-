import React from 'react';
import { NavigationPage, Course } from '../types';
import { COURSES } from '../data/mockData';
import { CourseCard } from '../components/CourseCard';
import { SKUAST_LOGO_DATA_URI } from '../assets/logoBase64';
import { 
  BookOpen, 
  Sparkles, 
  ChevronRight, 
  Download, 
  FileSpreadsheet,
  Clock,
  ClipboardList,
  ShieldCheck,
  Award,
  IdCard,
  MapPin,
  GraduationCap
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
      {/* Hero Section with Official SKUAST Kashmir Logo */}
      <section className="relative text-white pt-16 pb-28 px-4 sm:px-8 overflow-hidden min-h-[520px] flex items-center justify-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 bg-[url('/campus_banner_kashmir.jpg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#005E38]/90 via-[#014429]/85 to-slate-950/95"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center space-y-6">
          
          {/* Prominent SKUAST Kashmir Official Emblem Logo */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1.5 shadow-2xl border-4 border-amber-400 flex items-center justify-center overflow-hidden hover:scale-105 transition-all duration-300">
              <img 
                src={SKUAST_LOGO_DATA_URI} 
                alt="Sher-e-Kashmir University of Agricultural Sciences & Technology of Kashmir Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/50 text-amber-300 text-xs sm:text-sm font-extrabold tracking-wider uppercase font-mono shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>SKUAST KASHMIR • ESTD 1982</span>
            </div>
          </div>

          <div className="space-y-2 max-w-4xl">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-white tracking-tight leading-snug drop-shadow-md">
              Sher-e-Kashmir University of Agricultural Sciences &amp; Technology of Kashmir
            </h2>
            <p className="text-sm sm:text-base font-semibold text-emerald-200 tracking-wide">
              Extension Training Centre, Malangpora Pulwama • Department of Agriculture Production &amp; Farmers Welfare
            </p>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight leading-[1.15] max-w-3xl text-amber-300 py-2">
            LEARN • GROW • LEAD
          </h1>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('idcard')}
              className="px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs sm:text-sm uppercase tracking-wide rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
            >
              <IdCard className="w-4 h-4 text-slate-900" />
              <span>Student I-Card Portal</span>
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="px-7 py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-500 font-bold text-xs sm:text-sm uppercase tracking-wide rounded-xl transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Student Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('courses')}
              className="px-7 py-3.5 bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700 font-bold text-xs sm:text-sm uppercase tracking-wide rounded-xl transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
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
              title: 'Student I-Card',
              sub: 'PVC card generation & print',
              icon: <IdCard className="w-6 h-6 text-[#005E38]" />,
              page: 'idcard' as NavigationPage,
              badge: 'I-Card'
            },
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
              title: 'Downloads & Forms',
              sub: 'Certificates & forms',
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

      {/* University Institutional Identity & Affiliation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-r from-emerald-900 via-[#005E38] to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/60 relative overflow-hidden">
          {/* Subtle background decorative seal */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 opacity-10 pointer-events-none w-72 h-72">
            <img src={SKUAST_LOGO_DATA_URI} alt="" className="w-full h-full object-contain" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-1.5 shadow-xl border-2 border-amber-400 flex items-center justify-center shrink-0 overflow-hidden">
                <img 
                  src={SKUAST_LOGO_DATA_URI} 
                  alt="SKUAST-Kashmir Crest" 
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950/80 border border-amber-400/40 text-amber-300 text-[11px] font-bold uppercase font-mono">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Official University Affiliation</span>
                </div>
                <h3 className="text-lg sm:text-xl font-serif font-black text-white">
                  Sher-e-Kashmir University of Agricultural Sciences &amp; Technology of Kashmir
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
                  Established in 1982, SKUAST-Kashmir is Jammu &amp; Kashmir&apos;s leading agricultural sciences university. The 
                  <strong> Extension Training Centre (ETC) Malangpora Pulwama</strong> conducts comprehensive diploma programmes, 
                  farmer extension modules, and vocational horticulture certifications under university academic standards.
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-emerald-200">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-300" />
                    <span>Malangpora Campus, Pulwama - 192308</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                    <span>BHT &amp; BAT Diploma Programmes</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => onNavigate('idcard')}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <IdCard className="w-4 h-4 text-slate-900" />
                <span>Get Trainee I-Card</span>
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="px-5 py-2.5 bg-emerald-950/70 hover:bg-emerald-950 text-white border border-emerald-600 font-bold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>About Institute</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-300" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programmes */}
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
