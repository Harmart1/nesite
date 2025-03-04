/**
 * Enhanced Path Reference Fix
 * Converts absolute paths to relative paths for local development
 * and handles dynamic path resolution based on page location
 */

document.addEventListener('DOMContentLoaded', function() {
  // Determine if we're on local development
  const isLocalDev = window.location.protocol === 'file:' || 
                    window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('Local development environment detected. Fixing paths...');
    
    // Determine base path for dynamic path resolution
    const getBasePath = () => {
      const currentPath = window.location.pathname;
      const pathParts = currentPath.split('/');
      
      // Remove file name from path if present
      if (pathParts[pathParts.length - 1].includes('.')) {
        pathParts.pop();
      }
      
      // Count the directory depth
      const depth = pathParts.filter(part => part.length > 0).length;
      
      // Return appropriate relative path based on depth
      if (depth === 0) return './';
      
      // Return series of "../" based on depth
      return '../'.repeat(depth);
    };
    
    const basePath = getBasePath();
    console.log(`Calculated base path: ${basePath}`);
    
    // Fix CSS references
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      
      if (href.startsWith('/')) {
        const newPath = href.substring(1); // Remove leading slash
        console.log(`Fixing CSS path: ${href} → ${newPath}`);
        link.setAttribute('href', newPath);
      }
    });
    
    // Fix script references
    document.querySelectorAll('script[src]').forEach(script => {
      const src = script.getAttribute('src');
      if (!src) return;
      
      if (src.startsWith('/')) {
        const newPath = src.substring(1); // Remove leading slash
        console.log(`Fixing script path: ${src} → ${newPath}`);
        script.setAttribute('src', newPath);
      }
    });
    
    // Fix image references
    document.querySelectorAll('img[src]').forEach(img => {
      const src = img.getAttribute('src');
      if (!src) return;
      
      if (src.startsWith('/')) {
        const newPath = src.substring(1); // Remove leading slash
        console.log(`Fixing image path: ${src} → ${newPath}`);
        img.setAttribute('src', newPath);
        
        // Add error handler to use placeholder if image not found
        img.addEventListener('error', function() {
          console.warn(`Failed to load image: ${newPath}, using placeholder`);
          this.src = 'images/placeholder.html';
        });
      }
    });
    
    // Fix anchor links
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;
      
      if (href.startsWith('/') && !href.startsWith('//') && !href.includes('://')) {
        const newPath = href.substring(1); // Remove leading slash
        console.log(`Fixing anchor path: ${href} → ${newPath}`);
        a.setAttribute('href', newPath);
      }
    });
    
    console.log('Path fixing completed');
  }
});
