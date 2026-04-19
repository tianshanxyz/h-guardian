/**
 * Form Handler - H-Guardian Website
 * Handles form submissions and sends emails to info@h-guardian.com
 * 
 * EmailJS Configuration:
 * - Public Key: 1_y80J3lBqJfYafV7
 * - Service ID: service_9zp6s9v
 * - Template ID: template_rfge4zj
 */

(function() {
    'use strict';
    
    // EmailJS Configuration
    const EMAILJS_CONFIG = {
        publicKey: '1_y80J3lBqJfYafV7',
        serviceId: 'service_9zp6s9v',
        templateId: 'template_rfge4zj',
        toEmail: 'info@h-guardian.com',  // 固定收件人邮箱
        enabled: true
    };
    
    // 初始化 EmailJS
    function initEmailJS() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAILJS_CONFIG.publicKey);
            console.log('✅ EmailJS initialized successfully');
            return true;
        } else {
            console.error('❌ EmailJS SDK not loaded. Please check the script tag.');
            return false;
        }
    }
    
    // 立即初始化
    const emailjsInitialized = initEmailJS();
    
    // 收集表单数据
    function collectFormData(form) {
        const formData = {};
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            const label = input.id || input.name;
            if (label && input.value) {
                formData[label] = input.value.trim();
            }
        });
        
        // 添加页面信息
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
        
        // 添加用户代理信息
        formData.user_agent = navigator.userAgent;
        formData.language = navigator.language;
        
        return formData;
    }
    
    // 验证邮箱格式
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // 验证表单
    function validateForm(form) {
        const errors = [];
        const emailInput = form.querySelector('input[type="email"]');
        const requiredInputs = form.querySelectorAll('[required]');
        
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                const label = form.querySelector(`label[for="${input.id}"]`);
                const fieldName = label ? label.textContent.replace('*', '').trim() : input.id;
                errors.push(`${fieldName} is required`);
            }
        });
        
        if (emailInput && emailInput.value && !validateEmail(emailInput.value)) {
            errors.push('Please enter a valid email address');
        }
        
        return errors;
    }
    
    // 显示消息
    function showMessage(form, type, message) {
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
    
    // 发送邮件 - 使用 EmailJS
    async function sendEmailWithEmailJS(formData) {
        console.log('📧 Sending email via EmailJS...');
        console.log('Config:', {
            serviceId: EMAILJS_CONFIG.serviceId,
            templateId: EMAILJS_CONFIG.templateId,
            toEmail: EMAILJS_CONFIG.toEmail
        });
        
        // 准备邮件参数
        const templateParams = {
            to_email: EMAILJS_CONFIG.toEmail,  // 添加收件人邮箱
            to_name: 'H-Guardian Team',  // 添加收件人名称
            from_name: formData['inquiry-name'] || formData['quote-name'] || 'Website Visitor',
            from_email: formData['inquiry-email'] || formData['quote-email'] || '',
            reply_to: formData['inquiry-email'] || formData['quote-email'] || '',
            company: formData['inquiry-company'] || formData['quote-company'] || 'Not provided',
            subject: formData['inquiry-subject'] || 'Website Inquiry',
            message: formData['inquiry-message'] || formData['quote-message'] || '',
            phone: formData['inquiry-phone'] || formData['quote-phone'] || 'Not provided',
            country: formData['inquiry-country'] || formData['quote-country'] || 'Not provided',
            product_interest: formData['product-interest'] || 'Not specified',
            page_url: formData.page_url,
            submission_time: formData.submission_time,
            user_agent: formData.user_agent
        };
        
        console.log('Template params:', templateParams);
        
        try {
            // 发送邮件 - 不使用第四个参数（publicKey 已初始化）
            const response = await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateId,
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
    
    // 主表单提交处理函数
    async function handleFormSubmit(event) {
        event.preventDefault();
        
        console.log('📝 Form submission started');
        
        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
        
        // 验证表单
        const errors = validateForm(form);
        if (errors.length > 0) {
            console.error('Validation errors:', errors);
            showMessage(form, 'error', errors.join('. '));
            return;
        }
        
        // 收集表单数据
        const formData = collectFormData(form);
        console.log('Form data collected:', formData);
        
        // 显示加载状态
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
        }
        showMessage(form, 'loading', 'Sending your message...');
        
        try {
            // 检查 EmailJS 是否可用
            if (emailjsInitialized && typeof emailjs !== 'undefined') {
                console.log('Using EmailJS for sending');
                const result = await sendEmailWithEmailJS(formData);
                
                if (result.success && result.status === 200) {
                    showMessage(form, 'success', 'Thank you! Your message has been sent successfully. We will contact you within 24 hours.');
                    
                    // 重置表单
                    form.reset();
                    
                    // 记录提交
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
            
            showMessage(form, 'error', errorMessage);
        } finally {
            // 恢复按钮状态
            if (submitBtn) {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        }
    }
    
    // 初始化所有表单
    function initForms() {
        const forms = document.querySelectorAll('form[id]');
        console.log(`Found ${forms.length} form(s) to initialize`);
        
        forms.forEach(form => {
            form.addEventListener('submit', handleFormSubmit);
            
            // 添加实时验证
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    if (this.hasAttribute('required') && !this.value.trim()) {
                        this.style.borderColor = '#dc3545';
                    } else if (this.type === 'email' && this.value && !validateEmail(this.value)) {
                        this.style.borderColor = '#dc3545';
                    } else {
                        this.style.borderColor = '#28a745';
                    }
                });
                
                input.addEventListener('focus', function() {
                    this.style.borderColor = '#339999';
                });
            });
        });
        
        console.log('✅ Form handler initialized');
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initForms);
    } else {
        initForms();
    }
    
    // 暴露配置以便调试
    window.HGuardianForms = {
        testEmailJS: function() {
            console.log('Testing EmailJS connection...');
            if (typeof emailjs === 'undefined') {
                console.error('❌ EmailJS SDK not loaded');
                return false;
            }
            console.log('✅ EmailJS SDK loaded');
            console.log('Config:', EMAILJS_CONFIG);
            return true;
        },
        getStatus: function() {
            return {
                emailjsLoaded: typeof emailjs !== 'undefined',
                emailjsInitialized: emailjsInitialized,
                formsCount: document.querySelectorAll('form[id]').length
            };
        }
    };
})();
