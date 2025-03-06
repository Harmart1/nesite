/**
 * Form Validation Module
 * 
 * Provides comprehensive client-side form validation with:
 * - Real-time validation feedback
 * - Custom validation rules
 * - Accessibility features
 * - Form submission handling
 */

class FormValidator {
    constructor(formElement, options = {}) {
        this.form = formElement;
        this.options = {
            validateOnInput: true,
            validateOnBlur: true,
            customValidations: {},
            onSuccess: null,
            onError: null,
            ...options
        };
        
        this.errorMessages = {
            required: 'This field is required',
            email: 'Please enter a valid email address',
            phone: 'Please enter a valid phone number',
            minLength: 'Please enter at least {min} characters',
            maxLength: 'Please enter no more than {max} characters',
            pattern: 'Please enter a valid value',
            ...options.errorMessages
        };
        
        this.init();
    }
    
    init() {
        // Prevent default HTML5 validation to use our custom validation
        this.form.setAttribute('novalidate', 'novalidate');
        
        // Set up event listeners
        if (this.options.validateOnInput) {
            this.form.addEventListener('input', e => this.handleInput(e));
        }
        
        if (this.options.validateOnBlur) {
            this.form.addEventListener('blur', e => this.handleBlur(e), true);
        }
        
        this.form.addEventListener('submit', e => this.handleSubmit(e));
    }
    
    handleInput(e) {
        const field = e.target;
        if (this.isValidatableField(field)) {
            // Don't show errors immediately on input, 
            // wait until the user has stopped typing for a bit
            clearTimeout(field._validationTimeout);
            field._validationTimeout = setTimeout(() => {
                this.validateField(field);
            }, 300);
        }
    }
    
