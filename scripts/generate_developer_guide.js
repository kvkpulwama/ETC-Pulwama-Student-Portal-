import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { jsPDF } from 'jspdf';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateDeveloperGuidePDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;

  // Helper for page headers & footers
  function drawHeaderFooter(pageNum, totalPages) {
    // Top header
    doc.setFillColor(15, 60, 40); // Deep Forest Green
    doc.rect(0, 0, pageWidth, 12, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('SKUAST-KASHMIR  |  EXTENSION TRAINING CENTRE (ETC) MALANGPORA PULWAMA', margin, 7.5);
    doc.text('DEVELOPER & ARCHITECTURE HANDBOOK', pageWidth - margin, 7.5, { align: 'right' });

    // Bottom footer
    doc.setDrawColor(220, 225, 230);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 115, 130);
    doc.text('Official Technical Documentation • Portal Maintainer: pcpulwama@gmail.com • Tel: 01933-293294', margin, pageHeight - 7);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  }

  function checkPageBreak(spaceNeeded) {
    if (y + spaceNeeded > pageHeight - 20) {
      doc.addPage();
      y = 22; // starting y on new page
      return true;
    }
    return false;
  }

  function drawSectionHeading(title, subtitle) {
    checkPageBreak(22);
    y += 4;
    
    doc.setFillColor(240, 248, 243);
    doc.roundedRect(margin, y - 1, contentWidth, 12, 1.5, 1.5, 'F');

    doc.setFillColor(16, 120, 75); // Emerald accent strip
    doc.rect(margin, y - 1, 3, 12, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 55, 35);
    doc.text(title, margin + 6, y + 5);

    if (subtitle) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(80, 110, 95);
      doc.text(subtitle, margin + 6, y + 9.5);
    }
    y += 16;
  }

  function drawParagraph(text, isBold = false, fontSize = 8.5, color = [45, 55, 72]) {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, contentWidth);
    for (const line of lines) {
      checkPageBreak(5);
      doc.text(line, margin, y);
      y += 4.5;
    }
    y += 1.5;
  }

  function drawBullet(title, description) {
    checkPageBreak(7);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(20, 80, 50);
    doc.text('• ' + title + ': ', margin + 2, y);
    
    const titleWidth = doc.getTextWidth('• ' + title + ': ');
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(45, 55, 72);
    
    const remainingText = description;
    const firstLineWidth = contentWidth - titleWidth - 2;
    const splitDesc = doc.splitTextToSize(remainingText, firstLineWidth);

    if (splitDesc.length > 0) {
      doc.text(splitDesc[0], margin + 2 + titleWidth, y);
      y += 4.5;
      for (let i = 1; i < splitDesc.length; i++) {
        checkPageBreak(5);
        doc.text(splitDesc[i], margin + 6, y);
        y += 4.5;
      }
    } else {
      y += 4.5;
    }
  }

  function drawCodeBlock(codeLines) {
    const blockHeight = (codeLines.length * 4) + 6;
    checkPageBreak(blockHeight);
    
    doc.setFillColor(243, 246, 250);
    doc.setDrawColor(210, 220, 230);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, blockHeight, 1.5, 1.5, 'FD');
    
    doc.setFont('courier', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 45, 65);
    
    let lineY = y + 4.5;
    for (const line of codeLines) {
      doc.text(line, margin + 4, lineY);
      lineY += 4;
    }
    y += blockHeight + 4;
  }

  function drawTable(headers, rows, colWidths) {
    const rowHeight = 7;
    checkPageBreak(rowHeight * (rows.length + 1) + 4);

    // Header row
    doc.setFillColor(23, 75, 50);
    doc.rect(margin, y, contentWidth, rowHeight, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);

    let curX = margin;
    headers.forEach((h, idx) => {
      doc.text(h, curX + 2, y + 4.8);
      curX += colWidths[idx];
    });
    y += rowHeight;

    // Body rows
    rows.forEach((r, rIdx) => {
      checkPageBreak(rowHeight);
      if (rIdx % 2 === 0) {
        doc.setFillColor(250, 252, 253);
      } else {
        doc.setFillColor(242, 246, 249);
      }
      doc.rect(margin, y, contentWidth, rowHeight, 'F');
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(35, 45, 60);

      let rowX = margin;
      r.forEach((cell, idx) => {
        doc.text(String(cell), rowX + 2, y + 4.8);
        rowX += colWidths[idx];
      });

      // Border line under each row
      doc.setDrawColor(220, 228, 235);
      doc.setLineWidth(0.2);
      doc.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

      y += rowHeight;
    });
    y += 4;
  }

  // =========================================================================
  // PAGE 1: COVER & EXECUTIVE SUMMARY
  // =========================================================================
  y = 20;

  // Institution title header
  doc.setFillColor(15, 60, 40);
  doc.roundedRect(margin, y, contentWidth, 34, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 220, 110); // Warm gold
  doc.text('EXTENSION TRAINING CENTRE (ETC) MALANGPORA PULWAMA', pageWidth / 2, y + 9, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(230, 245, 235);
  doc.text('Sher-e-Kashmir University of Agricultural Sciences & Technology of Kashmir (SKUAST-Kashmir)', pageWidth / 2, y + 16, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('COMPLETE TECHNICAL ARCHITECTURE & DEVELOPER HANDBOOK', pageWidth / 2, y + 26, { align: 'center' });

  y += 40;

  // Metadata Card
  doc.setFillColor(245, 248, 250);
  doc.setDrawColor(215, 225, 235);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 18, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(20, 80, 50);
  doc.text('DOCUMENT VERSION:', margin + 4, y + 6);
  doc.text('PUBLISHED DATE:', margin + 65, y + 6);
  doc.text('PRIMARY CONTACT / EMAIL:', margin + 120, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 60, 75);
  doc.text('v2.4 (Production Release)', margin + 4, y + 12);
  doc.text('September 2026', margin + 65, y + 12);
  doc.text('pcpulwama@gmail.com', margin + 120, y + 12);

  y += 24;

  // Executive Overview
  drawSectionHeading('1. Executive Overview & System Purpose', 'Background, institutional mandate, and target users');
  drawParagraph('This document serves as the comprehensive engineering and development manual for the official web portal of Extension Training Centre (ETC) Malangpora, Pulwama, under SKUAST-Kashmir. The application is designed to handle student trainee lifecycle management, online ID card generation, digital admit cards, course completion certificates, academic catalogs, public announcements, and security audit logging.');
  drawParagraph('The portal operates on modern web standards with an offline-first architectural model: all trainee operations function seamlessly using client-side caching while automatically synchronizing records with a centralized Supabase cloud PostgreSQL database when network connectivity is available.');

  // Section 2: Technology Stack Summary Table
  drawSectionHeading('2. Full Technology Stack & Library Matrix', 'Complete architectural composition of frontend, backend, and data tiers');

  const stackHeaders = ['Component / Tier', 'Technology / Tool', 'Version', 'Role & Implementation Purpose'];
  const stackColWidths = [35, 40, 20, 79];
  const stackRows = [
    ['Frontend Framework', 'React & TypeScript', '19.x / 5.8', 'Component-driven UI, state management, hooks'],
    ['Styling & Theme', 'Tailwind CSS', 'v4.x', 'Utility-first styling, official gold/green branding'],
    ['Build & Dev Tool', 'Vite', 'v6.x', 'Hot Module Reloading (HMR), tree-shaken bundler'],
    ['Backend & Server', 'Node.js + Express', '20.x / 4.x', 'Custom server (server.ts) serving APIs & SPA assets'],
    ['Database (Cloud)', 'Supabase (PostgreSQL)', 'v2.x SDK', 'Central cloud relational storage for student rosters'],
    ['Database (Local)', 'HTML5 LocalStorage', 'Standard', 'Instant fallback offline storage and zero-latency cache'],
    ['Vector Icons', 'Lucide React', 'Latest', 'Institutional iconography across headers & navigation'],
    ['PDF Generation', 'jsPDF & html2canvas', '2.5.2 / 1.4', 'Vector CR80 ID cards, admit cards & certificates'],
    ['Barcode & QR', 'QRCode Library', '1.5.4', 'Instant student digital verification QR codes'],
    ['UI Transitions', 'Motion (Framer)', 'Latest', 'Accessible route fade and interactive modal animations']
  ];

  drawTable(stackHeaders, stackRows, stackColWidths);

  // =========================================================================
  // PAGE 2: DIRECTORY STRUCTURE & LOCAL SETUP (VS CODE)
  // =========================================================================
  doc.addPage();
  y = 22;

  drawSectionHeading('3. Complete Project Directory Layout', 'Annotated source code map for rapid navigation in code editors');
  drawParagraph('The repository is modularly structured to maintain clear separation of concerns between presentation, data, external cloud services, and static public assets:');

  const dirTree = [
    'etc-pulwama-portal/',
    '├── public/                        # Static public files & web assets',
    '│   ├── dr_javeed_portrait.jpg     # Official photo of Prof. & Head Dr. Javeed Ahmad Mugloo',
    '│   ├── dr_ajaz_portrait.jpg       # Official photo of Dr. Ajaz Ahmad Ganie (Animal Science)',
    '│   ├── jahangir_portrait.jpg      # Official photo of Mr. Jahangir Ahmad Magray (IT)',
    '│   ├── blank-avatar.svg           # Neutral silhouette placeholder for pending photos',
    '│   └── skuast-kashmir-logo.png    # Official high-resolution SKUAST-Kashmir crest',
    '├── src/                           # TypeScript React Application Source',
    '│   ├── components/                # Modular UI widgets and operational views',
    '│   │   ├── Header.tsx             # Sticky institutional navigation bar with emergency notice',
    '│   │   ├── Footer.tsx             # Official contact directory, maps, and helpline details',
    '│   │   ├── StudentIdCard.tsx      # ISO CR80 Student ID card with PVC print layout',
    '│   │   ├── AdminDashboardView.tsx # Analytics, batch metrics & enrollment charts',
    '│   │   ├── AdminAuditLogsView.tsx # Security audit trails with CSV compliance exporter',
    '│   │   ├── BulkAnnouncementView.tsx# SMS/Email notification broadcaster for circulars',
    '│   │   └── SupabaseConfigGuide.tsx# In-portal SQL schema & database connection assistant',
    '│   ├── data/                      # Structured mock records & content registries',
    '│   │   └── mockData.ts            # Faculty members, course curricula, notices & forms',
    '│   ├── lib/                       # Utility engines, formatters & cloud clients',
    '│   │   ├── supabase.ts            # Supabase PostgreSQL client & query helpers',
    '│   │   ├── pdfGenerator.ts        # jsPDF engine for examination admit cards',
    '│   │   └── idCardPrint.ts         # High-resolution print formatter for student ID cards',
    '│   ├── pages/                     # Full-page route views',
    '│   │   ├── HomePage.tsx           # Institutional home page with marquee notices',
    '│   │   ├── AboutPage.tsx          # KVK Pulwama Vision, Mission, Objectives & Faculty',
    '│   │   ├── StudentIdCardPage.tsx  # Student identity verification and card download',
    '│   │   ├── DownloadsPage.tsx      # Official document, syllabus, and certificate repo',
    '│   │   ├── ContactPage.tsx        # Campus location map, contact forms & helplines',
    '│   │   └── AdminPage.tsx          # Administrator control center & roster management',
    '│   ├── types.ts                   # Global TypeScript definitions & interfaces',
    '│   ├── App.tsx                    # Primary routing component & navigation state',
    '│   ├── main.tsx                   # React DOM root bootstrapping file',
    '│   └── index.css                  # Tailwind CSS import declarations & base styles',
    '├── server.ts                      # Express server entry point with Vite middleware',
    '├── package.json                   # Project dependencies and script declarations',
    '└── .env.example                   # Environment variables template'
  ];

  drawCodeBlock(dirTree);

  drawSectionHeading('4. Local Development Setup in VS Code', 'Step-by-step instructions to run and modify the portal on your PC');

  drawBullet('Step 1: Install Node.js', 'Ensure Node.js (v20.x or higher) is installed. Download from https://nodejs.org. Verify by running "node -v" in Command Prompt.');
  drawBullet('Step 2: Export Codebase', 'In Google AI Studio, click Settings/Options in the top right, then select "Export to ZIP" (or push to your GitHub repo).');
  drawBullet('Step 3: Open in VS Code', 'Extract the ZIP file to your preferred folder (e.g. C:\\Projects\\etc-pulwama-portal). In VS Code, click File -> Open Folder.');
  drawBullet('Step 4: Open Terminal', 'In VS Code, press Ctrl + ` (backtick) or go to Terminal -> New Terminal.');
  drawBullet('Step 5: Install Dependencies', 'In the terminal, execute: "npm install". This automatically downloads all libraries into the node_modules folder.');

  // =========================================================================
  // PAGE 3: ENVIRONMENT, SUPABASE DATABASE & NPM SCRIPTS
  // =========================================================================
  doc.addPage();
  y = 22;

  drawSectionHeading('5. Environment Configuration & Secrets', 'Configuring cloud database credentials safely');
  drawParagraph('Create a file named .env in the root directory (alongside package.json) and configure your Supabase project keys:');

  const envLines = [
    '# .env configuration for local execution',
    'PORT=3000',
    'VITE_SUPABASE_URL=https://ssypyegksjrpjgbcoqyc.supabase.co',
    'VITE_SUPABASE_ANON_KEY=sb_publishable_P19UWTAtI4Ujeg9HrYohqA_s6podg89'
  ];
  drawCodeBlock(envLines);

  drawParagraph('To start the application in development mode with live Hot Module Reloading:');
  drawCodeBlock(['npm run dev']);
  drawParagraph('Open your web browser and navigate to: http://localhost:3000. Any changes you save in VS Code will immediately update the live preview without reloading the page!');

  drawSectionHeading('6. Supabase Cloud Database SQL Schema', 'Table schema and database structure for student rosters');
  drawParagraph('The portal utilizes Supabase (PostgreSQL) to store student registrations. To provision the table in your own Supabase project:');
  drawBullet('Navigate to SQL Editor', 'Log in to https://supabase.com, open your project, and click the "SQL Editor" tab on the left navigation.');
  drawBullet('Execute DDL Query', 'Paste and run the following standard SQL script:');

  const sqlLines = [
    '-- Supabase PostgreSQL Table for ETC Pulwama Trainee Roster',
    'CREATE TABLE IF NOT EXISTS public.students (',
    '    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),',
    '    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),',
    '    roll_number TEXT UNIQUE NOT NULL,',
    '    registration_number TEXT,',
    '    name TEXT NOT NULL,',
    '    father_name TEXT,',
    '    course_type TEXT,',
    '    course_title TEXT,',
    '    session TEXT,',
    '    division TEXT,',
    '    cgpa TEXT,',
    '    email TEXT,',
    '    phone TEXT,',
    '    blood_group TEXT,',
    '    dob TEXT,',
    '    district TEXT,',
    '    address TEXT,',
    '    photo_url TEXT,',
    '    status TEXT DEFAULT \'active\'',
    ');',
    '',
    '-- Enable Row Level Security (RLS)',
    'ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;',
    '',
    '-- Public Read & Write Policies for Portal Operations',
    'CREATE POLICY "Allow public read access" ON public.students FOR SELECT USING (true);',
    'CREATE POLICY "Allow public insert/update access" ON public.students FOR ALL USING (true);'
  ];
  drawCodeBlock(sqlLines);

  drawSectionHeading('7. Essential NPM Commands Quick-Reference', 'Commands for building, checking, and deploying the codebase');

  const npmHeaders = ['Command', 'Execution Action & Context'];
  const npmColWidths = [50, 124];
  const npmRows = [
    ['npm run dev', 'Starts Express server + Vite development server at http://localhost:3000 with HMR.'],
    ['npm run lint', 'Runs TypeScript compiler check (tsc --noEmit) to detect syntax or type errors.'],
    ['npm run build', 'Compiles production client bundle into dist/ and bundles server.ts via esbuild.'],
    ['npm run start', 'Launches the compiled production server (node dist/server.cjs) for deployment.']
  ];
  drawTable(npmHeaders, npmRows, npmColWidths);

  // =========================================================================
  // PAGE 4: DEVELOPER CUSTOMIZATION CHEAT SHEET & CONTACTS
  // =========================================================================
  doc.addPage();
  y = 22;

  drawSectionHeading('8. Developer Customization Guide: Where to Edit What', 'Instant reference for common updates requested by university administration');

  const customHeaders = ['What you want to change', 'Target Source File to Edit', 'Specific Instructions'];
  const customColWidths = [45, 55, 74];
  const customRows = [
    ['Faculty Directory & Team', 'src/data/mockData.ts', 'Modify FACULTY_LIST array with names, designations & photo URLs.'],
    ['Vision, Mission, Objectives', 'src/pages/AboutPage.tsx', 'Update KVK Pulwama Vision & Mission text blocks directly.'],
    ['Official Contact & Phone', 'src/data/mockData.ts', 'Edit INSTITUTION_INFO object (phone, email: pcpulwama@gmail.com).'],
    ['Courses & Syllabi', 'src/data/mockData.ts', 'Update COURSES array with duration, seats, eligibility & modules.'],
    ['Flash Notices & Marquee', 'src/data/mockData.ts', 'Add or update items in the NOTICES array with priority levels.'],
    ['Student ID Card Design', 'src/components/StudentIdCard.tsx', 'Tune dimensions, ISO CR80 PVC formatting, and barcode layouts.'],
    ['Admit Card PDF Engine', 'src/lib/pdfGenerator.ts', 'Customize examination hall instructions, watermarks, and seals.'],
    ['Admin Credentials', 'src/pages/AdminPage.tsx', 'Update admin password validation (default: admin123).']
  ];
  drawTable(customHeaders, customRows, customColWidths);

  drawSectionHeading('9. Frequently Asked Questions by Developers', 'Solutions for common development scenarios');
  drawBullet('Q: How do I change faculty photos?', 'Place the new image inside the public/ folder (e.g. public/new_photo.jpg). Then open src/data/mockData.ts, find the faculty member in FACULTY_LIST, and set image: "/new_photo.jpg".');
  drawBullet('Q: How does student data persist?', 'When an administrator or student saves a profile, the portal saves it instantly in localStorage (ensuring it works offline) and attempts to push it to the Supabase students table. In the Admin Panel, clicking "Sync to Supabase" synchronizes all records in bulk.');
  drawBullet('Q: How do I deploy to a web host?', 'Run "npm run build". The output folder "dist" contains the static website files. You can deploy it to Vercel, Netlify, Cloud Run, or any standard Linux VPS running Node.js.');

  drawSectionHeading('10. Technical Support & Institutional Verification', 'Official contacts for technical assistance and web portal maintenance');

  doc.setFillColor(243, 248, 245);
  doc.setDrawColor(200, 220, 210);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 32, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 60, 40);
  doc.text('Extension Training Centre (ETC) Malangpora Pulwama', margin + 4, y + 6);
  doc.text('Sher-e-Kashmir University of Agricultural Sciences & Technology of Kashmir', margin + 4, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(45, 55, 70);
  doc.text('• Campus Address: Koil Road, Near District Administrative Complex, Pulwama, J&K - 192301', margin + 4, y + 17);
  doc.text('• Official Administration Email: pcpulwama@gmail.com', margin + 4, y + 22);
  doc.text('• Institutional Phone / Helpline: 01933-293294', margin + 4, y + 27);

  // Apply headers and footers to all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawHeaderFooter(i, totalPages);
  }

  // Ensure output directory exists
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = path.join(publicDir, 'Developer_Guide_ETC_Pulwama.pdf');
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(outputPath, pdfBuffer);
  console.log(`PDF successfully generated at: ${outputPath} (${pdfBuffer.length} bytes)`);

  // Also copy to dist if dist exists
  const distDir = path.join(__dirname, '..', 'dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'Developer_Guide_ETC_Pulwama.pdf'), pdfBuffer);
    console.log(`Copied PDF to dist/Developer_Guide_ETC_Pulwama.pdf`);
  }
}

generateDeveloperGuidePDF();
