/**
 * NorthernEdge Legal Solutions - Main JavaScript
 *
 * This file contains the main JavaScript functionality for the website,
 * handling navigation, animations, and interactive elements.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive components
  initializeMobileMenu();
  initializeDropdownMenus();
  initializeSmoothScroll();
  initializeScrollAnimations();
  initializeContactForm();
  // Back-to-top button is now handled by back-to-top.js
  initializeResourceFilters();
  initializeBlogFilters();
  initializeAccordions();
  
  // Add window resize handler for responsive elements
  window.addEventListener('resize', handleWindowResize);
});

/**
 * Handle window resize events for responsive elements
 */
function handleWindowResize() {
  // Reinitialize dropdown menus when window size changes
  initializeDropdownMenus();
}

/**
 * Mobile Menu Toggle
 * Handles the mobile hamburger menu toggle functionality
 */
function initializeMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!mobileMenuToggle || !navMenu) return;
  
  mobileMenuToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = mobileMenuToggle.querySelectorAll('span');
    spans.forEach(span => span.classList.toggle('active'));
    
    // Accessibility
    const isExpanded = navMenu.classList.contains('active');
    mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
  });
}

/**
 * Dropdown Menus
 * Handles touch interactions for dropdown menus on mobile
 */
function initializeDropdownMenus() {
  const dropdowns = document.querySelectorAll('.dropdown');
  
  if (dropdowns.length === 0) return;
  
  // Remove previous event listeners (to prevent duplicates on resize)
  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('a');
    if (link) {
      const newLink = link.cloneNode(true);
      if (link.parentNode) {
        link.parentNode.replaceChild(newLink, link);
      }
    }
  });
  
  // For mobile: toggle dropdown on click
  if (window.innerWidth < 1024) {
    dropdowns.forEach(dropdown => {
      const link = dropdown.querySelector('a');
      
      if (link) {
        link.addEventListener('click', function(e) {
          if (window.innerWidth < 1024) {
            e.preventDefault();
            dropdown.classList.toggle('active');
            
            // Close other dropdowns
            dropdowns.forEach(otherDropdown => {
              if (otherDropdown !== dropdown) {
                otherDropdown.classList.remove('active');
              }
            });
          }
        });
      }
    });
  }
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  });
}

/**
 * Resource Filters
 * For the resources page category filtering
 */
function initializeResourceFilters() {
  const categoryTabs = document.querySelectorAll('.category-tab');
  const resourceCards = document.querySelectorAll('.resource-card');
  
  if (categoryTabs.length === 0 || resourceCards.length === 0) return;
  
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs
      categoryTabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      const selectedCategory = this.getAttribute('data-category');
      
      // Show all cards if "All" is selected
      if (selectedCategory === 'all') {
        resourceCards.forEach(card => {
          card.style.display = 'flex';
        });
        return;
      }
      
      // Otherwise filter the cards
      resourceCards.forEach(card => {
        const cardCategories = card.getAttribute('data-categories');
        
        if (cardCategories && cardCategories.includes(selectedCategory)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Blog Filters
 * For the blog listings page category filtering
 */
function initializeBlogFilters() {
  const categoryTags = document.querySelectorAll('.blog-categories .category-tag');
  const blogCards = document.querySelectorAll('.blog-card');
  
  if (categoryTags.length === 0 || blogCards.length === 0) return;
  
  categoryTags.forEach(tag => {
    tag.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all tags
      categoryTags.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tag
      this.classList.add('active');
            const selectedCategory = this.getAttribute('data-category');
      
      // If "All" is selected, show all cards
      if (!selectedCategory || this.classList.contains('all')) {
        blogCards.forEach(card => {
          card.style.display = 'block';
        });
        return;
      }
      
      // Otherwise, filter cards
      blogCards.forEach(card => {
        const cardCategories = card.getAttribute('data-categories');
        if (cardCategories && cardCategories.includes(selectedCategory)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Initialize Accordions
 * For FAQ sections and other accordion-based content
 */
function initializeAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  if (accordionHeaders.length === 0) return;
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      this.classList.toggle('active');
      
      const content = this.nextElementSibling;
      if (!content) return;
      
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}

/**
 * Smooth Scroll
 * Adds smooth scrolling for anchors linking to page sections
 */
function initializeSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        // Get header height for offset (safely)
        const header = document.querySelector('.site-header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Scroll Animations
 * Adds fade-in animations for elements as they enter the viewport
 */
function initializeScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-in');
  
  if (animatedElements.length === 0) return;
  
  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    // Create observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Stop observing after animation
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe each element
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    animatedElements.forEach(element => {
      element.classList.add('active');
    });
  }
}

/**
 * Contact Form
 * Handles form validation and submission
 */
function initializeContactForm() {
  const contactForm = document.querySelector('.contact-form');
  
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simple validation
    let isValid = true;
    const requiredFields = contactForm.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
        
        // Add error message if it doesn't exist
        let errorMsg = field.nextElementSibling;
        if (!errorMsg || !errorMsg.classList.contains('error-message')) {
          errorMsg = document.createElement('p');
          errorMsg.classList.add('error-message');
          errorMsg.textContent = 'This field is required';
          field.parentNode.insertBefore(errorMsg, field.nextSibling);
        }
      } else {
        field.classList.remove('error');
        
        // Remove error message if it exists
        const errorMsg = field.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
          errorMsg.remove();
        }
      }
    });
    
    // Email validation for email field
    const emailField = contactForm.querySelector('input[type="email"]');
    if (emailField && emailField.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value.trim())) {
        isValid = false;
        emailField.classList.add('error');
        
        // Add error message if it doesn't exist
        let errorMsg = emailField.nextElementSibling;
        if (!errorMsg || !errorMsg.classList.contains('error-message')) {
          errorMsg = document.createElement('p');
          errorMsg.classList.add('error-message');
          errorMsg.textContent = 'Please enter a valid email address';
          emailField.parentNode.insertBefore(errorMsg, emailField.nextSibling);
        } else {
          errorMsg.textContent = 'Please enter a valid email address';
        }
      }
    }
    
    // If form is valid, show success message
    if (isValid) {
      // Here you would typically send the form data to your server
      // For now, we'll just show a success message
      const formData = new FormData(contactForm);
      
      // Replace form with success message
      const successMessage = document.createElement('div');
      successMessage.classList.add('form-success');
      successMessage.innerHTML = `
        <h3>Thank You for Contacting Us</h3>
        <p>Your message has been received. We'll get back to you shortly.</p>
      `;
      
      contactForm.parentNode.replaceChild(successMessage, contactForm);
    }
  });
  
  // Clear validation errors when field is interacted with
  contactForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', function() {
      this.classList.remove('error');
      
      const errorMsg = this.nextElementSibling;
      if (errorMsg && errorMsg.classList.contains('error-message')) {
        errorMsg.remove();
      }
    });
  });
}
