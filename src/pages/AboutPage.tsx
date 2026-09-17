import React from 'react';
import { INSTITUTION_INFO, FACULTY_LIST } from '../data/mockData';
import { SKUAST_LOGO_DATA_URI } from '../assets/logoBase64';

import { 
  Building2, 
  Target, 
  Award, 
  Users, 
  Mail, 
  CheckCircle2, 
  GraduationCap, 
  ShieldCheck, 
  BookOpen, 
  Calendar,
  Sparkles,
  Phone,
  MapPin,
  ArrowRight
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header (SKIIE Template Hero) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-[#03301D] to-slate-950 text-white p-8 sm:p-12 shadow-2xl border border-emerald-800/70 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-emerald-900/90 border border-emerald-600/60 text-amber-300 text-xs font-bold font-mono px-3.5 py-1.5 rounded-full shadow-sm">
            <Building2 className="w-3.5 h-3.5" />
            <span>ESTABLISHED IN {INSTITUTION_INFO.established}</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-white/10 text-emerald-100 text-xs font-bold px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-sm">
            <span>SKUAST-Kashmir Centre</span>
          </div>
        </div>

        <div className="space-y-3 max-w-4xl">
          <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
            About Extension Training Centre (ETC) Pulwama
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal">
            The Extension Training Centre (ETC) Malangpora, Pulwama is a premier agricultural education and capacity-building institution operating under the <strong>Department of Agriculture Production &amp; Farmers Welfare, Government of Jammu &amp; Kashmir</strong> in academic collaboration with <strong>SKUAST-Kashmir</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs font-medium text-emerald-200/90 border-t border-emerald-800/60">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Campus: <strong>Malangpora, Pulwama (J&amp;K)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Phone: <strong>01933-293294</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Email: <strong>pcpulwama@gmail.com</strong></span>
          </div>
        </div>
      </div>

      {/* Vision & Mission Bento Grid (User Specified Text) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -z-0"></div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shadow-sm relative z-10">
            <Target className="w-6 h-6" />
          </div>
          <div className="space-y-2 relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 font-mono">Institutional North Star</span>
            <h2 className="text-2xl font-serif font-black text-slate-900">Our Vision</h2>
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              The KVK Pulwama is a knowledge and innovation hub, delivering integrated, real-time, and location specific solution to farmers, entrepreneurs, FPOs and stake holders.
            </p>
          </div>
        </div>

        <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -z-0"></div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold shadow-sm relative z-10">
            <Award className="w-6 h-6" />
          </div>
          <div className="space-y-2 relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 font-mono">Core Purpose</span>
            <h2 className="text-2xl font-serif font-black text-slate-900">Our Mission</h2>
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              To serve as the district-level knowledge and resource centre for agricultural and allied sectors through assessing, refining, and disseminating location-specific technologies; building capacities of farmers and stakeholders; and promoting innovation, skill development, and entrepreneurship for sustainable agricultural development.
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Objectives Section (User Specified Text) */}
      <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 font-mono">Guiding Principles</span>
          <h3 className="text-2xl font-serif font-black text-slate-900 flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Strategic Objectives</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
              1
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              Act as a single window system for all agricultural advisory, technologies, input and support services.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
              2
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              Bridges the gap between research &amp; field level application through data and demand service extension.
            </p>
          </div>
        </div>
      </div>

      {/* Institutional Mandate & History */}
      <section className="bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-200 space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono block">
            Institutional Legacy
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
            Historical Development &amp; Mandate
          </h2>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4 text-slate-700">
          <p>
            Established in 1978 in District Pulwama—the agricultural heartland of Kashmir Valley—the Extension Training Centre was conceptualized to bridge the gap between laboratory research and field implementation. Over four decades, the centre has evolved into a premier capacity-building hub for grassroots extension officers, agricultural assistants, orchardists, and rural trainees.
          </p>
          <p>
            The institution conducts two flagship government-sponsored 1-year diploma programs: the <strong>Basic Horticulture Training Course (BHT)</strong> and the <strong>Basic Agriculture Training Course (BAT)</strong>. Trainees are selected across all districts of Jammu &amp; Kashmir and provided with stipend support, modern laboratories, nursery orchard plots, and intensive field exposure under SKUAST-Kashmir curricula.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-emerald-800 font-bold text-[11px] uppercase tracking-wider font-mono block">Administrative Dept</span>
            <p className="font-extrabold text-slate-900 text-sm">Dept of Agriculture Production &amp; Farmers Welfare, J&amp;K</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-emerald-800 font-bold text-[11px] uppercase tracking-wider font-mono block">Academic Affiliation</span>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full border border-emerald-600/40 p-0.5 bg-white shrink-0 overflow-hidden shadow-sm flex items-center justify-center">
                <img src={SKUAST_LOGO_DATA_URI} alt="SKUAST Kashmir" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <p className="font-extrabold text-slate-900 text-xs">SKUAST-Kashmir Recognized Centre</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-emerald-800 font-bold text-[11px] uppercase tracking-wider font-mono block">Specialized Focus</span>
            <p className="font-extrabold text-slate-900 text-sm">High-Density Pomology &amp; Precision Agronomy</p>
          </div>
        </div>
      </section>

      {/* Faculty Directory Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono block">
            Academic Leadership &amp; Scientific Officers
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-black text-slate-900">
            Faculty &amp; Training Officers
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Meet the experienced training officers, subject matter specialists, and agricultural scientists guiding trainees at ETC Pulwama.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FACULTY_LIST.map((fac) => (
            <div key={fac.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex gap-4 items-start group">
              <div className="w-20 h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-sm relative">
                <img
                  src={fac.image}
                  alt={fac.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/blank-avatar.svg';
                  }}
                />
              </div>

              <div className="space-y-1.5 text-xs flex-1 min-w-0">
                <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full inline-block truncate max-w-full">
                  {fac.department}
                </span>
                <h3 className="font-serif font-black text-base text-slate-900 leading-snug group-hover:text-emerald-800 transition-colors">
                  {fac.name}
                </h3>
                <p className="font-bold text-emerald-700 text-xs">{fac.designation}</p>
                <p className="text-slate-500 text-[11px] leading-tight">{fac.qualification}</p>
                <p className="text-slate-400 text-[10px] font-mono">Exp: {fac.experience}</p>

                <div className="pt-2 flex items-center gap-1.5 text-[11px] text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <a href={`mailto:${fac.email}`} className="font-mono text-[10px] hover:underline truncate">
                    {fac.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
