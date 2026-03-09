/**
 * Forms.js - Form handling and validation for H-Guardian website
 */

class FormHandler {
    constructor() {
        this.forms = [];
        this.init();
    }
    
    init() {
        this.setupFormValidation();
        this.setupFormSubmission();
        this.setupCustomSelects();
        this.setupFileUploads();
        this.setupDatePickers();
        this.setupRangeSliders();
        this.setupCharacterCounters();
    }
    
    setupFormValidation() {
        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Phone validation regex (国际号码)
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        
        // Custom validation rules
        const validationRules = {
            email: {
                validate: (value) => emailRegex.test(value),
                message: 'Please enter a valid email address'
            },
            phone: {
                validate: (value) => phoneRegex.test(value.replace(/[\s\-\(\)]/g, '')),
                message: 'Please enter a valid phone number'
            },
            required: {
                validate: (value) => value.trim().length > 0,
                message: 'This field is required'
            },
            minLength: (min) => ({
                validate: (value) => value.length >= min,
                message: `Minimum ${min} characters required`
            }),
            maxLength: (max) => ({
                validate: (value) => value.length <= max,
                message: `Maximum ${max} characters allowed`
            }),
            number: {
                validate: (value) => !isNaN(value) && !isNaN(parseFloat(value)),
                message: 'Please enter a valid number'
            },
            minValue: (min) => ({
                validate: (value) => parseFloat(value) >= min,
                message: `Minimum value is ${min}`
            }),
            maxValue: (max) => ({
                validate: (value) => parseFloat(value) <= max,
                message: `Maximum value is ${max}`
            })
        };
        
        // Apply validation to all forms
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => this.validateForm(e));
            
