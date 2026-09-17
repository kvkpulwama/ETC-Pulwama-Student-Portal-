import React, { useState, useRef, useEffect } from 'react';
import { 
  GraduationCap, 
  Menu, 
  X, 
  UserCircle, 
  Search, 
  PhoneCall, 
  Mail, 
  MapPin, 
  LogOut,
  Sparkles,
  Award,
  ChevronRight,
  ChevronDown,
  Home,
  Info,
  BookOpen,
  Download,
  Image as ImageIcon,
  Bell,
  Globe,
  ShieldCheck,
  IdCard,
  HelpCircle,
  ArrowRight,
  UserPlus,
  CreditCard
} from 'lucide-react';
import { NavigationPage, StudentProfile } from '../types';
import { SKUAST_LOGO_DATA_URI } from '../assets/logoBase64';
import { useSiteConfig } from '../lib/siteConfigStore';

interface HeaderProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  loggedInStudent: StudentProfile | null;
  onLogoutStudent: () => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  loggedInStudent,
  onLogoutStudent,
  onOpenSearch
}) => {
  const { config } = useSiteConfig();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studentServicesDropdown, setStudentServicesDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setStudentServicesDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (page: NavigationPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setStudentServicesDropdown(false);
  };

  const isStudentServicesActive = currentPage === 'idcard' || currentPage === 'auth' || currentPage === 'dashboard';

  return (
    <header className="w-full shadow-sm z-40 bg-white sticky top-0">
      {/* 1. Top Bar: Extension Training Centre SKUAST-Kashmir */}
      <div className="bg-[#052016] text-emerald-100 text-xs py-2 px-4 sm:px-8 border-b border-emerald-900/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-serif font-bold text-amber-300 text-xs sm:text-sm tracking-wide uppercase">
              Extension Training Centre SKUAST-Kashmir
            </span>
          </div>

          <div className="hidden md:flex items-center gap-5 text-[11px] font-mono text-emerald-200/90 shrink-0">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>{config.institution.phone}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{config.institution.email}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Institutional Brand & Single-Line Navigation Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          {/* Brand Identity: SKUAST Crest + Centre Wordmark */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer shrink-0 group"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white p-1 shadow-sm border border-emerald-700/40 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
              <img 
                src={SKUAST_LOGO_DATA_URI}
                alt="SKUAST-K Emblem Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-slate-900 text-base sm:text-xl tracking-tight">
                  ETC Pulwama
                </span>
                <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono border border-emerald-300">
                  SKUAST-K
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-600 tracking-tight hidden sm:block">
                Extension Training Centre • Malangpora Campus
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs font-bold tracking-wide flex-wrap xl:flex-nowrap">
            {/* Home */}
            <button
              onClick={() => handleNavClick('home')}
              className={`py-1.5 px-2.5 xl:px-3 rounded-full flex items-center gap-1.5 xl:gap-2 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shadow-sm hover:shadow-md ${
                currentPage === 'home'
                  ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-slate-950 font-black border-t border-amber-200 border-b-2 border-amber-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]'
                  : 'text-slate-700 hover:text-emerald-900 hover:bg-emerald-50 border border-transparent font-bold'
              }`}
            >
              <span className={`flex items-center justify-center w-5 h-5 xl:w-6 xl:h-6 rounded-full shrink-0 border transition-all ${
                currentPage === 'home'
                  ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-amber-300 border-slate-750 shadow-md'
                  : 'bg-white text-slate-800 border-slate-300'
              }`}>
                <Home className="w-3 h-3 font-extrabold" />
              </span>
              <span className="text-[10px] xl:text-[11px] uppercase tracking-wider font-extrabold">Home</span>
            </button>

            {/* About */}
            <button
              onClick={() => handleNavClick('about')}
              className={`py-1.5 px-2.5 xl:px-3 rounded-full flex items-center gap-1.5 xl:gap-2 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shadow-sm hover:shadow-md ${
                currentPage === 'about'
                  ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-slate-950 font-black border-t border-amber-200 border-b-2 border-amber-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]'
                  : 'text-slate-700 hover:text-emerald-900 hover:bg-emerald-50 border border-transparent font-bold'
              }`}
            >
              <span className={`flex items-center justify-center w-5 h-5 xl:w-6 xl:h-6 rounded-full shrink-0 border transition-all ${
                currentPage === 'about'
                  ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-amber-300 border-slate-750 shadow-md'
                  : 'bg-white text-slate-800 border-slate-300'
              }`}>
                <Info className="w-3 h-3 font-extrabold" />
              </span>
              <span className="text-[10px] xl:text-[11px] uppercase tracking-wider font-extrabold">About</span>
            </button>

            {/* Courses (Replaced Diplomas with Courses) */}
            <button
              onClick={() => handleNavClick('courses')}
              className={`py-1.5 px-2.5 xl:px-3 rounded-full flex items-center gap-1.5 xl:gap-2 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shadow-sm hover:shadow-md ${
                currentPage === 'courses'
                  ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-slate-950 font-black border-t border-amber-200 border-b-2 border-amber-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]'
                  : 'text-slate-700 hover:text-emerald-900 hover:bg-emerald-50 border border-transparent font-bold'
              }`}
            >
              <span className={`flex items-center justify-center w-5 h-5 xl:w-6 xl:h-6 rounded-full shrink-0 border transition-all ${
                currentPage === 'courses'
                  ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-amber-300 border-slate-750 shadow-md'
                  : 'bg-white text-slate-800 border-slate-300'
              }`}>
                <BookOpen className="w-3 h-3 font-extrabold" />
              </span>
              <span className="text-[10px] xl:text-[11px] uppercase tracking-wider font-extrabold">Courses</span>
            </button>

            {/* Student Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setStudentServicesDropdown(!studentServicesDropdown)}
                className={`py-1.5 px-2.5 xl:px-3 rounded-full flex items-center gap-1.5 xl:gap-2 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shadow-sm hover:shadow-md ${
                  isStudentServicesActive
                    ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-slate-950 font-black border-t border-amber-200 border-b-2 border-amber-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]'
                    : 'text-slate-700 hover:text-emerald-900 hover:bg-emerald-50 border border-transparent font-bold'
                }`}
              >
                <span className={`flex items-center justify-center w-5 h-5 xl:w-6 xl:h-6 rounded-full shrink-0 border transition-all ${
                  isStudentServicesActive 
                    ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-amber-300 border-slate-750 shadow-md' 
                    : 'bg-white text-slate-800 border-slate-300'
                }`}>
                  <UserCircle className="w-3 h-3 font-extrabold" />
                </span>
                <span className="text-[10px] xl:text-[11px] uppercase tracking-wider font-extrabold">Student Services</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${studentServicesDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {studentServicesDropdown && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    onClick={() => handleNavClick(loggedInStudent ? 'dashboard' : 'auth')}
                    className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 text-xs font-bold flex items-center gap-2.5 transition-colors"
                  >
                    <UserPlus className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <div>Student Registration</div>
                      <div className="text-[10px] text-slate-400 font-normal">Login or Register Account</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavClick('idcard')}
                    className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 text-xs font-bold flex items-center gap-2.5 transition-colors border-t border-slate-100"
                  >
                    <CreditCard className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <div>Student I-Card</div>
                      <div className="text-[10px] text-slate-400 font-normal">Generate &amp; Print Identity Card</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Downloads */}
            <button
              onClick={() => handleNavClick('downloads')}
              className={`py-1.5 px-2.5 xl:px-3 rounded-full flex items-center gap-1.5 xl:gap-2 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shadow-sm hover:shadow-md ${
                currentPage === 'downloads'
                  ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-slate-950 font-black border-t border-amber-200 border-b-2 border-amber-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]'
                  : 'text-slate-700 hover:text-emerald-900 hover:bg-emerald-50 border border-transparent font-bold'
              }`}
            >
              <span className={`flex items-center justify-center w-5 h-5 xl:w-6 xl:h-6 rounded-full shrink-0 border transition-all ${
                currentPage === 'downloads'
                  ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-amber-300 border-slate-750 shadow-md'
                  : 'bg-white text-slate-800 border-slate-300'
              }`}>
                <Download className="w-3 h-3 font-extrabold" />
              </span>
              <span className="text-[10px] xl:text-[11px] uppercase tracking-wider font-extrabold">Downloads</span>
            </button>

            {/* Gallery */}
            <button
              onClick={() => handleNavClick('gallery')}
              className={`py-1.5 px-2.5 xl:px-3 rounded-full flex items-center gap-1.5 xl:gap-2 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shadow-sm hover:shadow-md ${
                currentPage === 'gallery'
                  ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-slate-950 font-black border-t border-amber-200 border-b-2 border-amber-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]'
                  : 'text-slate-700 hover:text-emerald-900 hover:bg-emerald-50 border border-transparent font-bold'
              }`}
            >
              <span className={`flex items-center justify-center w-5 h-5 xl:w-6 xl:h-6 rounded-full shrink-0 border transition-all ${
                currentPage === 'gallery'
                  ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-amber-300 border-slate-750 shadow-md'
                  : 'bg-white text-slate-800 border-slate-300'
              }`}>
                <ImageIcon className="w-3 h-3 font-extrabold" />
              </span>
              <span className="text-[10px] xl:text-[11px] uppercase tracking-wider font-extrabold">Gallery</span>
            </button>

            {/* Contact */}
            <button
              onClick={() => handleNavClick('contact')}
              className={`py-1.5 px-2.5 xl:px-3 rounded-full flex items-center gap-1.5 xl:gap-2 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shadow-sm hover:shadow-md ${
                currentPage === 'contact'
                  ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-slate-950 font-black border-t border-amber-200 border-b-2 border-amber-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]'
                  : 'text-slate-700 hover:text-emerald-900 hover:bg-emerald-50 border border-transparent font-bold'
              }`}
            >
              <span className={`flex items-center justify-center w-5 h-5 xl:w-6 xl:h-6 rounded-full shrink-0 border transition-all ${
                currentPage === 'contact'
                  ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-amber-300 border-slate-750 shadow-md'
                  : 'bg-white text-slate-800 border-slate-300'
              }`}>
                <PhoneCall className="w-3 h-3 font-extrabold" />
              </span>
              <span className="text-[10px] xl:text-[11px] uppercase tracking-wider font-extrabold">Contact</span>
            </button>

            {/* Help/FAQ */}
            <button
              onClick={() => handleNavClick('faq')}
              className={`py-1.5 px-2.5 xl:px-3 rounded-full flex items-center gap-1.5 xl:gap-2 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shadow-sm hover:shadow-md ${
                currentPage === 'faq'
                  ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-slate-950 font-black border-t border-amber-200 border-b-2 border-amber-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]'
                  : 'text-slate-700 hover:text-emerald-900 hover:bg-emerald-50 border border-transparent font-bold'
              }`}
            >
              <span className={`flex items-center justify-center w-5 h-5 xl:w-6 xl:h-6 rounded-full shrink-0 border transition-all ${
                currentPage === 'faq'
                  ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-amber-300 border-slate-750 shadow-md'
                  : 'bg-white text-slate-800 border-slate-300'
              }`}>
                <HelpCircle className="w-3 h-3 font-extrabold" />
              </span>
              <span className="text-[10px] xl:text-[11px] uppercase tracking-wider font-extrabold">Help/FAQ</span>
            </button>
          </nav>

          {/* Right Action Controls: Search, Logged-in profile chip/logout, Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-700 border border-slate-200"
                title="Search portal"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {loggedInStudent && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-300 rounded-full text-xs font-bold shadow-sm hover:bg-amber-100 transition-all"
                  title="Go to Dashboard"
                >
                  <img
                    src={loggedInStudent.photoUrl}
                    alt={loggedInStudent.name}
                    className="w-4 h-4 rounded-full object-cover border border-amber-400"
                  />
                  <span>{loggedInStudent.name.split(' ')[0]}</span>
                </button>

                <button
                  onClick={onLogoutStudent}
                  className="p-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-full transition-colors border border-slate-200"
                  title="Log out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-800 hover:bg-slate-100 lg:hidden border border-slate-200"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 text-white px-6 py-4 space-y-2 border-t border-slate-800 text-xs font-bold shadow-2xl">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left py-2.5 px-3 rounded-xl uppercase tracking-wider flex items-center gap-3 ${
                currentPage === 'home' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`w-full text-left py-2.5 px-3 rounded-xl uppercase tracking-wider flex items-center gap-3 ${
                currentPage === 'about' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </button>

            <button
              onClick={() => handleNavClick('courses')}
              className={`w-full text-left py-2.5 px-3 rounded-xl uppercase tracking-wider flex items-center gap-3 ${
                currentPage === 'courses' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Courses</span>
            </button>

            {/* Student Services Collapsible Section in Mobile */}
            <div className="space-y-1 pl-2 border-l-2 border-amber-400/40 my-1">
              <div className="text-[10px] font-bold text-amber-300 uppercase tracking-widest px-3 py-1 font-mono">
                Student Services
              </div>
              <button
                onClick={() => handleNavClick(loggedInStudent ? 'dashboard' : 'auth')}
                className={`w-full text-left py-2 px-3 rounded-lg flex items-center gap-2 text-xs ${
                  currentPage === 'auth' || currentPage === 'dashboard' ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-300" />
                <span>Student Registration</span>
              </button>

              <button
                onClick={() => handleNavClick('idcard')}
                className={`w-full text-left py-2 px-3 rounded-lg flex items-center gap-2 text-xs ${
                  currentPage === 'idcard' ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-amber-300" />
                <span>Student I-Card</span>
              </button>
            </div>

            <button
              onClick={() => handleNavClick('downloads')}
              className={`w-full text-left py-2.5 px-3 rounded-xl uppercase tracking-wider flex items-center gap-3 ${
                currentPage === 'downloads' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Downloads</span>
            </button>

            <button
              onClick={() => handleNavClick('gallery')}
              className={`w-full text-left py-2.5 px-3 rounded-xl uppercase tracking-wider flex items-center gap-3 ${
                currentPage === 'gallery' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Gallery</span>
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`w-full text-left py-2.5 px-3 rounded-xl uppercase tracking-wider flex items-center gap-3 ${
                currentPage === 'contact' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              <span>Contact</span>
            </button>

            <button
              onClick={() => handleNavClick('faq')}
              className={`w-full text-left py-2.5 px-3 rounded-xl uppercase tracking-wider flex items-center gap-3 ${
                currentPage === 'faq' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help/FAQ</span>
            </button>

            {loggedInStudent && (
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-amber-300">Signed in as {loggedInStudent.name}</span>
                <button
                  onClick={() => {
                    onLogoutStudent();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 bg-red-900/60 text-red-200 hover:bg-red-800 rounded-full text-xs font-bold"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};



