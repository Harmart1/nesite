/**
 * Cookie Consent Banner
 * Displays a non-intrusive horizontal banner at the bottom of the viewport
 * Persists across pages until user makes a choice
 */

class CookieConsentManager {
  constructor(options = {}) {
    this.options = {
      cookieName: 'ne_cookie_consent',
      cookieExpiration: 365, // days
      privacyPolicyUrl: 'privacy-policy.html',
      necessary: true, // necessary cookies are always enabled
      ...options
    };

    this.consentSaved = this.checkConsentCookie();
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }
  
  init() {
    this.createBanner();
    this.createModal();
    
    if (!this.consentSaved) {
      this.showBanner();
    }
    
    // Add settings button to footer
    this.addCookieSettingsButton();
  }
  
  createBanner() {
    const banner = document.createElement('div');
    banner.className = 'cookie-consent-banner';
    banner.id = 'cookieConsentBanner';
    
    banner.innerHTML = `
      <div class="cookie-banner-container">
        <div class="cookie-text">
          <h4>Cookie Preferences</h4>
          <p>We use cookies to enhance your browsing experience. By continuing to use our site, you consent to our use of cookies. 
            <a href="${this.options.privacyPolicyUrl}">Learn more</a>
          </p>
        </div>
        <div class="cookie-options">
          <button class="cookie-btn cookie-btn-accept-all" id="acceptAllCookies">Accept All</button>
          <button class="cookie-btn cookie-btn-essential" id="acceptEssential">Essential Only</button>
          <button class="cookie-btn cookie-btn-customize" id="customizeCookies">Customize</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(banner);
    
    // Add event listeners
    document.getElementById('acceptAllCookies').addEventListener('click', () => {
      this.savePreferences({
        necessary: true,
        functional: true,
        analytics: true,
        marketing: true
      });
      this.hideBanner();
    });
    
    document.getElementById('acceptEssential').addEventListener('click', () => {
      this.savePreferences({
        necessary: true,
        functional: false,
        analytics: false,
        marketing: false
      });
      this.hideBanner();
    });
    
    document.getElementById('customizeCookies').addEventListener('click', () => {
      this.showPreferencesModal();
    });
  }
  
  createModal() {
    const modal = document.createElement('div');
    modal.className = 'cookie-preferences-modal';
    modal.id = 'cookiePreferencesModal';
    
    modal.innerHTML = `
      <div class="cookie-modal-content">
        <div class="cookie-modal-header">
          <h3>Cookie Preferences</h3>
          <button class="cookie-close-modal" id="closeCookieModal">&times;</button>
        </div>
        <div class="cookie-modal-body">
          <p>Customize your cookie preferences below. Essential cookies are required for basic website functionality.</p>
          
          <div class="cookie-category">
            <div class="cookie-category-header">
              <h4>Essential Cookies</h4>
              <label class="cookie-toggle">
                <input type="checkbox" id="necessaryCookies" checked disabled>
                <span class="cookie-toggle-slider"></span>
              </label>
            </div>
            <p>These cookies are required for the website to function and cannot be disabled.</p>
          </div>
          
          <div class="cookie-category">
            <div class="cookie-category-header">
              <h4>Functional Cookies</h4>
              <label class="cookie-toggle">
                <input type="checkbox" id="functionalCookies">
                <span class="cookie-toggle-slider"></span>
              </label>
            </div>
            <p>These cookies enable personalized features and functionality.</p>
          </div>
          
          <div class="cookie-category">
            <div class="cookie-category-header">
              <h4>Analytics Cookies</h4>
              <label class="cookie-toggle">
                <input type="checkbox" id="analyticsCookies">
                <span class="cookie-toggle-slider"></span>
              </label>
            </div>
            <p>These cookies help us understand how visitors interact with our website.</p>
          </div>
          
          <div class="cookie-category">
            <div class="cookie-category-header">
              <h4>Marketing Cookies</h4>
              <label class="cookie-toggle">
                <input type="checkbox" id="marketingCookies">
                <span class="cookie-toggle-slider"></span>
              </label>
            </div>
            <p>These cookies are used to deliver relevant advertisements and track their performance.</p>
          </div>
        </div>
        <div class="cookie-modal-footer">
          <button class="cookie-btn cookie-btn-essential" id="rejectAllModal">Reject All</button>
          <button class="cookie-btn cookie-btn-accept-all" id="savePreferences">Save Preferences</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    document.getElementById('closeCookieModal').addEventListener('click', () => {
      this.hidePreferencesModal();
    });
    
    document.getElementById('rejectAllModal').addEventListener('click', () => {
      document.getElementById('functionalCookies').checked = false;
      document.getElementById('analyticsCookies').checked = false;
      document.getElementById('marketingCookies').checked = false;
      
      this.savePreferences({
        necessary: true,
        functional: false,
        analytics: false,
        marketing: false
      });
      
      this.hidePreferencesModal();
      this.hideBanner();
    });
    
    document.getElementById('savePreferences').addEventListener('click', () => {
      const preferences = {
        necessary: true, // Always enabled
        functional: document.getElementById('functionalCookies').checked,
        analytics: document.getElementById('analyticsCookies').checked,
        marketing: document.getElementById('marketingCookies').checked
      };
      
      this.savePreferences(preferences);
      this.hidePreferencesModal();
      this.hideBanner();
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.hidePreferencesModal();
      }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        this.hidePreferencesModal();
      }
    });
  }
  
  showBanner() {
    const banner = document.getElementById('cookieConsentBanner');
    if (banner) {
      banner.style.display = 'block';
    }
  }
  
  hideBanner() {
    const banner = document.getElementById('cookieConsentBanner');
    if (banner) {
      banner.style.display = 'none';
    }
  }
  
  showPreferencesModal() {
    const modal = document.getElementById('cookiePreferencesModal');
    if (modal) {
      // Set checkboxes based on saved preferences or defaults
      const savedPreferences = this.consentSaved || {
        necessary: true,
        functional: false,
        analytics: false,
        marketing: false
      };
      
      document.getElementById('functionalCookies').checked = savedPreferences.functional;
      document.getElementById('analyticsCookies').checked = savedPreferences.analytics;
      document.getElementById('marketingCookies').checked = savedPreferences.marketing;
      
      modal.style.display = 'flex';
    }
  }
  
  hidePreferencesModal() {
    const modal = document.getElementById('cookiePreferencesModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
  
  checkConsentCookie() {
    const cookie = this.getCookie(this.options.cookieName);
    if (cookie) {
      try {
        return JSON.parse(cookie);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
  
  savePreferences(preferences) {
    this.consentSaved = preferences;
    
    // Set cookie
    const cookieValue = JSON.stringify(preferences);
    this.setCookie(this.options.cookieName, cookieValue, this.options.cookieExpiration);
    
    // Apply preferences
    this.applyPreferences(preferences);
    
    // Trigger event for other scripts
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
      detail: { preferences: preferences }
    }));
  }
  
  applyPreferences(preferences) {
    // Apply cookie preferences by enabling/disabling cookies
    if (!preferences.analytics) {
      this.disableAnalytics();
    }
    
    if (!preferences.marketing) {
      this.disableMarketing();
    }
    
    // Track the consent for compliance purposes
    this.logConsent(preferences);
  }
  
  disableAnalytics() {
    // Disable Google Analytics if present
    window['ga-disable-UA-XXXXXXXX-Y'] = true;
    
    // Remove analytics cookies
    this.deleteCookiesStartingWith('_ga');
    this.deleteCookiesStartingWith('_gid');
    this.deleteCookiesStartingWith('_gat');
  }
  
  disableMarketing() {
    // Remove marketing cookies
    this.deleteCookiesStartingWith('_fbp');
    this.deleteCookiesStartingWith('_pin_unauth');
    
    // Additional marketing cookies
    this.deleteCookiesStartingWith('ads');
    this.deleteCookiesStartingWith('__gads');
  }
  
  addCookieSettingsButton() {
    // Find footer with legal links
    const legalLinks = document.querySelector('.legal-links');
    if (legalLinks) {
      // Check if button already exists
      if (!document.getElementById('cookieSettings')) {
        const settingsLink = document.createElement('a');
        settingsLink.id = 'cookieSettings';
        settingsLink.href = '#';
        settingsLink.textContent = 'Cookie Settings';
        settingsLink.addEventListener('click', (e) => {
          e.preventDefault();
          this.showPreferencesModal();
        });
        
        // Add a separator and the link
        const separator = document.createTextNode(' | ');
        legalLinks.appendChild(separator);
        legalLinks.appendChild(settingsLink);
      }
    }
  }
  
  // Cookie utility functions
  setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }
  
  getCookie(name) {
    const namePattern = `${name}=`;
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(namePattern) === 0) {
        return decodeURIComponent(cookie.substring(namePattern.length, cookie.length));
      }
    }
    return null;
  }
  
  deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;SameSite=Lax`;
  }
  
  deleteCookiesStartingWith(prefix) {
    const cookies = document.cookie.split(';');
    
    cookies.forEach(cookie => {
      const cookieName = cookie.split('=')[0].trim();
      if (cookieName.startsWith(prefix)) {
        this.deleteCookie(cookieName);
      }
    });
  }
  
  logConsent(preferences) {
    // Log consent for compliance purposes (can be extended to send to server)
    console.log('Cookie consent saved:', preferences, 'at', new Date().toISOString());
  }
}

// Initialize cookie consent manager on page load
document.addEventListener('DOMContentLoaded', () => {
  window.cookieConsent = new CookieConsentManager({
    privacyPolicyUrl: 'privacy-policy.html'
  });
});
