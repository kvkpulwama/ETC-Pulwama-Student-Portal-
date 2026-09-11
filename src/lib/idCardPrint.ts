import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Standard ISO/IEC 7810 ID-1 (CR80) Identity Card physical dimensions in millimeters:
 * Width: 54.0 mm, Height: 85.6 mm (Portrait aspect ratio ~1:1.585)
 */
export const CR80_CARD_WIDTH_MM = 54.0;
export const CR80_CARD_HEIGHT_MM = 85.6;

/**
 * Extracts a safe base64 data URI from a canvas, handling tainted canvases if needed.
 */
function safeCanvasToDataUrl(canvas: HTMLCanvasElement): string {
  try {
    return canvas.toDataURL('image/png');
  } catch (err) {
    console.warn('PNG canvas export failed, attempting JPEG format fallback:', err);
    try {
      return canvas.toDataURL('image/jpeg', 0.95);
    } catch (err2) {
      console.error('All canvas toDataURL methods failed:', err2);
      throw new Error('Could not export ID card canvas. Please check image permissions.');
    }
  }
}

/**
 * Converts any image URL to a local Base64 Data URI to prevent CORS / tainted canvas issues.
 */
export async function convertImageUrlToDataUri(url: string): Promise<string> {
  if (!url || url.startsWith('data:')) return url;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 300;
        canvas.height = img.naturalHeight || 350;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataUri = canvas.toDataURL('image/jpeg', 0.92);
          resolve(dataUri);
          return;
        }
      } catch (e) {
        console.warn('Canvas export failed for image URL, trying fetch blob:', e);
      }
      
      // Fallback: fetch blob
      fetch(url, { mode: 'cors' })
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => resolve(url);
          reader.readAsDataURL(blob);
        })
        .catch(() => resolve(url));
    };

    img.onerror = () => {
      // Direct fetch fallback
      fetch(url, { mode: 'cors' })
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => resolve(url);
          reader.readAsDataURL(blob);
        })
        .catch(() => resolve(url));
    };

    img.src = url;
  });
}

/**
 * Captures an HTML ID card element into an HTMLCanvasElement at high DPI (scale 2.5)
 * with robust CORS handling, visible element assurance, and image pre-loading.
 */
export async function captureCardCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
  if (!element) {
    throw new Error('Target card element was not found in the DOM.');
  }

  // Ensure any images inside have finished loading
  const images = Array.from(element.querySelectorAll('img'));
  await Promise.all(
    images.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve(true);
      return new Promise((resolve) => {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        setTimeout(() => resolve(false), 2000); // safety timeout
      });
    })
  );

  // Allow layout to settle
  await new Promise((resolve) => requestAnimationFrame(resolve));

  const rect = element.getBoundingClientRect();
  const width = rect.width > 0 ? rect.width : 350;
  const height = rect.height > 0 ? rect.height : 555;

  return await html2canvas(element, {
    scale: 2.5, // 300+ DPI equivalent for standard card dimensions
    useCORS: true,
    allowTaint: false, // Prevents canvas from being tainted so toDataURL never throws SecurityError
    backgroundColor: '#ffffff',
    logging: false,
    imageTimeout: 8000,
    width,
    height,
    onclone: (_clonedDoc, clonedEl) => {
      if (clonedEl) {
        clonedEl.style.opacity = '1';
        clonedEl.style.visibility = 'visible';
        clonedEl.style.display = 'flex';
        clonedEl.style.position = 'relative';
        clonedEl.style.transform = 'none';

        // Ensure parent containers in the clone do not hide or clip the element
        let parent = clonedEl.parentElement;
        while (parent && parent !== _clonedDoc.body) {
          parent.style.opacity = '1';
          parent.style.visibility = 'visible';
          parent.style.overflow = 'visible';
          parent = parent.parentElement;
        }
      }
    }
  });
}

export interface PdfDownloadResult {
  filename: string;
  blobUrl: string;
  dataUri: string;
}

