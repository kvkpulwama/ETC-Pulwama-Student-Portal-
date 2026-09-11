import React, { useState, useEffect } from 'react';
import { StudentProfile, NavigationPage } from '../types';
import { DEMO_STUDENTS, COURSES } from '../data/mockData';
import { getStudentProfileFromSupabase } from '../lib/supabase';
import { StudentIdCard } from '../components/StudentIdCard';
import { SKUAST_LOGO_DATA_URI } from '../assets/logoBase64';
import { 
  Search, 
  UserCheck, 
  Download, 
  Printer, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  Edit3, 
  Check, 
  Award, 
  Camera, 
  RefreshCw, 
  RotateCcw,
  ArrowRight,
  FileCheck2,
  CheckCircle2,
  Phone,
  MapPin,
  Heart,
  Calendar,
  Layers
} from 'lucide-react';

interface StudentIdCardPageProps {
  loggedInStudent: StudentProfile | null;
  onNavigate: (page: NavigationPage) => void;
}

const BLANK_STUDENT: StudentProfile = {
  id: '',
  name: '',
  guardianName: '',
  rollNumber: '',
  registrationNumber: '',
  courseId: 'bht-101',
  courseTitle: 'One Year Basic Horticulture Training Course (BHT)',
  designation: 'Trainee (BHT)',
  division: 'Extension Training Centre (ETC) Malangpora Pulwama',
  bloodGroup: 'A +ve',
  validUpto: '2027-10-31',
  phone: '',
  emergencyContact: '',
  address: '',
  photoUrl: '',
  email: '',
  dateOfBirth: '',
  gender: 'Male',
  batchYear: '2026-27'
};

