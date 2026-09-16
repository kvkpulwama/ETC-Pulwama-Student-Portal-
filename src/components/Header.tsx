import React, { useState } from 'react';
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
  Home,
  Info,
  BookOpen,
  Download,
  Image as ImageIcon,
  Bell,
  Globe,
  ShieldCheck,
  IdCard,
  HelpCircle
} from 'lucide-react';
import { NavigationPage, StudentProfile } from '../types';
import { INSTITUTION_INFO, NOTICES } from '../data/mockData';
import { SKUAST_LOGO_DATA_URI } from '../assets/logoBase64';



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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as NavigationPage, label: 'Home', IconComponent: Home },
    { id: 'about' as NavigationPage, label: 'About', IconComponent: Info },
    { id: 'courses' as NavigationPage, label: 'Courses', IconComponent: BookOpen },
    { id: 'idcard' as NavigationPage, label: 'Student I-Card', IconComponent: IdCard },
    { id: 'downloads' as NavigationPage, label: 'Downloads', IconComponent: Download },
    { id: 'gallery' as NavigationPage, label: 'Gallery', IconComponent: ImageIcon },
    { id: 'contact' as NavigationPage, label: 'Contact', IconComponent: PhoneCall },
    { id: 'faq' as NavigationPage, label: 'Help/FAQ', IconComponent: HelpCircle }
  ];

  const handleNavClick = (page: NavigationPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full shadow-md z-40 bg-white">
      {/* 1. Top Utility Contact Bar */}
      <div className="bg-gradient-to-r from-[#012015] via-[#022c1e] to-[#012015] text-emerald-100 text-xs py-2 px-4 sm:px-8 border-b border-emerald-800/60 shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-medium">
          <div className="hidden sm:flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-emerald-200">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Malangpora, Pulwama, J&K
            </span>
            <span className="flex items-center gap-1.5 text-emerald-200">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              SKUAST-Kashmir
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6 text-[11px] font-mono">
            <a href="https://etcpulwama.edu" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/40 text-amber-300 font-bold hover:bg-amber-400/30 transition-all shadow-sm">
              <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              etcpulwama.edu
            </a>
            <span className="flex items-center gap-1.5 text-white/90">
              <Mail className="w-3.5 h-3.5 text-amber-300" />
              {INSTITUTION_INFO.email}
            </span>
            <span className="flex items-center gap-1.5 text-white/90">
              <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
              {INSTITUTION_INFO.phone}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Institutional White Banner with Modern Accents - SKUAST-K Official Logo */}
      <div className="bg-gradient-to-b from-white via-slate-50 to-emerald-50/20 py-4 px-4 sm:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Official SKUAST-K Emblem Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer shrink-0 group"
            title="Sher-e-Kashmir University of Agricultural Sciences & Technology of Kashmir (SKUAST-K)"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white p-1 shadow-lg border-2 border-emerald-600 flex items-center justify-center overflow-hidden group-hover:scale-105 group-hover:border-amber-400 transition-all">
              <img 
                src={SKUAST_LOGO_DATA_URI}
                alt="SKUAST-K Emblem Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Center Institution Title */}
          <div 
            onClick={() => handleNavClick('home')}
            className="text-center cursor-pointer space-y-0.5 flex-1"
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-gradient-emerald tracking-tight leading-tight drop-shadow-sm">
              Extension Training Centre, Malangpora Pulwama
            </h1>
            <p className="text-xs sm:text-sm font-sans font-bold text-slate-700 tracking-wide hidden sm:block">
              Sher-e-Kashmir University of Agricultural Sciences & Technology of Kashmir
            </p>
            <p className="text-[10px] text-emerald-800 font-bold sm:hidden">
              Department of Agriculture Production & Farmers Welfare, J&K
            </p>
          </div>

          {/* Right Spacer to preserve balanced institutional center alignment without ICAR logo */}
          <div className="w-14 sm:w-16 shrink-0 hidden sm:block pointer-events-none opacity-0" aria-hidden="true" />
        </div>
      </div>

      {/* 3. Deep Green Dynamic Navigation Bar */}
      <nav className="bg-gradient-to-r from-[#023321] via-[#045c3b] to-[#023321] text-white sticky top-0 z-50 shadow-xl border-t border-emerald-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2 flex items-center justify-between">
          {/* Desktop Links - Flex row, never wrap, taking the primary space since Brand badge is removed */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-extrabold tracking-wide flex-nowrap">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              const Icon = item.IconComponent;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`py-1.5 px-3 rounded-full flex items-center gap-2 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shadow-sm hover:shadow-md ${
                    isActive
                      ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-slate-950 font-black border-t border-amber-200 border-b-2 border-amber-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]'
                      : 'text-white hover:text-amber-300 hover:bg-emerald-800/80 hover:border-emerald-600/40 border border-transparent font-bold'
                  }`}
                >
                  {/* Real-look 3D Sphere/Bubble Icon Wrapper */}
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 border transition-all ${
                    isActive 
                      ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-amber-300 border-slate-750 shadow-[0_1.5px_2px_rgba(0,0,0,0.45),inset_0_1px_0.5px_rgba(255,255,255,0.2)]' 
                      : 'bg-gradient-to-b from-white via-slate-100 to-slate-300 text-slate-800 border-slate-200 shadow-[0_1.5px_2px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(0,0,0,0.2)]'
                  }`}>
                    <Icon className="w-3 h-3 font-extrabold" />
                  </span>
                  <span className="text-[11px] uppercase tracking-wider font-extrabold">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: Yellow Student Login Pill Button */}
          <div className="flex items-center gap-3">
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="p-2 rounded-full hover:bg-emerald-800/80 transition-colors text-white border border-emerald-600/40"
                title="Search portal"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {loggedInStudent ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="px-4 py-1.5 bg-amber-400 text-slate-950 font-black text-xs rounded-full shadow-md hover:bg-amber-300 transition-all flex items-center gap-2 border border-amber-300 hover:scale-105"
                >
                  <img
                    src={loggedInStudent.photoUrl}
                    alt={loggedInStudent.name}
                    className="w-4 h-4 rounded-full object-cover border border-slate-900"
                  />
                  <span>{loggedInStudent.name.split(' ')[0]}'s Portal</span>
                </button>

                <button
                  onClick={onLogoutStudent}
                  className="p-1.5 bg-emerald-950 hover:bg-red-700 text-white rounded-full transition-colors border border-emerald-700/60"
                  title="Log out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('auth')}
                className="px-5 py-2 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-2 border border-amber-200 glow-amber"
              >
                <UserCircle className="w-4 h-4 text-slate-950" />
                <span>Student Login</span>
              </button>
            )}

            {/* Admin Access Button */}
            <button
              onClick={() => handleNavClick('admin')}
              className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-amber-300 font-extrabold text-[11px] rounded-full shadow border border-emerald-600/60 transition-all flex items-center gap-1.5"
              title="Admin Portal Access"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Admin Access</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white hover:bg-emerald-800 lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#00482B] px-6 py-4 space-y-3 border-t border-emerald-700 text-xs font-bold">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              const Icon = item.IconComponent;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left py-2 uppercase tracking-wider flex items-center gap-3 transition-colors ${
                    isActive ? 'text-amber-300 font-extrabold' : 'text-white/85 hover:text-white'
                  }`}
                >
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 border ${
                    isActive 
                      ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-amber-300 border-slate-700 shadow-md' 
                      : 'bg-gradient-to-b from-white via-slate-100 to-slate-300 text-slate-800 border-slate-200'
                  }`}>
                    <Icon className="w-3 h-3" />
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-2 border-t border-emerald-700 space-y-2">
              <button
                onClick={() => handleNavClick('auth')}
                className="w-full bg-amber-400 text-slate-950 py-2.5 rounded-full font-bold text-center flex items-center justify-center gap-2"
              >
                <UserCircle className="w-4 h-4" />
                <span>Student Login / Registration</span>
              </button>
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full bg-emerald-950 text-amber-300 py-2 rounded-full font-bold text-center flex items-center justify-center gap-2 border border-emerald-700"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Portal Access</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};