    handleBlur(e) {
        const field = e.target;
        if (this.isValidatableField(field)) {
            // Clear any pending validation timeout
            clearTimeout(field._validationTimeout);
            this.validateField(field);
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const isValid = this.validateAllFields();
        
        if (isValid) {
            // All fields are valid
            if (typeof this.options.onSuccess === 'function') {
                this.options.onSuccess(this.form);
            } else {
                // Default submission behavior
                const formData = new FormData(this.form);
                
                // Sample AJAX submission (commented out as placeholder)
                /*
                fetch(this.form.action, {
                    method: this.form.method || 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    // Handle successful response
                    this.showSuccessMessage();
                })
                .catch(error => {
                    // Handle error
                    this.showErrorMessage('There was a problem submitting your form. Please try again.');
                });
                */
                
                // For now, just show success message
                this.showSuccessMessage();
            }
        } else {
            // Form has validation errors
            if (typeof this.options.onError === 'function') {
                this.options.onError(this.form);
            }
            
            // Focus the first invalid field
            const firstInvalidField = this.form.querySelector('.error');
            if (firstInvalidField) {
                firstInvalidField.focus();
            }
        }
    }
    
    validateAllFields() {
        const fields = this.form.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        fields.forEach(field => {
            if (this.isValidatableField(field)) {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        // Remove any existing validation messages
        this.removeValidationMessage(field);
        
        // Skip validation if field is disabled or not shown
        if (field.disabled || field.style.display === 'none') {
            return true;
        }
        
        // Check HTML5 validity
        let isValid = field.validity.valid;
        let errorMessage = '';
        
        // If field is required and empty
        if (field.required && !field.value.trim()) {
            isValid = false;
            errorMessage = this.errorMessages.required;
        }
        // Email validation
        else if (field.type === 'email' && field.value.trim() && !this.isValidEmail(field.value)) {
            isValid = false;
            errorMessage = this.errorMessages.email;
        }
        // Phone validation
        else if (field.type === 'tel' && field.value.trim() && !this.isValidPhone(field.value)) {
            isValid = false;
            errorMessage = this.errorMessages.phone;
        }
        // Min length validation
        else if (field.minLength && field.value.length < field.minLength) {
            isValid = false;
            errorMessage = this.errorMessages.minLength.replace('{min}', field.minLength);
        }
        // Max length validation
        else if (field.maxLength && field.maxLength > 0 && field.value.length > field.maxLength) {
            isValid = false;
            errorMessage = this.errorMessages.maxLength.replace('{max}', field.maxLength);
        }
        // Pattern validation
        else if (field.pattern && field.value.trim() && !new RegExp(field.pattern).test(field.value)) {
            isValid = false;
            errorMessage = field.dataset.errorPattern || this.errorMessages.pattern;
        }
        
        // Custom validation if defined
        const fieldName = field.name || field.id;
        if (isValid && this.options.customValidations[fieldName]) {
            const customValidation = this.options.customValidations[fieldName](field.value, this.form);
            
            if (customValidation !== true) {
                isValid = false;
                errorMessage = customValidation;
            }
        }
        
        // Update field UI based on validation
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.showFieldSuccess(field);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        // Add error class to field
        field.classList.add('error');
        field.classList.remove('valid');
        
        // Set aria attributes
        field.setAttribute('aria-invalid', 'true');
        
        // Create error message element if it doesn't exist
        let errorElement = field.parentNode.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            
            // Add unique ID for aria-describedby
            const errorId = `error-${field.name || field.id || Math.random().toString(36).substring(2, 9)}`;
            errorElement.id = errorId;
            
            // Connect error message to field with aria-describedby
            field.setAttribute('aria-describedby', errorId);
            
            // Insert after the field
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    showFieldSuccess(field) {
        // Add valid class
        field.classList.remove('error');
        field.classList.add('valid');
        
        // Update aria attributes
        field.setAttribute('aria-invalid', 'false');
        field.removeAttribute('aria-describedby');
    }
    
    removeValidationMessage(field) {
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    showSuccessMessage() {
        // Hide the form
        this.form.style.display = 'none';
        
        // Show success message
        let successMessage = document.querySelector('.form-success-message');
        if (!successMessage) {
            successMessage = document.createElement('div');
            successMessage.className = 'form-success-message';
            successMessage.innerHTML = `
                <h3>Thank You!</h3>
                <p>Your form has been submitted successfully.</p>
            `;
            this.form.parentNode.insertBefore(successMessage, this.form.nextSibling);
        } else {
            successMessage.style.display = 'block';
        }
    }
    
    showErrorMessage(message) {
        let formError = document.querySelector('.form-error-message');
        if (!formError) {
            formError = document.createElement('div');
            formError.className = 'form-error-message';
            this.form.parentNode.insertBefore(formError, this.form);
        }
        
        formError.textContent = message;
        formError.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            formError.style.display = 'none';
        }, 5000);
    }
    
    isValidatableField(field) {
        const nodeName = field.nodeName.toLowerCase();
        return (
            (nodeName === 'input' && !['button', 'submit', 'reset', 'hidden', 'file'].includes(field.type)) ||
            nodeName === 'select' ||
            nodeName === 'textarea'
        );
    }
    
    isValidEmail(email) {
        // RFC 5322 compliant email regex
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(email).toLowerCase());
    }
    
    isValidPhone(phone) {
        // Basic phone validation (allows various formats)
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 10;
    }
}

// Initialize all forms with validation class
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('.validate-form');
    
    forms.forEach(form => {
        new FormValidator(form, {
            // Custom validation example
            customValidations: {
                'confirm-email': (value, formElement) => {
                    const emailField = formElement.querySelector('input[name="email"]');
                    return emailField && value === emailField.value ? true : 'Email addresses must match';
                },
                'zip': (value) => {
                    return /^\d{5}(-\d{4})?$/.test(value) ? true : 'Please enter a valid ZIP code';
                }
            },
            // Custom error messages
            errorMessages: {
                email: 'Please enter a valid email address (example@domain.com)'
            },
            // Success callback
            onSuccess: (form) => {
                console.log('Form validated successfully:', form);
                // Form submission is handled in the validateForm method
            }
        });
    });
});
