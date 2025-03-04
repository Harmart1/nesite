/**
 * PDF Resource Generator
 * Creates downloadable PDF resources from web content
 * Requires jspdf and html2canvas libraries
 */

class PDFResourceGenerator {
  constructor(options = {}) {
    this.options = {
      filename: 'resource-document.pdf',
      pageSize: 'a4',
      margin: 15,
      headerLogo: '/images/northernedge-logo.svg',
      footerText: '© 2024 NorthernEdge Legal Solutions. All rights reserved.',
      includeDate: true,
      includePagination: true,
      ...options
    };
    
    // Check if required libraries are loaded
    this.librariesLoaded = typeof jspdf !== 'undefined' && typeof html2canvas !== 'undefined';
    if (!this.librariesLoaded) {
      console.error('PDFResourceGenerator requires jsPDF and html2canvas libraries');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    // Find all download buttons with data-pdf-target attribute
    const downloadButtons = document.querySelectorAll('[data-pdf-target]');
    
    downloadButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetSelector = button.getAttribute('data-pdf-target');
        const targetElement = document.querySelector(targetSelector);
        const filename = button.getAttribute('data-pdf-filename') || this.options.filename;
        
        if (targetElement) {
          this.generatePDF(targetElement, filename);
        } else {
          console.error(`Target element not found: ${targetSelector}`);
        }
      });
    });
  }

  async generatePDF(element, filename) {
    if (!this.librariesLoaded) {
      alert('PDF generation is not available. Required libraries not loaded.');
      return;
    }
    
    // Show loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'pdf-loading';
    loadingDiv.innerHTML = `
      <div class="pdf-loading-content">
        <div class="pdf-loading-spinner"></div>
        <p>Generating PDF...</p>
      </div>
    `;
    document.body.appendChild(loadingDiv);
    
    try {
      const options = this.options;
      
      // Create a clone of the element to avoid modifying the original
      const clonedElement = element.cloneNode(true);
      clonedElement.style.width = '800px'; // Fixed width for better PDF generation
      clonedElement.style.padding = '20px';
      clonedElement.style.visibility = 'hidden';
      clonedElement.style.position = 'absolute';
      clonedElement.style.top = '-9999px';
      clonedElement.style.left = '-9999px';
      document.body.appendChild(clonedElement);
      
      // Create a new jsPDF instance
      const pdf = new jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: options.pageSize
      });
      
      // Get page dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = options.margin;
      
      // Get current date if needed
      const currentDate = options.includeDate ? new Date().toLocaleDateString() : '';
      
      // Load the logo as a data URL for the header
      const logoImg = new Image();
      logoImg.src = options.headerLogo;
      
      // Convert the element to canvas
      const canvas = await html2canvas(clonedElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false
      });
      
      const contentWidth = pageWidth - (margin * 2);
      const contentHeight = (canvas.height * contentWidth) / canvas.width;
      const totalPages = Math.ceil(contentHeight / (pageHeight - (margin * 3))); // Account for header and footer
      
      // Add header, content, and footer to each page
      let remainingHeight = contentHeight;
      let yOffset = 0;
      
      for (let i = 0; i < totalPages; i++) {
        // Add a new page if not the first page
        if (i > 0) {
          pdf.addPage();
        }
        
        // Add header with logo
        pdf.addImage(logoImg, 'PNG', margin, margin, 40, 10);
        
        // Add date on the right side of the header
        if (options.includeDate) {
          pdf.setFontSize(10);
          pdf.setTextColor(100, 100, 100);
          const dateText = currentDate;
          pdf.text(dateText, pageWidth - margin - pdf.getStringUnitWidth(dateText) * 10 / pdf.internal.scaleFactor, margin + 5);
        }
        
        // Calculate the height for this page
        const pageContentHeight = Math.min(
          remainingHeight,
          pageHeight - (margin * 3) // Account for header and footer
        );
        
        // Add content for this page
        pdf.addImage(
          canvas,
          'PNG',
          margin,
          margin * 2, // Start after header
          contentWidth,
          pageContentHeight,
          null,
          'FAST',
          0,
          yOffset
        );
        
        // Update remaining height and y-offset for next page
        remainingHeight -= pageContentHeight;
        yOffset += pageContentHeight;
        
        // Add footer
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        
        // Footer text on left
        pdf.text(options.footerText, margin, pageHeight - margin);
        
        // Page number on right
        if (options.includePagination) {
          const pageText = `Page ${i + 1} of ${totalPages}`;
          pdf.text(
            pageText,
            pageWidth - margin - pdf.getStringUnitWidth(pageText) * 8 / pdf.internal.scaleFactor,
            pageHeight - margin
          );
        }
      }
      
      // Remove the cloned element
      document.body.removeChild(clonedElement);
      
      // Save the PDF
      pdf.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      // Remove loading indicator
      document.body.removeChild(loadingDiv);
    }
  }
}

// Initialize with default options
document.addEventListener('DOMContentLoaded', () => {
  window.pdfGenerator = new PDFResourceGenerator();
});
