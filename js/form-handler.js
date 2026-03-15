/**
 * Form Handler - H-Guardian Website
 * Handles form submissions and sends emails to info@h-guardian.com
 */

(function() {
    'use strict';
    
    // EmailJS Configuration - 免费邮件服务
    // 注册步骤：
    // 1. 访问 https://www.emailjs.com/ 注册账号
    // 2. 创建 Email Service (Gmail)
    // 3. 创建 Email Template
    // 4. 获取 Public Key, Service ID, Template ID
    const EMAILJS_CONFIG = {
        publicKey: '1_y80J3lBqJfYafV7',
        serviceId: 'service_j0lhwp4',  // iCloud SMTP 服务
        templateId: 'template_rfge4zj',
        enabled: true
    };
    
    // Formspree Configuration - 备用免费表单服务
    // 注册步骤：
    // 1. 访问 https://formspree.io/ 注册账号
    // 2. 创建新表单获取 Form ID
    const FORMSPREE_CONFIG = {
        formId: 'YOUR_FORM_ID',  // 替换为您的 Formspree Form ID
        enabled: false  // 设置为 true 启用 Formspree
    };
    
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
            form.insertBefore(msgDiv, form.querySelector('.form-submit'));
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
        } else if (type === 'info') {
            msgDiv.style.cssText += `
                background: #cce5ff;
                color: #004085;
                border: 1px solid #b8daff;
            `;
            msgDiv.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
        }
        
        msgDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        return msgDiv;
    }
    
    // 发送邮件 - 使用 EmailJS
    async function sendEmailWithEmailJS(formData) {
        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS is not loaded');
        }
        
        const templateParams = {
            to_email: 'info@h-guardian.com',
            from_name: formData['inquiry-name'] || formData['quote-name'] || 'Website Visitor',
            from_email: formData['inquiry-email'] || formData['quote-email'] || '',
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
        
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams,
            EMAILJS_CONFIG.publicKey
        );
        
        return response;
    }
    
    // 发送邮件 - 使用 Formspree
    async function sendEmailWithFormspree(formData) {
        const formspreeEndpoint = `https://formspree.io/f/${FORMSPREE_CONFIG.formId}`;
        
        const response = await fetch(formspreeEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                ...formData,
                _replyto: formData['inquiry-email'] || formData['quote-email'],
                _subject: `[H-Guardian Website] ${formData['inquiry-subject'] || 'New Inquiry'}`
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to submit form');
        }
        
        return response.json();
    }
    
    // 发送邮件 - 使用 mailto (备用方案)
    function sendEmailWithMailto(formData) {
        const name = formData['inquiry-name'] || formData['quote-name'] || '';
        const email = formData['inquiry-email'] || formData['quote-email'] || '';
        const company = formData['inquiry-company'] || formData['quote-company'] || '';
        const subject = formData['inquiry-subject'] || 'Website Inquiry';
        const message = formData['inquiry-message'] || formData['quote-message'] || '';
        const phone = formData['inquiry-phone'] || formData['quote-phone'] || '';
        
        const mailtoBody = `
Name: ${name}
Email: ${email}
Company: ${company}
Phone: ${phone}
Page: ${formData.page_url}
Time: ${formData.submission_time}

Message:
${message}
        `.trim();
        
        const mailtoLink = `mailto:info@h-guardian.com?subject=${encodeURIComponent(`[Website Inquiry] ${subject}`)}&body=${encodeURIComponent(mailtoBody)}&reply-to=${encodeURIComponent(email)}`;
        
        window.location.href = mailtoLink;
        
        return { status: 'mailto_opened' };
    }
    
    // 主表单提交处理函数
    async function handleFormSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
        
        // 验证表单
        const errors = validateForm(form);
        if (errors.length > 0) {
            showMessage(form, 'error', errors.join('. '));
            return;
        }
        
        // 收集表单数据
        const formData = collectFormData(form);
        
        // 显示加载状态
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
        }
        
        try {
            let result;
            
            // 尝试使用 EmailJS
            if (EMAILJS_CONFIG.enabled && typeof emailjs !== 'undefined') {
                result = await sendEmailWithEmailJS(formData);
                console.log('Email sent via EmailJS:', result);
                showMessage(form, 'success', 'Thank you! Your message has been sent successfully. We will contact you within 24 hours.');
            }
            // 尝试使用 Formspree
            else if (FORMSPREE_CONFIG.enabled) {
                result = await sendEmailWithFormspree(formData);
                console.log('Email sent via Formspree:', result);
                showMessage(form, 'success', 'Thank you! Your message has been sent successfully. We will contact you within 24 hours.');
            }
            // 使用 mailto 作为备用
            else {
                result = sendEmailWithMailto(formData);
                console.log('Mailto opened');
                showMessage(form, 'info', 'Your email client has been opened. Please send the email to complete your inquiry.');
            }
            
            // 重置表单
            form.reset();
            
            // 记录提交
            console.log('Form submitted:', {
                formId: form.id,
                timestamp: formData.submission_time,
                page: formData.page_url,
                email: formData['inquiry-email'] || formData['quote-email']
            });
            
        } catch (error) {
            console.error('Form submission error:', error);
            
            // 尝试 mailto 作为最后的备用
            try {
                sendEmailWithMailto(formData);
                showMessage(form, 'info', 'There was an issue with automatic submission. Your email client has been opened as a backup.');
            } catch (mailtoError) {
                showMessage(form, 'error', 'Sorry, there was an error. Please email us directly at info@h-guardian.com');
            }
        } finally {
            if (submitBtn) {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        }
    }
    
    // 初始化所有表单
    function initForms() {
        const forms = document.querySelectorAll('form[id]');
        
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
        
        console.log(`Form handler initialized for ${forms.length} form(s)`);
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initForms);
    } else {
        initForms();
    }
    
    // 暴露配置以便修改
    window.HGuardianForms = {
        setEmailJS: function(publicKey, serviceId, templateId) {
            EMAILJS_CONFIG.publicKey = publicKey;
            EMAILJS_CONFIG.serviceId = serviceId;
            EMAILJS_CONFIG.templateId = templateId;
            EMAILJS_CONFIG.enabled = true;
            console.log('EmailJS configured');
        },
        setFormspree: function(formId) {
            FORMSPREE_CONFIG.formId = formId;
            FORMSPREE_CONFIG.enabled = true;
            console.log('Formspree configured');
        },
        testSubmit: function() {
            console.log('Testing form submission...');
            console.log('EmailJS enabled:', EMAILJS_CONFIG.enabled);
            console.log('Formspree enabled:', FORMSPREE_CONFIG.enabled);
        }
    };
})();
