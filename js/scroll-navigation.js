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
        window.addEventListener('scroll', updateProgressBar);
        
        // Initial call to set progress bar on page load
        updateProgressBar();
        
        function updateProgressBar() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        }
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
        window.addEventListener('scroll', updateActiveLink);
        
        // Initial call to set active link on page load
        updateActiveLink();
        
        // Handle click events for jump links
        jumpLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Update active state visually
                jumpLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Smooth scroll to target section
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    smoothScrollTo(targetElement);
                }
            });
        });
    }
    
    // Side pagination dots (if present)
    if (paginationDots.length > 0) {
        // Update active dot on scroll
        window.addEventListener('scroll', updateActiveDot);
        
        // Initial call to set active dot on page load
        updateActiveDot();
        
        // Handle click events for pagination dots
        paginationDots.forEach(dot => {
            dot.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const sectionId = this.getAttribute('data-section');
                
                let targetElement;
                if (targetId) {
                    targetElement = document.querySelector(targetId);
                } else if (sectionId) {
                    targetElement = document.querySelector('#' + sectionId);
                }
                
                if (targetElement) {
                    smoothScrollTo(targetElement);
                }
            });
        });
    }
    
    // Helper function to smoothly scroll to an element
    function smoothScrollTo(element) {
        // Get header height for offset if fixed header exists
        const header = document.querySelector('.site-header');
        const headerOffset = header ? header.offsetHeight : 0;
        
        // Calculate position with offset
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;
        
        // Smooth scroll
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    
    // Helper function to check which section is currently in view
    function getCurrentSection() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        return current;
    }
    
    // Update active link in the jump navigation
    function updateActiveLink() {
        const current = getCurrentSection();
        
        if (current) {
            jumpLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        }
    }
    
    // Update active dot in the side pagination
    function updateActiveDot() {
        const current = getCurrentSection();
        
        if (current) {
            paginationDots.forEach(dot => {
                dot.classList.remove('active');
                if (dot.getAttribute('href') === '#' + current || dot.getAttribute('data-section') === current) {
                    dot.classList.add('active');
                }
            });
        }
    }
    
    // Handle Back-to-top button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        // Show button when scrolled down
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