            // Real-time validation on blur
            form.querySelectorAll('input, textarea, select').forEach(field => {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => this.clearFieldError(field));
            });
        });
    }
    
    validateForm(event) {
        event.preventDefault();
        
        const form = event.target;
        const fields = form.querySelectorAll('[data-validate]');
        let isValid = true;
        
        // Clear previous errors
        this.clearFormErrors(form);
        
        // Validate each field
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        // Check required fields without data-validate attribute
        form.querySelectorAll('[required]').forEach(field => {
            if (!field.value.trim() && !field.hasAttribute('data-validate')) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            }
        });
        
        if (isValid) {
            this.submitForm(form);
        } else {
            // Scroll to first error
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        return isValid;
    }
    
    validateField(field) {
        const rules = field.getAttribute('data-validate');
        if (!rules) return true;
        
        const value = field.value.trim();
        const ruleList = rules.split('|');
        let isValid = true;
        
        for (const rule of ruleList) {
            const [ruleName, ruleParam] = rule.split(':');
            
            switch (ruleName) {
                case 'required':
                    if (!value) {
                        this.showFieldError(field, 'This field is required');
                        isValid = false;
                    }
                    break;
                    
                case 'email':
                    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        this.showFieldError(field, 'Please enter a valid email address');
                        isValid = false;
                    }
                    break;
                    
                case 'phone':
                    if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
                        this.showFieldError(field, 'Please enter a valid phone number');
                        isValid = false;
                    }
                    break;
                    
                case 'min':
                    if (value && parseFloat(value) < parseFloat(ruleParam)) {
                        this.showFieldError(field, `Minimum value is ${ruleParam}`);
                        isValid = false;
                    }
                    break;
                    
                case 'max':
                    if (value && parseFloat(value) > parseFloat(ruleParam)) {
                        this.showFieldError(field, `Maximum value is ${ruleParam}`);
                        isValid = false;
                    }
                    break;
                    
                case 'minlength':
                    if (value && value.length < parseInt(ruleParam)) {
                        this.showFieldError(field, `Minimum ${ruleParam} characters required`);
                        isValid = false;
                    }
                    break;
                    
                case 'maxlength':
                    if (value && value.length > parseInt(ruleParam)) {
                        this.showFieldError(field, `Maximum ${ruleParam} characters allowed`);
                        isValid = false;
                    }
                    break;
                    
                case 'numeric':
                    if (value && isNaN(value)) {
                        this.showFieldError(field, 'Please enter a valid number');
                        isValid = false;
                    }
                    break;
            }
        }
        
        if (isValid) {
            this.clearFieldError(field);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        // Remove existing error
        this.clearFieldError(field);
        
        // Add error class to field
        field.classList.add('error');
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#dc3545';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '5px';
        
        // Insert after field
        field.parentNode.insertBefore(errorElement, field.nextSibling);
        
        // Add event listener to remove error on input
        const clearError = () => this.clearFieldError(field);
        field.addEventListener('input', clearError, { once: true });
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    clearFormErrors(form) {
        form.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });
        
        form.querySelectorAll('.error-message').forEach(msg => {
            msg.remove();
        });
    }
    
    async submitForm(form) {
        // Disable submit button
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitButton.disabled = true;
        
        try {
            // Collect form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Add timestamp and page info
            data.timestamp = new Date().toISOString();
            data.pageUrl = window.location.href;
            data.userAgent = navigator.userAgent;
            
            // Simulate API call (replace with actual API endpoint)
            await this.sendToAPI(form.action || '/api/contact', data);
            
            // Show success message
            this.showSuccessMessage(form, 'Thank you! Your message has been sent successfully.');
            
            // Reset form
            form.reset();
            
            // Reset file inputs
            form.querySelectorAll('input[type="file"]').forEach(input => {
                input.value = '';
                const preview = input.parentNode.querySelector('.file-preview');
                if (preview) preview.remove();
            });
            
        } catch (error) {
            // Show error message
            this.showErrorMessage(form, 'Sorry, there was an error sending your message. Please try again.');
            console.error('Form submission error:', error);
            
        } finally {
            // Re-enable submit button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }
    
    async sendToAPI(url, data) {
        // This is a simulation - replace with actual API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    console.log('Form data submitted:', data);
                    
                    // In a real application, you would:
                    // 1. Send data to your backend
                    // 2. Send confirmation email
                    // 3. Log to database
                    // 4. Send notification to sales team
                    
                    resolve({ success: true });
                } else {
                    reject(new Error('Network error'));
                }
            }, 1500);
        });
    }
    
    showSuccessMessage(form, message) {
        // Remove existing messages
        const existingMsg = form.querySelector('.form-message');
        if (existingMsg) existingMsg.remove();
        
        // Create success message
        const successMsg = document.createElement('div');
        successMsg.className = 'form-message success';
        successMsg.innerHTML = `
            <div class="message-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        successMsg.style.backgroundColor = '#d4edda';
        successMsg.style.color = '#155724';
        successMsg.style.padding = '15px';
        successMsg.style.borderRadius = 'var(--border-radius)';
        successMsg.style.marginTop = '20px';
        successMsg.style.border = '1px solid #c3e6cb';
        
        // Insert before submit button or at the end of form
        const submitSection = form.querySelector('.form-submit') || form;
        submitSection.parentNode.insertBefore(successMsg, submitSection.nextSibling);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (successMsg.parentNode) {
                successMsg.style.opacity = '0';
                successMsg.style.transition = 'opacity 0.3s';
                setTimeout(() => successMsg.remove(), 300);
            }
        }, 5000);
    }
    
    showErrorMessage(form, message) {
        // Remove existing messages
        const existingMsg = form.querySelector('.form-message');
        if (existingMsg) existingMsg.remove();
        
        // Create error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'form-message error';
        errorMsg.innerHTML = `
            <div class="message-content">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        errorMsg.style.backgroundColor = '#f8d7da';
        errorMsg.style.color = '#721c24';
        errorMsg.style.padding = '15px';
        errorMsg.style.borderRadius = 'var(--border-radius)';
        errorMsg.style.marginTop = '20px';
        errorMsg.style.border = '1px solid #f5c6cb';
        
        // Insert before submit button or at the end of form
        const submitSection = form.querySelector('.form-submit') || form;
        submitSection.parentNode.insertBefore(errorMsg, submitSection.nextSibling);
    }
    
    setupCustomSelects() {
        // Enhance native select elements
        document.querySelectorAll('select').forEach(select => {
            // Add custom styling
            select.style.cssText = `
                appearance: none;
                background: white url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e") no-repeat right 15px center;
                background-size: 16px;
                padding-right: 40px;
            `;
            
            // Add change event for visual feedback
            select.addEventListener('change', function() {
                if (this.value) {
                    this.classList.add('has-value');
                } else {
                    this.classList.remove('has-value');
                }
            });
            
            // Trigger initial state
            if (select.value) {
                select.classList.add('has-value');
            }
        });
    }
    
    setupFileUploads() {
        document.querySelectorAll('input[type="file"]').forEach(input => {
            // Create custom file upload button
            const wrapper = document.createElement('div');
            wrapper.className = 'file-upload-wrapper';
            wrapper.style.position = 'relative';
            
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'file-upload-button';
            button.innerHTML = '<i class="fas fa-upload"></i> Choose File';
            button.style.cssText = `
                background: var(--gray-light);
                border: 1px solid var(--gray);
                padding: 8px 15px;
                border-radius: var(--border-radius);
                cursor: pointer;
                font-size: 0.9rem;
                margin-right: 10px;
            `;
            
            const fileName = document.createElement('span');
            fileName.className = 'file-name';
            fileName.style.fontSize = '0.9rem';
            fileName.style.color = 'var(--text-light)';
            
            // Wrap the input
            input.style.opacity = '0';
            input.style.position = 'absolute';
            input.style.width = '100%';
            input.style.height = '100%';
            input.style.top = '0';
            input.style.left = '0';
            input.style.cursor = 'pointer';
            
            wrapper.appendChild(button);
            wrapper.appendChild(fileName);
            wrapper.appendChild(input);
            
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);
            
            // Update file name display
            input.addEventListener('change', function() {
                if (this.files.length > 0) {
                    if (this.files.length === 1) {
                        fileName.textContent = this.files[0].name;
                    } else {
                        fileName.textContent = `${this.files.length} files selected`;
                    }
                    button.innerHTML = '<i class="fas fa-sync"></i> Change';
                } else {
                    fileName.textContent = '';
                    button.innerHTML = '<i class="fas fa-upload"></i> Choose File';
                }
            });
            
            // Add drag and drop support
            wrapper.addEventListener('dragover', (e) => {
                e.preventDefault();
                wrapper.style.backgroundColor = 'rgba(51, 153, 153, 0.1)';
                wrapper.style.borderColor = 'var(--primary-color)';
            });
            
            wrapper.addEventListener('dragleave', () => {
                wrapper.style.backgroundColor = '';
                wrapper.style.borderColor = '';
            });
            
            wrapper.addEventListener('drop', (e) => {
                e.preventDefault();
                wrapper.style.backgroundColor = '';
                wrapper.style.borderColor = '';
                
                if (e.dataTransfer.files.length) {
                    input.files = e.dataTransfer.files;
                    input.dispatchEvent(new Event('change'));
                }
            });
        });
    }
    
    setupDatePickers() {
        // Set min date to today for delivery date fields
        const today = new Date().toISOString().split('T')[0];
        document.querySelectorAll('input[type="date"]').forEach(dateInput => {
            if (dateInput.id.includes('delivery') || dateInput.id.includes('date')) {
                dateInput.min = today;
                
                // Set placeholder to today + 30 days
                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + 30);
                const placeholderDate = futureDate.toISOString().split('T')[0];
                dateInput.placeholder = placeholderDate;
            }
        });
    }
    
    setupRangeSliders() {
        document.querySelectorAll('input[type="range"]').forEach(slider => {
            const output = document.createElement('div');
            output.className = 'range-output';
            output.style.marginTop = '5px';
            output.style.fontSize = '0.9rem';
            output.style.color = 'var(--text-light)';
            
            slider.parentNode.appendChild(output);
            
            const updateOutput = () => {
                const value = slider.value;
                const min = slider.min || 0;
                const max = slider.max || 100;
                const percentage = ((value - min) / (max - min)) * 100;
                
                output.textContent = `${value}%`;
                
                // Update slider background
                slider.style.background = `
                    linear-gradient(to right, 
                        var(--primary-color) 0%, 
                        var(--primary-color) ${percentage}%, 
                        var(--gray-light) ${percentage}%, 
                        var(--gray-light) 100%
                    )
                `;
            };
            
            slider.addEventListener('input', updateOutput);
            updateOutput(); // Initial update
        });
    }
    
    setupCharacterCounters() {
        document.querySelectorAll('textarea[maxlength]').forEach(textarea => {
            const maxLength = textarea.getAttribute('maxlength');
            const counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.style.fontSize = '0.8rem';
            counter.style.color = 'var(--text-lighter)';
            counter.style.textAlign = 'right';
            counter.style.marginTop = '5px';
            
            textarea.parentNode.appendChild(counter);
            
            const updateCounter = () => {
                const currentLength = textarea.value.length;
                counter.textContent = `${currentLength}/${maxLength} characters`;
                
                if (currentLength > maxLength * 0.9) {
                    counter.style.color = '#dc3545';
                } else if (currentLength > maxLength * 0.75) {
                    counter.style.color = '#ffc107';
                } else {
                    counter.style.color = 'var(--text-lighter)';
                }
            };
            
            textarea.addEventListener('input', updateCounter);
            updateCounter(); // Initial update
        });
    }
    
    // Utility function to serialize form data
    serializeForm(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                if (!Array.isArray(data[key])) {
                    data[key] = [data[key]];
                }
                data[key].push(value);
            } else {
                data[key] = value;
            }
        }
        
        return data;
    }
    
    // Utility function to reset form
    resetForm(form) {
        form.reset();
        
        // Clear custom file inputs
        form.querySelectorAll('.file-upload-wrapper .file-name').forEach(el => {
            el.textContent = '';
        });
        
        // Reset range sliders
        form.querySelectorAll('input[type="range"]').forEach(slider => {
            slider.dispatchEvent(new Event('input'));
        });
        
        // Reset character counters
        form.querySelectorAll('textarea[maxlength]').forEach(textarea => {
            const counter = textarea.parentNode.querySelector('.char-counter');
            if (counter) {
                const maxLength = textarea.getAttribute('maxlength');
                counter.textContent = `0/${maxLength} characters`;
                counter.style.color = 'var(--text-lighter)';
            }
        });
        
        // Clear validation errors
        this.clearFormErrors(form);
    }
}

