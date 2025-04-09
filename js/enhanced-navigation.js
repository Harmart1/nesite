/**
 * Enhanced Navigation Script
 * Adds responsive behavior to both homepage and inner page navigation systems
 * Optimized for mobile with improved touch interactions and accessibility
 * Uses debounced scroll events for better performance
 */

document.addEventListener('DOMContentLoaded', () => {
    // Common variables
    const html = document.documentElement;
    const body = document.body;
    let isHomePage = body.classList.contains('is-homepage');
    
    // Initialize appropriate navigation based on page type
    if (isHomePage) {
        initializeHomepageNavigation();
    } else {
        initializeStandardNavigation();
    }
    
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
     * Initialize homepage-specific navigation
     */
    function initializeHomepageNavigation() {
        const nav = document.querySelector('.homepage-navigation');
        const menuToggle = document.querySelector('.homepage-menu-toggle');
        const menu = document.querySelector('.homepage-menu');
        const dropdowns = document.querySelectorAll('.homepage-dropdown');
        
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
                const submenu = dropdown.querySelector('.homepage-dropdown-menu');
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
     * Initialize standard navigation for inner pages
     */
    function initializeStandardNavigation() {
        const nav = document.querySelector('.standard-navigation');
        const menuToggle = document.querySelector('.standard-menu-toggle');
        const menu = document.querySelector('.standard-menu');
        const dropdowns = document.querySelectorAll('.standard-dropdown');
        
        if (!nav || !menuToggle || !menu) return;
        
        // Use IntersectionObserver for scroll effects instead of scroll events
        const compactObserver = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    nav.classList.remove('compact');
                } else {
                    nav.classList.add('compact');
                }
            },
            { threshold: 0, rootMargin: "-50px 0px 0px 0px" }
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
        
        compactObserver.observe(sentinel);
        
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
                const submenu = dropdown.querySelector('.standard-dropdown-menu');
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
        // Close homepage navigation if present
        const homepageMenuToggle = document.querySelector('.homepage-menu-toggle.active');
        const homepageMenu = document.querySelector('.homepage-menu.active');
        const homepageDropdowns = document.querySelectorAll('.homepage-dropdown.active');
        
        if (homepageMenuToggle && homepageMenu) {
            toggleMenu(homepageMenuToggle, homepageMenu);
        }
        
        homepageDropdowns.forEach(dropdown => {
            toggleDropdown(dropdown);
        });
        
        // Close standard navigation if present
        const standardMenuToggle = document.querySelector('.standard-menu-toggle.active');
        const standardMenu = document.querySelector('.standard-menu.active');
        const standardDropdowns = document.querySelectorAll('.standard-dropdown.active');
        
        if (standardMenuToggle && standardMenu) {
            toggleMenu(standardMenuToggle, standardMenu);
        }
        
        standardDropdowns.forEach(dropdown => {
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
});