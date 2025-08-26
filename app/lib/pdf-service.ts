import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Define the GeneratedReading type locally to avoid import issues
type GeneratedReading = {
  id: string;
  title: string;
  content: string;
  loading: boolean;
  error?: string;
  category?: string;
  extractedData?: any;
};

export class PDFService {
  /**
   * Generate a PDF from a reading's content
   */
  static async generateReadingPDF(reading: GeneratedReading): Promise<Blob> {
    // Create temporary container with reading content
    const container = document.createElement('div');
    container.innerHTML = reading.content;
    
    // Apply PDF-specific styling
    container.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: 800px;
      background: white;
      color: #1a1a1a;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 40px;
      line-height: 1.6;
      font-size: 14px;
      border-radius: 0;
      box-shadow: none;
    `;
    
    // Add custom styles for PDF elements
    const style = document.createElement('style');
    style.textContent = `
      h1, h2, h3, h4, h5, h6 {
        color: #1a1a1a !important;
        font-weight: 600 !important;
        margin-top: 32px !important;
        margin-bottom: 20px !important;
        line-height: 1.3 !important;
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
      
      h1 { font-size: 24px !important; }
      h2 { font-size: 20px !important; }
      h3 { font-size: 18px !important; }
      h4 { font-size: 16px !important; }
      
      p {
        margin-bottom: 20px !important;
        text-align: left !important;
        color: #1a1a1a !important;
        line-height: 1.7 !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        orphans: 3 !important;
        widows: 3 !important;
      }
      
      strong {
        color: #1a1a1a !important;
        font-weight: 600 !important;
      }
      
      em {
        color: #666 !important;
        font-style: italic !important;
      }
      
      ul, ol {
        margin: 20px 0 !important;
        padding-left: 24px !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      li {
        margin-bottom: 12px !important;
        color: #1a1a1a !important;
        line-height: 1.6 !important;
      }
      
      blockquote {
        margin: 24px 0 !important;
        padding: 20px 24px !important;
        background: #f8f9fa !important;
        border-left: 4px solid #e9ecef !important;
        border-radius: 4px !important;
        font-style: italic !important;
        color: #495057 !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      * {
        box-sizing: border-box !important;
      }
    `;
    
    container.appendChild(style);
    document.body.appendChild(container);
    
    try {
      // Wait for fonts to load
      await document.fonts.ready;
      
      // Generate canvas from HTML
      const canvas = await html2canvas(container, {
        width: 800,
        height: container.scrollHeight,
        scale: 2, // Higher resolution
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        foreignObjectRendering: false
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calculate dimensions with better margins
      const imgWidth = 180; // A4 width minus larger margins (20mm each side)
      const pageHeight = 250; // A4 height minus margins (top: 20mm, bottom: 40mm for footer)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      let pageNumber = 1;
      
      // Add first content page (no title page)
      pdf.addImage(imgData, 'PNG', 15, 20, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      position = pageHeight;
      
      // Add additional pages if needed
      while (heightLeft >= 0) {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 15, 20 - position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        position += pageHeight;
        pageNumber++;
      }
      
      // Add footer with AstroAnew and date to all pages
      for (let i = 1; i <= pageNumber; i++) {
        pdf.setPage(i);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        
        // Add a subtle line above the footer
        pdf.setDrawColor(200, 200, 200);
        pdf.line(15, 270, 195, 270);
        
        // Add AstroAnew and date
        pdf.text('AstroAnew', 15, 280, { align: 'left' });
        pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 195, 280, { align: 'right' });
      }
      
      return pdf.output('blob');
    } finally {
      // Clean up
      document.body.removeChild(container);
    }
  }
  
  /**
   * Generate a filename for the PDF
   */
  static generateFilename(reading: GeneratedReading): string {
    const timestamp = new Date().toISOString().split('T')[0];
    const safeTitle = reading.title
      .replace(/[^a-z0-9\s]/gi, '')
      .replace(/\s+/g, '_')
      .toLowerCase();
    return `astroanew_${safeTitle}_${timestamp}.pdf`;
  }
  
  /**
   * Download a blob as a file
   */
  static downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }
}
