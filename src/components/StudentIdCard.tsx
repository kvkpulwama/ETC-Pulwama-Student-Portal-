import React, { useState, useRef, useEffect } from 'react';
import { StudentProfile } from '../types';
import { 
  Printer, 
  Download, 
  RotateCw, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronDown, 
  Image as ImageIcon, 
  FileText, 
  Layers,
  AlertCircle,
  ExternalLink,
  Eye,
  X
} from 'lucide-react';
import { SKUAST_LOGO_DATA_URI } from '../assets/logoBase64';
import { 
  printStudentIdCard, 
  downloadStudentIdCardPDF, 
  downloadStudentIdCardImage,
  convertImageUrlToDataUri,
  printViaDocumentPortal,
  printViaIframe,
  createPrintableBlobUrl,
  captureCardCanvas,
  CR80_CARD_WIDTH_MM,
  CR80_CARD_HEIGHT_MM
} from '../lib/idCardPrint';

/**
 * Formats validUpto date nicely for display on ID cards:
 * "2027-10-31" -> "31/10/2027"
 */
export function formatValidUpto(val?: string): string {
  if (!val) return '31/10/2027';
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
    const [year, month, day] = val.split('-');
    return `${day}/${month}/${year}`;
  }
  return val;
}

/**
 * Extracts / formats the trainee designation with abbreviation in brackets:
 * e.g. "Basic Horticulture Training" -> "Trainee (BHT)"
 * e.g. "Basic Agriculture Training" -> "Trainee (BAT)"
 */
export function formatTraineeDesignation(designation?: string, courseTitle?: string): string {
  // If designation already has bracket like "Trainee (BHT)" or "(BAT)"
  if (designation && designation.trim()) {
    const d = designation.trim();
    if (d.startsWith('Trainee (')) return d;
    const match = d.match(/\(([^)]+)\)/);
    if (match && match[1]) {
      return `Trainee (${match[1].trim().toUpperCase()})`;
    }
    // If it's a short 2-5 letter abbreviation like "BHT"
    if (d.length <= 5 && !d.includes(' ')) {
      return `Trainee (${d.toUpperCase()})`;
    }
  }

  // Derive from courseTitle
  const course = (courseTitle || '').trim();
  if (!course) return 'Trainee (BHT)';

  if (course.toLowerCase().includes('horticulture')) return 'Trainee (BHT)';
  if (course.toLowerCase().includes('agriculture')) return 'Trainee (BAT)';
  if (course.toLowerCase().includes('floriculture')) return 'Trainee (FLA)';
  if (course.toLowerCase().includes('mushroom')) return 'Trainee (MPT)';
  if (course.toLowerCase().includes('apiculture') || course.toLowerCase().includes('bee')) return 'Trainee (APM)';

  // First letter of the first three significant words
  const words = course
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0 && !['and', 'of', 'for', 'in', 'the', '&', 'course', 'training'].includes(w.toLowerCase()));

  if (words.length >= 3) {
    const abbr = (words[0][0] + words[1][0] + words[2][0]).toUpperCase();
    return `Trainee (${abbr})`;
  } else if (words.length > 0) {
    const abbr = words.slice(0, 3).map(w => w[0].toUpperCase()).join('');
    return `Trainee (${abbr})`;
  }

  return 'Trainee (BHT)';
}

/**
 * Vector SVG signature of Head, ETC Malangpora Pulwama (Dr. Javeed Ahmad Mugloo)
 */
const HeadEtcSignature: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 400 160" 
    className="h-9 w-auto object-contain"
    aria-label="Signature of Head ETC Malangpora Pulwama"
  >
    <g fill="none" stroke="#252468" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="140" cy="46" r="3.5" fill="#252468" stroke="none" />
      <path d="M 140 48 L 156 128 C 158 135, 153 140, 149 130 C 145 110, 138 90, 8 116 C 50 114, 120 100, 166 94" />
      <circle cx="180" cy="65" r="3.5" fill="#252468" stroke="none" />
      <path d="M 179 67 L 173 138" />
      <path d="M 190 92 C 194 88, 198 84, 204 88 C 210 93, 215 90, 222 84 C 228 80, 236 86, 244 88" />
      <path d="M 182 108 L 395 92" />
    </g>
  </svg>
);

interface StudentIdCardProps {
  student: StudentProfile;
  showControls?: boolean;
}

