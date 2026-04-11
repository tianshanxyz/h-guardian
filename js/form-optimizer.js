// 表单优化器 - 多步骤表单和智能字段处理
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

    // 多步骤表单设置
    setupMultiStepForms() {
        const multiStepForms = document.querySelectorAll('.multi-step-form');
        
        multiStepForms.forEach(form => {
            this.createProgressBar(form);
            this.setupStepNavigation(form);
            this.setupStepValidation(form);
        });
    }

    // 创建进度条
    createProgressBar(form) {
        const progressHTML = `
            <div class="form-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 33.33%"></div>
                </div>
                <div class="progress-steps">
                    <span class="step active" data-step="1">基本信息</span>
                    <span class="step" data-step="2">需求详情</span>
                    <span class="step" data-step="3">完成提交</span>
                </div>
            </div>
        `;
        
        form.insertAdjacentHTML('afterbegin', progressHTML);
    }

    // 步骤导航设置
    setupStepNavigation(form) {
        const steps = form.querySelectorAll('.step-content');
        const nextBtns = form.querySelectorAll('.next-step');
        const prevBtns = form.querySelectorAll('.prev-step');

        // 下一步按钮
        nextBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.validateCurrentStep(form)) {
                    this.goToNextStep(form);
                }
            });
        });

        // 上一步按钮
        prevBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToPrevStep(form);
            });
        });
    }

    // 智能字段设置
    setupSmartFields() {
        // 邮箱自动识别公司类型
        this.setupEmailDomainDetection();
        
        // 国家选择智能显示认证要求
        this.setupCountryBasedCertifications();
        
        // 自动填充地理位置
        this.setupGeoLocation();
    }

    // 邮箱域名检测
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

    // 检测公司类型
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

    // 基于国家显示认证要求
    setupCountryBasedCertifications() {
        const countrySelects = document.querySelectorAll('select[name="country"]');
        
        countrySelects.forEach(select => {
            select.addEventListener('change', () => {
                this.showRelevantCertifications(select.value);
            });
        });
    }

    // 显示相关认证
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
                <h4>推荐认证: ${certs[country].join(', ')}</h4>
                <p>基于您选择的国家，我们建议关注以下认证要求</p>
            `;
            certificationSection.style.display = 'block';
        }
    }

    // 实时验证设置
    setupRealTimeValidation() {
        const inputs = document.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    // 字段验证
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name') || field.id;
        
        // 清除之前的错误
        this.clearFieldError(field);
        
        // 必填字段验证
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, '此字段为必填项');
            return false;
        }
        
        // 邮箱验证
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(field, '请输入有效的邮箱地址');
            return false;
        }
        
        // 电话验证
        if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            this.showFieldError(field, '请输入有效的电话号码');
            return false;
        }
        
        return true;
    }

    // 显示字段错误
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

    // 清除字段错误
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // 验证当前步骤
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

    // 转到下一步
    goToNextStep(form) {
        const currentStep = form.querySelector('.step-content.active');
        const nextStep = currentStep.nextElementSibling;
        
        if (nextStep && nextStep.classList.contains('step-content')) {
            currentStep.classList.remove('active');
            nextStep.classList.add('active');
            this.updateProgressBar(form, nextStep.dataset.step);
        }
    }

    // 转到上一步
    goToPrevStep(form) {
        const currentStep = form.querySelector('.step-content.active');
        const prevStep = currentStep.previousElementSibling;
        
        if (prevStep && prevStep.classList.contains('step-content')) {
            currentStep.classList.remove('active');
            prevStep.classList.add('active');
            this.updateProgressBar(form, prevStep.dataset.step);
        }
    }

    // 更新进度条
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

    // 工具函数
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    isValidPhone(phone) {
        return /^[\+\d\s\-\(\)]{10,}$/.test(phone);
    }

    // 自动填充地理位置
    setupGeoLocation() {
        if ('geolocation' in navigator) {
            const countryFields = document.querySelectorAll('select[name="country"]');
            
            if (countryFields.length > 0) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.getCountryFromCoordinates(position.coords.latitude, position.coords.longitude);
                    },
                    (error) => {
                        console.log('地理位置获取失败:', error);
                    }
                );
            }
        }
    }

    // 从坐标获取国家
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
            console.log('国家信息获取失败:', error);
        }
    }
}

// 初始化表单优化器
document.addEventListener('DOMContentLoaded', () => {
    new FormOptimizer();
});