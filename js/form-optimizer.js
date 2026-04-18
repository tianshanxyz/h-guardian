// Form Optimizer - Multi-step forms and smart field handling
class FormOptimizer {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
        this.init();
    }

    init() {
        this.setupMultiStepForms();
        this.setupSmartFields();
        this.setupRealTimeValidation();
    }

    // Multi-step form setup
    setupMultiStepForms() {
        const multiStepForms = document.querySelectorAll('.multi-step-form');

        multiStepForms.forEach(form => {
            this.createProgressBar(form);
            this.setupStepNavigation(form);
            this.setupStepValidation(form);
        });
    }

    // Create progress bar
    createProgressBar(form) {
        const progressHTML = `
            <div class="form-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 33.33%"></div>
                </div>
                <div class="progress-steps">
                    <span class="step active" data-step="1">Basic Info</span>
                    <span class="step" data-step="2">Inquiry Details</span>
                    <span class="step" data-step="3">Review & Submit</span>
                </div>
            </div>
        `;

        form.insertAdjacentHTML('afterbegin', progressHTML);
    }

    // Step navigation setup
    setupStepNavigation(form) {
        const steps = form.querySelectorAll('.step-content');
        const nextBtns = form.querySelectorAll('.next-step');
        const prevBtns = form.querySelectorAll('.prev-step');

        // Next step buttons
        nextBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.validateCurrentStep(form)) {
                    this.goToNextStep(form);
                }
            });
        });

        // Previous step buttons
        prevBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToPrevStep(form);
            });
        });
    }

    // Smart field setup
    setupSmartFields() {
        // Auto-detect company type from email
        this.setupEmailDomainDetection();

        // Show certification requirements based on country
        this.setupCountryBasedCertifications();

        // Auto-fill geographic location
        this.setupGeoLocation();
    }

    // Email domain detection
    setupEmailDomainDetection() {
        const emailInputs = document.querySelectorAll('input[type="email"]');

        emailInputs.forEach(input => {
            input.addEventListener('blur', () => {
                const email = input.value.trim();
                if (email && this.isValidEmail(email)) {
                    const domain = email.split('@')[1];
                    this.detectCompanyType(domain, input);
                }
            });
        });
    }

    // Detect company type
    detectCompanyType(domain, input) {
        const hospitalDomains = ['hospital', 'clinic', 'medical', 'health'];
        const govDomains = ['gov', 'government', 'org'];

        const form = input.closest('form');
        const companyTypeField = form?.querySelector('#company-type');

        if (companyTypeField) {
            if (hospitalDomains.some(keyword => domain.includes(keyword))) {
                companyTypeField.value = 'hospital';
            } else if (govDomains.some(keyword => domain.includes(keyword))) {
                companyTypeField.value = 'government';
            }
        }
    }

    // Country-based certification requirements
    setupCountryBasedCertifications() {
        const countrySelects = document.querySelectorAll('select[name="country"]');

        countrySelects.forEach(select => {
            select.addEventListener('change', () => {
                this.showRelevantCertifications(select.value);
            });
        });
    }

    // Show relevant certifications
    showRelevantCertifications(country) {
        const certs = {
            'US': ['FDA', 'NIOSH', 'ASTM'],
            'EU': ['CE', 'EN14683', 'ISO13485'],
            'JP': ['PMDA', 'JIS'],
            'AU': ['TGA'],
            'CA': ['Health Canada']
        };

        const certificationSection = document.querySelector('.certification-requirements');
        if (certificationSection && certs[country]) {
            certificationSection.innerHTML = `
                <h4>Recommended Certifications: ${certs[country].join(', ')}</h4>
                <p>Based on your selected country, we recommend focusing on the following certification requirements</p>
            `;
            certificationSection.style.display = 'block';
        }
    }

    // Real-time validation setup
    setupRealTimeValidation() {
        const inputs = document.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    // Field validation
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name') || field.id;

        // Clear previous errors
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }

        // Email validation
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(field, 'Please enter a valid email address');
            return false;
        }

        // Phone validation
        if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            this.showFieldError(field, 'Please enter a valid phone number');
            return false;
        }

        return true;
    }

    // Show field error
    showFieldError(field, message) {
        field.classList.add('error');

        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }

        errorElement.textContent = message;
    }

    // Clear field error
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Validate current step
    validateCurrentStep(form) {
        const currentStep = form.querySelector('.step-content.active');
        const fields = currentStep.querySelectorAll('[required]');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Go to next step
    goToNextStep(form) {
        const currentStep = form.querySelector('.step-content.active');
        const nextStep = currentStep.nextElementSibling;

        if (nextStep && nextStep.classList.contains('step-content')) {
            currentStep.classList.remove('active');
            nextStep.classList.add('active');
            this.updateProgressBar(form, nextStep.dataset.step);
        }
    }

    // Go to previous step
    goToPrevStep(form) {
        const currentStep = form.querySelector('.step-content.active');
        const prevStep = currentStep.previousElementSibling;

        if (prevStep && prevStep.classList.contains('step-content')) {
            currentStep.classList.remove('active');
            prevStep.classList.add('active');
            this.updateProgressBar(form, prevStep.dataset.step);
        }
    }

    // Update progress bar
    updateProgressBar(form, stepNumber) {
        const progressFill = form.querySelector('.progress-fill');
        const progressSteps = form.querySelectorAll('.progress-steps .step');

        const progressPercentage = (stepNumber / this.totalSteps) * 100;
        progressFill.style.width = `${progressPercentage}%`;

        progressSteps.forEach((step, index) => {
            if (index + 1 <= stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    // Utility functions
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    isValidPhone(phone) {
        return /^[\+\d\s\-\(\)]{10,}$/.test(phone);
    }

    // Auto-fill geographic location
    setupGeoLocation() {
        if ('geolocation' in navigator) {
            const countryFields = document.querySelectorAll('select[name="country"]');

            if (countryFields.length > 0) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.getCountryFromCoordinates(position.coords.latitude, position.coords.longitude);
                    },
                    (error) => {
                        console.log('Geolocation acquisition failed:', error);
                    }
                );
            }
        }
    }

    // Get country from coordinates
    async getCountryFromCoordinates(lat, lng) {
        try {
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
            const data = await response.json();

            if (data.countryCode) {
                const countryFields = document.querySelectorAll('select[name="country"]');
                countryFields.forEach(field => {
                    const option = field.querySelector(`option[value="${data.countryCode}"]`);
                    if (option) {
                        field.value = data.countryCode;
                        this.showRelevantCertifications(data.countryCode);
                    }
                });
            }
        } catch (error) {
            console.log('Country information acquisition failed:', error);
        }
    }
}

// Initialize form optimizer
document.addEventListener('DOMContentLoaded', () => {
    new FormOptimizer();
});