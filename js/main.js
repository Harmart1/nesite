/**
 * Law Firm Website JavaScript
 * Modern, accessible, and performance-optimized
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize mobile navigation
  setupMobileNav();
  
  // Initialize form validation
  setupFormValidation();
  
  // Initialize smooth scrolling
  setupSmoothScrolling();
  
  // Initialize animation on scroll
  setupScrollAnimations();
});

/**
 * Mobile Navigation Setup
 */
function setupMobileNav() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!navToggle || !navMenu) return;
  
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
    
    // Prevent body scrolling when menu is open
    document.body.classList.toggle('nav-open', !isExpanded);
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (
      navMenu.classList.contains('active') && 
      !navMenu.contains(e.target) && 
      !navToggle.contains(e.target)
    ) {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('active');
      document.body.classList.remove('nav-open');
    }
  });
  
  // Close menu when menu item is clicked
  const menuLinks = navMenu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
      }
    });
  });
  
  // Handle resize events (to fix mobile/desktop transition issues)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('active');
      document.body.classList.remove('nav-open');
    }
  });
}

/**
 * Form Validation
 */
function setupFormValidation() {
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    
    // Name validation
    const nameInput = document.getElementById('name');
    if (nameInput && !nameInput.value.trim()) {
      showError(nameInput, 'Please enter your name');
      isValid = false;
    } else if (nameInput) {
      clearError(nameInput);
    }
    
    // Email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
      } else {
        clearError(emailInput);
      }
    }
    
    // Message validation
    const messageInput = document.getElementById('message');
    if (messageInput && !messageInput.value.trim()) {
      showError(messageInput, 'Please enter your message');
      isValid = false;
    } else if (messageInput) {
      clearError(messageInput);
    }
    
    if (isValid) {
      // Form submission logic would go here
      // For now, we'll just show a success message
      const formContainer = contactForm.closest('.contact-form-container');
      if (formContainer) {
        formContainer.innerHTML = `
          <div class="form-success">
            <h3>Thank You!</h3>
            <p>Your message has been sent successfully. One of our attorneys will contact you shortly.</p>
          </div>
        `;
      }
    }
  });
  
  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    // Remove any existing error message
    clearError(input);
    
    // Create error element
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.textContent = message;
    formGroup.appendChild(errorElement);
    
    // Add error class to input
    input.classList.add('input-error');
    
    // Set aria attributes for accessibility
    input.setAttribute('aria-invalid', 'true');
    
    const errorId = `error-for-${input.id}`;
    errorElement.id = errorId;
    input.setAttribute('aria-describedby', errorId);
    
    // Focus the first input with an error
    input.focus();
  }
  
  function clearError(input) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    const errorElement = formGroup.querySelector('.form-error');
    if (errorElement) {
      errorElement.remove();
    }
    
    input.classList.remove('input-error');
    input.removeAttribute('aria-invalid');
    
    const describedBy = input.getAttribute('aria-describedby');
    if (describedBy && describedBy.startsWith('error-for-')) {
      input.removeAttribute('aria-describedby');
    }
  }
}

/**
 * Smooth Scrolling
 */
function setupSmoothScrolling() {
  const scrollLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  scrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (!targetElement) return;
      
      const headerOffset = 80; // Adjust based on your header height
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = targetPosition - headerOffset;
      
      // Check if browser supports smooth scrolling
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        // Fallback for browsers that don't support smooth scrolling
        window.scrollTo(0, offsetPosition);
      }
      
      // Update URL hash (without scrolling)
      window.history.pushState(null, null, targetId);
    });
  });
}

/**
 * Animation on Scroll
 * Using Intersection Observer for performance
 */
function setupScrollAnimations() {
  // Elements to animate
  const animatedElements = document.querySelectorAll(
    '.practice-card, .attorney-card, .testimonial-card, .contact-form-container, .contact-info'
  );
  
  if (!animatedElements.length) return;
  
  // Add initial state class
  animatedElements.forEach(el => {
    el.classList.add('animate-on-scroll');
  });
  
  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
      observer.observe(el);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    animatedElements.forEach(el => {
      el.classList.add('animate-in');
    });
  }
}

/**
 * Handle CSS transitions for elements
 * Add this to your CSS:
 * 
.animate-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.animate-in {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .animate-on-scroll {
    opacity: 1;
    transform: translateY(0);
    transition: none;
  }
}
*/