/**
 * Universal PDF downloader that handles iframe sandboxes and download attributes safely.
 */
export function triggerPdfDownload(pdf: jsPDF, filename: string): PdfDownloadResult {
  let blobUrl = '';
  let dataUri = '';

  try {
    const blob = pdf.output('blob');
    blobUrl = window.URL.createObjectURL(blob);
  } catch (err) {
    console.warn('Blob generation failed:', err);
  }

  try {
    dataUri = pdf.output('datauristring');
  } catch (err) {
    console.warn('Data URI generation failed:', err);
  }

  try {
    // 1. First attempt: standard jsPDF save
    pdf.save(filename);
  } catch (err1) {
    console.warn('pdf.save failed, executing Blob anchor download fallback:', err1);
    try {
      // 2. Second attempt: Blob URL with anchor element
      if (blobUrl) {
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          link.remove();
        }, 3000);
      }
    } catch (err2) {
      console.warn('Blob anchor failed, attempting Data URI window download:', err2);
      // 3. Third attempt: direct data URI
      if (dataUri) {
        const link = document.createElement('a');
        link.href = dataUri;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => link.remove(), 2000);
      }
    }
  }

  return { filename, blobUrl: blobUrl || dataUri, dataUri };
}

/**
 * Downloads the Student ID Card as a PDF in exact ID Card Format (CR80 standard 54mm x 85.6mm)
 * or as an A4 Print Sheet with cut guidelines.
 */