// Initialize form handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.formHandler = new FormHandler();
    
    // Add form-specific styles
    const style = document.createElement('style');
    style.textContent = `
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: var(--text-dark);
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid var(--gray);
            border-radius: var(--border-radius);
            font-family: inherit;
            font-size: 1rem;
            transition: border-color 0.3s;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(51, 153, 153, 0.1);
        }
        
        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
            border-color: #dc3545;
        }
        
        .form-group input.error:focus,
        .form-group select.error:focus,
        .form-group textarea.error:focus {
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
        }
        
        .error-message {
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 5px;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        
        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
            }
        }
        
        .form-hint {
            display: block;
            margin-top: 5px;
            font-size: 0.875rem;
            color: var(--text-lighter);
        }
        
        .form-submit {
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--gray-light);
        }
        
        .btn-block {
            display: block;
            width: 100%;
        }
        
        .btn-large {
            padding: 15px 40px;
            font-size: 1.1rem;
        }
        
        .terms-agreement {
            margin-bottom: 1.5rem;
        }
        
        .terms-agreement input[type="checkbox"] {
            margin-right: 10px;
        }
        
        .form-note {
            margin-top: 1rem;
            font-size: 0.9rem;
            color: var(--text-light);
            text-align: center;
        }
        
        .file-preview {
            display: flex;
            align-items: center;
            margin-top: 10px;
            padding: 8px 12px;
            background: var(--gray-light);
            border-radius: var(--border-radius);
            font-size: 0.9rem;
        }
        
        .file-preview i {
            margin-right: 8px;
            color: var(--primary-color);
        }
        
        .remove-file {
            margin-left: auto;
            background: none;
            border: none;
            color: var(--text-lighter);
            cursor: pointer;
            padding: 0 5px;
        }
        
        .remove-file:hover {
            color: #dc3545;
        }
    `;
    
    document.head.appendChild(style);
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FormHandler };
}