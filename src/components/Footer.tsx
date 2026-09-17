import React from 'react';
import { NavigationPage } from '../types';
import { SKUAST_LOGO_DATA_URI } from '../assets/logoBase64';
import { useSiteConfig } from '../lib/siteConfigStore';
import { 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ChevronRight, 
  ExternalLink,
  Award,
  BookOpen,
  ArrowRight,
  Globe
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: NavigationPage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { config } = useSiteConfig();
  return (
    <footer className="bg-[#061A12] text-white border-t border-emerald-900/60">
      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-white/10">
        {/* Col 1: Brand & Affiliation */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white p-1 border border-emerald-600 shrink-0 overflow-hidden flex items-center justify-center">
              <img 
                src={SKUAST_LOGO_DATA_URI} 
                alt="SKUAST-Kashmir" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-serif font-black text-xl text-white block leading-tight">
                ETC Pulwama
              </span>
              <p className="text-[10px] uppercase tracking-wider text-amber-300 font-bold font-mono">
                SKUAST-Kashmir Centre
              </p>
            </div>
          </div>

          <p className="text-xs text-white/70 leading-relaxed font-normal">
            The KVK / Extension Training Centre Malangpora, Pulwama is a knowledge and innovation hub, delivering integrated, real-time, and location-specific solutions to farmers, entrepreneurs, FPOs, and stakeholders under SKUAST-Kashmir.
          </p>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="space-y-3">
          <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-amber-300 font-mono">
            Navigation
          </h4>
          <ul className="space-y-2 text-xs font-medium">
            {[
              { page: 'home', label: 'Home' },
              { page: 'about', label: 'About KVK / ETC' },
              { page: 'courses', label: 'Academic Courses (BHT/BAT)' },
              { page: 'idcard', label: 'Student I-Card Pass' },
              { page: 'downloads', label: 'Downloads & Developer Guide' },
              { page: 'gallery', label: 'Campus & Field Gallery' },
              { page: 'contact', label: 'Helpdesk & Advisory' },
              { page: 'faq', label: 'FAQ & Student Help' }
            ].map((link) => (
              <li key={link.page}>
                <button
                  onClick={() => onNavigate(link.page as NavigationPage)}
                  className="text-white/70 hover:text-white transition-colors text-left hover:underline flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>{link.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Flagship Programs */}
        <div className="space-y-3">
          <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-amber-300 font-mono">
            Academic Courses
          </h4>
          <div className="space-y-3 text-xs">
            <div 
              onClick={() => onNavigate('courses')}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 space-y-1 cursor-pointer transition-colors"
            >
              <span className="font-serif text-white font-bold block">Basic Horticulture Training (BHT)</span>
              <p className="text-[11px] text-emerald-300">1 Year Government Diploma • High-Density Orchards</p>
            </div>
            <div 
              onClick={() => onNavigate('courses')}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 space-y-1 cursor-pointer transition-colors"
            >
              <span className="font-serif text-white font-bold block">Basic Agriculture Training (BAT)</span>
              <p className="text-[11px] text-emerald-300">1 Year Diploma • Agronomy &amp; Plant Protection</p>
            </div>
          </div>
        </div>

        {/* Col 4: Contact & Verification */}
        <div className="space-y-3">
          <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-amber-300 font-mono">
            Contact &amp; Location
          </h4>
          <div className="space-y-2.5 text-xs text-white/80">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <span>{config.institution.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-300 shrink-0" />
              <a href={`tel:${config.institution.phone}`} className="hover:underline text-white font-mono">{config.institution.phone}</a>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-300 shrink-0" />
              <a href={`mailto:${config.institution.email}`} className="hover:underline text-white font-mono">{config.institution.email}</a>
            </p>
            <p className="flex items-center gap-2 text-amber-300 font-mono text-[11px] pt-1">
              <Globe className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Domain: etcpulwama.edu</span>
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-white/50 font-bold gap-3">
        <span>© {new Date().getFullYear()} Extension Training Centre Malangpora Pulwama • SKUAST-Kashmir.</span>
        
        <div className="flex items-center gap-3">
          <span>Directorate of Extension, SKUAST-Kashmir</span>
          <span className="text-white/20">•</span>
          
          {/* discreet Admin Access Portal Link */}
          <div className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/10 transition-colors">
            <button
              onClick={() => onNavigate('admin')}
              className="text-white/60 hover:text-amber-300 transition-colors flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider group"
              title="Official Admin & Staff Management Portal"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400 group-hover:text-amber-300 transition-colors" />
              <span>Admin Access</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                const windowUrl = `${window.location.origin}${window.location.pathname}?page=admin`;
                window.open(windowUrl, 'ETCAdminPortal', 'width=1280,height=900,menubar=no,toolbar=no,location=no,status=no');
              }}
              className="text-white/40 hover:text-amber-300 transition-colors p-0.5"
              title="Open Admin Portal in Separate Window"
            >
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

