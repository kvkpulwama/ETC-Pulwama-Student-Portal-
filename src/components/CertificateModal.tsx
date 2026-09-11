import React, { useState, useRef, useEffect } from 'react';
import { CertificateData, StudentProfile } from '../types';
import { OfficialCertificate } from './OfficialCertificate';
import { downloadCertificateAsPDF, downloadCertificateAsImage, printCertificateElement } from '../lib/certificatePdf';
import { getStudentProfileFromSupabase } from '../lib/supabase';
import { 
  X, 
  Award, 
  Download, 
  Printer, 
  Image as ImageIcon, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  Sprout, 
  Apple, 
  FileText, 
  Loader2, 
  Calendar, 
  MapPin, 
  User, 
  ShieldCheck, 
  RefreshCw, 
  Eye,
  Check,
  Building,
  HelpCircle
} from 'lucide-react';

interface CertificateModalProps {
  initialCourse?: 'BHT' | 'BAT';
  onClose: () => void;
  loggedInStudent?: StudentProfile | null;
}

const JK_DISTRICTS = [
  'PULWAMA',
  'KULGAM',
  'SRINAGAR',
  'ANANTNAG',
  'BARAMULLA',
  'BUDGAM',
  'SHOPIAN',
  'BANDIPORA',
  'GANDERBAL',
  'KUPWARA',
  'JAMMU',
  'DODA',
  'KATHUA',
  'RAJOURI',
  'POONCH',
  'RAMBAN',
  'REASI',
  'SAMBA',
  'KISHTWAR',
  'UDHAMPUR'
];

