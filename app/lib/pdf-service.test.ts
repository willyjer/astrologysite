// Simple test file for PDF service functionality
// This can be used to verify the PDF generation works in the browser

import { PDFService } from './pdf-service';

// Mock GeneratedReading for testing
const mockReading = {
  id: 'test-reading',
  title: 'Test Astrology Reading',
  content: `
    <h2>Your Personal Astrology Reading</h2>
    <p>This is a <strong>test reading</strong> to verify PDF generation works correctly.</p>
    <p>It includes various elements like:</p>
    <ul>
      <li>Bullet points</li>
      <li>Formatted text</li>
      <li>Different headings</li>
    </ul>
    <blockquote>
      This is a blockquote to test styling in the PDF.
    </blockquote>
    <p>This reading was generated on <em>${new Date().toLocaleDateString()}</em>.</p>
  `,
  loading: false,
  error: null,
  category: 'test',
  description: 'Test reading for PDF generation'
};

// Test function that can be called from browser console
export async function testPDFGeneration() {
  try {
    console.log('🔄 Starting PDF generation test...');
    
    const startTime = Date.now();
    const pdfBlob = await PDFService.generateReadingPDF(mockReading);
    const endTime = Date.now();
    
    console.log(`✅ PDF generated successfully in ${endTime - startTime}ms`);
    console.log(`📄 PDF size: ${(pdfBlob.size / 1024).toFixed(2)} KB`);
    
    // Generate filename and download
    const filename = PDFService.generateFilename(mockReading);
    console.log(`📁 Filename: ${filename}`);
    
    PDFService.downloadBlob(pdfBlob, filename);
    
    console.log('🎉 PDF download initiated!');
    
  } catch (error) {
    console.error('❌ PDF generation failed:', error);
  }
}

// Export for browser testing
if (typeof window !== 'undefined') {
  (window as any).testPDFGeneration = testPDFGeneration;
}
