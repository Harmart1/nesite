/**
 * Visual Enhancement Integration Script
 * Adds interactive behavior for enhanced navigation and UI elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    initMobileNavigation();
    
    // Back to top button
    initBackToTopButton();
    
    // Sticky header behavior
    initStickyHeader();
    
    // Dropdown menu accessibility for keyboard navigation
    initAccessibleDropdowns();
    
    // Apply subtle entrance animations to elements
    initEntranceAnimations();
});

function initMobileNavigation() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        // Toggle aria-expanded
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !expanded);
    });
    
    // Handle dropdowns in mobile view
    const dropdownLinks = document.querySelectorAll('.nav-menu .dropdown > a');
    
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                this.classList.toggle('active-dropdown');
                const dropdownMenu = this.nextElementSibling;
                dropdownMenu.classList.toggle('active');
                
                // Toggle aria-expanded
                const expanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !expanded);
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            !e.target.closest('.nav-menu') && 
            !e.target.closest('.mobile-menu-toggle')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            body.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Enhance touch targets for mobile menu items
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.style.padding = 'var(--space-3) var(--space-4)';
    });
    
    // Implement keyboard navigation support
    navMenu.addEventListener('keydown', function(e) {
        const activeElement = document.activeElement;
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (activeElement === navMenu.firstElementChild) {
                    e.preventDefault();
                    menuToggle.focus();
                }
            } else {
                if (activeElement === menuToggle) {
                    e.preventDefault();
                    navMenu.firstElementChild.focus();
                }
            }
        } else if (e.key === 'Enter') {
            if (activeElement.classList.contains('dropdown-link')) {
                activeElement.click();
            }
        }
    });
}

function initBackToTopButton() {
    const backToTopButton = document.querySelector('.back-to-top');
    if (!backToTopButton) return;
    
    // Show button when scrolled down
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    
    // Add shadow and compress header on scroll
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            header.classList.add('compact');
        } else {
            header.classList.remove('compact');
        }
        
        // Hide header when scrolling down, show when scrolling up
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
        
        lastScrollY = currentScrollY;
    });
}

function initAccessibleDropdowns() {
    const dropdownMenus = document.querySelectorAll('.dropdown');
    
    dropdownMenus.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        
        // Add appropriate ARIA attributes
        link.setAttribute('aria-haspopup', 'true');
        link.setAttribute('aria-expanded', 'false');
        
        // Toggle dropdown with keyboard
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const expanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !expanded);
                
                const dropdownMenu = this.nextElementSibling;
                dropdownMenu.style.display = expanded ? 'none' : 'block';
            }
        });
        
        // Update aria-expanded when mouse interactions occur
        dropdown.addEventListener('mouseenter', function() {
            link.setAttribute('aria-expanded', 'true');
        });
        
        dropdown.addEventListener('mouseleave', function() {
            link.setAttribute('aria-expanded', 'false');
        });
    });
}

function initEntranceAnimations() {
    // Only apply animations if user doesn't prefer reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    // Add subtle entrance animations to elements
    const animateElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .slide-up');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        animateElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        animateElements.forEach(element => {
            element.classList.add('animated');
        });
    }
}
