/**
 * Enhanced Navigation System
 * Handles both homepage and inner page navigation functionality
 * Mobile optimized with improved touch interactions and accessibility
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize appropriate navigation based on page type
  const body = document.body;
  const isHomepage = document.querySelector('.homepage-navigation') !== null;
  
  // Create overlay element for mobile navigation
  const overlay = document.createElement('div');
  overlay.className = 'mobile-overlay';
  body.appendChild(overlay);
  
  if (isHomepage) {
    body.classList.add('is-homepage');
    initHomepageNavigation();
  } else {
    initStandardNavigation();
  }
  
  // Add click handler to the overlay
  overlay.addEventListener('click', function() {
    closeAllMobileMenus();
  });
  
  // General window scroll handling
  handleScroll();
  
  // Handle window resize events
  handleResizeEvents();
  
  // Setup accessibility enhancements
  setupAccessibility();
});

/**
 * Initialize the homepage-specific navigation
 */
function initHomepageNavigation() {
  const nav = document.querySelector('.homepage-navigation');
  const menuToggle = document.querySelector('.homepage-menu-toggle');
  const menu = document.querySelector('.homepage-menu');
  const dropdowns = document.querySelectorAll('.homepage-dropdown');
  
  if (menuToggle && menu) {
    // Mobile menu toggle
    menuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      this.classList.toggle('active');
      menu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
      
      // ARIA attributes for accessibility
      const expanded = this.classList.contains('active');
      this.setAttribute('aria-expanded', expanded);
      
      // Announce to screen readers
      if (expanded) {
        announceToScreenReader('Main menu expanded');
      } else {
        announceToScreenReader('Main menu collapsed');
      }
    });
    
    // Handle dropdown menus on mobile and touch devices
    dropdowns.forEach(dropdown => {
      const link = dropdown.querySelector('a');
      
      if (link) {
        link.addEventListener('click', function(e) {
          if (window.innerWidth <= 992 || isTouchDevice()) {
            e.preventDefault();
            
            // Close any open dropdowns
            dropdowns.forEach(d => {
              if (d !== dropdown && d.classList.contains('active')) {
                d.classList.remove('active');
              }
            });
            
            dropdown.classList.toggle('active');
            
            // ARIA attributes for accessibility
            const expanded = dropdown.classList.contains('active');
            link.setAttribute('aria-expanded', expanded);
          }
        });
      }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 992) return; // Skip on mobile - handled separately
      
      if (!e.target.closest('.homepage-dropdown')) {
        dropdowns.forEach(dropdown => {
          dropdown.classList.remove('active');
          const link = dropdown.querySelector('a');
          if (link) link.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }
}

/**
 * Initialize the standard navigation for inner pages
 */
function initStandardNavigation() {
  const menuToggle = document.querySelector('.standard-menu-toggle');
  const menu = document.querySelector('.standard-menu');
  const dropdowns = document.querySelectorAll('.standard-dropdown');
  
  if (menuToggle && menu) {
    // Mobile menu toggle
    menuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      this.classList.toggle('active');
      menu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
      
      // ARIA attributes for accessibility
      const expanded = this.classList.contains('active');
      this.setAttribute('aria-expanded', expanded);
      
      // Announce to screen readers
      if (expanded) {
        announceToScreenReader('Main menu expanded');
      } else {
        announceToScreenReader('Main menu collapsed');
      }
    });
    
    // Handle dropdown menus on mobile and touch devices
    dropdowns.forEach(dropdown => {
      const link = dropdown.querySelector('a');
      
      if (link) {
        link.addEventListener('click', function(e) {
          if (window.innerWidth <= 992 || isTouchDevice()) {
            e.preventDefault();
            
            // Close any open dropdowns
            dropdowns.forEach(d => {
              if (d !== dropdown && d.classList.contains('active')) {
                d.classList.remove('active');
              }
            });
            
            dropdown.classList.toggle('active');
            
            // ARIA attributes for accessibility
            const expanded = dropdown.classList.contains('active');
            link.setAttribute('aria-expanded', expanded);
          }
        });
      }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 992) return; // Skip on mobile - handled separately
      
      if (!e.target.closest('.standard-dropdown')) {
        dropdowns.forEach(dropdown => {
          dropdown.classList.remove('active');
          const link = dropdown.querySelector('a');
          if (link) link.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }
  
  // Highlight current page in navigation
  highlightCurrentPage();
}

/**
 * Handle window scroll events for both navigation types
 */
function handleScroll() {
  const homepageNav = document.querySelector('.homepage-navigation');
  const standardNav = document.querySelector('.standard-navigation');
  
  window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    
    // Throttle scroll events for better performance
    if (!window.scrollThrottle) {
      window.scrollThrottle = true;
      
      // For homepage navigation
      if (homepageNav) {
        if (scrollY > 50) {
          homepageNav.classList.add('scrolled');
        } else {
          homepageNav.classList.remove('scrolled');
        }
      }
      
      // For standard navigation
      if (standardNav) {
        if (scrollY > 30) {
          standardNav.classList.add('compact');
        } else {
          standardNav.classList.remove('compact');
        }
      }
      
      setTimeout(function() {
        window.scrollThrottle = false;
      }, 100);
    }
  }, { passive: true });
}

/**
 * Highlight the current page in the navigation
 */
function highlightCurrentPage() {
  const currentPath = window.location.pathname;
  let currentPage = currentPath.split('/').pop();
  
  // Default to index.html if on root path
  if (currentPage === '' || currentPage === '/') {
    currentPage = 'index.html';
  }
  
  // Find and mark the active menu item
  const menuLinks = document.querySelectorAll('.standard-menu-item > a');
  menuLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // Check if this link matches the current page
    if (href === currentPage || 
        (currentPage === 'index.html' && href === './') || 
        href === './' + currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
      
      // Check if in dropdown
      const parentDropdown = link.closest('.standard-dropdown');
      if (parentDropdown) {
        const parentLink = parentDropdown.querySelector(':scope > a');
        if (parentLink) {
          parentLink.classList.add('active');
        }
      }
    }
  });
  
  // Also check dropdown menus
  const dropdownLinks = document.querySelectorAll('.standard-dropdown-menu a');
  dropdownLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    if (href === currentPage || href === './' + currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
      
      // Add active class to parent dropdown
      const parentDropdown = link.closest('.standard-dropdown');
      if (parentDropdown) {
        const parentLink = parentDropdown.querySelector(':scope > a');
        if (parentLink) {
          parentLink.classList.add('active');
        }
      }
    }
  });
}

