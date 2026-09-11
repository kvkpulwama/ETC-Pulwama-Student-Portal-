import React from 'react';
import { NavigationPage } from '../types';
import { INSTITUTION_INFO } from '../data/mockData';
import { 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ChevronRight, 
  ExternalLink,
  Award,
  BookOpen
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: NavigationPage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#1A1A1A] text-white/80 border-t border-[#1A1A1A]">
      {/* Top Editorial Banner */}
      <div className="bg-[#2D4739] text-white py-12 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-300">
              Department of Agriculture Production & Farmers Welfare, J&K
            </span>
            <h3 className="font-serif italic text-3xl font-light text-white">
              Enroll in Official Horticultural & Agricultural Diplomas
            </h3>
            <p className="text-xs text-emerald-100/80 max-w-2xl leading-relaxed">
              Admissions open for Basic Horticulture Training (BHT) and Basic Agriculture Training (BAT) at Extension Training Centre Pulwama.
            </p>
          </div>

          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => onNavigate('courses')}
              className="px-6 py-3 bg-white text-[#2D4739] text-[10px] uppercase font-bold tracking-widest hover:bg-[#F5F5F0] transition-all"
            >
              Academic Programs
            </button>
            <button
              onClick={() => onNavigate('auth')}
              className="px-6 py-3 border border-white text-white text-[10px] uppercase font-bold tracking-widest hover:bg-white hover:text-[#2D4739] transition-all"
            >
              Student Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-white/10">
        {/* Col 1 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#2D4739] text-white flex items-center justify-center font-serif text-lg italic border border-white/10">
              E
            </div>
            <div>
              <span className="font-serif italic text-xl text-white">ETC Pulwama</span>
              <p className="text-[9px] uppercase tracking-widest text-emerald-400 font-bold">Extension Training Centre</p>
            </div>
          </div>

          <p className="text-xs text-white/60 leading-relaxed font-light">
            Government of Jammu & Kashmir extension institute training agricultural officers, orchardists, and rural youth in modern high-density horticultural science and agronomy.
          </p>
        </div>

        {/* Col 2 */}
        <div className="space-y-3">
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-300">
            Navigation
          </h4>
          <ul className="space-y-2 text-xs font-medium">
            {[
              { page: 'home', label: 'Home Page' },
              { page: 'about', label: 'About Institute' },
              { page: 'courses', label: 'Diploma Courses (BHT/BAT)' },
              { page: 'idcard', label: 'Student I-Card (Digital Pass)' },
              { page: 'downloads', label: 'Downloads & Forms' },
              { page: 'gallery', label: 'Campus Orchard Gallery' },
              { page: 'contact', label: 'Helpdesk & Map' },
              { page: 'auth', label: 'Student Login / Register' },
              { page: 'admin', label: 'Admin Access' }
            ].map((link) => (
              <li key={link.page}>
                <button
                  onClick={() => onNavigate(link.page as NavigationPage)}
                  className="text-white/70 hover:text-white transition-colors text-left font-light hover:underline"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 */}
        <div className="space-y-3">
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-300">
            Programs
          </h4>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-white/5 border border-white/10 space-y-1">
              <span className="font-serif italic text-white font-bold block">Basic Horticulture Training</span>
              <p className="text-[10px] text-white/60">1 Year Government Diploma • Orchard Management</p>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 space-y-1">
              <span className="font-serif italic text-white font-bold block">Basic Agriculture Training</span>
              <p className="text-[10px] text-white/60">1 Year Diploma • Agronomy & Crop Protection</p>
            </div>
          </div>
        </div>

        {/* Col 4 */}
        <div className="space-y-3">
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-300">
            Contact & Location
          </h4>
          <div className="space-y-2 text-xs text-white/70 font-light">
            <p className="text-amber-300 font-semibold font-mono">Web Domain: etcpulwama.edu</p>
            <p>{INSTITUTION_INFO.address}</p>
            <p>Phone: {INSTITUTION_INFO.phone}</p>
            <p>Email: {INSTITUTION_INFO.email}</p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-white/40 font-bold">
        <span>© {new Date().getFullYear()} Extension Training Centre Pulwama. All Rights Reserved.</span>
        <span>J&K Dept of Agriculture Production & Farmers Welfare</span>
      </div>
    </footer>
  );
};