export const CertificateModal: React.FC<CertificateModalProps> = ({
  initialCourse = 'BHT',
  onClose,
  loggedInStudent = null,
}) => {
  const [courseType, setCourseType] = useState<'BHT' | 'BAT'>(initialCourse);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  // Search & lookup state
  const [searchRollNo, setSearchRollNo] = useState(loggedInStudent ? loggedInStudent.rollNumber : '');
  const [searchLoading, setSearchLoading] = useState(false);
  const [statusNotice, setStatusNotice] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  // Form Fields State
  const [candidateName, setCandidateName] = useState(loggedInStudent?.name ? loggedInStudent.name.toUpperCase() : 'SHAHJAHAN NAZKI');
  const [genderPrefix, setGenderPrefix] = useState<'Shri' | 'Smt.'>(
    loggedInStudent?.gender?.toLowerCase() === 'female' ? 'Smt.' : 'Shri'
  );
  const [relationType, setRelationType] = useState<'Son' | 'Daughter' | 'Son/Daughter'>(
    loggedInStudent?.gender?.toLowerCase() === 'female' ? 'Daughter' : 'Son'
  );
  const [parentage, setParentage] = useState(
    loggedInStudent?.guardianName ? loggedInStudent.guardianName.toUpperCase() : 'AB. SALAM SHAH'
  );
  const [residence, setResidence] = useState(
    loggedInStudent?.address ? loggedInStudent.address.toUpperCase() : 'GRIELKUND RAZIGUND'
  );
  const [district, setDistrict] = useState(
    loggedInStudent?.district ? loggedInStudent.district.toUpperCase() : 'KULGAM'
  );
  const [session, setSession] = useState(
    loggedInStudent?.batchYear ? loggedInStudent.batchYear.replace(/\s+/g, '') : '2026-27'
  );
  const [division, setDivision] = useState('First');
  const [dateOfIssue, setDateOfIssue] = useState(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  });

  // Sr No and Registration No
  const [srNo, setSrNo] = useState(() => {
    if (loggedInStudent?.rollNumber) {
      const nums = loggedInStudent.rollNumber.replace(/\D/g, '');
      return nums ? nums.slice(-2) : '82';
    }
    return '82';
  });

  const [regdNo, setRegdNo] = useState('');
  const [isManualRegd, setIsManualRegd] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Helper to compute university formatted registration number
  const generateFormattedRegdNo = (cType: 'BHT' | 'BAT', sess: string, sNumber: string) => {
    const cleanSession = sess.trim() || '2026-27';
    const num = parseInt(sNumber.trim(), 10);
    const suffix = !isNaN(num) ? 1000 + (num % 1000) : 1033;
    return `AU/ETC/${cType}/${cleanSession}/30/${suffix}`;
  };

  // Keep Registration No synced automatically unless user manually edited it
  useEffect(() => {
    if (!isManualRegd) {
      setRegdNo(generateFormattedRegdNo(courseType, session, srNo));
    }
  }, [courseType, session, srNo, isManualRegd]);

  // Construct CertificateData object
  const certData: CertificateData = {
    regdNo: regdNo || generateFormattedRegdNo(courseType, session, srNo),
    srNo: srNo || '82',
    candidateName: candidateName.toUpperCase(),
    genderPrefix,
    parentage: parentage.toUpperCase(),
    relationType,
    residence: residence.toUpperCase(),
    district: district.toUpperCase(),
    courseCode: courseType,
    courseName:
      courseType === 'BAT'
        ? 'One Year Basic Agriculture Training Course'
        : 'One Year Basic Horticulture Training Course',
    session,
    division,
    dateOfIssue,
  };

  const certRef = useRef<HTMLDivElement>(null);

  // Change Course Handler
  const handleCourseChange = (type: 'BHT' | 'BAT') => {
    setCourseType(type);
    setIsSubmitted(false);
    if (!isManualRegd) {
      setRegdNo(generateFormattedRegdNo(type, session, srNo));
    }
  };

  // Re-sync Registration No to automatic format
  const handleSyncRegdNo = () => {
    setIsManualRegd(false);
    setIsSubmitted(false);
    setRegdNo(generateFormattedRegdNo(courseType, session, srNo));
    setStatusNotice({ text: 'Registration No. regenerated as per official SKUAST-K format.', type: 'success' });
  };

  // Submit Handler: Validates and enables download while staying on same window
  const handleSubmitDetails = () => {
    if (!candidateName.trim()) {
      setStatusNotice({
        text: 'Please enter Candidate Name before submitting.',
        type: 'error',
      });
      return;
    }
    if (!parentage.trim()) {
      setStatusNotice({
        text: 'Please enter Parentage / Guardian Name.',
        type: 'error',
      });
      return;
    }

    setIsSubmitted(true);
    setStatusNotice({
      text: 'Details submitted successfully! You can now download the certificate.',
      type: 'success',
    });
  };

  // Lookup student details
  const handleStudentLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRollNo.trim()) return;

    setSearchLoading(true);
    setStatusNotice(null);

    try {
      let found: StudentProfile | null = null;

      // 1. Check Supabase DB
      found = await getStudentProfileFromSupabase(searchRollNo.trim());

      // 2. Check local registered students
      if (!found && typeof window !== 'undefined') {
        const localStr = localStorage.getItem('etc_registered_students');
        const list: StudentProfile[] = localStr ? JSON.parse(localStr) : [];
        const clean = searchRollNo.trim().toLowerCase();
        found = list.find(
          (s) =>
            s.rollNumber.toLowerCase() === clean ||
            s.email.toLowerCase() === clean ||
            s.registrationNumber?.toLowerCase() === clean
        ) || null;
      }

      if (found) {
        const isBat = found.courseId?.toLowerCase().includes('bat') || found.courseTitle?.toLowerCase().includes('agriculture');
        const code = isBat ? 'BAT' : 'BHT';
        const cleanSession = (found.batchYear || '2026-27').replace(/\s+/g, '');
        const numPart = found.rollNumber.replace(/\D/g, '') || '82';
        const sNum = numPart.slice(-2) || '82';

        setCourseType(code);
        setCandidateName(found.name.toUpperCase());
        const isFemale = found.gender?.toLowerCase() === 'female';
        setGenderPrefix(isFemale ? 'Smt.' : 'Shri');
        setRelationType(isFemale ? 'Daughter' : 'Son');
        setParentage((found.guardianName || 'AB. SALAM SHAH').toUpperCase());
        setResidence((found.address || 'Grielkund Razigund').toUpperCase());
        setDistrict((found.district || 'PULWAMA').toUpperCase());
        setSession(cleanSession);
        setSrNo(sNum);
        setIsManualRegd(false);
        setRegdNo(generateFormattedRegdNo(code, cleanSession, sNum));

        setStatusNotice({
          text: `Verified student details loaded for "${found.name}" (${found.rollNumber})!`,
          type: 'success',
        });
      } else {
        setStatusNotice({
          text: 'No student found with this Roll No/Email. You can fill in the certificate fields manually below.',
          type: 'info',
        });
      }
    } catch (err: any) {
      setStatusNotice({
        text: 'Offline notice: Details can be customized directly in the input fields below.',
        type: 'info',
      });
    } finally {
      setSearchLoading(false);
    }
  };

  // Download PDF
  const handleDownloadPDF = async () => {
    setExportLoading(true);
    setStatusNotice({
      text: 'Generating official SKUAST-K certificate in PDF format...',
      type: 'info',
    });

    try {
      // Short delay to ensure DOM and fonts are fully settled
      await new Promise((resolve) => setTimeout(resolve, 100));

      const target =
        certRef.current ||
        (document.getElementById('skuast-certificate-container') as HTMLElement);

      if (!target) {
        throw new Error('Certificate container could not be found.');
      }

      const success = await downloadCertificateAsPDF(target, certData);
      if (success) {
        setStatusNotice({
          text: `Certificate PDF for "${candidateName || 'Candidate'}" downloaded successfully!`,
          type: 'success',
        });
      } else {
        setStatusNotice({
          text: 'PDF rendering completed. If download did not trigger automatically, you can use the Print button.',
          type: 'info',
        });
      }
    } catch (err: any) {
      console.error('Failed to generate certificate PDF:', err);
      setStatusNotice({
        text: 'Direct PDF capture encountered an issue. Triggering Print dialog for PDF saving...',
        type: 'info',
      });
      window.print();
    } finally {
      setExportLoading(false);
    }
  };

  // Download PNG Image
  const handleDownloadImage = async () => {
    setExportLoading(true);
    try {
      if (activeTab !== 'preview') {
        setActiveTab('preview');
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      const target =
        certRef.current ||
        (document.getElementById('skuast-certificate-container') as HTMLElement);
      if (!target) return;

      const success = await downloadCertificateAsImage(target, certData);
      if (success) {
        setStatusNotice({
          text: `Certificate image (PNG) for "${candidateName || 'Candidate'}" downloaded successfully!`,
          type: 'success',
        });
      }
    } catch (err: any) {
      console.error('Failed to export image:', err);
    } finally {
      setExportLoading(false);
    }
  };

  // Print
  const handlePrint = () => {
    const target =
      certRef.current ||
      (document.getElementById('skuast-certificate-container') as HTMLElement);
    printCertificateElement(target);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden border border-slate-200 flex flex-col max-h-[96vh] animate-in fade-in zoom-in-95 duration-200 print:border-none print:shadow-none print:max-h-none">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-400 text-slate-950 rounded-2xl shadow-lg shrink-0 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-black tracking-wider text-amber-300 bg-emerald-900/90 px-2.5 py-0.5 rounded-full border border-emerald-700">
                  OFFICIAL SKUAST-K CERTIFICATE GENERATOR
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                Download Official Certificate (BHT / BAT)
              </h2>
            </div>
          </div>

          {/* Course Selector Tabs */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <button
              onClick={() => handleCourseChange('BHT')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                courseType === 'BHT'
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                  : 'bg-emerald-900/80 text-emerald-100 hover:bg-emerald-800'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              <span>BHT (Horticulture)</span>
            </button>

            <button
              onClick={() => handleCourseChange('BAT')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                courseType === 'BAT'
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                  : 'bg-emerald-900/80 text-emerald-100 hover:bg-emerald-800'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>BAT (Agriculture)</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors ml-2"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-Bar: Quick Auto-Fill Form & Tab Switcher */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          {/* Quick Auto-Fill Search */}
          <form onSubmit={handleStudentLookup} className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchRollNo}
                onChange={(e) => setSearchRollNo(e.target.value)}
                placeholder="Enter Roll No / Email to auto-fill..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={searchLoading}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-emerald-900 text-amber-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
            >
              {searchLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Auto-Fill</span>
            </button>
          </form>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-200 p-0.5 rounded-xl flex items-center text-xs font-bold">
              <button
                onClick={() => setActiveTab('form')}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'form' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>1. Fill Details</span>
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'preview' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>2. Certificate Preview</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Notice */}
        {statusNotice && (
          <div
            className={`px-6 py-2 text-xs flex items-center justify-between font-medium print:hidden ${
              statusNotice.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-b border-emerald-200'
                : 'bg-amber-50 text-amber-900 border-b border-amber-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{statusNotice.text}</span>
            </div>
            <button onClick={() => setStatusNotice(null)} className="text-[11px] font-bold underline ml-2">
              Dismiss
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100 flex flex-col items-center">
          
          {/* TAB 1: FILL DETAILS FORM (Like Roll No Slip Modal) */}
          {activeTab === 'form' && (
            <div className="w-full max-w-3xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6 animate-in fade-in duration-150">
              
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="font-serif font-black text-slate-900 text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-800" />
                    <span>Candidate Certificate Details ({courseType})</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fill out the fields below. The registration number &amp; serial number are automatically generated as per university protocol.
                  </p>
                </div>

                <span className="text-xs font-mono font-black bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
                  {courseType === 'BAT' ? 'BAT Agriculture' : 'BHT Horticulture'}
                </span>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                
                {/* 1. Candidate Full Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Candidate Full Name *</span>
                    </label>
                    <span className="text-[11px] text-slate-400">Shri / Smt.</span>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={genderPrefix}
                      onChange={(e) => setGenderPrefix(e.target.value as 'Shri' | 'Smt.')}
                      className="w-24 p-2.5 border border-slate-300 rounded-xl font-bold bg-slate-50 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    >
                      <option value="Shri">Shri</option>
                      <option value="Smt.">Smt.</option>
                    </select>
                    <input
                      type="text"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value.toUpperCase())}
                      placeholder="e.g. SHAHJAHAN NAZKI"
                      className="flex-1 p-2.5 border border-slate-300 rounded-xl font-bold uppercase focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* 2. Relation Type & Parentage */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-slate-800 block">
                    Parentage (Father / Mother / Guardian) *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={relationType}
                      onChange={(e) => setRelationType(e.target.value as any)}
                      className="w-36 p-2.5 border border-slate-300 rounded-xl font-bold bg-slate-50 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    >
                      <option value="Son">Son of</option>
                      <option value="Daughter">Daughter of</option>
                      <option value="Son/Daughter">Son/Daughter of</option>
                    </select>
                    <input
                      type="text"
                      value={parentage}
                      onChange={(e) => setParentage(e.target.value.toUpperCase())}
                      placeholder="e.g. AB. SALAM SHAH"
                      className="flex-1 p-2.5 border border-slate-300 rounded-xl font-bold uppercase focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* 3. Residence / Village */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Residence / Village (R/o) *</span>
                  </label>
                  <input
                    type="text"
                    value={residence}
                    onChange={(e) => setResidence(e.target.value.toUpperCase())}
                    placeholder="e.g. GRIELKUND RAZIGUND"
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-bold uppercase focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                {/* 4. District */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">
                    District *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={JK_DISTRICTS.includes(district) ? district : 'OTHER'}
                      onChange={(e) => {
                        if (e.target.value !== 'OTHER') {
                          setDistrict(e.target.value);
                        }
                      }}
                      className="w-full p-2.5 border border-slate-300 rounded-xl font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    >
                      {JK_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 5. Academic Session */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Academic Session *</span>
                  </label>
                  <input
                    type="text"
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    placeholder="e.g. 2026-27 or 2016-17"
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                {/* 6. Division / Result */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">
                    Division / Result *
                  </label>
                  <select
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="First">First Division</option>
                    <option value="Distinction">Distinction</option>
                    <option value="Second">Second Division</option>
                    <option value="Pass">Pass</option>
                  </select>
                </div>

                {/* 7. Date of Issue */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">
                    Date of Issue *
                  </label>
                  <input
                    type="text"
                    value={dateOfIssue}
                    onChange={(e) => setDateOfIssue(e.target.value)}
                    placeholder="DD-MM-YYYY (e.g. 16-10-2026)"
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                {/* 8. Serial Number (Sr. No.) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 block">
                      Serial Number (Sr. No.) *
                    </label>
                    <span className="text-[10px] text-emerald-700 font-mono font-bold">Auto-assigned</span>
                  </div>
                  <input
                    type="text"
                    value={srNo}
                    onChange={(e) => setSrNo(e.target.value)}
                    placeholder="e.g. 82"
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                {/* 9. Registration Number (Auto Generated as per university protocol) */}
                <div className="space-y-1.5 sm:col-span-2 bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-extrabold text-amber-950 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Registration Number (Regd. No.) *</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleSyncRegdNo}
                      className="text-[11px] font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Auto-Generate Format</span>
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    value={regdNo}
                    onChange={(e) => {
                      setRegdNo(e.target.value);
                      setIsManualRegd(true);
                    }}
                    placeholder={`AU/ETC/${courseType}/${session}/30/1033`}
                    className="w-full p-2.5 bg-white border border-amber-300 rounded-xl font-mono font-black text-slate-900 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                    required
                  />
                  <p className="text-[10px] text-amber-800 font-mono">
                    Format: AU/ETC/{courseType}/{session}/30/[1000 + Sr.No]
                  </p>
                </div>

              </div>

              {/* Action Buttons inside Form */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-300"
                >
                  <Eye className="w-4 h-4 text-emerald-800" />
                  <span>Preview Certificate</span>
                </button>

                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                  {/* Print Button */}
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-300 shadow-sm"
                  >
                    <Printer className="w-4 h-4 text-emerald-800" />
                    <span>Print (Color Landscape)</span>
                  </button>

                  {/* Submit Button - Keeps user on same window and enables download */}
                  <button
                    type="button"
                    onClick={handleSubmitDetails}
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 border border-emerald-700 hover:scale-102 active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    <span>Submit</span>
                  </button>

                  {/* Separate Download Certificate Button */}
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    disabled={exportLoading}
                    className={`w-full sm:w-auto px-5 py-2.5 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 border ${
                      isSubmitted
                        ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 border-amber-400 hover:scale-105 active:scale-95 ring-2 ring-emerald-600 ring-offset-1'
                        : 'bg-amber-300 hover:bg-amber-400 border-amber-400'
                    }`}
                  >
                    {exportLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    ) : (
                      <Download className="w-4 h-4 text-slate-950" />
                    )}
                    <span>Download Certificate</span>
                  </button>
                </div>
              </div>

              {/* Off-screen render node during Form mode so PDF download captures certificate format accurately from the same window */}
              <div
                style={{
                  position: 'fixed',
                  left: '-9999px',
                  top: '0',
                  width: '1000px',
                  pointerEvents: 'none',
                  opacity: 1,
                  zIndex: -50,
                }}
                aria-hidden="true"
              >
                <OfficialCertificate data={certData} ref={certRef} />
              </div>

            </div>
          )}

          {/* TAB 2: LIVE CERTIFICATE PREVIEW */}
          {activeTab === 'preview' && (
            <div className="w-full flex flex-col items-center space-y-4 animate-in fade-in duration-150">
              
              {/* Preview Action Bar */}
              <div className="w-full max-w-[960px] bg-white p-3.5 rounded-2xl border border-slate-300 shadow-sm flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Displaying Official SKUAST-K Certificate ({courseType})</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('form')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Edit Form Fields</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 border border-slate-300"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Print</span>
                  </button>

                  <button
                    onClick={handleDownloadImage}
                    disabled={exportLoading}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 border border-slate-300"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-blue-700" />
                    <span>Image (PNG)</span>
                  </button>

                  <button
                    onClick={handleDownloadPDF}
                    disabled={exportLoading}
                    className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black rounded-xl transition-all shadow flex items-center gap-1.5"
                  >
                    {exportLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                    ) : (
                      <Download className="w-3.5 h-3.5 text-amber-300" />
                    )}
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* Certificate Canvas Frame */}
              <div className="w-full max-w-[1000px] bg-white p-3 sm:p-5 rounded-3xl shadow-xl border border-slate-300 overflow-x-auto flex justify-center">
                <OfficialCertificate data={certData} ref={certRef} />
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 border-t border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              Official Certification Portal • SKUAST-Kashmir, Extension Training Centre, Pulwama
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              className="font-extrabold text-emerald-800 hover:text-emerald-950 underline text-xs flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Certificate</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
