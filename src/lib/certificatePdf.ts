import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CertificateData } from '../types';

/**
 * Downloads the rendered certificate element as a crisp High-Resolution A4 Landscape PDF.
 */
export async function downloadCertificateAsPDF(
  element: HTMLElement,
  data: CertificateData,
  filename?: string
): Promise<boolean> {
  try {
    if (!element) {
      console.error('Target certificate DOM element not found.');
      return false;
    }

    // Ensure all images within the element are fully loaded before capturing
    const images = Array.from(element.querySelectorAll('img'));
    await Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          // Timeout fallback in 1.5s
          setTimeout(resolve, 1500);
        });
      })
    );

    // 1. Render DOM Element to Canvas with safe CORS settings
    const canvas = await html2canvas(element, {
      scale: 2.5, // Crisp resolution without memory overflow
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#fffdf8',
      logging: false,
      imageTimeout: 10000,
      onclone: (clonedDoc, clonedElement) => {
        // Ensure cloned element is visible and has no CSS transform during capture
        clonedElement.style.transform = 'none';
        clonedElement.style.margin = '0 auto';
      },
    });

    // 2. Extract image data safely
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // 3. Initialize jsPDF in Landscape A4 (297mm x 210mm)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 297mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 210mm

    // Printable Margins
    const margin = 6;
    const renderWidth = pdfWidth - margin * 2;
    const renderHeight = pdfHeight - margin * 2;

    pdf.addImage(imgData, 'JPEG', margin, margin, renderWidth, renderHeight, undefined, 'FAST');

    // 4. Save PDF with clean filename
    const cleanName = (data.candidateName || 'Candidate')
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '_');
    const courseCode = data.courseCode || 'BHT';
    const pdfFileName = filename || `SKUAST_Certificate_${courseCode}_${cleanName}.pdf`;

    // Attempt direct save
    pdf.save(pdfFileName);

    // Fallback: Also trigger blob link download if in iframe
    try {
      const blob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = pdfFileName;
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      setTimeout(() => {
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(blobUrl);
      }, 2000);
    } catch {
      // Direct pdf.save succeeded already
    }

    return true;
  } catch (error) {
    console.error('Error generating certificate PDF:', error);
    
    // Ultimate Fallback: Direct Browser Print
    try {
      window.print();
    } catch {
      // ignore
    }
    return false;
  }
}

/**
 * Downloads the rendered certificate as a high-resolution PNG image.
 */
export async function downloadCertificateAsImage(
  element: HTMLElement,
  data: CertificateData,
  filename?: string
): Promise<boolean> {
  try {
    if (!element) return false;

    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#fffdf8',
      logging: false,
      onclone: (_, clonedElement) => {
        clonedElement.style.transform = 'none';
      },
    });

    const link = document.createElement('a');
    const cleanName = (data.candidateName || 'Candidate')
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '_');
    const courseCode = data.courseCode || 'BHT';
    link.download = filename || `SKUAST_Certificate_${courseCode}_${cleanName}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 1000);
    return true;
  } catch (error) {
    console.error('Error exporting certificate image:', error);
    return false;
  }
}

/**
 * Triggers high-fidelity browser print for ONLY the certificate in landscape color format (1 page).
 */
export function printCertificateElement(element?: HTMLElement | null): void {
  const target = element || document.getElementById('skuast-certificate-container');
  if (!target) {
    window.print();
    return;
  }

  try {
    // Remove any previously created print iframes
    const oldIframes = document.querySelectorAll('iframe[data-skuast-print="true"]');
    oldIframes.forEach((el) => el.remove());

    const iframe = document.createElement('iframe');
    iframe.setAttribute('data-skuast-print', 'true');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) {
      window.print();
      return;
    }

    // Collect all loaded CSS styles to ensure Tailwind and custom classes are active
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((s) => s.outerHTML)
      .join('\n');

    // Clone the certificate target node
    const clone = target.cloneNode(true) as HTMLElement;
    clone.style.transform = 'none';
    clone.style.margin = '0 auto';
    clone.style.boxShadow = 'none';

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>SKUAST-K Certificate Print</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        ${styles}
        <style>
          @page {
            size: landscape A4;
            margin: 0mm;
          }
          *, *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            box-sizing: border-box !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            max-width: 297mm !important;
            max-height: 210mm !important;
            overflow: hidden !important;
            background: #fffdf8 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-family: 'Playfair Display', Georgia, serif;
          }
          #print-wrapper {
            width: 297mm !important;
            height: 210mm !important;
            max-width: 297mm !important;
            max-height: 210mm !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin: 0 !important;
            padding: 4mm !important;
            overflow: hidden !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            break-inside: avoid !important;
          }
          #skuast-certificate-container {
            width: 288mm !important;
            height: 198mm !important;
            max-width: 288mm !important;
            max-height: 198mm !important;
            transform: none !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
          }
        </style>
      </head>
      <body>
        <div id="print-wrapper">
          ${clone.outerHTML}
        </div>
      </body>
      </html>
    `);
    doc.close();

    // Trigger printing inside iframe
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.error('Direct print failed, using window.print() fallback:', err);
        window.print();
      } finally {
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            iframe.remove();
          }
        }, 120000);
      }
    }, 450);
  } catch (err) {
    console.error('Error during certificate printing:', err);
    window.print();
  }
}