export async function downloadStudentIdCardPDF(
  element: HTMLElement,
  studentName: string,
  side: 'front' | 'back' | 'both' = 'front',
  backElement?: HTMLElement | null,
  format: 'card' | 'a4_sheet' = 'card'
): Promise<PdfDownloadResult> {
  const safeName = (studentName || 'Student').trim().replace(/[^a-zA-Z0-9_-]/g, '_');

  // Resolve target elements
  let frontEl = element;
  let backEl = backElement || null;

  if (!frontEl && typeof document !== 'undefined') {
    frontEl = (document.getElementById('skuast-card-front') || element) as HTMLElement;
  }
  if (!backEl && typeof document !== 'undefined') {
    backEl = document.getElementById('skuast-card-back') as HTMLElement | null;
  }

  if (format === 'card') {
    // =========================================================================
    // TRUE ID CARD FORMAT (Standard CR80: 54mm x 85.6mm portrait PDF)
    // =========================================================================
    if (side === 'front') {
      const frontCanvas = await captureCardCanvas(frontEl);
      const frontImg = safeCanvasToDataUrl(frontCanvas);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [CR80_CARD_WIDTH_MM, CR80_CARD_HEIGHT_MM]
      });

      pdf.addImage(frontImg, 'PNG', 0, 0, CR80_CARD_WIDTH_MM, CR80_CARD_HEIGHT_MM, undefined, 'FAST');
      return triggerPdfDownload(pdf, `SKUAST_ICard_${safeName}_Front_Card_Format.pdf`);
    }

    if (side === 'back') {
      const targetEl = backEl || frontEl;
      const backCanvas = await captureCardCanvas(targetEl);
      const backImg = safeCanvasToDataUrl(backCanvas);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [CR80_CARD_WIDTH_MM, CR80_CARD_HEIGHT_MM]
      });

      pdf.addImage(backImg, 'PNG', 0, 0, CR80_CARD_WIDTH_MM, CR80_CARD_HEIGHT_MM, undefined, 'FAST');
      return triggerPdfDownload(pdf, `SKUAST_ICard_${safeName}_Back_Card_Format.pdf`);
    }

    if (side === 'both') {
      // Capture Front
      const frontCanvas = await captureCardCanvas(frontEl);
      const frontImg = safeCanvasToDataUrl(frontCanvas);

      // Create PDF with Page 1 = Front
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [CR80_CARD_WIDTH_MM, CR80_CARD_HEIGHT_MM]
      });

      pdf.addImage(frontImg, 'PNG', 0, 0, CR80_CARD_WIDTH_MM, CR80_CARD_HEIGHT_MM, undefined, 'FAST');

      // Page 2 = Back
      if (backEl) {
        const backCanvas = await captureCardCanvas(backEl);
        const backImg = safeCanvasToDataUrl(backCanvas);

        pdf.addPage([CR80_CARD_WIDTH_MM, CR80_CARD_HEIGHT_MM], 'portrait');
        pdf.addImage(backImg, 'PNG', 0, 0, CR80_CARD_WIDTH_MM, CR80_CARD_HEIGHT_MM, undefined, 'FAST');
      }

      return triggerPdfDownload(pdf, `SKUAST_ICard_${safeName}_Both_Sides_Card_Format.pdf`);
    }
  }

  // =========================================================================
  // A4 PRINT SHEET FORMAT (Front & Back centered with fold & cut guidelines)
  // =========================================================================
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
  const cardW = CR80_CARD_WIDTH_MM; // 54mm
  const cardH = CR80_CARD_HEIGHT_MM; // 85.6mm
  const gap = 12; // 12mm between cards
  const startY = 52; // vertical placement

  // Header banner text
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.setTextColor(144, 23, 32); // SKUAST Crimson Red
  pdf.text('EXTENSION TRAINING CENTRE (ETC) MALANGPORA PULWAMA', pageWidth / 2, 22, { align: 'center' });

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(15, 23, 42);
  pdf.text('SKUAST KASHMIR - 192308', pageWidth / 2, 28, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Official Student Identity Card • ISO/IEC 7810 ID-1 Standard (CR80: 54.0 mm x 85.6 mm)', pageWidth / 2, 34, { align: 'center' });

  if (side === 'both' && backEl) {
    const totalCardsWidth = cardW * 2 + gap;
    const startX = (pageWidth - totalCardsWidth) / 2;
    const frontX = startX;
    const backX = startX + cardW + gap;

    const frontCanvas = await captureCardCanvas(frontEl);
    const frontImg = safeCanvasToDataUrl(frontCanvas);

    const backCanvas = await captureCardCanvas(backEl);
    const backImg = safeCanvasToDataUrl(backCanvas);

    // Add Front card
    pdf.addImage(frontImg, 'PNG', frontX, startY, cardW, cardH, undefined, 'FAST');
    // Add Back card
    pdf.addImage(backImg, 'PNG', backX, startY, cardW, cardH, undefined, 'FAST');

    // Draw cut guides around both cards
    pdf.setDrawColor(203, 213, 225); // slate-300
    pdf.setLineDashPattern([2, 2], 0);
    pdf.rect(frontX - 1.5, startY - 1.5, cardW + 3, cardH + 3, 'S');
    pdf.rect(backX - 1.5, startY - 1.5, cardW + 3, cardH + 3, 'S');

    // Labels above cards
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(71, 85, 105);
    pdf.text('FRONT SIDE', frontX + cardW / 2, startY - 4, { align: 'center' });
    pdf.text('BACK SIDE', backX + cardW / 2, startY - 4, { align: 'center' });

    // Bottom instructions
    const instructY = startY + cardH + 20;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(15, 23, 42);
    pdf.text('PRINTING & LAMINATION INSTRUCTIONS:', pageWidth / 2, instructY, { align: 'center' });

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text('1. In your printer settings, select "Actual Size" or "100% Scale" (Do NOT choose "Fit to Printable Area").', pageWidth / 2, instructY + 6, { align: 'center' });
    pdf.text('2. Cut along the dashed boundary lines and insert into a standard PVC card pouch or thermal laminate.', pageWidth / 2, instructY + 11, { align: 'center' });
    pdf.text(`Candidate: ${studentName} | Date of Generation: ${new Date().toLocaleDateString('en-GB')}`, pageWidth / 2, instructY + 18, { align: 'center' });
  } else {
    // Single card centered
    const targetEl = side === 'back' && backEl ? backEl : frontEl;
    const canvas = await captureCardCanvas(targetEl);
    const imgData = safeCanvasToDataUrl(canvas);

    const cardX = (pageWidth - cardW) / 2;
    pdf.addImage(imgData, 'PNG', cardX, startY, cardW, cardH, undefined, 'FAST');

    // Guide
    pdf.setDrawColor(203, 213, 225);
    pdf.setLineDashPattern([2, 2], 0);
    pdf.rect(cardX - 1.5, startY - 1.5, cardW + 3, cardH + 3, 'S');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(71, 85, 105);
    pdf.text(`${side.toUpperCase()} SIDE`, pageWidth / 2, startY - 4, { align: 'center' });
  }

  return triggerPdfDownload(pdf, `SKUAST_ICard_${safeName}_A4_Print_Sheet.pdf`);
}

