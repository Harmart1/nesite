/**
 * Unobtrusive back-to-top button functionality
 * Only shows after significant scrolling and with a slight delay
 */

document.addEventListener('DOMContentLoaded', function() {
  // Make sure we're not duplicating initialization
  if (window.backToTopInitialized) return;
  window.backToTopInitialized = true;
  
  const backToTopButton = document.querySelector('.back-to-top');
  
  if (!backToTopButton) {
    return;
  }
  
  // Set initial state - hidden
  backToTopButton.style.opacity = '0';
  backToTopButton.style.visibility = 'hidden';
  
  let scrollTimer;
  const scrollThreshold = window.innerHeight * 0.7; // Show after scrolling 70% of the viewport height
  
  // Show/hide button based on scroll position with delay
  const toggleBackToTopButton = () => {
    clearTimeout(scrollTimer);
    
    if (window.scrollY > scrollThreshold) {
      // Add delay before showing button to prevent it from appearing during short scrolls
      scrollTimer = setTimeout(() => {
        backToTopButton.classList.add('visible');
      }, 300);
    } else {
      backToTopButton.classList.remove('visible');
    }
  };
  
  // Smooth scroll to top when clicked
  backToTopButton.addEventListener('click', function(e) {
    e.preventDefault();
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Auto-hide after 3 seconds of no scrolling
  let autoHideTimer;
  const startAutoHideTimer = () => {
    clearTimeout(autoHideTimer);
    if (backToTopButton.classList.contains('visible')) {
      autoHideTimer = setTimeout(() => {
        backToTopButton.style.opacity = '0';
      }, 3000);
    }
  };
  
  // Show again when mouse moves
  const handleMouseMove = () => {
    if (window.scrollY > scrollThreshold) {
      backToTopButton.style.opacity = '';
      startAutoHideTimer();
    }
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  
  // Update threshold on window resize
  const updateThreshold = () => {
    scrollThreshold = window.innerHeight * 0.7;
  };
  
  window.addEventListener('resize', updateThreshold);
  
  // Check scroll position on page load
  toggleBackToTopButton();
  
  // Use passive event listener for better scroll performance
  window.addEventListener('scroll', toggleBackToTopButton, { passive: true });
  
  // Start auto-hide timer when button becomes visible
  backToTopButton.addEventListener('transitionend', (e) => {
    if (e.propertyName === 'opacity' && backToTopButton.classList.contains('visible')) {
      startAutoHideTimer();
    }
  });
  
  // Clean up function to prevent memory leaks
  window.addEventListener('beforeunload', () => {
    document.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', updateThreshold);
    window.removeEventListener('scroll', toggleBackToTopButton);
  });
});
