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
 * Triggers standard browser print dialog for the certificate.
 */
export function printCertificateElement(): void {
  window.print();
}