/**
 * Downloads the card as a high-definition PNG image cropped exactly to standard card boundaries.
 */
export async function downloadStudentIdCardImage(
  element: HTMLElement,
  studentName: string,
  sideName: string = 'Front'
): Promise<{ filename: string; dataUrl: string }> {
  const canvas = await captureCardCanvas(element);
  const safeName = (studentName || 'Student').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const dataUrl = safeCanvasToDataUrl(canvas);
  const filename = `SKUAST_ICard_${safeName}_${sideName}_Card_Format.png`;

  try {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => link.remove(), 2000);
  } catch (err) {
    console.warn('Direct image link click failed:', err);
  }

  return { filename, dataUrl };
}

/**
 * Generates self-contained, standalone printable HTML document for the ID card.
 * Can be opened in a clean popup tab, rendered in an iframe, or printed directly.
 */
export function generatePrintableHtml(
  frontImgData: string,
  backImgData: string = '',
  side: 'front' | 'back' | 'both' = 'front',
  layout: 'card' | 'a4_sheet' = 'card',
  studentName: string = 'Trainee'
): string {
  const isCard = layout === 'card';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SKUAST-Kashmir - Student Identity Card - ${studentName}</title>
  <style>
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      box-sizing: border-box !important;
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #f1f5f9;
      font-family: system-ui, -apple-system, sans-serif;
    }

    /* Screen UI toolbar (hidden during print) */
    @media screen {
      .print-screen-bar {
        position: sticky;
        top: 0;
        left: 0;
        right: 0;
        background: #901720;
        color: #ffffff;
        padding: 12px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        z-index: 99999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      .print-screen-bar h1 {
        margin: 0;
        font-size: 15px;
        font-weight: 800;
        letter-spacing: 0.5px;
      }
      .print-screen-bar p {
        margin: 2px 0 0;
        font-size: 12px;
        color: #fca5a5;
      }
      .print-actions {
        display: flex;
        gap: 10px;
      }
      .btn-print {
        background: #fbbf24;
        color: #1e293b;
        border: none;
        padding: 8px 18px;
        border-radius: 8px;
        font-weight: 800;
        font-size: 13px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.12);
      }
      .btn-print:hover {
        background: #f59e0b;
      }
      .btn-close {
        background: rgba(255,255,255,0.15);
        color: #ffffff;
        border: 1px solid rgba(255,255,255,0.3);
        padding: 8px 14px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 13px;
        cursor: pointer;
      }
      .btn-close:hover {
        background: rgba(255,255,255,0.25);
      }
      .instructions-banner {
        max-width: 600px;
        margin: 16px auto;
        background: #ffffff;
        border: 1px solid #cbd5e1;
        border-radius: 12px;
        padding: 12px 16px;
        font-size: 12px;
        color: #334155;
        line-height: 1.5;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      }
      .instructions-banner strong {
        color: #901720;
      }
      .preview-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
        padding: 20px;
      }
      .card-item {
        background: #ffffff;
        box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
        border-radius: 8px;
        overflow: hidden;
      }
    }

    /* PRINT RULES */
    @media print {
      .print-screen-bar, .instructions-banner {
        display: none !important;
      }
      html, body {
        background: #ffffff !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      ${isCard ? `
        @page {
          size: ${CR80_CARD_WIDTH_MM}mm ${CR80_CARD_HEIGHT_MM}mm;
          margin: 0mm;
        }
        .preview-container {
          padding: 0 !important;
          margin: 0 !important;
          display: block !important;
        }
        .card-page {
          width: ${CR80_CARD_WIDTH_MM}mm !important;
          height: ${CR80_CARD_HEIGHT_MM}mm !important;
          page-break-inside: avoid !important;
          page-break-after: always !important;
          margin: 0 !important;
          padding: 0 !important;
          display: block !important;
          overflow: hidden !important;
        }
        .card-page:last-child {
          page-break-after: auto !important;
        }
        .card-img {
          width: ${CR80_CARD_WIDTH_MM}mm !important;
          height: ${CR80_CARD_HEIGHT_MM}mm !important;
          display: block !important;
          object-fit: cover !important;
          margin: 0 !important;
          padding: 0 !important;
        }
      ` : `
        @page {
          size: A4 portrait;
          margin: 10mm;
        }
        .preview-container {
          padding: 0 !important;
          margin: 0 !important;
          display: block !important;
        }
        .a4-header {
          text-align: center;
          margin-bottom: 25px;
        }
        .a4-header h2 {
          margin: 0;
          font-size: 16px;
          color: #901720;
          font-weight: 800;
          text-transform: uppercase;
        }
        .a4-header p {
          margin: 4px 0 0;
          font-size: 11px;
          color: #475569;
        }
        .a4-grid {
          display: flex;
          justify-content: center;
          gap: 20mm;
          margin-top: 15mm;
        }
        .a4-card-unit {
          text-align: center;
        }
        .a4-label {
          font-size: 11px;
          font-weight: bold;
          color: #475569;
          margin-bottom: 6px;
          text-transform: uppercase;
        }
        .a4-card-border {
          width: ${CR80_CARD_WIDTH_MM}mm;
          height: ${CR80_CARD_HEIGHT_MM}mm;
          border: 1px dashed #94a3b8;
          overflow: hidden;
        }
        .a4-card-img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }
      `}
    }
  </style>
</head>
<body>

  <!-- Screen Toolbar -->
  <div class="print-screen-bar">
    <div>
      <h1>SKUAST-Kashmir • Student Identity Card</h1>
      <p>Print View (${isCard ? 'CR80 Card Size: 54mm × 85.6mm' : 'A4 Multi-Card Sheet with Cut Lines'})</p>
    </div>
    <div class="print-actions">
      <button class="btn-print" onclick="window.print()">
        🖨️ Print Card Now
      </button>
      <button class="btn-close" onclick="window.close()">
        ✕ Close
      </button>
    </div>
  </div>

  <div class="instructions-banner">
    <strong>Printer Setup Instructions:</strong><br/>
    1. Click <strong>Print Card Now</strong> or press <kbd>Ctrl+P</kbd> / <kbd>Cmd+P</kbd>.<br/>
    2. In the printer dialog, set <strong>Destination</strong> to your Card/Document Printer or <em>Save as PDF</em>.<br/>
    3. Paper Size: <strong>${isCard ? 'CR80 Card / 54×85.6mm (or Custom 54mm×85.6mm)' : 'A4'}</strong>, Scale: <strong>100% (Default)</strong>.<br/>
    4. Make sure <strong>Background graphics</strong> is enabled.
  </div>

  <!-- Printable Content -->
  <div class="preview-container">
    ${isCard ? `
      ${side === 'front' || side === 'both' ? `
        <div class="card-page card-item">
          <img src="${frontImgData}" alt="ID Card Front" class="card-img" />
        </div>
      ` : ''}
      ${(side === 'back' || side === 'both') && backImgData ? `
        <div class="card-page card-item">
          <img src="${backImgData}" alt="ID Card Back" class="card-img" />
        </div>
      ` : ''}
    ` : `
      <div class="a4-header">
        <h2>EXTENSION TRAINING CENTRE (ETC) MALANGPORA PULWAMA</h2>
        <p>SKUAST Kashmir • Official Trainee Identity Card</p>
      </div>
      <div class="a4-grid">
        ${side === 'front' || side === 'both' ? `
          <div class="a4-card-unit">
            <div class="a4-label">Front Side (54mm × 85.6mm)</div>
            <div class="a4-card-border card-item">
              <img src="${frontImgData}" alt="Front" class="a4-card-img" />
            </div>
          </div>
        ` : ''}
        ${(side === 'back' || side === 'both') && backImgData ? `
          <div class="a4-card-unit">
            <div class="a4-label">Back Side (54mm × 85.6mm)</div>
            <div class="a4-card-border card-item">
              <img src="${backImgData}" alt="Back" class="a4-card-img" />
            </div>
          </div>
        ` : ''}
      </div>
    `}
  </div>

  <script>
    // Auto-trigger print after images have loaded
    window.addEventListener('load', function() {
      setTimeout(function() {
        try {
          window.print();
        } catch(e) {
          console.warn('Auto-print blocked:', e);
        }
      }, 500);
    });
  </script>
</body>
</html>`;
}

