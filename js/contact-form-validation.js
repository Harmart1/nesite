/**
 * Contact Form Validation
 * Provides client-side validation for contact forms with accessibility features
 */

class ContactFormValidator {
  constructor(formSelector, options = {}) {
    this.form = document.querySelector(formSelector);
    if (!this.form) {
      console.error(`Contact form with selector ${formSelector} not found.`);
      return;
    }

    this.options = {
      invalidClass: 'invalid',
      errorClass: 'error-message',
      errorContainer: '.form-error-container',
      validateOnBlur: true,
      validateOnSubmit: true,
      recaptchaEnabled: true,
      formSubmitEndpoint: '/api/submit-form',
      redirectAfterSubmit: '/thank-you.html',
      ...options
    };

    this.validators = {
      required: (value) => value.trim() !== '',
      email: (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
      phone: (value) => /^(\+\d{1,3})?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value),
      minLength: (value, length) => value.length >= length,
      maxLength: (value, length) => value.length <= length,
      postalCode: (value) => /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(value), // Canadian postal code
      numericOnly: (value) => /^\d+$/.test(value),
      alphaOnly: (value) => /^[A-Za-z]+$/.test(value),
      url: (value) => {
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      }
    };

    this.errorMessages = {
      required: 'This field is required',
      email: 'Please enter a valid email address',
      phone: 'Please enter a valid phone number',
      minLength: (length) => `Please enter at least ${length} characters`,
      maxLength: (length) => `Please enter no more than ${length} characters`,
      postalCode: 'Please enter a valid postal code',
      numericOnly: 'Please enter numbers only',
      alphaOnly: 'Please enter letters only',
      url: 'Please enter a valid URL',
      recaptcha: 'Please verify that you are not a robot'
    };

    this.submitting = false;
    this.init();
  }

  init() {
    // Set up form submission handler
    if (this.options.validateOnSubmit) {
      this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    // Set up field validation on blur
    if (this.options.validateOnBlur) {
      this.form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', () => this.validateField(field));
        field.addEventListener('input', () => this.clearFieldError(field));
      });
    }

    // Override form's HTML5 validation
    this.form.setAttribute('novalidate', 'true');

