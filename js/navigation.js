/**
 * Consolidated Navigation Script
 * Handles responsive behavior, smooth scrolling, active section highlighting, and interactive elements for the navigation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive components
    initializeMobileMenu();
    initializeSmoothScroll();
    initializeScrollAnimations();
    initializeBackToTopButton();
    initializeStickyHeader();
    initializeAccessibleDropdowns();
    initializeEntranceAnimations();
    initializeJumpNavigation();
    initializePaginationDots();
    initializeSwipeSupport();
    initializeDropdownMenus(); // P3d19
});

/**
 * Mobile Menu Toggle
 * Handles the mobile hamburger menu toggle functionality
 */
function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    if (!mobileMenuToggle || !navMenu) return;
    
    mobileMenuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        // Animate hamburger icon
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans.forEach(span => span.classList.toggle('active'));
        
        // Accessibility
        const isExpanded = navMenu.classList.contains('active');
        mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
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
 * Back to Top Button
 * Handles the back to top button functionality
 */
function initializeBackToTopButton() {
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

/**
 * Sticky Header
 * Adds sticky behavior to the header
 */
function initializeStickyHeader() {
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

/**
 * Accessible Dropdowns
 * Adds accessibility features to dropdown menus
 */
function initializeAccessibleDropdowns() {
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

/**
 * Entrance Animations
 * Adds subtle entrance animations to elements
 */
function initializeEntranceAnimations() {
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

/**
 * Jump Navigation
 * Handles the jump navigation functionality
 */
function initializeJumpNavigation() {
    const jumpLinks = document.querySelectorAll('.jump-nav-links a');
    const sections = document.querySelectorAll('.page-section');
    
    if (jumpLinks.length === 0 || sections.length === 0) return;
    
    // Create section observer to detect which section is in view
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
                const currentSection = entry.target.id;
                
                // Update jump links
                jumpLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${currentSection}`) {
                        jumpLinks.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                        
                        const jumpNav = link.closest('.jump-nav-links');
                        if (jumpNav && window.innerWidth < 992) {
                            link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                        }
                    }
                });
            }
        });
    }, { 
        threshold: [0.1, 0.2, 0.5, 0.8],
        rootMargin: '-100px 0px -100px 0px'
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Handle click events for jump links
    jumpLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                smoothScrollTo(targetElement);
            }
        });
    });
}

/**
 * Pagination Dots
 * Handles the pagination dots functionality
 */
function initializePaginationDots() {
    const paginationDots = document.querySelectorAll('.page-navigation-dots .dot');
    
    if (paginationDots.length === 0) return;
    
    paginationDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            if (targetId) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    smoothScrollTo(targetElement);
                }
            }
        });
    });
}

/**
 * Swipe Support
 * Adds swipe detection for mobile menus
 */
function initializeSwipeSupport() {
    const menu = document.querySelector('.nav-menu');
    if (!menu) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 100;
    
    menu.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    menu.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;
        
        if (swipeDistance > swipeThreshold) {
            closeAllMenus();
        }
    }
}

/**
 * Helper function to smoothly scroll to an element
 */
function smoothScrollTo(element) {
    if (!element) return;
    
    element.style.willChange = 'scroll-position';
    
    const header = document.querySelector('.site-header');
    const headerOffset = header ? header.offsetHeight : 0;
    
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
        top: targetPosition - headerOffset - 20,
        behavior: 'smooth'
    });
    
    setTimeout(() => {
        element.style.willChange = 'auto';
    }, 500);
}

/**
 * Helper function to close all menus
 */
function closeAllMenus() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const body = document.body;
    
    if (navMenu && mobileMenuToggle) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        body.classList.remove('menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
}

/**
 * Debounce function to limit frequency of events
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
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

    // Add keyboard navigation support for dropdown menus
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        if (link) {
            link.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
}
