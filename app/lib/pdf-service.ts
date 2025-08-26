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
    
    // Add a wrapper div to ensure proper spacing
    const wrapper = document.createElement('div');
    wrapper.appendChild(container);
    wrapper.className = 'pdf-content-wrapper';
    
    // Apply PDF-specific styling
    wrapper.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: 800px;
      background: white;
      color: #1a1a1a;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 60px 40px 80px 40px;
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
        margin-top: 40px !important;
        margin-bottom: 24px !important;
        line-height: 1.3 !important;
        page-break-after: avoid !important;
        break-after: avoid !important;
        page-break-before: auto !important;
        break-before: auto !important;
      }
      
      h1 { font-size: 24px !important; }
      h2 { font-size: 20px !important; }
      h3 { font-size: 18px !important; }
      h4 { font-size: 16px !important; }
      
      p {
        margin-bottom: 24px !important;
        text-align: left !important;
        color: #1a1a1a !important;
        line-height: 1.7 !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        orphans: 4 !important;
        widows: 4 !important;
        margin-top: 0 !important;
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
        margin: 24px 0 !important;
        padding-left: 24px !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      li {
        margin-bottom: 16px !important;
        color: #1a1a1a !important;
        line-height: 1.6 !important;
      }
      
      blockquote {
        margin: 32px 0 !important;
        padding: 24px 28px !important;
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
      
      /* Add extra spacing before page breaks */
      .page-break-before {
        page-break-before: always !important;
        break-before: page !important;
        margin-top: 40px !important;
      }
      
      /* Ensure proper spacing at the end of content */
      .content-end {
        margin-bottom: 60px !important;
      }
      
      /* PDF content wrapper */
      .pdf-content-wrapper {
        padding-bottom: 40px !important;
      }
      
      .pdf-content-wrapper > div:last-child {
        margin-bottom: 40px !important;
      }
    `;
    
    wrapper.appendChild(style);
    document.body.appendChild(wrapper);
    
    try {
      // Wait for fonts to load
      await document.fonts.ready;
      
      // Generate canvas from HTML
      const canvas = await html2canvas(wrapper, {
        width: 800,
        height: wrapper.scrollHeight,
        scale: 2, // Higher resolution
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        foreignObjectRendering: false
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calculate dimensions with better margins and spacing
      const imgWidth = 180; // A4 width minus margins (20mm each side)
      const pageHeight = 240; // A4 height minus margins (top: 20mm, bottom: 20mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      let pageNumber = 1;
      
      // Add first content page
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
      
      // Add footer only to the last page
      if (pageNumber > 0) {
        pdf.setPage(pageNumber);
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
      document.body.removeChild(wrapper);
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
