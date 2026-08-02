import React from 'react';
import { INSTITUTION_INFO, FACULTY_LIST } from '../data/mockData';
import skuastEmblemImg from '../assets/images/skuast-emblem.png';
import icarLogoImg from '../assets/images/icar-logo.png';
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
  Calendar 
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800 space-y-4">
        <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/60 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
          <Building2 className="w-3.5 h-3.5" />
          <span>ESTABLISHED IN {INSTITUTION_INFO.established}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          About Extension Training Centre (ETC) Pulwama
        </h1>

        <p className="text-sm sm:text-base text-emerald-100 max-w-3xl leading-relaxed">
          The Extension Training Centre (ETC) Pulwama is a premier government institution operating under the <strong>Department of Agriculture Production & Farmers Welfare, Government of Jammu & Kashmir</strong>.
        </p>

        <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-medium text-emerald-200 border-t border-emerald-800/80">
          <span>Campus Area: <strong>{INSTITUTION_INFO.campusArea}</strong></span>
          <span>Location: <strong>Koil Road, District Pulwama, J&K</strong></span>
          <span>Mandate: <strong>Extension Education & Capacity Building</strong></span>
        </div>
      </div>

      {/* Vision & Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Our Vision</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            To serve as a center of excellence in agricultural extension, empowering rural youth, extension workers, and farming communities of Jammu & Kashmir with modern scientific knowledge in temperate horticulture, agronomy, and sustainable farm management.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Our Mission</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Imparting rigorous, hands-on field practical training in high-density apple grafting, soil health diagnostics, protected greenhouse cultivation, and integrated pest management (IPM) to foster self-employment and modern agricultural productivity.
          </p>
        </div>
      </div>

      {/* Institutional Mandate & History */}
      <section className="bg-slate-50 p-6 sm:p-10 rounded-3xl border border-slate-200 space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
            Institutional Legacy
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Historical Development & Mandate
          </h2>
        </div>

        <div className="prose prose-slate max-w-none text-xs leading-relaxed space-y-4 text-slate-700">
          <p>
            Established in 1978 in District Pulwama—the agricultural heartland of Kashmir Valley—the Extension Training Centre was conceptualized to bridge the gap between laboratory research and field implementation. Over four decades, the centre has evolved into a key capacity-building hub for grassroots extension officers, agricultural assistants, and rural trainees.
          </p>
          <p>
            The institution conducts two flagship government-sponsored 1-year diploma programs: the <strong>Basic Horticulture Training Course (BHT)</strong> and the <strong>Basic Agriculture Training Course (BAT)</strong>. Trainees are selected across all districts of Jammu & Kashmir and provided with stipend support, hostel accommodation, and intensive field exposure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-emerald-700 font-bold text-xs uppercase block">Department</span>
            <p className="font-extrabold text-slate-900 text-sm">Agriculture Production & Farmers Welfare J&K</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="text-emerald-700 font-bold text-xs uppercase block">Academic Collaboration</span>
            <div className="flex items-center gap-2">
              <img src={skuastEmblemImg} alt="SKUAST" className="w-7 h-7 object-contain" referrerPolicy="no-referrer" />
              <img src={icarLogoImg} alt="ICAR" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
              <p className="font-extrabold text-slate-900 text-xs">SKUAST-K & ICAR Extension Guidelines</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-emerald-700 font-bold text-xs uppercase block">Training Focus</span>
            <p className="font-extrabold text-slate-900 text-sm">Temperate Pomology & Organic Agronomy</p>
          </div>
        </div>
      </section>

      {/* Faculty Directory Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
            Academic Leadership
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Faculty & Training Officers
          </h2>
          <p className="text-xs text-slate-600">
            Meet the experienced training officers, subject matter specialists, and agricultural scientists at ETC Pulwama.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FACULTY_LIST.map((fac) => (
            <div key={fac.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all p-5 flex gap-4 items-start">
              <img
                src={fac.image}
                alt={fac.name}
                className="w-20 h-24 rounded-xl object-cover border border-emerald-300 shrink-0 shadow-sm"
                onError={(e) => {
                  if (fac.id === 'f-1') {
                    (e.target as HTMLImageElement).src = '/prof-mugloo.png';
                  }
                }}
              />

              <div className="space-y-1 text-xs">
                <span className="text-[10px] font-bold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded">
                  {fac.department}
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{fac.name}</h3>
                <p className="font-semibold text-emerald-800 text-[11px]">{fac.designation}</p>
                <p className="text-slate-500 text-[11px]">{fac.qualification}</p>
                <p className="text-slate-600 text-[10px] italic">Exp: {fac.experience}</p>

                <div className="pt-2 flex items-center gap-1 text-[10px] text-slate-500">
                  <Mail className="w-3 h-3 text-emerald-700" />
                  <span className="font-mono text-[10px]">{fac.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