export const StudentIdCardPage: React.FC<StudentIdCardPageProps> = ({
  loggedInStudent,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Try loading previously saved student card from localStorage if available
  const getInitialStudent = (): StudentProfile => {
    if (loggedInStudent) return loggedInStudent;
    try {
      const savedCard = localStorage.getItem('etc_my_student_icard');
      if (savedCard) {
        const parsed = JSON.parse(savedCard);
        // Ensure we do not load old demo phone numbers or old hardcoded data
        if (parsed && parsed.phone !== '7006626378' && parsed.emergencyContact !== '7006626378' && parsed.name?.trim()) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved student card', e);
    }
    return BLANK_STUDENT;
  };

  const [activeStudent, setActiveStudent] = useState<StudentProfile>(getInitialStudent);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'search'>('form');

  // Form state for trainee details
  const [formData, setFormData] = useState<StudentProfile>({
    ...activeStudent
  });

  // When loggedInStudent changes or is present
  useEffect(() => {
    if (loggedInStudent) {
      setActiveStudent(loggedInStudent);
      setFormData(loggedInStudent);
    }
  }, [loggedInStudent]);

  // Handle Search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setSubmitSuccess(false);

    try {
      const q = searchQuery.trim().toLowerCase();

      // 1. Check DEMO_STUDENTS
      const foundDemo = DEMO_STUDENTS.find(
        (s) =>
          s.rollNumber.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.registrationNumber.toLowerCase().includes(q) ||
          (s.email && s.email.toLowerCase().includes(q))
      );

      if (foundDemo) {
        setActiveStudent(foundDemo);
        setFormData(foundDemo);
        setLoading(false);
        return;
      }

      // 2. Check Supabase DB
      const supabaseStudent = await getStudentProfileFromSupabase(searchQuery.trim());
      if (supabaseStudent) {
        setActiveStudent(supabaseStudent);
        setFormData(supabaseStudent);
        setLoading(false);
        return;
      }

      // 3. Check Local registered students
      const localStr = localStorage.getItem('etc_registered_students');
      if (localStr) {
        const localList: StudentProfile[] = JSON.parse(localStr);
        const foundLocal = localList.find(
          (s) =>
            s.rollNumber.toLowerCase().includes(q) ||
            s.name.toLowerCase().includes(q) ||
            s.registrationNumber.toLowerCase().includes(q)
        );
        if (foundLocal) {
          setActiveStudent(foundLocal);
          setFormData(foundLocal);
          setLoading(false);
          return;
        }
      }

      setErrorMsg(`No trainee record found for "${searchQuery}". You can enter the details in the form below to create your I-Card.`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Lookup error. Please verify your query.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Start Fresh Form (Clear all registration details & keep clean)
  const handleStartFresh = () => {
    localStorage.removeItem('etc_my_student_icard');
    setActiveStudent(BLANK_STUDENT);
    setFormData(BLANK_STUDENT);
    setErrorMsg('');
    setSubmitSuccess(false);
  };

  // Handle Form Submission: Update Card, Persist, and Show Success
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.rollNumber.trim()) {
      setErrorMsg('Full Name and Roll Number are required.');
      return;
    }

    setErrorMsg('');
    const submittedStudent: StudentProfile = {
      ...formData,
      photoUrl: formData.photoUrl || '/default-student.jpg'
    };
    // Update the live active student card preview
    setActiveStudent(submittedStudent);

    try {
      localStorage.setItem('etc_my_student_icard', JSON.stringify(submittedStudent));
    } catch (err) {
      console.warn('Could not save to localStorage', err);
    }

    // Reset I-Card form after the student submits details (clears all fields as requested)
    handleResetForm(false);
    setSubmitSuccess(true);

    // Scroll smoothly to ID card preview on small screens
    const cardEl = document.getElementById('student-id-card-preview-section');
    if (cardEl && window.innerWidth < 1024) {
      cardEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Image Upload for Candidate Photo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photoUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset to empty / clean form
  const handleResetForm = (clearSuccess = true) => {
    const blankForm: StudentProfile = {
      id: `std_${Date.now()}`,
      name: '',
      guardianName: '',
      rollNumber: '',
      registrationNumber: '',
      courseId: 'bht-101',
      courseTitle: 'One Year Basic Horticulture Training Course',
      designation: 'Trainee (BHT)',
      division: 'Extension Training Centre (ETC) Malangpora Pulwama',
      bloodGroup: '',
      validUpto: '2027-10-31',
      phone: '',
      emergencyContact: '',
      address: '',
      photoUrl: '',
      email: '',
      dateOfBirth: '',
      gender: 'Male',
      batchYear: '2026-27'
    };
    setFormData(blankForm);
    if (clearSuccess) {
      setSubmitSuccess(false);
    }
    setErrorMsg('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner with SKUAST-K Official Emblem */}
      <div className="bg-gradient-to-r from-red-950 via-[#78121a] to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-red-800/80 space-y-4 relative overflow-hidden">
        {/* Background decorative gloss */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Circular SKUAST-K Logo */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white p-1 shadow-md border-2 border-amber-300 shrink-0 flex items-center justify-center overflow-hidden">
              <img 
                src="/SKUASTK_LOGO.png" 
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = SKUAST_LOGO_DATA_URI;
                }}
                alt="SKUAST-K Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-red-900/80 border border-red-700/60 text-amber-300 text-[11px] font-bold px-3 py-0.5 rounded-full font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>SKUAST-KASHMIR • EXTENSION TRAINING CENTRE PULWAMA</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
                Student Identity Card Portal (I-Card Form &amp; Download)
              </h1>
            </div>
          </div>

          <div className="bg-red-900/50 border border-red-700/50 rounded-2xl p-3 text-right hidden sm:block">
            <span className="text-xs text-amber-300 font-mono font-bold block">ACADEMIC SESSION 2026-27</span>
            <span className="text-[11px] text-red-200 block">ISO/IEC 7810 ID-1 CR80 Format</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-red-100 max-w-3xl leading-relaxed">
          Fill your personal, academic, and contact details in the official form below and submit to generate your verified 
          <strong> SKUAST-K Student Identity Card</strong>. Once generated, you can immediately download it in the exact card format (54 mm × 85.6 mm PDF) or print it for PVC lamination.
        </p>

        {/* Fresh Form & Reset Control */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-red-950/50 border border-red-500/30 rounded-full text-xs font-semibold text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Fresh Registration Form (Fields Blank)</span>
          </div>
          <button
            type="button"
            onClick={handleStartFresh}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/25 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
            <span>Clear / Start Fresh Form</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Trainee Details Form & Quick Lookup */}
        <div className="lg:col-span-6 space-y-6">

          {/* Form Tabs: Fill Details Form (Primary) vs. Lookup */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'form'
                  ? 'bg-white text-slate-900 shadow-sm font-extrabold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-red-700" />
              <span>Fill I-Card Details Form</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('search')}
              className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'search'
                  ? 'bg-white text-slate-900 shadow-sm font-extrabold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-slate-700" />
              <span>Lookup by Roll No</span>
            </button>
          </div>

          {/* TAB 1: Complete Trainee Details Form */}
          {activeTab === 'form' && (
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              
              {/* Form Header with Official SKUAST-K Branding */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 p-1 border border-red-200 flex items-center justify-center shrink-0">
                    <img src={SKUAST_LOGO_DATA_URI} alt="SKUAST-K" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-slate-900 text-base">
                      Trainee Identity Card Form
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Fill candidate details below to update and download the official card
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetForm}
                  className="text-xs text-slate-500 hover:text-red-700 font-semibold flex items-center gap-1 hover:underline"
                  title="Clear form to blank fields"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Error Notification */}
              {errorMsg && (
                <div className="p-3.5 bg-red-50 text-red-800 text-xs rounded-2xl border border-red-200 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Success Notification */}
              {submitSuccess && (
                <div className="p-4 bg-emerald-50 text-emerald-900 text-xs rounded-2xl border border-emerald-200 font-medium space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>I-Card Generated Successfully!</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Card preview has been updated for <strong>{activeStudent.name}</strong> (Roll No: {activeStudent.rollNumber}). 
                    You can now use the <strong>Download Card</strong> or <strong>Print Card</strong> buttons on the right to obtain your official copy.
                  </p>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-5">
                
                {/* SECTION 1: Personal Identification */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-red-700"></span>
                    <span>1. Candidate Personal Information</span>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-xs mb-1">
                      Student Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder=""
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-700 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold text-xs mb-1">
                        Father&apos;s / Guardian&apos;s Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.guardianName || ''}
                        onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                        placeholder=""
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-red-700 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold text-xs mb-1">
                        Blood Group <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={formData.bloodGroup || 'A +ve'}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-red-700 focus:bg-white focus:ring-2 focus:ring-red-700 focus:outline-none"
                      >
                        {['A +ve', 'A -ve', 'B +ve', 'B -ve', 'O +ve', 'O -ve', 'AB +ve', 'AB -ve'].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: Academic & Institutional Credentials */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-red-700"></span>
                    <span>2. Academic &amp; Roll Credentials</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold text-xs mb-1">
                        Roll Number <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.rollNumber}
                        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                        placeholder=""
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-red-800 focus:bg-white focus:ring-2 focus:ring-red-700 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold text-xs mb-1">
                        Registration Number <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.registrationNumber}
                        onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                        placeholder=""
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:bg-white focus:ring-2 focus:ring-red-700 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold text-xs mb-1">
                        Course Enrolled
                      </label>
                      <select
                        value={formData.courseId}
                        onChange={(e) => {
                          const selectedCourse = COURSES.find((c) => c.id === e.target.value);
                          const courseTitle = selectedCourse ? selectedCourse.title : formData.courseTitle;
                          // Auto calculate abbreviation: first letter of 3 words
                          let abbr = 'BHT';
                          if (courseTitle.toLowerCase().includes('horticulture')) abbr = 'BHT';
                          else if (courseTitle.toLowerCase().includes('agriculture')) abbr = 'BAT';
                          else if (courseTitle.toLowerCase().includes('floriculture')) abbr = 'FLA';
                          else if (courseTitle.toLowerCase().includes('mushroom')) abbr = 'MPT';
                          else if (courseTitle.toLowerCase().includes('apiculture')) abbr = 'APM';
                          else {
                            const words = courseTitle.replace(/[^a-zA-Z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 0 && !['and', 'of', 'for', 'in', 'the', '&'].includes(w.toLowerCase()));
                            abbr = words.slice(0, 3).map(w => w[0].toUpperCase()).join('') || 'BHT';
                          }

                          setFormData({
                            ...formData,
                            courseId: e.target.value,
                            courseTitle: courseTitle,
                            designation: `Trainee (${abbr})`
                          });
                        }}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-red-700 focus:outline-none"
                      >
                        {COURSES.map((c) => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold text-xs mb-1">
                        Trainee Abbreviation in Bracket
                      </label>
                      <div className="flex items-center gap-2">
                        <select
                          value={
                            ['BHT', 'BAT', 'FLA', 'MPT', 'APM', 'CFN'].includes(
                              (formData.designation.match(/\(([^)]+)\)/)?.[1] || '').toUpperCase()
                            )
                              ? (formData.designation.match(/\(([^)]+)\)/)?.[1] || 'BHT').toUpperCase()
                              : 'CUSTOM'
                          }
                          onChange={(e) => {
                            if (e.target.value !== 'CUSTOM') {
                              setFormData({
                                ...formData,
                                designation: `Trainee (${e.target.value})`
                              });
                            }
                          }}
                          className="w-1/2 px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-red-900 focus:bg-white focus:ring-2 focus:ring-red-700 focus:outline-none"
                        >
                          <option value="BHT">BHT (Basic Horticulture)</option>
                          <option value="BAT">BAT (Basic Agriculture)</option>
                          <option value="FLA">FLA (Floriculture)</option>
                          <option value="MPT">MPT (Mushroom Tech)</option>
                          <option value="APM">APM (Apiculture)</option>
                          <option value="CFN">CFN (Commercial Floriculture)</option>
                          <option value="CUSTOM">Custom Abbreviation...</option>
                        </select>

                        <div className="flex-1 relative">
                          <input
                            type="text"
                            maxLength={5}
                            value={formData.designation.match(/\(([^)]+)\)/)?.[1] || formData.designation.replace('Trainee', '').replace(/[() ]/g, '') || 'BHT'}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                              setFormData({
                                ...formData,
                                designation: `Trainee (${val || 'BHT'})`
                              });
                            }}
                            placeholder="e.g. BHT"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-black text-red-800 focus:bg-white focus:ring-2 focus:ring-red-700 focus:outline-none text-center uppercase"
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Displays on Card: <span className="font-bold text-red-800">{formData.designation || 'Trainee (BHT)'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold text-xs mb-1">
                        Division / Centre
                      </label>
                      <input
                        type="text"
                        value={formData.division || 'Extension Training Centre (ETC) Malangpora Pulwama'}
                        onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-red-700 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold text-xs mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-red-700" />
                          <span>Valid Upto</span>
                        </span>
                        <span className="text-[10px] text-red-700 font-semibold">Calendar Picker</span>
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="date"
                          value={
                            formData.validUpto && /^\d{4}-\d{2}-\d{2}$/.test(formData.validUpto)
                              ? formData.validUpto
                              : '2027-10-31'
                          }
                          onChange={(e) => setFormData({ ...formData, validUpto: e.target.value })}
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-red-700 focus:outline-none cursor-pointer"
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                        <span>Card validity date</span>
                        <span className="font-mono font-bold text-slate-700">
                          {formData.validUpto && /^\d{4}-\d{2}-\d{2}$/.test(formData.validUpto)
                            ? `${formData.validUpto.split('-')[2]}/${formData.validUpto.split('-')[1]}/${formData.validUpto.split('-')[0]}`
                            : formData.validUpto || '31/10/2027'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: Contact & Permanent Address */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-red-700"></span>
                    <span>3. Contact &amp; Emergency Details</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold text-xs mb-1">
                        Phone Number <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder=""
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:bg-white focus:ring-2 focus:ring-red-700 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold text-xs mb-1">
                        Emergency Contact No. <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.emergencyContact || ''}
                        onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                        placeholder=""
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:bg-white focus:ring-2 focus:ring-red-700 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-xs mb-1">
                      Permanent Address (Village, Tehsil, District) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder=""
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-red-700 focus:outline-none"
                    />
                  </div>

                  {/* Candidate Photo Upload */}
                  <div>
                    <label className="block text-slate-700 font-bold text-xs mb-1">
                      Candidate Photograph (Passport Size)
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 rounded-xl border border-slate-300 overflow-hidden bg-slate-100 shrink-0">
                        <img 
                          src={formData.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <label className="flex-1 cursor-pointer border-2 border-dashed border-red-300 hover:border-red-500 rounded-2xl p-2.5 flex items-center justify-center gap-2 hover:bg-red-50/50 transition-colors">
                        <Camera className="w-4 h-4 text-red-700" />
                        <span className="text-xs font-semibold text-slate-700">Choose photo from your device...</span>
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-red-800 via-[#901720] to-rose-900 hover:from-red-900 hover:to-rose-950 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4 text-amber-300" />
                    <span>Submit Details &amp; Generate I-Card</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Quick Search by Roll No / Database Lookup */}
          {activeTab === 'search' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <Search className="w-4 h-4 text-red-800" />
                  <span>Lookup Enrolled Trainee Record</span>
                </h2>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  Live Lookup
                </span>
              </div>

              <form onSubmit={handleSearch} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter Roll No, Regd No, or Name..."
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-red-700 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-1.5 top-1.5 p-1.5 bg-red-800 hover:bg-red-900 text-white rounded-lg transition-colors"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </form>

              {/* Quick Profile Summary after Search */}
              <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-bold">Currently Active Trainee:</span>
                  <span className="font-mono font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                    Roll: {activeStudent.rollNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Name:</span>
                  <span className="font-extrabold text-slate-900">{activeStudent.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Course:</span>
                  <span className="font-semibold text-slate-800">{activeStudent.courseTitle}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(activeStudent);
                    setActiveTab('form');
                  }}
                  className="w-full mt-2 py-1.5 bg-white hover:bg-red-50 text-red-900 font-bold text-xs rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit in Details Form</span>
                </button>
              </div>
            </div>
          )}

          {/* Institutional Note */}
          <div className="bg-red-50/60 p-5 rounded-3xl border border-red-200/80 text-xs text-red-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-red-950">
              <ShieldCheck className="w-4 h-4 text-red-700" />
              <span>Identity Verification Authority</span>
            </div>
            <p className="text-[11px] leading-relaxed text-red-900">
              This card is officially authorized by <strong>Extension Training Centre (ETC) Malangpora Pulwama</strong>, SKUAST-Kashmir. 
              The reverse side features the signature of the <strong>Head, ETC Malangpora Pulwama</strong> and emergency university contact protocols.
            </p>
          </div>
        </div>

        {/* Right Column: High-Fidelity Student ID Card Live Preview & Download Controls */}
        <div id="student-id-card-preview-section" className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            
            {/* Real-time ID Card Component with Head Signature & Card Format Downloads */}
            <StudentIdCard student={activeStudent} showControls={true} />

            {/* Quick Links Section */}
            <div className="border-t border-slate-100 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="text-slate-500">
                Need your course certificate or training marks card?
              </div>
              <button
                type="button"
                onClick={() => onNavigate('downloads')}
                className="px-4 py-2 bg-slate-100 hover:bg-red-50 text-red-900 font-bold rounded-xl border border-slate-200 hover:border-red-300 transition-all flex items-center gap-1.5"
              >
                <span>Go to Certificates</span>
                <ArrowRight className="w-3.5 h-3.5 text-red-700" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
