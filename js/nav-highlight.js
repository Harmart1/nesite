/**
 * Navigation Highlight Script
 * 
 * Automatically updates the active state of navigation items based on:
 * 1. Current URL path
 * 2. Scroll position (for on-page navigation)
 * 
 * This script is designed to work with both main navigation and sidebar/jump navigation.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Highlight main navigation based on current URL
    highlightCurrentPageInNav();
    
    // For pages with section navigation, highlight based on scroll
    initSectionHighlighting();
    
    // For practice area pages, initialize section highlighting
    initPracticeAreaNavigation();
});

/**
 * Highlights the appropriate navigation item based on current URL
 */
function highlightCurrentPageInNav() {
    // Get current page path
    const currentPath = window.location.pathname;
    
    // Remove any file extension and trailing slashes for comparison
    const cleanPath = currentPath.replace(/\.[^/.]+$/, "").replace(/\/$/, "");
    
    // Select all navigation links
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Check each link to see if it matches current path
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        // Clean the href attribute similarly for fair comparison
        const linkPath = href.replace(/\.[^/.]+$/, "").replace(/\/$/, "");
        
        // Improved matching logic to handle relative and absolute paths
        if (
            // Exact match
            cleanPath === linkPath || 
            // Current path ends with link path (for subdirectories)
            (linkPath !== "" && cleanPath.endsWith(linkPath)) ||
            // Match the filename if it's the index page
            (linkPath.endsWith('index') && cleanPath.endsWith(linkPath.replace('/index', '')))
        ) {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to matching link
            link.classList.add('active');
            
            // If in dropdown, activate parent
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                const parentLink = parentDropdown.querySelector(':scope > a');
                if (parentLink) {
                    parentLink.classList.add('active');
                }
            }
        }
    });
}

/**
 * Initializes the section highlighting for pages with on-page navigation
 */
function initSectionHighlighting() {
    // Check if page has jump navigation
    const jumpNavLinks = document.querySelectorAll('.jump-nav-links a');
    if (jumpNavLinks.length === 0) return;
    
    // Get all sections that can be navigated to
    const sections = [];
    jumpNavLinks.forEach(link => {
        const targetId = link.getAttribute('href');
        if (!targetId || !targetId.startsWith('#')) return;
        
        const sectionId = targetId.substring(1); // Remove # from href
        const section = document.getElementById(sectionId);
        if (section) {
            sections.push(section);
        }
    });
    
    if (sections.length === 0) return;
    
    // Function to determine which section is currently in view
    function getCurrentSection() {
        // Offset to trigger section slightly before it reaches the top
        const offset = 100;
        
        // Default to first section
        let current = sections[0]?.id || '';
        
        // Check each section's position
        for (const section of sections) {
            const sectionTop = section.offsetTop - offset;
            if (window.pageYOffset >= sectionTop) {
                current = section.id;
            }
        }
        
        return current;
    }
    
    // Function to update active state in navigation
    function updateActiveSection() {
        const currentSectionId = getCurrentSection();
        if (!currentSectionId) return;
        
        // Update jump navigation
        jumpNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
                
                // If this is a horizontal scrolling navigation, ensure active link is visible
                const jumpNav = link.closest('.jump-nav');
                if (jumpNav && window.innerWidth < 992) { // Only for mobile/tablet
                    const linkRect = link.getBoundingClientRect();
                    const navRect = jumpNav.getBoundingClientRect();
                    
                    // If link is not fully visible, scroll the navigation
                    if (linkRect.right > navRect.right || linkRect.left < navRect.left) {
                        link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }
                }
            }
        });
        
        // Update side navigation if present
        const sideNavLinks = document.querySelectorAll('.side-navigation a');
        sideNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Initial update
    updateActiveSection();
    
    // Update on scroll (use passive for better performance)
    window.addEventListener('scroll', updateActiveSection, { passive: true });
}

/**
 * Initializes special navigation for practice area pages
 */
function initPracticeAreaNavigation() {
    // Check if this is a practice area page with sections
    const practiceAreaSections = document.querySelectorAll('.page-section');
    if (practiceAreaSections.length === 0) return;
    
    // Initialize progress bar if present
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const updateProgressBar = () => {
            const windowHeight = window.innerHeight;
            const fullHeight = document.body.offsetHeight;
            const scrolled = window.pageYOffset;
            
            // Calculate percentage scrolled
            const scrollPercent = (scrolled / (fullHeight - windowHeight)) * 100;
            progressBar.style.width = Math.min(100, Math.max(0, scrollPercent)) + '%';
        };
        
        window.addEventListener('scroll', updateProgressBar, { passive: true });
        updateProgressBar(); // Initial update
    }
    
    // Initialize continuation buttons
    const continueButtons = document.querySelectorAll('.continue-button');
    continueButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            if (!targetId) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Get header height for offset
                const header = document.querySelector('.site-header');
                const headerHeight = header ? header.offsetHeight : 0;
                
                // Scroll to target section with offset
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: targetPosition - headerHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
}
