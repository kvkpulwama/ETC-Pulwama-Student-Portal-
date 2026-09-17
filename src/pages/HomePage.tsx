import React from 'react';
import { NavigationPage } from '../types';
import { useSiteConfig } from '../lib/siteConfigStore';
import { 
  GraduationCap, 
  Building2, 
  Users, 
  Target, 
  Award, 
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Download,
  ChevronRight,
  IdCard
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: NavigationPage) => void;
  onSelectCourse?: (course: any) => void;
  onApplyCourse?: (course: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { config } = useSiteConfig();
  const impactMetrics = [
    {
      id: 'diplomates',
      number: '1,200+',
      label: 'Certified Diplomates',
      description: 'Graduated from official 1-year BHT (Horticulture) & BAT (Agriculture) programs serving in agricultural departments and rural enterprises.',
      icon: GraduationCap,
      color: 'emerald',
      bgLight: 'bg-emerald-50',
      textDark: 'text-emerald-900',
      iconColor: 'text-emerald-700'
    },
    {
      id: 'demos',
      number: '150+',
      label: 'Field Demonstrations',
      description: 'Annual applied trials conducted in high-density orchards, nursery management, rootstock propagation, and IPM protocols.',
      icon: Building2,
      color: 'amber',
      bgLight: 'bg-amber-50',
      textDark: 'text-amber-900',
      iconColor: 'text-amber-700'
    },
    {
      id: 'fpos',
      number: '45+',
      label: 'FPOs & Collectives',
      description: 'Farmer Producer Organizations, rural self-help groups, and youth agri-enterprises mentored with scientific input advisory.',
      icon: Users,
      color: 'teal',
      bgLight: 'bg-teal-50',
      textDark: 'text-teal-900',
      iconColor: 'text-teal-700'
    },
    {
      id: 'consultations',
      number: '2,500+',
      label: 'Annual Farmer Consultations',
      description: 'Real-time diagnostic support for orchard disease management, soil health testing, nutrient deficiency, and weather advisories.',
      icon: Target,
      color: 'sky',
      bgLight: 'bg-sky-50',
      textDark: 'text-sky-900',
      iconColor: 'text-sky-700'
    },
    {
      id: 'legacy',
      number: '40+',
      label: 'Years of Extension Legacy',
      description: 'Continuous grassroots extension, capacity building, and technology dissemination across Jammu & Kashmir since 1978.',
      icon: Clock,
      color: 'indigo',
      bgLight: 'bg-indigo-50',
      textDark: 'text-indigo-900',
      iconColor: 'text-indigo-700'
    },
    {
      id: 'immersion',
      number: '100%',
      label: 'Practical Field Immersion',
      description: 'Hands-on experiential learning across research orchards, automated polyhouses, and state-of-the-art soil testing labs.',
      icon: Award,
      color: 'rose',
      bgLight: 'bg-rose-50',
      textDark: 'text-rose-900',
      iconColor: 'text-rose-700'
    }
  ];

  return (
    <div className="bg-[#FDFCFB] space-y-12 pb-16">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-b from-[#0F4C2E] via-[#0A3A22] to-[#072415] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/60 overflow-hidden shadow-xl">
        {/* Ambient Subtle Radial Light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-3">
          {config.hero.badgeText && (
            <div className="inline-flex items-center gap-2 bg-amber-400/10 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{config.hero.badgeText}</span>
            </div>
          )}
          {/* Main Title: LEARN • GROW • LEAD */}
          <h1 className="font-serif font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#FFC107] drop-shadow-md uppercase">
            LEARN • GROW • LEAD
          </h1>
          {config.hero.subTitle && (
            <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl mx-auto font-medium leading-relaxed">
              {config.hero.subTitle}
            </p>
          )}
        </div>
      </div>

      {/* Floating Action Cards Row (Exact Match to Screenshot) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Student I-Card */}
          <button
            onClick={() => onNavigate('idcard')}
            className="bg-white hover:bg-emerald-50/50 rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-lg hover:shadow-xl hover:border-emerald-500/60 transition-all text-left group flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <CreditCard className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="min-w-0">
                <h3 className="font-serif font-black text-slate-900 text-sm leading-tight group-hover:text-emerald-800 transition-colors">
                  Student I-Card
                </h3>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  PVC card generation &amp; print
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* Card 2: Course Materials */}
          <button
            onClick={() => onNavigate('downloads')}
            className="bg-white hover:bg-emerald-50/50 rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-lg hover:shadow-xl hover:border-emerald-500/60 transition-all text-left group flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="min-w-0">
                <h3 className="font-serif font-black text-slate-900 text-sm leading-tight group-hover:text-emerald-800 transition-colors">
                  Course Materials
                </h3>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  Notes &amp; resources
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* Card 3: Class Schedule */}
          <button
            onClick={() => onNavigate('downloads')}
            className="bg-white hover:bg-emerald-50/50 rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-lg hover:shadow-xl hover:border-emerald-500/60 transition-all text-left group flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="min-w-0">
                <h3 className="font-serif font-black text-slate-900 text-sm leading-tight group-hover:text-emerald-800 transition-colors">
                  Class Schedule
                </h3>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  Weekly timetable
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* Card 4: Downloads & Forms */}
          <button
            onClick={() => onNavigate('downloads')}
            className="bg-white hover:bg-emerald-50/50 rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-lg hover:shadow-xl hover:border-emerald-500/60 transition-all text-left group flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Download className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="min-w-0">
                <h3 className="font-serif font-black text-slate-900 text-sm leading-tight group-hover:text-emerald-800 transition-colors">
                  Downloads &amp; Forms
                </h3>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  Certificates &amp; forms
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        </div>
      </div>

      {/* Impact Section */}
      <div className="max-w-6xl mx-auto w-full space-y-12 px-4 sm:px-6 lg:px-8 pt-6">
        {/* Header / Eyebrow */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-900/5 border border-emerald-800/15 text-emerald-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>KVK / ETC Malangpora Pulwama • SKUAST-Kashmir</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-slate-900 leading-tight">
            Our Impact as a Knowledge Hub
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Delivering integrated, real-time, and location-specific solutions to farmers, entrepreneurs, FPOs, and rural youth across Jammu &amp; Kashmir through scientific research and hands-on agricultural extension.
          </p>
        </div>

        {/* Impact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {impactMetrics.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-600/50 transition-all duration-300 space-y-4 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${item.bgLight} ${item.iconColor} flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                      ETC Pulwama
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-4xl sm:text-5xl font-serif font-black text-slate-900 tracking-tight">
                      {item.number}
                    </div>
                    <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800 font-mono">
                      {item.label}
                    </h2>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-400 group-hover:text-emerald-700 transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified Institutional Outreach</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

