import jsPDF from 'jspdf';
import { StudentProfile } from '../types';

/**
 * Generates an official BHT / Course Syllabus PDF document with real PDF binary structure.
 */
export const generateDocumentPDF = (title: string, category: string, contentText: string, filename?: string) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Page dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header Banner Background
  doc.setFillColor(2, 44, 30); // Deep Emerald #022c1e
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Amber Accent Line
  doc.setFillColor(245, 158, 11); // Amber #f59e0b
  doc.rect(0, 42, pageWidth, 3, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('EXTENSION TRAINING CENTRE, MALANGPORA PULWAMA', pageWidth / 2, 16, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(251, 191, 36); // Gold
  doc.text('Sher-e-Kashmir University of Agricultural Sciences & Technology of Kashmir (SKUAST-K)', pageWidth / 2, 24, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(209, 250, 229);
  doc.text('Govt. Recognized Extension & Skill Development Training Hub | ICAR Accredited', pageWidth / 2, 31, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('Website: etcpulwama.edu | Email: pcpulwama@gmail.com', pageWidth / 2, 37, { align: 'center' });

  // Document Badge
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(15, 52, pageWidth - 30, 16, 2, 2, 'F');
  
  doc.setDrawColor(209, 213, 219);
  doc.roundedRect(15, 52, pageWidth - 30, 16, 2, 2, 'D');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(title.toUpperCase(), 20, 62);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'mono');
  doc.setTextColor(4, 120, 87);
  doc.text(`[ ${category.toUpperCase()} ]  •  OFFICIAL PUBLICATION 2026`, pageWidth - 20, 62, { align: 'right' });

  // Body Content
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);

  const cleanText = contentText || 'Official training handbook and institutional syllabus for students at Extension Training Centre Pulwama.';
  const splitLines = doc.splitTextToSize(cleanText, pageWidth - 40);

  let cursorY = 78;
  splitLines.forEach((line: string) => {
    if (cursorY > 260) {
      doc.addPage();
      cursorY = 20;
    }
    doc.text(line, 20, cursorY);
    cursorY += 6;
  });

  // Footer & Seal Box
  const footerY = Math.max(cursorY + 15, 250);

  doc.setDrawColor(226, 232, 240);
  doc.line(20, footerY, pageWidth - 20, footerY);

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Issued by: Office of the Prof. & Head, Extension Training Centre, Malangpora Pulwama (SKUAST-K)', 20, footerY + 8);
  doc.text(`Generated Date: ${new Date().toLocaleDateString('en-GB')} | Document Ref: ETC/2026/DOC-OFFICIAL`, 20, footerY + 13);

  // Download Trigger
  const safeName = (filename || title).replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${safeName}.pdf`);
};

/**
 * Helper to load student photograph as HTMLImageElement for PDF rendering.
 */
const loadStudentImage = (url: string): Promise<HTMLImageElement | null> => {
  return new Promise((resolve) => {
    if (!url) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
};

/**
 * Generates an official Examination Hall Ticket / Roll No. Slip PDF for a student.
 */
export const generateRollNoSlipPDF = async (
  student: StudentProfile,
  overrides?: { rollNo?: string; session?: string; course?: string; semester?: string }
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Outer Border Frame
  doc.setDrawColor(2, 44, 30);
  doc.setLineWidth(1);
  doc.rect(8, 8, pageWidth - 16, 281, 'D');

  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.5);
  doc.rect(10, 10, pageWidth - 20, 277, 'D');

  // Header Banner
  doc.setFillColor(2, 44, 30);
  doc.rect(10, 10, pageWidth - 20, 36, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('EXTENSION TRAINING CENTRE, MALANGPORA PULWAMA', pageWidth / 2, 22, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(251, 191, 36);
  doc.text('Sher-e-Kashmir University of Agricultural Sciences & Technology of Kashmir', pageWidth / 2, 29, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(209, 250, 229);
  doc.text('ICAR Recognized Centre | Pulwama, Jammu & Kashmir - 192301', pageWidth / 2, 35, { align: 'center' });

  // Title Badge
  doc.setFillColor(245, 158, 11);
  doc.rect(10, 46, pageWidth - 20, 10, 'F');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  const sessionStr = overrides?.session || student.batchYear || '2026-27';
  doc.text(`EXAMINATION HALL TICKET / ROLL NO. SLIP - SESSION ${sessionStr.toUpperCase()}`, pageWidth / 2, 53, { align: 'center' });

  // Student Details Box
  const startY = 64;

  // Box Frame
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(16, startY, pageWidth - 32, 95, 3, 3, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(16, startY, pageWidth - 32, 95, 3, 3, 'D');

  // Candidate Details Text
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);

  const leftX = 22;
  const valX = 68;

  const rows = [
    { label: 'Roll Number:', val: overrides?.rollNo || student.rollNumber || 'BHT-2026-27-101', bold: true },
    { label: 'Registration No:', val: student.registrationNumber || 'JK-ETC-2026-9081', bold: false },
    { label: 'Candidate Name:', val: student.name.toUpperCase(), bold: true },
    { label: 'Father / Guardian:', val: (student.guardianName || 'N/A').toUpperCase(), bold: false },
    { label: 'Programme / Course:', val: overrides?.course || student.courseTitle, bold: true },
    { label: 'Semester:', val: overrides?.semester || '1st Semester', bold: true },
    { label: 'Batch / Session:', val: overrides?.session || student.batchYear || '2026 - 2027', bold: false },
    { label: 'Exam Centre:', val: 'Main Examination Hall, ETC Malangpora Campus, Pulwama', bold: false },
    { label: 'Reporting Time:', val: '09:30 AM (Shift - I)', bold: false },
    { label: 'District / State:', val: student.address || 'Pulwama, J&K', bold: false }
  ];

  let currentY = startY + 10;
  rows.forEach((r) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text(r.label, leftX, currentY);

    doc.setFont('helvetica', r.bold ? 'bold' : 'normal');
    doc.setTextColor(r.bold ? 4 : 15, r.bold ? 120 : 23, r.bold ? 87 : 42);
    doc.text(r.val, valX, currentY);

    currentY += 9;
  });

  // Candidate Photograph Rendering
  const photoX = pageWidth - 55;
  const photoY = startY + 8;
  doc.setFillColor(241, 245, 249);
  doc.rect(photoX, photoY, 32, 40, 'F');
  doc.setDrawColor(148, 163, 184);
  doc.rect(photoX, photoY, 32, 40, 'D');

  let photoAdded = false;
  if (student.photoUrl) {
    try {
      const img = await loadStudentImage(student.photoUrl);
      if (img) {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 300;
        canvas.height = img.naturalHeight || img.height || 400;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          doc.addImage(dataUrl, 'JPEG', photoX, photoY, 32, 40);
          photoAdded = true;
        }
      }
    } catch (photoErr) {
      console.warn("Could not render candidate photograph onto PDF hall ticket:", photoErr);
    }
  }

  if (!photoAdded) {
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('CANDIDATE', photoX + 16, photoY + 18, { align: 'center' });
    doc.text('PHOTOGRAPH', photoX + 16, photoY + 23, { align: 'center' });
  }

  // Verification QR / Barcode Box
  doc.setFillColor(255, 255, 255);
  doc.rect(photoX, photoY + 44, 32, 18, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(photoX, photoY + 44, 32, 18, 'D');

  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('VERIFIED SLIP', photoX + 16, photoY + 52, { align: 'center' });
  doc.text((student.rollNumber || 'VERIFIED').replace(/[^a-zA-Z0-9]/g, ''), photoX + 16, photoY + 57, { align: 'center' });

  // Instructions Header
  let instY = startY + 108;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(2, 44, 30);
  doc.text('IMPORTANT INSTRUCTIONS FOR EXAM CANDIDATES:', 16, instY);

  const instructions = [
    '1. Candidate must bring this printed Examination Hall Ticket along with valid Photo ID proof.',
    '2. Electronic devices, smartwatches, and mobile phones are strictly prohibited inside the Exam Hall.',
    '3. Candidates should reach the examination venue at least 30 minutes prior to the scheduled time.',
    '4. Candidate must maintain discipline and adhere strictly to ICAR/SKUAST-K examination conduct guidelines.',
    '5. In case of any mismatch in candidate details, report immediately to the ETC Administration Office.'
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);

  instY += 6;
  instructions.forEach((ins) => {
    doc.text(ins, 16, instY);
    instY += 5.5;
  });

  // Signatures Section
  const sigY = instY + 28;

  doc.setDrawColor(148, 163, 184);
  doc.line(22, sigY, 72, sigY);
  doc.line(pageWidth - 72, sigY, pageWidth - 22, sigY);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Candidate Signature', 47, sigY + 5, { align: 'center' });
  doc.text('Controller of Examinations / Prof. & Head', pageWidth - 47, sigY + 5, { align: 'center' });

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Extension Training Centre, Malangpora Pulwama', pageWidth - 47, sigY + 9, { align: 'center' });

  // Save PDF
  const cleanRoll = (student.rollNumber || 'RollNoSlip').replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`RollNoSlip_${cleanRoll}.pdf`);
};
