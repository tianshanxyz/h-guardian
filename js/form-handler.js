/**
 * Form Handler - H-Guardian Website
 * Unified form handling with validation, UI enhancements, and EmailJS integration
 * 
 * EmailJS Configuration:
 * - Public Key: 1_y80J3lBqJfYafV7
 * - Service ID: service_x9ahpml (163 Enterprise Email SMTP)
 * - Template ID: template_rfge4zj
 */

class FormHandler {
    constructor() {
        this.forms = [];
        
        // EmailJS Configuration
        this.EMAILJS_CONFIG = {
            publicKey: '1_y80J3lBqJfYafV7',
            serviceId: 'service_x9ahpml',  // 网易企业邮箱 SMTP 服务
            templateId: 'template_rfge4zj',
            toEmail: 'info@h-guardian.com',
            enabled: true
        };
        
        this.init();
    }
    
    init() {
        this.initEmailJS();
        this.setupFormValidation();
        this.setupFormSubmission();
        this.setupCustomSelects();
        this.setupFileUploads();
        this.setupDatePickers();
        this.setupRangeSliders();
        this.setupCharacterCounters();
    }
    
    // ========== EmailJS Initialization ==========
    initEmailJS() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.EMAILJS_CONFIG.publicKey);
            console.log('✅ EmailJS initialized successfully');
            this.emailjsInitialized = true;
        } else {
            console.error('❌ EmailJS SDK not loaded. Please check the script tag.');
            this.emailjsInitialized = false;
        }
    }
    
    // ========== Validation System ==========
    setupFormValidation() {
        // Validation rules are used by validateFormLegacy in handleFormSubmit
        // No need to add submit event listeners here as they're added in setupFormSubmission
    }
    
    // ========== Form Submission ==========
    setupFormSubmission() {
        document.querySelectorAll('form').forEach(form => {
            if (!form.id) return;
            
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleFormSubmit(e);
            });
        });
    }
    
    async handleFormSubmit(event) {
        console.log('📝 Form submission started');
        
        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
        
        const errors = this.validateFormLegacy(form);
        if (errors.length > 0) {
            console.error('Validation errors:', errors);
            this.showMessage(form, 'error', errors.join('. '));
            return;
        }
        
        const formData = this.collectFormData(form);
        console.log('Form data collected:', formData);
        
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
        }
        this.showMessage(form, 'loading', 'Sending your message...');
        
        try {
            if (this.emailjsInitialized && typeof emailjs !== 'undefined') {
                console.log('Using EmailJS for sending');
                const result = await this.sendEmailWithEmailJS(formData);
                
                if (result.success && result.status === 200) {
                    this.showMessage(form, 'success', 'Thank you! Your message has been sent successfully. We will contact you within 24 hours.');
                    
                    form.reset();
                    
                    console.log('✅ Form submitted successfully:', {
                        formId: form.id,
                        timestamp: formData.submission_time,
                        page: formData.page_url,
                        email: formData['inquiry-email'] || formData['quote-email']
                    });
                }
            } else {
                throw new Error('EmailJS not initialized');
            }
            
        } catch (error) {
            console.error('❌ Form submission error:', error);
            
            let errorMessage = 'Sorry, there was an error sending your message.';
            
            if (error.status === 422) {
                errorMessage = 'Email configuration error. Please check EmailJS template settings. ';
                if (error.text) {
                    errorMessage += `Details: ${error.text}`;
                }
                errorMessage += ' Contact: info@h-guardian.com';
            } else if (error.status === 401) {
                errorMessage = 'EmailJS authentication error. Please check Public Key and Service ID. Contact: info@h-guardian.com';
            } else if (error.status === 404) {
                errorMessage = 'EmailJS template not found. Please check Template ID. Contact: info@h-guardian.com';
            } else {
                if (error.text) {
                    errorMessage += ` Error: ${error.text}`;
                }
                errorMessage += ' Please try again or contact us directly at info@h-guardian.com';
            }
            
            this.showMessage(form, 'error', errorMessage);
        } finally {
            if (submitBtn) {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        }
    }
    
    validateFormLegacy(form) {
        const errors = [];
        const requiredInputs = form.querySelectorAll('[required]');
        
        requiredInputs.forEach(input => {
            if (!input.value || !input.value.trim()) {
                const label = form.querySelector(`label[for="${input.id}"]`);
                const fieldName = label ? label.textContent.replace('*', '').replace('required', '').trim() : input.id;
                errors.push(`${fieldName} is required`);
            }
        });
        
        // Validate email format if email field exists and has value
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                errors.push('Please enter a valid email address');
            }
        }
        
        return errors;
    }
    
    collectFormData(form) {
        const formData = {};
        const inputs = form.querySelectorAll('input, textarea, select');
        
        // Helper function to set field value with priority
        const setField = (fieldNames, value) => {
            if (!value || !value.trim()) return;
            // Use the first field name as primary
            const primaryField = Array.isArray(fieldNames) ? fieldNames[0] : fieldNames;
            if (!formData[primaryField]) {
                formData[primaryField] = value.trim();
            }
        };
        
        inputs.forEach(input => {
            if (!input.value || !input.value.trim()) return;
            
            const value = input.value.trim();
            const id = input.id;
            
            // Map different field IDs to standardized names
            switch(id) {
                // Name fields
                case 'inquiry-name':
                case 'contact-person':
                case 'name':
                    setField('inquiry-name', value);
                    break;
                    
                // Email fields
                case 'inquiry-email':
                case 'email':
                case 'quote-email':
                    setField('inquiry-email', value);
                    break;
                    
                // Company fields
                case 'inquiry-company':
                case 'company-name':
                case 'company':
                    setField('inquiry-company', value);
                    break;
                    
                // Phone fields
                case 'inquiry-phone':
                case 'phone':
                case 'quote-phone':
                    setField('inquiry-phone', value);
                    break;
                    
                // Country fields
                case 'inquiry-country':
                case 'country':
                case 'quote-country':
                    setField('inquiry-country', value);
                    break;
                    
                // Subject/Inquiry type
                case 'inquiry-subject':
                case 'product-type':
                case 'product-interest':
                    setField('inquiry-subject', value);
                    break;
                    
                // Message fields
                case 'inquiry-message':
                case 'customization-details':
                case 'message':
                case 'quote-message':
                    setField('inquiry-message', value);
                    break;
                    
                // Quantity fields
                case 'order-quantity':
                case 'quantity':
                    setField('order-quantity', value);
                    break;
                    
                // Sample fields
                case 'sample-needed':
                    setField('sample-needed', value);
                    break;
                    
                // Additional notes
                case 'additional-notes':
                    setField('additional-notes', value);
                    break;
                    
                // Default: use the field ID as-is
                default:
                    if (id) {
                        formData[id] = value;
                    }
                    break;
            }
        });
        
        // Add metadata
        formData.page_url = window.location.href;
        formData.page_title = document.title;
        formData.submission_time = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Shanghai',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        formData.user_agent = navigator.userAgent;
        formData.language = navigator.language;
        
        return formData;
    }
    
    async sendEmailWithEmailJS(formData) {
        console.log('📧 Sending email via EmailJS...');
        console.log('Config:', {
            serviceId: this.EMAILJS_CONFIG.serviceId,
            templateId: this.EMAILJS_CONFIG.templateId,
            toEmail: this.EMAILJS_CONFIG.toEmail
        });
        
        const templateParams = {
            from_name: formData['inquiry-name'] || 'Website Visitor',
            from_email: formData['inquiry-email'] || '',
            reply_to: formData['inquiry-email'] || '',
            company: formData['inquiry-company'] || 'Not provided',
            subject: formData['inquiry-subject'] || 'Website Inquiry',
            message: formData['inquiry-message'] || '',
            phone: formData['inquiry-phone'] || 'Not provided',
            country: formData['inquiry-country'] || 'Not provided',
            product_interest: formData['inquiry-subject'] || 'Not specified',
            order_quantity: formData['order-quantity'] || 'Not specified',
            sample_needed: formData['sample-needed'] || 'Not specified',
            additional_notes: formData['additional-notes'] || 'Not specified',
            customization_details: formData['inquiry-message'] || 'Not provided',
            page_url: formData.page_url,
            page_title: formData.page_title,
            submission_time: formData.submission_time,
            user_agent: formData.user_agent,
            language: formData.language
        };
        
        console.log('Template params:', templateParams);
        
        try {
            const response = await emailjs.send(
                this.EMAILJS_CONFIG.serviceId,
                this.EMAILJS_CONFIG.templateId,
                templateParams
            );
            
            console.log('✅ Email sent successfully:', response);
            return { success: true, response, status: 200 };
        } catch (error) {
            console.error('❌ EmailJS send error:', error);
            console.error('Error details:', {
                status: error.status,
                text: error.text,
                message: error.message
            });
            throw error;
        }
    }
    
    showMessage(form, type, message) {
        let msgDiv = form.querySelector('.form-message');
        
        if (!msgDiv) {
            msgDiv = document.createElement('div');
            msgDiv.className = 'form-message';
            msgDiv.style.cssText = `
                padding: 15px 20px;
                margin: 20px 0;
                border-radius: 8px;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 10px;
            `;
            
            const submitSection = form.querySelector('.form-submit') || form.querySelector('button[type="submit"]');
            if (submitSection) {
                form.insertBefore(msgDiv, submitSection);
            } else {
                form.appendChild(msgDiv);
            }
        }
        
        if (type === 'success') {
            msgDiv.style.cssText += `
                background: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            `;
            msgDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        } else if (type === 'error') {
            msgDiv.style.cssText += `
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            `;
            msgDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        } else if (type === 'loading') {
            msgDiv.style.cssText += `
                background: #cce5ff;
                color: #004085;
                border: 1px solid #b8daff;
            `;
            msgDiv.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${message}`;
        }
        
        msgDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        return msgDiv;
    }
    
    // ========== UI Enhancements ==========
    setupCustomSelects() {
        document.querySelectorAll('select').forEach(select => {
            select.style.cssText = `
                appearance: none;
                background: white url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e") no-repeat right 15px center;
                background-size: 16px;
                padding-right: 40px;
            `;
            
            select.addEventListener('change', function() {
                if (this.value) {
                    this.classList.add('has-value');
                } else {
                    this.classList.remove('has-value');
                }
            });
            
            if (select.value) {
                select.classList.add('has-value');
            }
        });
    }
    
    setupFileUploads() {
        document.querySelectorAll('input[type="file"]').forEach(input => {
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
        const today = new Date().toISOString().split('T')[0];
        document.querySelectorAll('input[type="date"]').forEach(dateInput => {
            if (dateInput.id.includes('delivery') || dateInput.id.includes('date')) {
                dateInput.min = today;
                
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
            updateOutput();
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
            updateCounter();
        });
    }
    
    // ========== Utility Functions ==========
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
    
    resetForm(form) {
        form.reset();
        
        form.querySelectorAll('.file-upload-wrapper .file-name').forEach(el => {
            el.textContent = '';
        });
        
        form.querySelectorAll('input[type="range"]').forEach(slider => {
            slider.dispatchEvent(new Event('input'));
        });
        
        form.querySelectorAll('textarea[maxlength]').forEach(textarea => {
            const counter = textarea.parentNode.querySelector('.char-counter');
            if (counter) {
                const maxLength = textarea.getAttribute('maxlength');
                counter.textContent = `0/${maxLength} characters`;
                counter.style.color = 'var(--text-lighter)';
            }
        });
        
        this.clearFormErrors(form);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.formHandler = new FormHandler();
    
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

// Debug utilities
window.HGuardianForms = {
    testEmailJS: function() {
        console.log('Testing EmailJS connection...');
        if (typeof emailjs === 'undefined') {
            console.error('❌ EmailJS SDK not loaded');
            return false;
        }
        console.log('✅ EmailJS SDK loaded');
        console.log('Config:', window.formHandler.EMAILJS_CONFIG);
        return true;
    },
    getStatus: function() {
        return {
            emailjsLoaded: typeof emailjs !== 'undefined',
            emailjsInitialized: window.formHandler?.emailjsInitialized,
            formsCount: document.querySelectorAll('form[id]').length
        };
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FormHandler };
}