/**
 * Creates an object URL for the self-contained printable card HTML.
 */
export function createPrintableBlobUrl(
  frontImgData: string,
  backImgData: string = '',
  side: 'front' | 'back' | 'both' = 'front',
  layout: 'card' | 'a4_sheet' = 'card',
  studentName: string = 'Trainee'
): string {
  const html = generatePrintableHtml(frontImgData, backImgData, side, layout, studentName);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  return URL.createObjectURL(blob);
}

/**
 * Executes high-fidelity in-document card printing.
 * Injects a pure @media print layer into document.body so that ONLY the ID Card
 * is printed with exact 54mm x 85.6mm physical dimensions, bypassing any iframe sandbox issues.
 */
export async function printViaDocumentPortal(
  frontImgData: string,
  backImgData: string = '',
  side: 'front' | 'back' | 'both' = 'front',
  layout: 'card' | 'a4_sheet' = 'card'
): Promise<void> {
  // 1. Remove any previous print artifacts
  document.getElementById('skuast-print-portal')?.remove();
  document.getElementById('skuast-print-style')?.remove();
  document.body.classList.remove('idcard-print-mode');

  // 2. Add idcard-print-mode to body for complete isolation
  document.body.classList.add('idcard-print-mode');

  // 3. Inject print CSS
  const styleEl = document.createElement('style');
  styleEl.id = 'skuast-print-style';

  if (layout === 'card') {
    styleEl.innerHTML = `
      @media print {
        @page {
          size: ${CR80_CARD_WIDTH_MM}mm ${CR80_CARD_HEIGHT_MM}mm;
          margin: 0mm;
        }
        *, *::before, *::after {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          box-sizing: border-box !important;
        }
        html, body {
          width: ${CR80_CARD_WIDTH_MM}mm !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #ffffff !important;
        }
        body.idcard-print-mode > *:not(#skuast-print-portal) {
          display: none !important;
          visibility: hidden !important;
        }
        #skuast-print-portal {
          display: block !important;
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: ${CR80_CARD_WIDTH_MM}mm !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #ffffff !important;
          z-index: 9999999 !important;
        }
        .skuast-portal-page {
          width: ${CR80_CARD_WIDTH_MM}mm !important;
          height: ${CR80_CARD_HEIGHT_MM}mm !important;
          page-break-inside: avoid !important;
          page-break-after: always !important;
          overflow: hidden !important;
          margin: 0 !important;
          padding: 0 !important;
          display: block !important;
        }
        .skuast-portal-page:last-child {
          page-break-after: auto !important;
        }
        .skuast-portal-img {
          width: ${CR80_CARD_WIDTH_MM}mm !important;
          height: ${CR80_CARD_HEIGHT_MM}mm !important;
          display: block !important;
          object-fit: cover !important;
          margin: 0 !important;
          padding: 0 !important;
        }
      }
      @media screen {
        #skuast-print-portal {
          display: none !important;
        }
      }
    `;
  } else {
    // A4 Sheet
    styleEl.innerHTML = `
      @media print {
        @page {
          size: A4 portrait;
          margin: 10mm;
        }
        *, *::before, *::after {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          box-sizing: border-box !important;
        }
        body.idcard-print-mode > *:not(#skuast-print-portal) {
          display: none !important;
          visibility: hidden !important;
        }
        #skuast-print-portal {
          display: block !important;
          position: static !important;
          width: 100% !important;
          background: #ffffff !important;
        }
        .skuast-a4-portal-header {
          text-align: center;
          margin-bottom: 25px;
        }
        .skuast-a4-portal-cards {
          display: flex;
          justify-content: center;
          gap: 20mm;
          margin-top: 15mm;
        }
        .skuast-a4-card-box {
          width: ${CR80_CARD_WIDTH_MM}mm;
          height: ${CR80_CARD_HEIGHT_MM}mm;
          border: 1px dashed #94a3b8;
          overflow: hidden;
        }
        .skuast-a4-card-img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }
      }
      @media screen {
        #skuast-print-portal {
          display: none !important;
        }
      }
    `;
  }
  document.head.appendChild(styleEl);

  // 4. Inject print portal DOM
  const portal = document.createElement('div');
  portal.id = 'skuast-print-portal';

  if (layout === 'card') {
    let pagesHtml = '';
    if (side === 'front' || side === 'both') {
      pagesHtml += `
        <div class="skuast-portal-page">
          <img src="${frontImgData}" alt="ID Card Front" class="skuast-portal-img" />
        </div>
      `;
    }
    if ((side === 'back' || side === 'both') && backImgData) {
      pagesHtml += `
        <div class="skuast-portal-page">
          <img src="${backImgData}" alt="ID Card Back" class="skuast-portal-img" />
        </div>
      `;
    }
    portal.innerHTML = pagesHtml;
  } else {
    portal.innerHTML = `
      <div class="skuast-a4-portal-header">
        <h2 style="font-size: 16px; margin: 0; color: #1b5e20; font-family: system-ui, sans-serif; font-weight: 800;">
          EXTENSION TRAINING CENTRE (ETC) MALANGPORA PULWAMA
        </h2>
        <p style="font-size: 11px; margin: 4px 0 0; color: #475569; font-family: system-ui, sans-serif;">
          SKUAST Kashmir • Official Trainee Identity Card
        </p>
      </div>
      <div class="skuast-a4-portal-cards">
        ${side === 'front' || side === 'both' ? `
          <div style="text-align: center;">
            <div style="font-size: 11px; font-weight: bold; margin-bottom: 6px; font-family: system-ui, sans-serif; color: #475569;">
              FRONT SIDE (54mm × 85.6mm)
            </div>
            <div class="skuast-a4-card-box">
              <img src="${frontImgData}" alt="Front" class="skuast-a4-card-img" />
            </div>
          </div>
        ` : ''}
        ${(side === 'back' || side === 'both') && backImgData ? `
          <div style="text-align: center;">
            <div style="font-size: 11px; font-weight: bold; margin-bottom: 6px; font-family: system-ui, sans-serif; color: #475569;">
              BACK SIDE (54mm × 85.6mm)
            </div>
            <div class="skuast-a4-card-box">
              <img src="${backImgData}" alt="Back" class="skuast-a4-card-img" />
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
  document.body.appendChild(portal);

  // 5. Wait for all portal images to finish decoding before window.print() opens!
  const imgElements = Array.from(portal.getElementsByTagName('img'));
  await Promise.all(
    imgElements.map(async (img) => {
      if (img.complete && img.naturalWidth > 0) return;
      try {
        await img.decode();
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    })
  );

  // Allow browser layout and paint frames
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  // 6. Trigger print dialog cleanly
  try {
    window.focus();
    window.print();
  } catch (err) {
    console.warn('window.print call notice:', err);
  }

  // 7. Cleanup
  const cleanup = () => {
    document.body.classList.remove('idcard-print-mode');
    portal.remove();
    styleEl.remove();
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);
  setTimeout(cleanup, 12000);
}

/**
 * Isolated Hidden Iframe Print Engine
 * Bypasses applet iframe barriers and avoids printing parent portal background or UI elements.
 */
export function printViaIframe(
  frontImgData: string,
  backImgData: string = '',
  side: 'front' | 'back' | 'both' = 'front',
  layout: 'card' | 'a4_sheet' = 'card',
  studentName: string = 'Trainee'
): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const existingIframe = document.getElementById('skuast-isolated-print-iframe');
      if (existingIframe) {
        existingIframe.remove();
      }

      const iframe = document.createElement('iframe');
      iframe.id = 'skuast-isolated-print-iframe';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);

      const htmlContent = generatePrintableHtml(frontImgData, backImgData, side, layout, studentName);

      const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
      if (!iframeDoc || !iframe.contentWindow) {
        resolve(false);
        return;
      }

      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();

      iframe.onload = async () => {
        try {
          const imgs = Array.from(iframeDoc.getElementsByTagName('img'));
          await Promise.all(
            imgs.map(async (img) => {
              if (img.complete && img.naturalWidth > 0) return;
              try {
                await img.decode();
              } catch {
                // ignore
              }
            })
          );

          await new Promise((r) => setTimeout(r, 250));
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          resolve(true);
        } catch (printErr) {
          console.warn('Iframe print dispatch error:', printErr);
          resolve(false);
        } finally {
          setTimeout(() => {
            iframe.remove();
          }, 15000);
        }
      };
    } catch (e) {
      console.warn('Iframe setup error:', e);
      resolve(false);
    }
  });
}