    // Create error container if it doesn't exist
    if (!this.form.querySelector(this.options.errorContainer)) {
      const errorContainer = document.createElement('div');
      errorContainer.className = this.options.errorContainer.replace('.', '');
      errorContainer.setAttribute('role', 'alert');
      errorContainer.setAttribute('aria-live', 'polite');
      this.form.prepend(errorContainer);
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    // Prevent double submission
    if (this.submitting) {
      return;
    }

    // Validate all fields
    const isValid = this.validateForm();
    
    // Check reCAPTCHA if enabled
    if (isValid && this.options.recaptchaEnabled) {
      const recaptchaResponse = this.getRecaptchaResponse();
      if (!recaptchaResponse) {
        this.showFormError(this.errorMessages.recaptcha);
        return;
      }
    }

    // Submit form if valid
    if (isValid) {
      this.submitForm();
    } else {
      // Focus the first invalid field
      const firstInvalid = this.form.querySelector(`.${this.options.invalidClass}`);
      if (firstInvalid) {
        firstInvalid.focus();
      }
      
      // Scroll to the top of the form to show errors
      this.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  validateForm() {
    // Clear previous errors
    this.clearFormErrors();
    
    let isValid = true;
    
    // Validate each field
    this.form.querySelectorAll('input, select, textarea').forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  validateField(field) {
    // Skip fields that are disabled or hidden
    if (field.disabled || field.type === 'hidden') {
      return true;
    }
    
    // Get validation rules from data attributes
    const validations = field.dataset.validate ? field.dataset.validate.split(' ') : [];
    const value = field.value;
    let isValid = true;
    
    // Check each validation rule
    for (const validation of validations) {
      const [rule, param] = validation.split(':');
      
      if (this.validators[rule]) {
        // Skip empty values for non-required fields
        if (rule !== 'required' && value === '' && !validations.includes('required')) {
          continue;
        }
        
        const isRuleValid = this.validators[rule](value, param);
        if (!isRuleValid) {
          // Generate error message
          let errorMessage = '';
          if (field.dataset.errorMessage) {
            errorMessage = field.dataset.errorMessage;
          } else if (typeof this.errorMessages[rule] === 'function') {
            errorMessage = this.errorMessages[rule](param);
          } else {
            errorMessage = this.errorMessages[rule];
          }
          
          // Show error for this field
          this.showFieldError(field, errorMessage);
          isValid = false;
          break; // Stop at first failed validation
        }
      }
    }
    
    // If field is valid, ensure it's not marked as invalid
    if (isValid) {
      this.clearFieldError(field);
    }
    
    return isValid;
  }

  showFieldError(field, message) {
    // Add error class to the field
    field.classList.add(this.options.invalidClass);
    field.setAttribute('aria-invalid', 'true');
    
    // Find or create error message element
    const fieldId = field.id || field.name;
    let errorElement = document.getElementById(`${fieldId}-error`);
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = `${fieldId}-error`;
      errorElement.className = this.options.errorClass;
      errorElement.setAttribute('aria-live', 'polite');
      
      // Add after the field or its label
      const fieldParent = field.closest('.form-field') || field.parentNode;
      fieldParent.appendChild(errorElement);
    }
    
    // Set error message
    errorElement.textContent = message;
    
    // Connect field to error message with aria-describedby
    field.setAttribute('aria-describedby', errorElement.id);
  }

  clearFieldError(field) {
    field.classList.remove(this.options.invalidClass);
    field.removeAttribute('aria-invalid');
    
    // Find and remove error message
    const fieldId = field.id || field.name;
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (errorElement) {
      errorElement.textContent = '';
      // Don't remove the element entirely to avoid layout shifts
    }
  }

  showFormError(message) {
    const errorContainer = this.form.querySelector(this.options.errorContainer);
    
    if (errorContainer) {
      errorContainer.textContent = message;
      errorContainer.style.display = 'block';
      errorContainer.classList.add('active');
    }
  }

  clearFormErrors() {
    // Clear general form error
    const errorContainer = this.form.querySelector(this.options.errorContainer);
    
    if (errorContainer) {
      errorContainer.textContent = '';
      errorContainer.style.display = 'none';
      errorContainer.classList.remove('active');
    }
  }

  getRecaptchaResponse() {
    if (window.grecaptcha) {
      return grecaptcha.getResponse();
    }
    
    // If reCAPTCHA is enabled but not loaded, treat as invalid
    return null;
  }

  async submitForm() {
    this.submitting = true;
    
    // Show loading state
    this.form.classList.add('submitting');
    const submitButton = this.form.querySelector('button[type="submit"], input[type="submit"]');
    
    if (submitButton) {
      const originalText = submitButton.textContent || submitButton.value;
      submitButton.disabled = true;
      submitButton.textContent = submitButton.value = 'Submitting...';
    }
    
    try {
      // Collect form data
      const formData = new FormData(this.form);
      
      // Add reCAPTCHA response if available
      if (this.options.recaptchaEnabled && window.grecaptcha) {
        formData.append('g-recaptcha-response', grecaptcha.getResponse());
      }
      
      // Send form data
      const response = await fetch(this.options.formSubmitEndpoint, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Form submission failed');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Successful submission - store form data in sessionStorage for thank you page
        sessionStorage.setItem('formData', JSON.stringify(Object.fromEntries(formData)));
        
        // Redirect to thank you page
        window.location.href = this.options.redirectAfterSubmit;
      } else {
        // Server indicated an error
        this.showFormError(result.message || 'There was a problem submitting your form. Please try again.');
        this.submitting = false;
        
        // Reset submit button
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = submitButton.value = originalText;
        }
        
        this.form.classList.remove('submitting');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showFormError('There was a problem submitting your form. Please try again.');
      this.submitting = false;
      
      // Reset submit button
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitButton.value = originalText;
      }
      
      this.form.classList.remove('submitting');
    }
  }
}

// Initialize all contact forms when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const contactForms = document.querySelectorAll('.contact-form');
  
  contactForms.forEach((form, index) => {
    new ContactFormValidator(`#${form.id || 'contact-form-' + index}`, {
      // Override default options if needed
      formSubmitEndpoint: form.dataset.endpoint || '/api/submit-form',
      redirectAfterSubmit: form.dataset.redirect || '/thank-you.html',
      recaptchaEnabled: form.dataset.recaptcha !== 'false'
    });
  });
});
