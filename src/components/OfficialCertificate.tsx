import React, { forwardRef } from 'react';
import { CertificateData } from '../types';
import { SKUAST_LOGO_DATA_URI } from '../assets/logoBase64';

interface OfficialCertificateProps {
  data: CertificateData;
  scale?: number;
  isPrintMode?: boolean;
}

export const OfficialCertificate = forwardRef<HTMLDivElement, OfficialCertificateProps>(
  ({ data, scale = 1, isPrintMode = false }, ref) => {
    const isBat = data.courseCode === 'BAT';
    const courseTitle =
      data.courseName ||
      (isBat
        ? 'One Year Basic Agriculture Training Course'
        : 'One Year Basic Horticulture Training Course');

    return (
      <div className="w-full flex justify-center items-center overflow-auto p-1 sm:p-2">
        <div
          ref={ref}
          id="skuast-certificate-container"
          style={{
            transform: scale !== 1 && !isPrintMode ? `scale(${scale})` : undefined,
            transformOrigin: 'top center',
            width: '980px',
            minHeight: '700px',
            boxSizing: 'border-box',
          }}
          className="relative bg-[#fffdf8] text-[#1c1917] p-8 sm:p-10 shadow-2xl rounded-sm border-8 border-[#2e2619] select-none font-serif print:shadow-none print:m-0 print:border-8 print:border-[#2e2619]"
        >
          {/* Background Parchment & Subtle Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#faf7ed] via-[#fffdf9] to-[#fbf7ee] pointer-events-none opacity-95" />

          {/* Background Center Watermark SKUAST Emblem */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07]">
            <img
              src={SKUAST_LOGO_DATA_URI}
              alt="SKUAST Watermark"
              className="w-[340px] h-[340px] object-contain filter grayscale contrast-125"
            />
          </div>

          {/* Double Ornate Inner Border */}
          <div className="absolute inset-3 border-2 border-[#b8860b] pointer-events-none" />
          <div className="absolute inset-4 border border-[#8b6508]/50 pointer-events-none" />

          {/* Corner Ornamental Accents */}
          <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-[#8b6508] pointer-events-none" />
          <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-[#8b6508] pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-[#8b6508] pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-[#8b6508] pointer-events-none" />

          {/* Content Layer */}
          <div className="relative z-10 flex flex-col justify-between h-full min-h-[620px] text-center">
            {/* Top Bar: Regd. No. & Sr. No. */}
            <div className="flex justify-between items-start text-xs font-serif font-bold text-[#1e293b] tracking-wider px-3 pt-1">
              <div className="flex items-center gap-1">
                <span className="text-[#334155] font-serif">Regd. No.</span>
                <span className="font-mono text-[#0f172a] font-black border-b border-dotted border-slate-700 pb-0.5 px-2 bg-[#f8fafc]/70">
                  {data.regdNo || (isBat ? 'AU/ETC/BAT/2026-27/30/1033' : 'AU/ETC/BHT/2026-27/30/1033')}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[#334155] font-serif">Sr. No.</span>
                <span className="font-mono text-[#0f172a] font-black border-b border-dotted border-slate-700 pb-0.5 px-2 bg-[#f8fafc]/70">
                  {data.srNo || '82'}
                </span>
              </div>
            </div>

            {/* University Arched Heading & Middle SKUAST Logo */}
            <div className="my-1 flex flex-col items-center">
              {/* Arched Complete Name of the Institution - Designed with wide arc to never truncate text */}
              <div className="w-full max-w-[900px] h-[64px] relative flex justify-center items-center">
                <svg viewBox="0 0 920 68" className="w-full h-full overflow-visible">
                  <defs>
                    <path
                      id="skuast-university-arc-path"
                      d="M 15,64 Q 460,-10 905,64"
                      fill="transparent"
                    />
                  </defs>
                  <text className="font-serif font-black tracking-[0.018em] text-[14.2px] fill-[#0f172a]">
                    <textPath
                      href="#skuast-university-arc-path"
                      startOffset="50%"
                      textAnchor="middle"
                    >
                      SKUAST KASHMIR UNIVERSITY OF AGRICULTURAL SCIENCES &amp; TECHNOLOGY OF KASHMIR
                    </textPath>
                  </text>
                </svg>
              </div>

              {/* SKUAST Center Official Logo Icon in Middle of Certificate */}
              <div className="relative -mt-1 mb-1 flex justify-center">
                <div className="w-20 h-20 sm:w-22 sm:h-22 flex items-center justify-center p-1 bg-white rounded-full border-2 border-[#b8860b] shadow-md">
                  <img
                    src={SKUAST_LOGO_DATA_URI}
                    alt="SKUAST-K Emblem"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
              </div>

              {/* Directorate & Centre Subheadings */}
              <div className="space-y-0.5 text-center mt-0.5">
                <h3 className="font-serif font-bold text-sm sm:text-[15px] text-[#1e3a8a] tracking-wide uppercase">
                  Directorate of Extension
                </h3>
                <h4 className="font-serif font-bold text-xs sm:text-[13px] text-[#0f766e] tracking-wide">
                  Extension Training Centre / Krishi Vigyan Kendra, Pulwama
                </h4>
              </div>

              {/* Certificate Main Title */}
              <div className="mt-2 mb-3">
                <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#881337] tracking-[0.25em] uppercase drop-shadow-sm inline-block px-8 py-0.5 border-b-2 border-[#881337]/30">
                  CERTIFICATE
                </h1>
              </div>
            </div>

            {/* Certificate Body Paragraph */}
            <div className="text-left text-sm sm:text-[15px] text-[#1e293b] leading-[2.4] sm:leading-[2.55] px-5 font-serif space-y-2">
              <p className="text-justify font-serif">
                <span>This is to certify that {data.genderPrefix || 'Shri/Smt.'}</span>{' '}
                <span className="font-bold text-[#0f172a] uppercase tracking-wider font-sans border-b-2 border-dotted border-slate-900 px-3 py-0.5 bg-[#fefce8]/70 inline-block min-w-[220px] text-center mx-1">
                  {data.candidateName || 'SHAHJAHAN NAZKI'}
                </span>
                <span>{data.relationType || 'Son'} of</span>{' '}
                <span className="font-bold text-[#0f172a] uppercase tracking-wider font-sans border-b-2 border-dotted border-slate-900 px-3 py-0.5 bg-[#fefce8]/70 inline-block min-w-[200px] text-center mx-1">
                  {data.parentage || 'AB. SALAM SHAH'}
                </span>
                <span>R/o.</span>{' '}
                <span className="font-bold text-[#0f172a] uppercase tracking-wider font-sans border-b-2 border-dotted border-slate-900 px-3 py-0.5 bg-[#fefce8]/70 inline-block min-w-[180px] text-center mx-1">
                  {data.residence || 'GRIELKUND RAZIGUND'}
                </span>
                <span>District</span>{' '}
                <span className="font-bold text-[#0f172a] uppercase tracking-wider font-sans border-b-2 border-dotted border-slate-900 px-3 py-0.5 bg-[#fefce8]/70 inline-block min-w-[140px] text-center mx-1">
                  {data.district || 'KULGAM'}
                </span>
                <span>has been declared successful in</span>{' '}
                <span className="font-extrabold text-[#111827] px-1 font-serif underline decoration-[#b8860b] decoration-2 underline-offset-4">
                  {courseTitle}
                </span>
                <span>, Session</span>{' '}
                <span className="font-bold text-[#0f172a] font-mono border-b-2 border-dotted border-slate-900 px-2 py-0.5 bg-[#fefce8]/70 inline-block min-w-[100px] text-center mx-1">
                  {data.session || '2026-27'}
                </span>
                <span>in</span>{' '}
                <span className="font-bold text-[#0f172a] italic border-b-2 border-dotted border-slate-900 px-3 py-0.5 bg-[#fefce8]/70 inline-block min-w-[90px] text-center mx-1 font-serif">
                  {data.division || 'First'}
                </span>
                <span>Division.</span>
              </p>
            </div>

            {/* Date of Issue */}
            <div className="text-left px-5 mt-3">
              <div className="inline-flex items-center text-xs sm:text-[13px] font-serif font-bold text-[#1e293b]">
                <span>Date of issue:</span>
                <span className="font-mono text-[#0f172a] font-black border-b-2 border-dotted border-slate-900 ml-2 px-3 pb-0.5 bg-[#fefce8]/70 min-w-[120px] text-center">
                  {data.dateOfIssue || '16-10-2026'}
                </span>
              </div>
            </div>

            {/* Three Signatory Columns with Authentic Signatures and Stamps */}
            <div className="grid grid-cols-3 gap-6 items-end pt-5 pb-2 px-5 text-center mt-3">
              {/* 1. Left Signature: Checked by / I/c Academics (Attached Flowing Signature) */}
              <div className="flex flex-col items-center justify-end relative">
                <div className="w-36 h-16 relative flex items-center justify-center -mb-2 pointer-events-none">
                  {/* Inline Vector Representation of Attached I/c Academics Signature */}
                  <svg
                    viewBox="0 0 350 140"
                    className="w-32 h-14 object-contain transform -rotate-2"
                  >
                    <g
                      fill="none"
                      stroke="#2d5a43"
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M 68 46 C 45 48, 18 60, 18 78 C 18 100, 68 116, 120 72 C 145 52, 140 28, 132 30 C 120 34, 110 50, 105 78 C 100 102, 108 120, 115 124" />
                      <path d="M 115 106 L 225 56 C 235 52, 240 80, 235 84 C 230 87, 226 76, 234 68 C 240 60, 248 54, 258 50 C 265 48, 270 70, 268 76 C 274 72, 282 54, 290 44 C 298 34, 310 18, 318 16 C 324 14, 332 20, 334 32 C 336 44, 332 60, 322 72 C 314 80, 305 84, 326 62 C 335 52, 340 76, 338 120" />
                      <circle cx="290" cy="94" r="5" fill="#2d5a43" stroke="none" />
                    </g>
                  </svg>
                  {/* Blue Academic Seal Stamp */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-70 transform rotate-[-4deg] pointer-events-none">
                    <div className="border-2 border-dashed border-blue-900/80 rounded-full px-2 py-0.5 text-[8px] font-mono font-black text-blue-900 uppercase tracking-tighter leading-none bg-blue-50/30">
                      I/c Academics • KVK/ETC
                    </div>
                  </div>
                </div>

                <div className="w-36 border-t border-slate-700 pt-1">
                  <p className="font-serif font-bold text-xs text-[#0f172a]">Checked by</p>
                  <p className="font-serif text-[11px] font-semibold text-[#334155]">
                    I/c Academics
                  </p>
                  <p className="font-serif text-[9px] text-[#64748b]">KVK/ETC Pulwama</p>
                </div>
              </div>

              {/* 2. Middle Signature: Secretary / Board of Examination (Dr. Javeed Sir Attached Signature) */}
              <div className="flex flex-col items-center justify-end relative">
                <div className="w-40 h-16 relative flex items-center justify-center -mb-2 pointer-events-none">
                  {/* Inline Vector Representation of Attached Javeed Sir Signature */}
                  <svg
                    viewBox="0 0 400 160"
                    className="w-36 h-14 object-contain transform rotate-1"
                  >
                    <g
                      fill="none"
                      stroke="#252468"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="140" cy="46" r="3.5" fill="#252468" stroke="none" />
                      <path d="M 140 48 L 156 128 C 158 135, 153 140, 149 130 C 145 110, 138 90, 8 116 C 50 114, 120 100, 166 94" />
                      <circle cx="180" cy="65" r="3.5" fill="#252468" stroke="none" />
                      <path d="M 179 67 L 173 138" />
                      <path d="M 190 92 C 194 88, 198 84, 204 88 C 210 93, 215 90, 222 84 C 228 80, 236 86, 244 88" />
                      <path d="M 182 108 L 395 92" />
                    </g>
                  </svg>
                  {/* Coordinator Official Stamp */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-70 transform rotate-[2deg] pointer-events-none">
                    <div className="border border-blue-900 rounded px-1.5 py-0.5 text-[7.5px] font-sans font-black text-blue-900 uppercase tracking-tight leading-none bg-blue-50/30">
                      Programme Coordinator / PI
                    </div>
                  </div>
                </div>

                <div className="w-44 border-t border-slate-700 pt-1">
                  <p className="font-serif font-bold text-xs text-[#0f172a]">Secretary</p>
                  <p className="font-serif font-bold text-[11px] text-[#1e293b]">
                    Board of Examination
                  </p>
                  <p className="font-serif text-[10px] text-[#475569]">
                    (Programme Coordinator)
                  </p>
                  <p className="font-serif text-[9px] text-[#64748b]">SKUAST-K, Pulwama</p>
                </div>
              </div>

              {/* 3. Right Signature: Chairman / Board of Examination (Director Extension) */}
              <div className="flex flex-col items-center justify-end relative">
                <div className="w-36 h-16 relative flex items-center justify-center -mb-2 pointer-events-none">
                  {/* Director Extension Signature Vector */}
                  <svg
                    viewBox="0 0 140 45"
                    className="w-28 h-12 text-[#1e3a8a] fill-none stroke-current stroke-[2.3] transform -rotate-3 opacity-90"
                  >
                    <path
                      d="M 14 26 Q 30 6 52 24 T 78 12 T 102 26 Q 120 6 134 22"
                      strokeLinecap="round"
                    />
                    <path d="M 22 34 C 48 31, 88 35, 126 31" strokeLinecap="round" />
                  </svg>
                  {/* Round University Directorate Seal */}
                  <div className="absolute -top-1 right-0 opacity-75 transform rotate-[-6deg] pointer-events-none">
                    <div className="w-11 h-11 border-2 border-dashed border-blue-900 rounded-full flex items-center justify-center text-[6px] font-sans font-bold text-blue-950 text-center leading-[1.1] p-0.5 bg-blue-50/20">
                      SKUAST-K
                      <br />
                      DIRECTOR
                      <br />
                      EXTENSION
                    </div>
                  </div>
                </div>

                <div className="w-44 border-t border-slate-700 pt-1">
                  <p className="font-serif font-bold text-xs text-[#0f172a]">Chairman</p>
                  <p className="font-serif font-bold text-[11px] text-[#1e293b]">
                    Board of Examination
                  </p>
                  <p className="font-serif text-[10px] text-[#475569]">
                    (Director Extension)
                  </p>
                  <p className="font-serif text-[9px] text-[#64748b]">
                    SKUAST-Kashmir, Shalimar, Sgr
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

OfficialCertificate.displayName = 'OfficialCertificate';
