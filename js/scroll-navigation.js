/**
 * Enhanced Navigation Scripts
 * 
 * This file provides functionality for:
 * - Smooth scrolling navigation
 * - Progress bar updates
 * - Active section highlighting in navigation
 * - Section-based pagination dots
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const progressBar = document.getElementById('progressBar');
    const jumpLinks = document.querySelectorAll('.jump-nav-links a');
    const sections = document.querySelectorAll('.page-section');
    const continueButtons = document.querySelectorAll('.continue-button');
    const paginationDots = document.querySelectorAll('.page-navigation-dots .dot');
    
    // Progress bar functionality - updates as user scrolls
    if (progressBar) {
        const updateProgressBar = () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (height <= 0) return; // Prevent division by zero
            
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = Math.min(100, Math.max(0, scrolled)) + "%";
        };
        
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
    
    // Jump navigation active state management
    if (jumpLinks.length > 0 && sections.length > 0) {
        // Update active link on scroll
        const updateActiveLink = () => {
            const currentSection = getCurrentSection();
            
            if (currentSection) {
                jumpLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + currentSection) {
                        link.classList.add('active');
                    }
                });
                
                // Also update pagination dots if they exist
                if (paginationDots.length > 0) {
                    updatePaginationDots(currentSection);
                }
            }
        };
        
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
        
        // Get header height for offset
        const header = document.querySelector('.site-header');
        const headerOffset = header ? header.offsetHeight : 0;
        
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
            top: targetPosition - headerOffset - 20,
            behavior: 'smooth'
        });
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
});