/**
 * Handle window resize events
 */
function handleResizeEvents() {
  let resizeTimer;
  
  window.addEventListener('resize', function() {
    // Clear the timeout
    clearTimeout(resizeTimer);
    
    // Set a new timeout to avoid excessive processing during resize
    resizeTimer = setTimeout(function() {
      const isHomepage = document.body.classList.contains('is-homepage');
      
      // Reset mobile menu state on window resize
      document.body.classList.remove('menu-open');
      
      if (isHomepage) {
        const menuToggle = document.querySelector('.homepage-menu-toggle');
        const menu = document.querySelector('.homepage-menu');
        const dropdowns = document.querySelectorAll('.homepage-dropdown');
        
        if (menuToggle) menuToggle.classList.remove('active');
        if (menu) menu.classList.remove('active');
        dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
      } else {
        const menuToggle = document.querySelector('.standard-menu-toggle');
        const menu = document.querySelector('.standard-menu');
        const dropdowns = document.querySelectorAll('.standard-dropdown');
        
        if (menuToggle) menuToggle.classList.remove('active');
        if (menu) menu.classList.remove('active');
        dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
      }
      
      // Reset ARIA states
      document.querySelectorAll('[aria-expanded]').forEach(el => {
        el.setAttribute('aria-expanded', 'false');
      });
    }, 250);
  });
}

/**
 * Close all mobile menus
 */
