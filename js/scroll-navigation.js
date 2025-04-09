/**
 * Enhanced Navigation Scripts
 * 
 * This file provides functionality for:
 * - Smooth scrolling navigation with performance optimizations
 * - Progress bar updates using IntersectionObserver
 * - Active section highlighting in navigation
 * - Section-based pagination dots
 * 
 * Performance optimizations:
 * - Uses IntersectionObserver instead of scroll events where possible
 * - Debounced scroll handlers
 * - Passive event listeners
 * - Optimized animations with will-change
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const progressBar = document.getElementById('progressBar');
    const jumpLinks = document.querySelectorAll('.jump-nav-links a');
    const sections = document.querySelectorAll('.page-section');
    const continueButtons = document.querySelectorAll('.continue-button');
    const paginationDots = document.querySelectorAll('.page-navigation-dots .dot');
    
    // Apply will-change to elements that will animate
    if (progressBar) {
        progressBar.style.willChange = 'width';
    }
    
    // Progress bar functionality - optimized with IntersectionObserver
    if (progressBar) {
        // Create progress observer to track scroll percentage
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Calculate the intersection ratio as percentage of page scrolled
                updateProgressBar();
            });
        }, { threshold: Array.from({length: 101}, (_, i) => i / 100) });
        
        // Observe document body to track scroll progress
        progressObserver.observe(document.body);
        
        // Throttled scroll handler as backup for browsers without full IntersectionObserver support
        const updateProgressBar = debounce(() => {
            requestAnimationFrame(() => {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                if (height <= 0) return; // Prevent division by zero
                
                const scrolled = (winScroll / height) * 100;
                progressBar.style.width = Math.min(100, Math.max(0, scrolled)) + "%";
            });
        }, 10);
        
        window.addEventListener('scroll', updateProgressBar, { passive: true });
        
        // Initial call to set progress bar on page load
        updateProgressBar();
    }
    
    // Continue reading buttons - smooth scroll to next section
    if (continueButtons.length > 0) {
        continueButtons.forEach(button => {
            button.addEventListener('click', function() {
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
    
    // Jump navigation active state management with IntersectionObserver
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
                    
                    // Update pagination dots if they exist
                    updatePaginationDots(currentSection);
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
                
                // Update pagination dots if they exist
                if (paginationDots.length > 0) {
                    updatePaginationDots(currentSection);
                }
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
    
    // Pagination dots functionality
    if (paginationDots.length > 0) {
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
    
    // Helper function to update pagination dots
    function updatePaginationDots(currentSectionId) {
        paginationDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-target') === '#' + currentSectionId) {
                dot.classList.add('active');
            }
        });
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
    
    // Debounce function to limit frequency of events
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
    
    // Clean up function to prevent memory leaks
    window.addEventListener('beforeunload', () => {
        window.removeEventListener('scroll', updateActiveLink);
        if (progressBar) {
            window.removeEventListener('scroll', updateProgressBar);
        }
    });
});