export const StudentIdCard: React.FC<StudentIdCardProps> = ({ 
  student, 
  showControls = true 
}) => {
  const [activeSide, setActiveSide] = useState<'front' | 'back' | 'both'>('front');
  const [downloading, setDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<string>('');
  const [downloadError, setDownloadError] = useState<string>('');
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showPrintMenu, setShowPrintMenu] = useState(false);
  const [downloadResult, setDownloadResult] = useState<{
    url: string;
    filename: string;
    type: 'pdf' | 'png';
  } | null>(null);

  // Dedicated Print Modal state & pre-rendered card images
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printLayout, setPrintLayout] = useState<'card' | 'a4_sheet'>('card');
  const [printSide, setPrintSide] = useState<'front' | 'back' | 'both'>('front');
  const [printModalData, setPrintModalData] = useState<{
    blobUrl: string;
    frontImg: string;
    backImg: string;
  } | null>(null);
  
  // Safe Base64 Data URI for the photo to guarantee zero CORS canvas taint
  const [safePhotoUri, setSafePhotoUri] = useState<string>(student.photoUrl || '');

  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);
  const exportFrontRef = useRef<HTMLDivElement>(null);
  const exportBackRef = useRef<HTMLDivElement>(null);

  // Pre-convert photo URL to data URI to ensure html2canvas never fails
  useEffect(() => {
    let isMounted = true;
    if (student.photoUrl) {
      if (student.photoUrl.startsWith('data:')) {
        setSafePhotoUri(student.photoUrl);
      } else {
        convertImageUrlToDataUri(student.photoUrl)
          .then((uri) => {
            if (isMounted && uri) setSafePhotoUri(uri);
          })
          .catch(() => {
            if (isMounted) setSafePhotoUri(student.photoUrl || '');
          });
      }
    }
    return () => {
      isMounted = false;
    };
  }, [student.photoUrl]);

  // Resolve front and back DOM nodes safely (prioritizing visible or always-mounted export nodes)
  const getFrontElement = (): HTMLElement => {
    return (
      frontCardRef.current ||
      exportFrontRef.current ||
      document.getElementById('skuast-card-front') ||
      document.getElementById('skuast-export-front')
    ) as HTMLElement;
  };

  const getBackElement = (): HTMLElement => {
    return (
      backCardRef.current ||
      exportBackRef.current ||
      document.getElementById('skuast-card-back') ||
      document.getElementById('skuast-export-back')
    ) as HTMLElement;
  };

  // Trainee designation with abbreviation in brackets
  const traineeDesignation = formatTraineeDesignation(student.designation, student.courseTitle);

  // 1. One-click direct Card format print
  const handlePrint = async (layout: 'card' | 'a4_sheet' = 'card', sideToPrint: 'front' | 'back' | 'both' = activeSide) => {
    setShowPrintMenu(false);
    setDownloadError('');
    const frontEl = getFrontElement();
    const backEl = getBackElement();
    if (!frontEl) return;
    
    setIsPrinting(true);
    setPrintLayout(layout);
    setPrintSide(sideToPrint);

    try {
      const res = await printStudentIdCard(frontEl, sideToPrint, backEl, layout, student.name);
      setPrintModalData({
        blobUrl: res.printableBlobUrl,
        frontImg: res.frontImgData,
        backImg: res.backImgData
      });
      // Direct print was dispatched to browser; keep modal closed unless user requests preview
    } catch (e: any) {
      console.warn('Direct print notice:', e);
      // If direct print hit an iframe obstacle, open the modal as an interactive fallback
      setShowPrintModal(true);
    } finally {
      setIsPrinting(false);
    }
  };

  // 1b. Open Print Preview & Options Dialog
  const handleOpenPrintPreview = async (layout: 'card' | 'a4_sheet' = 'card', sideToPrint: 'front' | 'back' | 'both' = activeSide) => {
    setShowPrintMenu(false);
    setDownloadError('');
    const frontEl = getFrontElement();
    const backEl = getBackElement();
    if (!frontEl) return;

    setIsPrinting(true);
    setPrintLayout(layout);
    setPrintSide(sideToPrint);

    try {
      const frontCanvas = await captureCardCanvas(frontEl);
      const frontImgData = frontCanvas.toDataURL('image/png');
      let backImgData = '';
      if (backEl) {
        try {
          const backCanvas = await captureCardCanvas(backEl);
          backImgData = backCanvas.toDataURL('image/png');
        } catch (bErr) {
          console.warn('Back capture warning:', bErr);
        }
      }
      const blobUrl = createPrintableBlobUrl(frontImgData, backImgData, sideToPrint, layout, student.name);
      setPrintModalData({
        blobUrl,
        frontImg: frontImgData,
        backImg: backImgData
      });
      setShowPrintModal(true);
    } catch (e: any) {
      console.warn('Preview preparation error:', e);
      setShowPrintModal(true);
    } finally {
      setIsPrinting(false);
    }
  };

  // 2. Download Card Format PDF (Standard CR80 54mm x 85.6mm)
  const handleDownloadPDF = async (format: 'card' | 'a4_sheet' = 'card', sideToDownload: 'front' | 'back' | 'both' = activeSide) => {
    setShowDownloadMenu(false);
    setDownloadError('');
    const frontEl = getFrontElement();
    const backEl = getBackElement();
    if (!frontEl) return;

    setDownloading(true);
    setDownloadStatus(format === 'card' ? 'Generating Card PDF...' : 'Preparing A4 Sheet...');

    try {
      const res = await downloadStudentIdCardPDF(frontEl, student.name, sideToDownload, backEl, format);
      if (res && (res.blobUrl || res.dataUri)) {
        setDownloadResult({
          url: res.blobUrl || res.dataUri,
          filename: res.filename,
          type: 'pdf'
        });
      }
    } catch (e: any) {
      console.error('PDF export error:', e);
      setDownloadError('Direct PDF generation error. Exporting high-definition card image...');
      // Direct image fallback so student always gets their card
      try {
        const imgRes = await downloadStudentIdCardImage(frontEl, student.name, 'Front');
        if (imgRes && imgRes.dataUrl) {
          setDownloadResult({
            url: imgRes.dataUrl,
            filename: imgRes.filename,
            type: 'png'
          });
        }
      } catch (imgErr) {
        console.error('Fallback image failed:', imgErr);
        setDownloadError('Could not export automatically. Please use the Print button to save as PDF.');
      }
    } finally {
      setDownloading(false);
      setDownloadStatus('');
    }
  };

  // 3. Download as High-Res PNG Image
  const handleDownloadPNG = async (sideToDownload: 'front' | 'back' = activeSide === 'back' ? 'back' : 'front') => {
    setShowDownloadMenu(false);
    setDownloadError('');
    const el = sideToDownload === 'front' ? getFrontElement() : getBackElement();
    if (!el) return;

    setDownloading(true);
    setDownloadStatus('Exporting HD Card Image...');

    try {
      const imgRes = await downloadStudentIdCardImage(el, student.name, sideToDownload === 'front' ? 'Front' : 'Back');
      if (imgRes && imgRes.dataUrl) {
        setDownloadResult({
          url: imgRes.dataUrl,
          filename: imgRes.filename,
          type: 'png'
        });
      }
    } catch (e: any) {
      console.error('Image export error:', e);
      setDownloadError('Image download failed. Please try Print Card.');
    } finally {
      setDownloading(false);
      setDownloadStatus('');
    }
  };

  /**
   * Reusable Front Card Rendering
   * Top Header: "Extension Training Centre SKUAST Kashmir Pulwama"
   * Logo: Official SKUAST-K circular emblem
   * Trainee: "Trainee (BHT)" or "(BAT)" in brackets
   */
  const renderFrontCard = (id: string, refHook: React.RefObject<HTMLDivElement | null>) => (
    <div 
      id={id}
      ref={refHook}
      className="w-[350px] h-[555px] rounded-2xl bg-white overflow-hidden shadow-2xl border border-slate-300/90 relative flex flex-col my-2 shrink-0 select-none transition-all"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Top Agricultural Light Green Gradient Header (~45% height) */}
      <div className="h-[245px] w-full bg-gradient-to-b from-[#1b5e20] via-[#2e7d32] to-[#388e3c] flex flex-col items-center pt-4 px-3 relative shrink-0">
        {/* Radial specular gloss */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/25 via-transparent to-black/30 pointer-events-none"></div>

        {/* Official SKUAST-K Kashmir Logo (Circular with thin white/gold ring) */}
        <div className="w-[70px] h-[70px] rounded-full bg-white p-0.5 shadow-xl flex items-center justify-center overflow-hidden z-10 border-2 border-amber-300 shrink-0">
          <img
            src={SKUAST_LOGO_DATA_URI}
            alt="SKUAST Kashmir Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Top Header Text: Extension Training Centre SKUAST Kashmir Pulwama */}
        <div className="text-center z-10 drop-shadow-md mt-1.5 px-1">
          <h2 className="text-white font-extrabold text-[14px] tracking-wide uppercase leading-tight font-sans">
            Extension Training Centre
          </h2>
          <h3 className="text-amber-300 font-black text-[12.5px] tracking-wider uppercase leading-tight font-sans mt-0.5">
            SKUAST Kashmir Pulwama
          </h3>
        </div>

        {/* Student / Trainee Photo: Arched / Domed shape overlapping the green & white zones */}
        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 z-20">
          <div className="w-[116px] h-[132px] rounded-t-full rounded-b-2xl overflow-hidden border-[3.5px] border-white bg-slate-200 shadow-xl ring-2 ring-emerald-400/30 flex items-center justify-center">
            {safePhotoUri ? (
              <img
                src={safePhotoUri}
                alt={student.name || 'Trainee'}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400">
                <svg viewBox="0 0 100 115" className="w-20 h-24 text-slate-400 fill-current">
                  <circle cx="50" cy="40" r="24" />
                  <path d="M 12 105 C 12 78 30 68 50 68 C 70 68 88 105 88 105 Z" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom White Section (~55% height) with SKUAST Watermark Seal */}
      <div className="flex-1 bg-white pt-16 pb-3 px-7 flex flex-col justify-between relative overflow-hidden">
        {/* Official SKUAST Kashmir Security Emblem Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.08] z-0">
          <img
            src={SKUAST_LOGO_DATA_URI}
            alt=""
            className="w-48 h-48 object-contain"
            aria-hidden="true"
          />
        </div>

        {/* Candidate Name & Trainee Designation with Course Abbreviation */}
        <div className="text-left space-y-0.5 relative z-10">
          <h3 className="font-extrabold text-slate-900 text-lg tracking-tight leading-tight">
            {student.name || 'STUDENT NAME'}
          </h3>
          <p className="text-xs font-bold text-emerald-800 tracking-wide">
            {traineeDesignation}
          </p>
        </div>

        {/* Detail Rows with Clean Colon Alignment */}
        <div className="space-y-1.5 text-[13px] text-slate-900 font-semibold my-auto pt-1 relative z-10">
          <div className="flex items-baseline leading-normal">
            <span className="w-[110px] shrink-0 text-slate-700 font-bold">Roll No.</span>
            <span className="mr-2 text-slate-900 font-bold shrink-0">:</span>
            <span className="font-bold text-slate-900 font-mono text-[13px] leading-normal flex-1">
              {student.rollNumber || '—'}
            </span>
          </div>

          <div className="flex items-baseline leading-normal">
            <span className="w-[110px] shrink-0 text-slate-700 font-bold">Registration</span>
            <span className="mr-2 text-slate-900 font-bold shrink-0">:</span>
            <span className="font-bold text-slate-900 font-mono text-[12px] leading-normal break-all flex-1">
              {student.registrationNumber || '—'}
            </span>
          </div>

          <div className="flex items-baseline leading-normal">
            <span className="w-[110px] shrink-0 text-slate-700 font-bold">Phone</span>
            <span className="mr-2 text-slate-900 font-bold shrink-0">:</span>
            <span className="font-bold text-slate-900 font-mono text-[13px] leading-normal flex-1">
              {student.phone || '—'}
            </span>
          </div>

          <div className="flex items-baseline leading-normal">
            <span className="w-[110px] shrink-0 text-slate-700 font-bold">Valid upto</span>
            <span className="mr-2 text-slate-900 font-bold shrink-0">:</span>
            <span className="font-bold text-slate-900 text-[13px] leading-normal flex-1">
              {formatValidUpto(student.validUpto)}
            </span>
          </div>
        </div>

        {/* Bottom Right: Head ETC Malangpora Pulwama Signature */}
        <div className="flex justify-end items-end pt-1 relative z-10">
          <div className="text-center w-36">
            <div className="h-9 w-full flex items-center justify-center">
              <HeadEtcSignature />
            </div>
            <div className="border-t border-emerald-800/30 pt-0.5">
              <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight block font-sans leading-tight">
                Head, ETC Malangpora
              </span>
              <span className="text-[8.5px] font-bold text-emerald-800 uppercase tracking-tighter block font-sans">
                Pulwama (SKUAST-K)
              </span>
            </div>
          </div>
        </div>

        {/* Subtle Agriculture Green Bottom Accent Stripe */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-600 via-green-400 to-emerald-700 absolute bottom-0 left-0"></div>
      </div>
    </div>
  );

  /**
   * Reusable Back Card Rendering
   * Address: EXACT permanent address entered by student
   * Return Address: "If found please return to SKUAST-K ETC Malangpora Pulwama, Head Office No. 01933-293294"
   */
  const renderBackCard = (id: string, refHook: React.RefObject<HTMLDivElement | null>) => (
    <div 
      id={id}
      ref={refHook}
      className="w-[350px] h-[555px] rounded-2xl bg-white overflow-hidden shadow-2xl border border-slate-300/90 relative flex flex-col my-2 shrink-0 select-none transition-all"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Top Agricultural Green Portion (~38% height) */}
      <div className="h-[215px] w-full bg-gradient-to-b from-[#1b5e20] via-[#2e7d32] to-[#388e3c] flex flex-col items-center justify-center p-4 text-center relative shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/35 pointer-events-none"></div>

        {/* Official SKUAST-K Kashmir Logo (Circular with thin white ring) */}
        <div className="w-[66px] h-[66px] rounded-full bg-white p-0.5 shadow-xl flex items-center justify-center overflow-hidden z-10 border-2 border-amber-300 mb-1.5 shrink-0">
          <img
            src={SKUAST_LOGO_DATA_URI}
            alt="SKUAST Kashmir Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* University Header */}
        <h2 className="text-white font-black text-base tracking-wide uppercase leading-tight z-10 font-sans">
          Sher-e-Kashmir
        </h2>
        <h3 className="text-amber-300 font-extrabold text-[12.5px] leading-snug z-10 mt-0.5 font-sans px-2">
          University of Agricultural Sciences &amp; Technology of Kashmir
        </h3>
        <p className="text-emerald-100 text-[11px] font-medium mt-1 z-10 tracking-wide font-sans">
          Main Campus, Shalimar, Srinagar - 190025
        </p>
      </div>

      {/* Middle White Portion (~50% height) with SKUAST Watermark Seal */}
      <div className="flex-1 bg-white p-6 flex flex-col justify-center text-[13px] text-slate-900 font-semibold space-y-2.5 relative overflow-hidden">
        {/* Official SKUAST Kashmir Security Emblem Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.08] z-0">
          <img
            src={SKUAST_LOGO_DATA_URI}
            alt=""
            className="w-48 h-48 object-contain"
            aria-hidden="true"
          />
        </div>

        {/* Primary Candidate Fields */}
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-baseline leading-normal">
            <span className="w-[110px] shrink-0 text-slate-700 font-bold">Name</span>
            <span className="mr-2 text-slate-900 font-bold shrink-0">:</span>
            <span className="font-extrabold text-slate-900 text-[13px] leading-normal flex-1 break-words">
              {student.name || '—'}
            </span>
          </div>

          <div className="flex items-baseline leading-normal">
            <span className="w-[110px] shrink-0 text-slate-700 font-bold">Father&apos;s Name</span>
            <span className="mr-2 text-slate-900 font-bold shrink-0">:</span>
            <span className="font-bold text-slate-900 text-[13px] leading-normal flex-1 break-words">
              {student.guardianName || '—'}
            </span>
          </div>

          <div className="flex items-baseline leading-normal">
            <span className="w-[110px] shrink-0 text-slate-700 font-bold">Blood Group</span>
            <span className="mr-2 text-slate-900 font-bold shrink-0">:</span>
            <span className="font-extrabold text-emerald-800 text-[13px] leading-normal flex-1">
              {student.bloodGroup || '—'}
            </span>
          </div>

          <div className="flex items-start leading-normal">
            <span className="w-[110px] shrink-0 text-slate-700 font-bold">Division</span>
            <span className="mr-2 text-slate-900 font-bold shrink-0">:</span>
            <span className="font-bold text-slate-900 text-[12.5px] leading-snug flex-1">
              {student.division || 'Extension Training Centre (ETC) Malangpora Pulwama'}
            </span>
          </div>
        </div>

        {/* Address: EXACT permanent address entered by student */}
        <div className="pt-2 border-t border-slate-100 relative z-10">
          <div className="flex items-start leading-normal">
            <span className="w-[110px] shrink-0 text-slate-700 font-bold shrink-0">Address</span>
            <span className="mr-2 text-slate-900 font-bold shrink-0">:</span>
            <div className="font-bold text-slate-900 leading-snug text-xs break-words flex-1">
              {student.address || '—'}
            </div>
          </div>
        </div>

        {/* Emergency Contact No. */}
        <div className="pt-1.5 relative z-10">
          <p className="font-bold text-slate-900 text-xs flex items-baseline leading-normal">
            <span className="text-slate-700">Emergency Contact No.</span>
            <span className="font-mono font-black text-slate-950 ml-2 text-xs">
              {student.emergencyContact || student.phone || '—'}
            </span>
          </p>
        </div>
      </div>

      {/* Bottom Horticulture & Agriculture Green Strip: Updated Return Details with SKUAST Logo */}
      <div className="bg-[#2e7d32] text-white py-2 px-3 flex items-center justify-center gap-2.5 border-t border-emerald-700 shrink-0">
        <div className="w-6 h-6 rounded-full bg-white p-0.5 shadow-xs flex items-center justify-center overflow-hidden shrink-0 border border-amber-300">
          <img
            src={SKUAST_LOGO_DATA_URI}
            alt="SKUAST-K"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-center">
          <p className="text-[11.5px] font-black tracking-wide leading-tight">
            If found please return to SKUAST-K ETC Malangpora Pulwama
          </p>
          <p className="text-[11px] font-bold tracking-wide text-amber-200 mt-0.5">
            Head Office No. 01933-293294
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      {showControls && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>SKUAST-K OFFICIAL IDENTITY CARD</span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base mt-1">
              {student.name}&apos;s Identity Card
            </h4>
            <p className="text-xs text-slate-500">
              Roll No: <span className="font-mono font-bold text-slate-700">{student.rollNumber}</span> • Regd: <span className="font-mono font-bold text-slate-700">{student.registrationNumber}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Side Switch Buttons */}
            <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1 text-xs font-bold text-slate-700">
              <button
                type="button"
                onClick={() => setActiveSide('front')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeSide === 'front'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                Front Side
              </button>
              <button
                type="button"
                onClick={() => setActiveSide('back')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeSide === 'back'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                Back Side
              </button>
              <button
                type="button"
                onClick={() => setActiveSide('both')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeSide === 'both'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                Both Sides
              </button>
            </div>

            {/* Quick Flip Button */}
            {activeSide !== 'both' && (
              <button
                type="button"
                onClick={() => setActiveSide(activeSide === 'front' ? 'back' : 'front')}
                className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl transition-all shadow-xs"
                title="Flip ID Card"
              >
                <RotateCw className="w-4 h-4 text-slate-600" />
              </button>
            )}

            {/* PRINT BUTTON */}
            <div className="relative">
              <div className="inline-flex rounded-xl shadow-xs overflow-hidden border border-emerald-900">
                <button
                  type="button"
                  onClick={() => handlePrint('card')}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  title="Print official identity card in standard ID Card Format (54mm x 85.6mm)"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isPrinting ? 'Printing...' : 'Print Card'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintMenu(!showPrintMenu)}
                  className="px-2 py-2 bg-emerald-900 hover:bg-emerald-950 text-emerald-100 border-l border-emerald-800"
                  title="Print layout options"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {showPrintMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs text-slate-800">
                  <div className="px-3 py-1.5 font-bold text-[11px] text-slate-400 uppercase tracking-wider">
                    Select Print Format
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePrint('card')}
                    className="w-full px-3 py-2 text-left hover:bg-emerald-50 flex items-center gap-2.5 font-semibold text-slate-900"
                  >
                    <Printer className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <div className="font-bold">Print ID Card Format</div>
                      <div className="text-[10px] text-slate-500 font-normal">CR80 PVC standard (54.0 mm × 85.6 mm)</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePrint('a4_sheet')}
                    className="w-full px-3 py-2 text-left hover:bg-emerald-50 flex items-center gap-2.5 font-semibold text-slate-900"
                  >
                    <Layers className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <div className="font-bold">Print A4 Sheet</div>
                      <div className="text-[10px] text-slate-500 font-normal">Dual card with cut &amp; fold marks</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenPrintPreview(printLayout, printSide)}
                    className="w-full px-3 py-2 text-left hover:bg-emerald-50 flex items-center gap-2.5 font-semibold text-slate-900 border-t border-slate-100"
                  >
                    <Eye className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <div className="font-bold">Print Preview &amp; Options</div>
                      <div className="text-[10px] text-slate-500 font-normal">Review both sides, select layout &amp; print</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* DOWNLOAD BUTTON */}
            <div className="relative">
              <div className="inline-flex rounded-xl shadow-xs overflow-hidden border border-emerald-900">
                <button
                  type="button"
                  onClick={() => handleDownloadPDF('card', activeSide)}
                  disabled={downloading}
                  className="px-3.5 py-2 bg-gradient-to-r from-emerald-700 to-green-800 hover:from-emerald-800 hover:to-green-900 text-white text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
                  title="Download ID Card in Standard Card Format (54mm x 85.6mm PDF)"
                >
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>{downloading ? downloadStatus || 'Exporting...' : 'Download Card'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  disabled={downloading}
                  className="px-2 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border-l border-emerald-800 disabled:opacity-50"
                  title="More download options"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {showDownloadMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs text-slate-800">
                  <div className="px-3 py-1.5 font-bold text-[11px] text-slate-400 uppercase tracking-wider">
                    Card Format Downloads
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadPDF('card', activeSide)}
                    className="w-full px-3 py-2 text-left hover:bg-emerald-50 flex items-center gap-2.5 font-semibold text-slate-900"
                  >
                    <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <div className="font-bold">Download Card PDF (CR80)</div>
                      <div className="text-[10px] text-slate-500 font-normal">Exact card size (54mm × 85.6mm)</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadPDF('card', 'both')}
                    className="w-full px-3 py-2 text-left hover:bg-emerald-50 flex items-center gap-2.5 font-semibold text-slate-900"
                  >
                    <Layers className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <div className="font-bold">Download Both Sides (2-Page PDF)</div>
                      <div className="text-[10px] text-slate-500 font-normal">Page 1: Front, Page 2: Back in card format</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadPNG(activeSide === 'back' ? 'back' : 'front')}
                    className="w-full px-3 py-2 text-left hover:bg-emerald-50 flex items-center gap-2.5 font-semibold text-slate-900"
                  >
                    <ImageIcon className="w-4 h-4 text-blue-700 shrink-0" />
                    <div>
                      <div className="font-bold">Download Card Image (HD PNG)</div>
                      <div className="text-[10px] text-slate-500 font-normal">300 DPI high-resolution card graphic</div>
                    </div>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    type="button"
                    onClick={() => handleDownloadPDF('a4_sheet', 'both')}
                    className="w-full px-3 py-2 text-left hover:bg-emerald-50 flex items-center gap-2.5 font-semibold text-slate-900"
                  >
                    <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <div className="font-bold">Download A4 Print Sheet (PDF)</div>
                      <div className="text-[10px] text-slate-500 font-normal">Dual card layout with cut &amp; fold lines</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* SUCCESS DOWNLOAD BANNER: Provides direct click & save link if browser blocks auto-download */}
      {downloadResult && (
        <div className="p-3.5 bg-emerald-50 text-emerald-950 text-xs rounded-2xl border border-emerald-300 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-emerald-900">
                Card Generated Successfully: <span className="font-mono">{downloadResult.filename}</span>
              </div>
              <div className="text-[11px] text-emerald-700">
                If the download did not start automatically, click here to save immediately.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={downloadResult.url}
              download={downloadResult.filename}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center gap-1.5 text-xs shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save File</span>
            </a>
            <button
              type="button"
              onClick={() => setDownloadResult(null)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Error Alert if Download/Print issues arise */}
      {downloadError && (
        <div className="p-3 bg-amber-50 text-amber-900 text-xs rounded-xl border border-amber-200 flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{downloadError}</span>
        </div>
      )}

      {/* Visible ID Card Container */}
      <div 
        id="student-id-card-element"
        className={`flex flex-col ${activeSide === 'both' ? 'lg:flex-row items-center justify-center gap-8' : 'items-center justify-center'} py-2 select-none`}
      >
        {/* FRONT SIDE (when active) */}
        {(activeSide === 'front' || activeSide === 'both') && renderFrontCard('skuast-card-front', frontCardRef)}

        {/* BACK SIDE (when active) */}
        {(activeSide === 'back' || activeSide === 'both') && renderBackCard('skuast-card-back', backCardRef)}
      </div>

      {/* 
        DEDICATED OFF-SCREEN STAGING AREA FOR 100% COLOR GRAPHICS CAPTURE:
        Placed at left: -9999px with positive z-index and side-by-side flex layout
        so html2canvas captures full color graphics without any clipping or blank canvas issues.
      */}
      <div 
        aria-hidden="true" 
        className="fixed pointer-events-none select-none"
        style={{ 
          left: '-9999px', 
          top: '0', 
          width: '900px', 
          minHeight: '650px', 
          zIndex: 9999, 
          opacity: 1, 
          visibility: 'visible',
          display: 'flex',
          flexDirection: 'row',
          gap: '40px',
          background: '#ffffff' 
        }}
      >
        {renderFrontCard('skuast-export-front', exportFrontRef)}
        {renderBackCard('skuast-export-back', exportBackRef)}
      </div>

      {/* Helpful Specifications & Quality Footer */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Standard ISO/IEC 7810 ID-1 CR80 Format ({CR80_CARD_WIDTH_MM}mm × {CR80_CARD_HEIGHT_MM}mm) matching SKUAST-K official issuance.
          </span>
        </div>
        <div className="text-slate-500 shrink-0 font-mono text-[11px] flex items-center gap-2">
          <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded font-bold">CR-80 PVC</span>
          <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded font-bold">300 DPI</span>
        </div>
      </div>

      {/* DEDICATED CARD PRINT MODAL & HIGH-RESOLUTION FORMAT VIEWER */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Print Trainee Identity Card
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Official SKUAST-K CR80 Standard Card Format (54.0 mm × 85.6 mm)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Print Options Toolbar */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-4 flex flex-wrap items-center justify-between gap-2.5 text-xs">
              {/* Layout selector */}
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-600">Layout:</span>
                <button
                  type="button"
                  onClick={() => setPrintLayout('card')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    printLayout === 'card'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  Standard Card (54×85.6mm)
                </button>
                <button
                  type="button"
                  onClick={() => setPrintLayout('a4_sheet')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    printLayout === 'a4_sheet'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  A4 Dual Sheet
                </button>
              </div>

              {/* Side selector */}
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-600">Side:</span>
                <button
                  type="button"
                  onClick={() => setPrintSide('front')}
                  className={`px-2.5 py-1.5 rounded-xl font-bold transition-all ${
                    printSide === 'front'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  Front
                </button>
                <button
                  type="button"
                  onClick={() => setPrintSide('back')}
                  className={`px-2.5 py-1.5 rounded-xl font-bold transition-all ${
                    printSide === 'back'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setPrintSide('both')}
                  className={`px-2.5 py-1.5 rounded-xl font-bold transition-all ${
                    printSide === 'both'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  Both
                </button>
              </div>
            </div>

            {/* Live Print-Ready Card Preview */}
            <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-center gap-5 max-h-[380px] overflow-y-auto mb-4">
              {(printSide === 'front' || printSide === 'both') && (
                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Front Side (54mm × 85.6mm)
                  </span>
                  <div className="w-[170px] h-[270px] rounded-xl overflow-hidden shadow-lg border border-slate-300 bg-white">
                    {printModalData?.frontImg ? (
                      <img
                        src={printModalData.frontImg}
                        alt="Front Card"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-50/50 p-3 text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-600 border-t-transparent mb-2"></div>
                        <span className="text-[11px] font-bold text-emerald-800">Generating Card...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {(printSide === 'back' || printSide === 'both') && (
                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Back Side (54mm × 85.6mm)
                  </span>
                  <div className="w-[170px] h-[270px] rounded-xl overflow-hidden shadow-lg border border-slate-300 bg-white">
                    {printModalData?.backImg ? (
                      <img
                        src={printModalData.backImg}
                        alt="Back Card"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-50/50 p-3 text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-600 border-t-transparent mb-2"></div>
                        <span className="text-[11px] font-bold text-emerald-800">Generating Card...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Print & Export Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                {/* Direct High-Fidelity Print Now Button */}
                <button
                  type="button"
                  onClick={async () => {
                    if (printModalData?.frontImg) {
                      const iframeSuccess = await printViaIframe(
                        printModalData.frontImg,
                        printModalData.backImg || '',
                        printSide,
                        printLayout,
                        student.name
                      );
                      if (!iframeSuccess) {
                        await printViaDocumentPortal(
                          printModalData.frontImg,
                          printModalData.backImg || '',
                          printSide,
                          printLayout
                        );
                      }
                    } else {
                      await handlePrint(printLayout, printSide);
                    }
                  }}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>Print Card Now</span>
                </button>

                {/* Open in Separate Tab / Window */}
                {printModalData?.blobUrl && (
                  <a
                    href={printModalData.blobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4 text-amber-300" />
                    <span>Open Print Window</span>
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2 justify-end">
                {/* Save PNG button */}
                <button
                  type="button"
                  onClick={() => handleDownloadPNG(printSide === 'back' ? 'back' : 'front')}
                  disabled={downloading}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Save PNG</span>
                </button>

                {/* Download PDF button */}
                <button
                  type="button"
                  onClick={() => handleDownloadPDF(printLayout, printSide)}
                  disabled={downloading}
                  className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Save PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPrintModal(false)}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
