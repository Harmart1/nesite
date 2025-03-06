/**
 * Performance Optimization Script
 * 
 * This script improves site performance by:
 * - Lazy loading images
 * - Deferring non-critical JavaScript
 * - Optimizing animation performance
 * - Implementing responsive resource loading
 */

document.addEventListener('DOMContentLoaded', function() {
    // Enable native lazy loading for images and iframes
    enableLazyLoading();
    
    // Implement responsive resource loading
    handleResponsiveResources();
    
    // Optimize animation performance
    optimizeAnimations();
    
    // Listen for viewport changes to update optimizations
    window.addEventListener('resize', handleResponsiveResources);
    
    // Clean up on page unload
    window.addEventListener('beforeunload', function() {
        window.removeEventListener('resize', handleResponsiveResources);
    });
});

/**
 * Enables lazy loading for images and iframes
 */
function enableLazyLoading() {
    // Check if browser supports native lazy loading
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        document.querySelectorAll('img:not([loading])').forEach(img => {
            img.loading = 'lazy';
        });
        
        document.querySelectorAll('iframe:not([loading])').forEach(iframe => {
            iframe.loading = 'lazy';
        });
    } else {
        // Implement fallback for browsers without native support
        implementLazyLoadFallback();
    }
}

/**
 * Fallback lazy loading implementation using IntersectionObserver
 */
function implementLazyLoadFallback() {
    if (!('IntersectionObserver' in window)) return;
    
    const lazyImages = document.querySelectorAll('img[data-src], iframe[data-src]');
    
    const lazyLoadObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                
                if (target.dataset.src) {
                    target.src = target.dataset.src;
                    delete target.dataset.src;
                }
                
                if (target.dataset.srcset) {
                    target.srcset = target.dataset.srcset;
                    delete target.dataset.srcset;
                }
                
                lazyLoadObserver.unobserve(target);
            }
        });
    }, {
        rootMargin: '200px', // Start loading when within 200px of viewport
    });
    
    lazyImages.forEach(image => {
        lazyLoadObserver.observe(image);
    });
}

/**
 * Loads different resources based on viewport size
 */
function handleResponsiveResources() {
    // Get current viewport size
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const isDesktop = window.innerWidth >= 1024;
    
    // Handle responsive images that aren't using picture/srcset
    document.querySelectorAll('[data-mobile-src], [data-tablet-src], [data-desktop-src]').forEach(img => {
        if (isMobile && img.dataset.mobileSrc) {
            if (img.src !== img.dataset.mobileSrc) img.src = img.dataset.mobileSrc;
        } else if (isTablet && img.dataset.tabletSrc) {
            if (img.src !== img.dataset.tabletSrc) img.src = img.dataset.tabletSrc;
        } else if (isDesktop && img.dataset.desktopSrc) {
            if (img.src !== img.dataset.desktopSrc) img.src = img.dataset.desktopSrc;
        }
    });
    
    // Handle responsive background images
    document.querySelectorAll('[data-mobile-bg], [data-tablet-bg], [data-desktop-bg]').forEach(element => {
        if (isMobile && element.dataset.mobileBg) {
            element.style.backgroundImage = `url(${element.dataset.mobileBg})`;
        } else if (isTablet && element.dataset.tabletBg) {
            element.style.backgroundImage = `url(${element.dataset.tabletBg})`;
        } else if (isDesktop && element.dataset.desktopBg) {
            element.style.backgroundImage = `url(${element.dataset.desktopBg})`;
        }
    });
}

/**
 * Optimizes animations for better performance
 */
function optimizeAnimations() {
    // Use requestAnimationFrame for smooth animations
    const animatedElements = document.querySelectorAll('.animated, .fade-in, .slide-in, .slide-up');
    
    if (animatedElements.length === 0) return;
    
    // Check for prefers-reduced-motion media query
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Remove animations if user prefers reduced motion
        animatedElements.forEach(element => {
            element.classList.add('no-animation');
            
            // Remove any animation/transition properties
            element.style.animation = 'none';
            element.style.transition = 'none';
        });
        return;
    }
    
    // Use Intersection Observer for triggering animations when elements come into view
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(() => {
                        entry.target.classList.add('animate');
                        animationObserver.unobserve(entry.target);
                    });
                }
            });
        }, {
            threshold: 0.15, // Trigger when 15% of element is visible
            rootMargin: '0px 0px -50px 0px' // Slightly offset trigger point
        });
        
        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        animatedElements.forEach(element => {
            element.classList.add('animate');
        });
    }
    
    // Apply transform/opacity optimizations for better performance
    animatedElements.forEach(element => {
        // Force GPU acceleration for smoother animations
        element.style.willChange = 'opacity, transform';
        
        // Clean up will-change after animation completes
        element.addEventListener('animationend', function() {
            this.style.willChange = 'auto';
        }, { once: true });
    });
}
