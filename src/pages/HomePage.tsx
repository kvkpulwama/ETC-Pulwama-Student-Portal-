import React from 'react';
import { NavigationPage, Course, NoticeItem } from '../types';
import { INSTITUTION_INFO, COURSES, NOTICES, FACULTY_LIST } from '../data/mockData';
import { CourseCard } from '../components/CourseCard';
import { 
  Award, 
  BookOpen, 
  Users, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  Download, 
  Building2, 
  PhoneCall, 
  Calendar, 
  GraduationCap, 
  ArrowRight,
  ShieldAlert,
  FileText,
  UserCheck,
  FileSpreadsheet,
  Clock,
  ClipboardList
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: NavigationPage) => void;
  onSelectCourse: (course: Course) => void;
  onApplyCourse: (course: Course) => void;
  onSelectNotice: (notice: NoticeItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectCourse,
  onApplyCourse,
  onSelectNotice
}) => {
  return (
    <div className="space-y-16 pb-20 bg-slate-50/50">
      {/* 1. Hero Banner with Dark Emerald Mesh Backdrop */}
      <section className="relative portal-hero-mesh text-white pt-16 pb-24 px-4 sm:px-8 overflow-hidden">
        {/* Farm & Orchard Overlay */}
        <div className="absolute inset-0 z-0 opacity-15 mix-blend-overlay pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=1600&q=80"
            alt="Extension Training Centre Campus"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Dynamic Glowing Radial Accents */}
        <div className="absolute -right-24 -top-24 w-[600px] h-[600px] rounded-full border-[30px] border-emerald-500/10 pointer-events-none transform rotate-12 blur-sm"></div>
        <div className="absolute -right-12 -top-12 w-[450px] h-[450px] rounded-full border-[20px] border-amber-400/10 pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-6">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 text-amber-300 font-black text-xs uppercase tracking-widest font-mono bg-emerald-950/90 px-4 py-1.5 rounded-full border border-emerald-600/60 shadow-lg glow-emerald">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>LEARN • GROW • LEAD 2026</span>
          </div>

          {/* Main Display Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black tracking-tight leading-[1.1] max-w-3xl drop-shadow-md">
            Your journey begins <br />
            <span className="italic font-normal text-gradient-gold">with purpose.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-emerald-100 max-w-2xl font-normal leading-relaxed">
            Access course material, academic updates, learning resources and everything you need to make your student life successful at <strong className="text-amber-300">Extension Training Centre, Malangpora Pulwama</strong>.
          </p>

          {/* Hero Call To Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-7 py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wide rounded-full transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 border border-amber-200 glow-amber"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Explore Student Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('courses')}
              className="px-7 py-3.5 bg-emerald-950/60 hover:bg-white/10 text-white border border-emerald-500/50 font-bold text-xs sm:text-sm uppercase tracking-wide rounded-full transition-all flex items-center gap-2 hover:border-amber-400"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>View Programmes</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Floating 3D Overlapping Quick Action Cards (Overlapping Hero Edge) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              title: 'Course Materials',
              sub: 'Notes & resources',
              icon: <FileSpreadsheet className="w-6 h-6 text-[#005E38]" />,
              page: 'downloads' as NavigationPage,
              badge: 'BHT / BAT'
            },
            {
              title: 'Class Schedule',
              sub: 'Weekly timetable',
              icon: <Clock className="w-6 h-6 text-[#005E38]" />,
              page: 'downloads' as NavigationPage,
              badge: '2026 Batch'
            },
            {
              title: 'Examination',
              sub: 'Results & notices',
              icon: <ClipboardList className="w-6 h-6 text-[#005E38]" />,
              page: 'downloads' as NavigationPage,
              badge: 'Date Sheets'
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
              className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-[0_15px_35px_rgba(0,0,0,0.12)] border border-slate-200/80 hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(0,94,56,0.2)] transition-all duration-300 group cursor-pointer flex items-start gap-4 relative overflow-hidden"
            >
              {/* Subtle 3D Top Corner Gradient Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-100 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity"></div>

              {/* 3D Icon Container */}
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-[#005E38] group-hover:border-[#005E38] group-hover:text-amber-300 transition-all duration-300 group-hover:scale-110">
                {React.cloneElement(card.icon, {
                  className: "w-6 h-6 text-[#005E38] group-hover:text-amber-300 transition-colors"
                })}
              </div>

              {/* Card Text */}
              <div className="space-y-0.5 flex-1 pr-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-[#005E38] transition-colors">
                    {card.title}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#005E38] group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-slate-500 font-medium">{card.sub}</p>
                <span className="inline-block mt-1 text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                  {card.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 3D Key Metrics Counter Band */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-[#033320] to-slate-900 rounded-3xl p-8 text-white shadow-2xl border border-emerald-800/50 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-emerald-800/40 relative overflow-hidden">
          {/* Subtle 3D Glass Glow */}
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-1">
            <p className="text-3xl sm:text-5xl font-black text-amber-300 font-serif drop-shadow">48+ Years</p>
            <p className="text-xs text-emerald-200 font-semibold uppercase tracking-wider">Academic Legacy (Est. 1978)</p>
          </div>
          <div className="space-y-1 pt-4 lg:pt-0">
            <p className="text-3xl sm:text-5xl font-black text-amber-300 font-serif drop-shadow">12,500+</p>
            <p className="text-xs text-emerald-200 font-semibold uppercase tracking-wider">Trained Extension Trainees</p>
          </div>
          <div className="space-y-1 pt-4 lg:pt-0">
            <p className="text-3xl sm:text-5xl font-black text-amber-300 font-serif drop-shadow">35 Acres</p>
            <p className="text-xs text-emerald-200 font-semibold uppercase tracking-wider">Experimental Farm Campus</p>
          </div>
          <div className="space-y-1 pt-4 lg:pt-0">
            <p className="text-3xl sm:text-5xl font-black text-amber-300 font-serif drop-shadow">100%</p>
            <p className="text-xs text-emerald-200 font-semibold uppercase tracking-wider">Field Practical Exposure</p>
          </div>
        </div>
      </section>

      {/* 4. Principal & Leadership Desk (3D Elevation Design) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-200/90 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
          {/* Decorative Corner Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0"></div>

          <div className="lg:col-span-4 text-center space-y-4 relative z-10">
            {/* 3D Layered Photo Frame */}
            <div className="relative inline-block">
              <div className="w-40 h-48 sm:w-44 sm:h-52 rounded-2xl overflow-hidden border-4 border-white shadow-[0_15px_30px_rgba(0,0,0,0.15)] mx-auto transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                <img
                  src={FACULTY_LIST[0].image}
                  alt={FACULTY_LIST[0].name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/prof-mugloo.png';
                  }}
                />
              </div>
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#005E38] text-amber-300 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                Prof. & Head
              </span>
            </div>

            <div className="pt-2">
              <h3 className="font-serif italic font-bold text-xl text-slate-900">{FACULTY_LIST[0].name}</h3>
              <p className="text-xs text-[#005E38] font-bold uppercase tracking-wider">{FACULTY_LIST[0].designation}</p>
              <p className="text-xs text-slate-500 font-medium">{FACULTY_LIST[0].qualification}</p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-5 relative z-10">
            <div className="flex items-center gap-2 text-[#005E38] font-extrabold text-xs uppercase tracking-widest font-mono">
              <UserCheck className="w-4 h-4 text-amber-500" />
              <span>Leadership Desk Message</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 leading-snug">
              "Fostering Scientific Agriculture & Modern Horticultural Expertise in Jammu & Kashmir"
            </h2>

            <blockquote className="text-xs sm:text-sm text-slate-700 italic leading-relaxed bg-emerald-50/60 p-5 rounded-2xl border-l-4 border-[#005E38]">
              "{INSTITUTION_INFO.principalMessage}"
            </blockquote>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('about')}
                className="px-6 py-2.5 bg-[#005E38] hover:bg-[#00482B] text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                <span>Read Full Leadership Profile</span>
                <ChevronRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Academic Programs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-[#005E38] uppercase tracking-widest font-mono block">
              Flagship Admissions 2026 - 2027
            </span>
            <h2 className="text-3xl font-serif font-extrabold text-slate-900 tracking-tight">
              Featured Diploma & Training Courses
            </h2>
          </div>

          <button
            onClick={() => onNavigate('courses')}
            className="text-xs font-bold text-[#005E38] hover:text-emerald-900 flex items-center gap-1 hover:underline font-mono"
          >
            <span>VIEW ALL COURSES & SYLLABUS</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3D Course Cards Grid */}
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

      {/* 6. Important Announcements & Notice Board Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-[#003820] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-400 text-slate-950 rounded-xl font-bold shadow-md">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-white">Official Notice & Circular Desk</h3>
                <p className="text-xs text-emerald-200">Latest administrative circulars, exam schedules, and results</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('downloads')}
              className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-amber-300 text-xs font-bold rounded-xl border border-emerald-700 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>Download Circulars PDF</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {NOTICES.slice(0, 3).map((notice) => (
              <div
                key={notice.id}
                onClick={() => onSelectNotice(notice)}
                className="bg-emerald-950/80 hover:bg-emerald-900/90 p-4 rounded-2xl border border-emerald-800/80 hover:border-amber-400/60 transition-all cursor-pointer group space-y-2 shadow-md hover:-translate-y-1"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-extrabold uppercase">
                    {notice.category}
                  </span>
                  <span className="text-emerald-300 font-medium">{notice.date}</span>
                </div>

                <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors leading-snug line-clamp-2">
                  {notice.title}
                </h4>

                <p className="text-[11px] text-emerald-200/80 line-clamp-2 leading-relaxed">
                  Official notification released by Extension Training Centre Malangpora Pulwama. Click to view complete guidelines.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Campus Facilities Showcase (3D Perspective Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#005E38] uppercase tracking-widest font-mono block">
            Infrastructure & Practical Labs
          </span>
          <h2 className="text-3xl font-serif font-extrabold text-slate-900">
            Experimental Facilities at Malangpora Campus
          </h2>
          <p className="text-xs text-slate-600">
            35-Acre High-Density Orchards, Soil Testing Diagnostic Centre, Polyhouses & Trainee Hostels.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: '35-Acre Experimental Orchard',
              desc: 'High-density apple, cherry, pear, and walnut orchards for pruning, grafting, and canopy management.',
              image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&q=80'
            },
            {
              title: 'Soil & Water Diagnostics Lab',
              desc: 'Chemical testing equipment for NPK, micronutrient estimation, and soil health card generation.',
              image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
            },
            {
              title: 'Hi-Tech Greenhouse Polyhouse',
              desc: 'Climate controlled protected cultivation structures for off-season vegetable farming and floriculture.',
              image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80'
            },
            {
              title: 'Residential Trainee Hostels',
              desc: 'Secure hostel blocks for trainees with modern mess facilities, library, and sports amenities.',
              image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80'
            }
          ].map((fac, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="h-44 overflow-hidden relative">
                <img 
                  src={fac.image} 
                  alt={fac.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
              </div>
              <div className="p-5 space-y-1.5">
                <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#005E38] transition-colors">{fac.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{fac.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};


