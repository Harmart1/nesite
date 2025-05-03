// JavaScript compiled from TypeScript
document.addEventListener('DOMContentLoaded', function () {
    // Initialize mobile menu toggle
    var menuToggle = document.querySelector('.menu-toggle');
    var mainNav = document.querySelector('.main-nav');
    var menuItems = document.querySelectorAll('.nav-menu a');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function () {
            var expanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', (!expanded).toString());
            mainNav.classList.toggle('active');
        });
    }
    // Close menu when a menu item is clicked (mobile)
    menuItems.forEach(function (item) {
        item.addEventListener('click', function () {
            if (window.innerWidth < 768 && menuToggle && mainNav) {
                menuToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('active');
            }
        });
    });
    // Add scroll reveal animation for elements
    var revealElements = document.querySelectorAll('.service-card, .portfolio-item, .contact-form, .contact-info');
    // Simple intersection observer to add animation when elements come into view
    if ('IntersectionObserver' in window) {
        var observer_1 = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer_1.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        revealElements.forEach(function (el) {
            observer_1.observe(el);
        });
    }
    else {
        // Fallback for browsers that don't support IntersectionObserver
        revealElements.forEach(function (el) {
            el.classList.add('revealed');
        });
    }
    // Form validation
    var contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            // Simple validation example
            var nameInput = document.getElementById('name');
            var emailInput = document.getElementById('email');
            var messageInput = document.getElementById('message');
            var isValid = true;
            if (nameInput && !nameInput.value.trim()) {
                showError(nameInput, 'Please enter your name');
                isValid = false;
            }
            else if (nameInput) {
                clearError(nameInput);
            }
            if (emailInput) {
                var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailInput.value)) {
                    showError(emailInput, 'Please enter a valid email address');
                    isValid = false;
                }
                else {
                    clearError(emailInput);
                }
            }
            if (messageInput && !messageInput.value.trim()) {
                showError(messageInput, 'Please enter your message');
                isValid = false;
            }
            else if (messageInput) {
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
    function showError(input, message) {
        var formGroup = input.closest('.form-group');
        if (formGroup) {
            // Remove any existing error message
            var existingError = formGroup.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            // Create and add error message
            var errorElement = document.createElement('div');
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
            input.setAttribute('aria-describedby', "error-for-".concat(input.id));
            errorElement.id = "error-for-".concat(input.id);
        }
    }
    function clearError(input) {
        var formGroup = input.closest('.form-group');
        if (formGroup) {
            var errorElement = formGroup.querySelector('.error-message');
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
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            var href = this.getAttribute('href');
            if (href) {
                var targetElement = document.querySelector(href);
                if (targetElement) {
                    // Check if browser supports ScrollToOptions
                    if ('scrollBehavior' in document.documentElement.style) {
                        // Modern smooth scroll
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                    else {
                        // Fallback for older browsers
                        window.scrollTo(0, targetElement.offsetTop - 80);
                    }
                }
            }
        });
    });
});
