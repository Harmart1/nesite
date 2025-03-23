document.addEventListener('DOMContentLoaded', function() {
  initializeMobileMenu();
  initializeDropdownMenus();
  initializeSmoothScroll();
  initializeScrollAnimations();
  initializeContactForm();
});

function initializeMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!mobileMenuToggle || !navMenu) return;

  mobileMenuToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');

    const spans = mobileMenuToggle.querySelectorAll('span');
    spans.forEach(span => span.classList.toggle('active'));

    const isExpanded = navMenu.classList.contains('active');
    mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
  });
}

function initializeDropdownMenus() {
  const dropdowns = document.querySelectorAll('.dropdown');

  if (dropdowns.length === 0) return;

  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('a');
    if (link) {
      const newLink = link.cloneNode(true);
      if (link.parentNode) {
        link.parentNode.replaceChild(newLink, link);
      }
    }
  });
}

function initializeSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();

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

function initializeScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-in');

  if (animatedElements.length === 0) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    animatedElements.forEach(element => {
      element.classList.add('active');
    });
  }
}

function initializeContactForm() {
  const contactForm = document.querySelector('.contact-form');

  if (!contactForm) return;

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    let isValid = true;
    const requiredFields = contactForm.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');

        let errorMsg = field.nextElementSibling;
        if (!errorMsg || !errorMsg.classList.contains('error-message')) {
          errorMsg = document.createElement('p');
          errorMsg.classList.add('error-message');
          errorMsg.textContent = 'This field is required';
          field.parentNode.insertBefore(errorMsg, field.nextSibling);
        }
      } else {
        field.classList.remove('error');

        const errorMsg = field.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
          errorMsg.remove();
        }
      }
    });

    const emailField = contactForm.querySelector('input[type="email"]');
    if (emailField && emailField.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value.trim())) {
        isValid = false;
        emailField.classList.add('error');

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

    if (isValid) {
      const formData = new FormData(contactForm);

      const successMessage = document.createElement('div');
      successMessage.classList.add('form-success');
      successMessage.innerHTML = `
        <h3>Thank You for Contacting Us</h3>
        <p>Your message has been received. We'll get back to you shortly.</p>
      `;

      contactForm.parentNode.replaceChild(successMessage, contactForm);
    }
  });

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
