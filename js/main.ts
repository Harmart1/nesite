// TypeScript for enhanced type safety
interface HTMLElementWithExpanded extends HTMLElement {
  ariaExpanded: string;
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', (): void => {
  // Initialize mobile menu toggle
  const menuToggle: HTMLElement | null = document.querySelector('.menu-toggle');
  const mainNav: HTMLElement | null = document.querySelector('.main-nav');
  const menuItems: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.nav-menu a');
  
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', (): void => {
      const expanded: boolean = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', (!expanded).toString());
      mainNav.classList.toggle('active');
    });
  }
  
  // Close menu when a menu item is clicked (mobile)
  menuItems.forEach((item: HTMLAnchorElement): void => {
    item.addEventListener('click', (): void => {
      if (window.innerWidth < 768 && menuToggle && mainNav) {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('active');
      }
    });
  });
  
  // Add scroll reveal animation for elements
  const revealElements: NodeListOf<HTMLElement> = document.querySelectorAll('.service-card, .portfolio-item, .contact-form, .contact-info');
  
  // Simple intersection observer to add animation when elements come into view
  if ('IntersectionObserver' in window) {
    const observer: IntersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]): void => {
      entries.forEach((entry: IntersectionObserverEntry): void => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    
    revealElements.forEach((el: HTMLElement): void => {
      observer.observe(el);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    revealElements.forEach((el: HTMLElement): void => {
      el.classList.add('revealed');
    });
  }
  
  // Form validation
  const contactForm: HTMLFormElement | null = document.querySelector('.contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e: Event): void => {
      e.preventDefault();
      // Simple validation example
      const nameInput: HTMLInputElement | null = document.getElementById('name') as HTMLInputElement;
      const emailInput: HTMLInputElement | null = document.getElementById('email') as HTMLInputElement;
      const messageInput: HTMLTextAreaElement | null = document.getElementById('message') as HTMLTextAreaElement;
      
      let isValid: boolean = true;
      
      if (nameInput && !nameInput.value.trim()) {
        showError(nameInput, 'Please enter your name');
        isValid = false;
      } else if (nameInput) {
        clearError(nameInput);
      }
      
      if (emailInput) {
        const emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value)) {
          showError(emailInput, 'Please enter a valid email address');
          isValid = false;
        } else {
          clearError(emailInput);
        }
      }
      
      if (messageInput && !messageInput.value.trim()) {
        showError(messageInput, 'Please enter your message');
        isValid = false;
      } else if (messageInput) {
        clearError(messageInput);
      }
      
      if (isValid) {
        // Would normally submit the form or make API call here
        alert('Form submitted successfully!');
        contactForm.reset();
      }
    });
  }
  
  // Helper functions for form validation
  function showError(input: HTMLElement, message: string): void {
    const formGroup: HTMLElement | null = input.closest('.form-group');
    if (formGroup) {
      // Remove any existing error message
      const existingError = formGroup.querySelector('.error-message');
      if (existingError) {
        existingError.remove();
      }
      
      // Create and add error message
      const errorElement: HTMLDivElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.textContent = message;
      errorElement.style.color = '#dc3545';
      errorElement.style.fontSize = '0.875rem';
      errorElement.style.marginTop = '0.25rem';
      formGroup.appendChild(errorElement);
      
      // Add error styling to input
      input.style.borderColor = '#dc3545';
      
      // Add aria attributes for accessibility
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', `error-for-${input.id}`);
      errorElement.id = `error-for-${input.id}`;
    }
  }
  
  function clearError(input: HTMLElement): void {
    const formGroup: HTMLElement | null = input.closest('.form-group');
    if (formGroup) {
      const errorElement = formGroup.querySelector('.error-message');
      if (errorElement) {
        errorElement.remove();
      }
      
      // Reset input styling
      input.style.borderColor = '';
      
      // Remove aria attributes
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    }
  }
  
  // Add animation to scroll links for smooth scrolling experience
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((anchor: Element): void => {
    anchor.addEventListener('click', function(e: Event): void {
      e.preventDefault();
      const href: string | null = this.getAttribute('href');
      
      if (href) {
        const targetElement: HTMLElement | null = document.querySelector(href);
        if (targetElement) {
          // Check if browser supports ScrollToOptions
          if ('scrollBehavior' in document.documentElement.style) {
            // Modern smooth scroll
            window.scrollTo({
              top: targetElement.offsetTop - 80, // Offset for fixed header
              behavior: 'smooth'
            });
          } else {
            // Fallback for older browsers
            window.scrollTo(0, targetElement.offsetTop - 80);
          }
        }
      }
    });
  });
});

// Compiled JavaScript will be generated in main.js