/**
 * High-fidelity print utility that formats the ID card strictly in CARD FORMAT.
 * By pre-capturing the card as a 300-DPI high-res canvas, it prints with 100% color accuracy,
 * zero layout shifting, and exact 54mm x 85.6mm physical dimensions.
 */
export async function printStudentIdCard(
  elementOrId: HTMLElement | string,
  side: 'front' | 'back' | 'both' = 'front',
  backElementOrId?: HTMLElement | string | null,
  layout: 'card' | 'a4_sheet' = 'card',
  studentName: string = 'Trainee'
): Promise<{ success: boolean; printableBlobUrl: string; frontImgData: string; backImgData: string }> {
  // Resolve DOM elements
  const frontEl = (typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId)
    || document.getElementById('skuast-export-front')
    || document.getElementById('skuast-card-front');

  const backEl = (backElementOrId ? (typeof backElementOrId === 'string' ? document.getElementById(backElementOrId) : backElementOrId) : null)
    || document.getElementById('skuast-export-back')
    || document.getElementById('skuast-card-back');

  if (!frontEl) {
    throw new Error('Front card element not found in DOM.');
  }

  // 1. Capture high-res front canvas
  const frontCanvas = await captureCardCanvas(frontEl);
  const frontImgData = safeCanvasToDataUrl(frontCanvas);

  // 2. Capture back canvas if present
  let backImgData = '';
  if (backEl) {
    try {
      const backCanvas = await captureCardCanvas(backEl);
      backImgData = safeCanvasToDataUrl(backCanvas);
    } catch (bErr) {
      console.warn('Back card capture notice:', bErr);
    }
  }

  // 3. Generate standalone blob URL
  const printableBlobUrl = createPrintableBlobUrl(frontImgData, backImgData, side, layout, studentName);

  // 4. Trigger print via isolated iframe (prevents background printing)
  const iframeSuccess = await printViaIframe(frontImgData, backImgData, side, layout, studentName);
  if (!iframeSuccess) {
    // Fallback to portal print
    await printViaDocumentPortal(frontImgData, backImgData, side, layout);
  }

  return {
    success: true,
    printableBlobUrl,
    frontImgData,
    backImgData
  };
}