function closeAllMobileMenus() {
  const isHomepage = document.body.classList.contains('is-homepage');
  document.body.classList.remove('menu-open');
  
  if (isHomepage) {
    const menuToggle = document.querySelector('.homepage-menu-toggle');
    const menu = document.querySelector('.homepage-menu');
    const dropdowns = document.querySelectorAll('.homepage-dropdown');
    
    if (menuToggle) menuToggle.classList.remove('active');
    if (menu) menu.classList.remove('active');
    dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
  } else {
    const menuToggle = document.querySelector('.standard-menu-toggle');
    const menu = document.querySelector('.standard-menu');
    const dropdowns = document.querySelectorAll('.standard-dropdown');
    
    if (menuToggle) menuToggle.classList.remove('active');
    if (menu) menu.classList.remove('active');
    dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
  }
  
  // Reset ARIA states
  document.querySelectorAll('[aria-expanded]').forEach(el => {
    el.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Setup accessibility features for the navigation
 */
function setupAccessibility() {
  // Add ARIA attributes to toggle buttons
  const homepageToggle = document.querySelector('.homepage-menu-toggle');
  const standardToggle = document.querySelector('.standard-menu-toggle');
  
  if (homepageToggle) {
    homepageToggle.setAttribute('aria-label', 'Toggle Navigation Menu');
    homepageToggle.setAttribute('aria-expanded', 'false');
    homepageToggle.setAttribute('aria-controls', 'homepage-menu');
    
    const menu = document.querySelector('.homepage-menu');
    if (menu) menu.id = 'homepage-menu';
  }
  
  if (standardToggle) {
    standardToggle.setAttribute('aria-label', 'Toggle Navigation Menu');
    standardToggle.setAttribute('aria-expanded', 'false');
    standardToggle.setAttribute('aria-controls', 'standard-menu');
    
    const menu = document.querySelector('.standard-menu');
    if (menu) menu.id = 'standard-menu';
  }
  
  // Add ARIA attributes to dropdowns
  document.querySelectorAll('.homepage-dropdown > a, .standard-dropdown > a').forEach(link => {
    link.setAttribute('aria-expanded', 'false');
    link.setAttribute('aria-haspopup', 'true');
    
    const menu = link.nextElementSibling;
    const id = `dropdown-${Math.random().toString(36).substr(2, 9)}`;
    
    if (menu) {
      menu.id = id;
      link.setAttribute('aria-controls', id);
    }
  });
  
  // Add keyboard navigation support
  setupKeyboardNav();
}

/**
 * Setup keyboard navigation for menu items
 */
function setupKeyboardNav() {
  // Handle arrow key navigation in menu
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeAllMobileMenus();
    }
  });
  
  // Add focus trap in mobile menu
  const homepageMenu = document.querySelector('.homepage-menu');
  const standardMenu = document.querySelector('.standard-menu');
  
  if (homepageMenu) trapFocus(homepageMenu);
  if (standardMenu) trapFocus(standardMenu);
}

/**
 * Focus trap helper for accessibility
 */
function trapFocus(element) {
  element.addEventListener('keydown', function(e) {
    if (!element.classList.contains('active')) return;
    
    if (e.key === 'Tab') {
      const focusableElements = element.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}

/**
 * Helper function for screen reader announcements
 */
function announceToScreenReader(text) {
  let ariaLive = document.getElementById('aria-live-announcer');
  if (!ariaLive) {
    ariaLive = document.createElement('div');
    ariaLive.id = 'aria-live-announcer';
    ariaLive.setAttribute('aria-live', 'polite');
    ariaLive.style.position = 'absolute';
    ariaLive.style.width = '1px';
    ariaLive.style.height = '1px';
    ariaLive.style.padding = '0';
    ariaLive.style.overflow = 'hidden';
    ariaLive.style.clip = 'rect(0, 0, 0, 0)';
    ariaLive.style.whiteSpace = 'nowrap';
    ariaLive.style.border = '0';
    document.body.appendChild(ariaLive);
  }
  
  ariaLive.textContent = text;
}

/**
 * Detect touch device
 */
function isTouchDevice() {
  return ('ontouchstart' in window) ||
         (navigator.maxTouchPoints > 0) ||
         (navigator.msMaxTouchPoints > 0);
}