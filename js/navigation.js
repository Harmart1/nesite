/**
 * Consolidated Navigation Script
 * Handles responsive behavior, smooth scrolling, active section highlighting, and interactive elements for the navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    // Common variables
    const html = document.documentElement;
    const body = document.body;
    let isHomePage = body.classList.contains('is-homepage');
    
    // Initialize appropriate navigation based on page type
    initializeNavigation();
    
    // Add mobile overlay if it doesn't exist
    if (!document.querySelector('.mobile-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'mobile-overlay';
        body.appendChild(overlay);
        
        // Close menu when clicking on overlay
        overlay.addEventListener('click', () => {
            closeAllMenus();
        });
    }
    
    /**
     * Initialize navigation
     */
    function initializeNavigation() {
        const nav = document.querySelector('.site-header');
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const menu = document.querySelector('.nav-menu');
        const dropdowns = document.querySelectorAll('.dropdown');
        
        if (!nav || !menuToggle || !menu) return;
        
        // Use IntersectionObserver for scroll effects instead of scroll events
        const navObserver = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    nav.classList.remove('scrolled');
                } else {
                    nav.classList.add('scrolled');
                }
            },
            { threshold: 0, rootMargin: "-100px 0px 0px 0px" }
        );
        
        // Create sentinel element at the top of the page
        const sentinel = document.createElement('div');
        sentinel.style.height = '1px';
        sentinel.style.position = 'absolute';
        sentinel.style.top = '0';
        sentinel.style.left = '0';
        sentinel.style.width = '100%';
        sentinel.style.pointerEvents = 'none';
        document.body.prepend(sentinel);
        
        navObserver.observe(sentinel);
        
        // Toggle mobile menu
        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMenu(menuToggle, menu);
        });
        
        // Handle dropdown clicks on mobile
        dropdowns.forEach(dropdown => {
            const dropdownLink = dropdown.querySelector('a');
            
            if (dropdownLink) {
                // Use touchstart for better mobile experience with fallback
                const eventToUse = 'ontouchstart' in window ? 'touchstart' : 'click';
                
                dropdownLink.addEventListener(eventToUse, function(e) {
                    if (window.innerWidth <= 992) {
                        e.preventDefault();
                        toggleDropdown(dropdown);
                        
                        // Close other open dropdowns
                        dropdowns.forEach(otherDropdown => {
                            if (otherDropdown !== dropdown && otherDropdown.classList.contains('active')) {
                                toggleDropdown(otherDropdown);
                            }
                        });
                    }
                });
                
                // Add aria attributes for accessibility
                const submenu = dropdown.querySelector('.dropdown-menu');
                if (submenu) {
                    const id = `dropdown-${Math.floor(Math.random() * 1000)}`;
                    submenu.id = id;
                    dropdownLink.setAttribute('aria-expanded', 'false');
                    dropdownLink.setAttribute('aria-controls', id);
                    dropdownLink.setAttribute('aria-haspopup', 'true');
                }
            }
        });
        
        // Close menu on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeAllMenus();
            }
        });
        
        // Handle window resize events
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth > 992) {
                closeAllMenus();
            }
        }, 250));
        
        // Add swipe detection for mobile
        addSwipeSupport(menu, 'right', closeAllMenus);
    }
    
    /**
     * Toggle mobile menu
     */
    function toggleMenu(toggle, menu) {
        const isActive = toggle.classList.contains('active');
        
        // Toggle classes
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        
        // Update aria attributes
        toggle.setAttribute('aria-expanded', !isActive);
        
        // Toggle body class to prevent scrolling
        if (!isActive) {
            body.classList.add('menu-open');
        } else {
            body.classList.remove('menu-open');
        }
        
        // Announce to screen readers
        announceToScreenReader(!isActive ? 'Menu opened' : 'Menu closed');
    }
    
    /**
     * Toggle dropdown on mobile
     */
    function toggleDropdown(dropdown) {
        const isActive = dropdown.classList.contains('active');
        const dropdownLink = dropdown.querySelector('a');
        
        dropdown.classList.toggle('active');
        
        if (dropdownLink) {
            dropdownLink.setAttribute('aria-expanded', !isActive);
        }
    }
    
    /**
     * Close all menus and dropdowns
     */
    function closeAllMenus() {
        // Close navigation if present
        const menuToggle = document.querySelector('.mobile-menu-toggle.active');
        const menu = document.querySelector('.nav-menu.active');
        const dropdowns = document.querySelectorAll('.dropdown.active');
        
        if (menuToggle && menu) {
            toggleMenu(menuToggle, menu);
        }
        
        dropdowns.forEach(dropdown => {
            toggleDropdown(dropdown);
        });
        
        // Remove body class
        body.classList.remove('menu-open');
    }
    
    /**
     * Add swipe detection for mobile menus
     */
    function addSwipeSupport(element, direction, callback) {
        let touchStartX = 0;
        let touchEndX = 0;
        const swipeThreshold = 100; // Minimum distance for a swipe
        
        element.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        element.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeDistance = touchEndX - touchStartX;
            
            // Check if it's a right swipe
            if (direction === 'right' && swipeDistance > swipeThreshold) {
                callback();
            }
            // Check if it's a left swipe
            else if (direction === 'left' && swipeDistance < -swipeThreshold) {
                callback();
            }
        }
    }
    
    /**
     * Debounce function for scroll and resize events
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
     * Announce changes to screen readers (accessibility)
     */
    function announceToScreenReader(message) {
        let announce = document.getElementById('aria-announcer');
        
        if (!announce) {
            announce = document.createElement('div');
            announce.id = 'aria-announcer';
            announce.setAttribute('aria-live', 'polite');
            announce.className = 'sr-only';
            document.body.appendChild(announce);
        }
        
        announce.textContent = message;
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    smoothScrollTo(targetElement);
                }
            }
        });
    });
    
    // Helper function to smoothly scroll to an element
    function smoothScrollTo(element) {
        if (!element) return;
        
        // Add will-change before animating
        element.style.willChange = 'scroll-position';
        
        // Get header height for offset
        const header = document.querySelector('.site-header');
        const headerOffset = header ? header.offsetHeight : 0;
        
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
            top: targetPosition - headerOffset - 20,
            behavior: 'smooth'
        });
        
        // Reset will-change after animation completes
        setTimeout(() => {
            element.style.willChange = 'auto';
        }, 500);
    }
    
    // Active section highlighting in navigation
    const sections = document.querySelectorAll('.page-section');
    const jumpLinks = document.querySelectorAll('.jump-nav-links a');
    
    if (jumpLinks.length > 0 && sections.length > 0) {
        // Create section observer to detect which section is in view
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // We need to account for sections that are partially visible
                if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
                    const currentSection = entry.target.id;
                    
                    // Update jump links
                    jumpLinks.forEach(link => {
                        if (link.getAttribute('href') === `#${currentSection}`) {
                            // First clear all active classes
                            jumpLinks.forEach(l => l.classList.remove('active'));
                            
                            // Add active class to current link
                            link.classList.add('active');
                            
                            // If this is a horizontal scrolling navigation, ensure active link is visible
                            const jumpNav = link.closest('.jump-nav-links');
                            if (jumpNav && window.innerWidth < 992) { // Only for mobile/tablet
                                link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                            }
                        }
                    });
                }
            });
        }, { 
            threshold: [0.1, 0.2, 0.5, 0.8],
            rootMargin: '-100px 0px -100px 0px' // Adjust the trigger area for better UX
        });
        
        // Observe each section
        sections.forEach(section => {
            sectionObserver.observe(section);
        });
        
        // Throttled scroll handler as backup
        const updateActiveLink = debounce(() => {
            const currentSection = getCurrentSection();
            
            if (currentSection) {
                jumpLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + currentSection) {
                        link.classList.add('active');
                        
                        // If horizontal scrolling navigation, ensure active link is visible
                        const jumpNav = link.closest('.jump-nav-links');
                        if (jumpNav && window.innerWidth < 992) {
                            link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                        }
                    }
                });
            }
        }, 50);
        
        window.addEventListener('scroll', updateActiveLink, { passive: true });
        
        // Initial call to set active link on page load
        updateActiveLink();
        
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
    
    // Helper function to get the current visible section
    function getCurrentSection() {
        const scrollPosition = window.scrollY + 100; // Add offset for header
        
        // Find the section that's currently in view
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            
            // If we've scrolled at least to the section
            if (scrollPosition >= section.offsetTop) {
                return section.id;
            }
        }
        
        // Default to first section if nothing else matches
        return sections[0]?.id;
    }
});
