# EmailJS 配置优化指南

## 问题 1: 隐藏发件人隐私信息 ✅

### 当前问题
收件箱显示发件人是 `joyma01@icloud.com`，这是您的私人邮箱。

### 解决方案

#### 方法 A: 修改发件人名称（推荐）

在 EmailJS 模板的 **Settings** 标签：

```
From name: H-Guardian Website
From email: noreply@h-guardian.com  ← 使用域名邮箱
Reply-to: {{from_email}}  ← 这样回复会发给客户
```

**说明**：
- `From name`: 显示为 "H-Guardian Website" 而不是个人邮箱
- `From email`: 使用 `noreply@h-guardian.com` 或 `website@h-guardian.com`
- `Reply-to`: 设置为 `{{from_email}}`，这样您回复时会直接发给客户

#### 方法 B: 使用域名邮箱（如果您有）

如果您有企业邮箱（如 `noreply@h-guardian.com`）：

1. 在 iCloud 中添加这个邮箱作为别名
2. 或者在 EmailJS 中使用其他 SMTP 服务（如 SendGrid、Mailgun）

---

## 问题 2: Subject 下拉选项未体现 ✅

### 当前问题
表单中的 Subject 是下拉选项，但邮件中没有显示选择的值。

### 解决方案

#### 步骤 1: 检查 HTML 表单

打开 `contact.html`，找到 Subject 字段，确保有 `name` 或 `id` 属性：

```html
<select id="inquiry-subject" name="inquiry-subject" required>
    <option value="">Select a subject</option>
    <option value="Product Inquiry">Product Inquiry</option>
    <option value="Customization Request">Customization Request</option>
    <option value="Order Status">Order Status</option>
    <option value="Other">Other</option>
</select>
```

#### 步骤 2: 更新 EmailJS 模板

在 EmailJS 模板的 **Email Content** 标签，添加：

```html
<div class="field">
    <div class="label">Subject:</div>
    <div>{{inquiry-subject}}</div>  ← 确保变量名与表单一致
</div>
```

#### 步骤 3: 更新 form-handler.js

确保收集了 `inquiry-subject` 字段：

```javascript
const templateParams = {
    from_name: formData['inquiry-name'] || formData['quote-name'] || 'Website Visitor',
    from_email: formData['inquiry-email'] || formData['quote-email'] || '',
    subject: formData['inquiry-subject'] || 'Website Inquiry',  ← 确保这行存在
    // ... 其他字段
};
```

---

## 问题 3: 收到的是 Auto-reply 而不是用户提交的内容 ✅

### 当前问题
收到的是预设的自动回复内容，而不是用户实际填写的表单数据。

### 原因
EmailJS 模板中使用了固定的内容，没有正确使用表单变量。

### 解决方案

#### 步骤 1: 修改 EmailJS 模板内容

在 EmailJS Dashboard → Email Templates → 编辑模板 → **Email Content** 标签

**使用以下完整模板**：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header { 
            background: #339999; 
            color: white; 
            padding: 20px;
            border-radius: 8px 8px 0 0;
        }
        .header h2 { margin: 0; }
        .content { 
            padding: 20px;
            background: #f9f9f9;
            border: 1px solid #ddd;
        }
        .field { 
            margin-bottom: 15px;
            background: white;
            padding: 10px;
            border-radius: 4px;
        }
        .label { 
            font-weight: bold; 
            color: #339999;
            font-size: 12px;
            text-transform: uppercase;
        }
        .value {
            margin-top: 5px;
            font-size: 14px;
        }
        .message {
            background: #fff;
            padding: 15px;
            border-left: 3px solid #339999;
            margin: 15px 0;
        }
        .footer { 
            background: #f4f4f4; 
            padding: 15px; 
            font-size: 12px;
            color: #666;
            border-radius: 0 0 8px 8px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>📬 New Website Inquiry</h2>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">You have received a new message from H-Guardian website</p>
    </div>
    
    <div class="content">
        <!-- Visitor Information -->
        <div class="field">
            <div class="label">👤 From</div>
            <div class="value">{{from_name}}</div>
        </div>
        
        <div class="field">
            <div class="label">📧 Email</div>
            <div class="value">{{from_email}}</div>
        </div>
        
        <div class="field">
            <div class="label">🏢 Company</div>
            <div class="value">{{company}}</div>
        </div>
        
        <div class="field">
            <div class="label">📱 Phone</div>
            <div class="value">{{phone}}</div>
        </div>
        
        <div class="field">
            <div class="label">🌍 Country</div>
            <div class="value">{{country}}</div>
        </div>
        
        <div class="field">
            <div class="label">📋 Subject</div>
            <div class="value">{{subject}}</div>
        </div>
        
        <!-- Message Content -->
        <div class="field">
            <div class="label">💬 Message</div>
            <div class="message">
                {{message}}
            </div>
        </div>
        
        <!-- Additional Information -->
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        
        <div class="field">
            <div class="label">🔗 Page URL</div>
            <div class="value"><a href="{{page_url}}">{{page_url}}</a></div>
        </div>
        
        <div class="field">
            <div class="label">⏰ Submitted at</div>
            <div class="value">{{submission_time}}</div>
        </div>
    </div>
    
    <div class="footer">
        <p><strong>Reply Instructions:</strong></p>
        <p>Click "Reply" in your email client to respond to this inquiry.</p>
        <p>The reply will be sent to: {{from_email}}</p>
        <p style="margin-top: 15px;">---<br>
        This is an automated message from H-Guardian website contact form.<br>
        © 2026 H-Guardian. All rights reserved.</p>
    </div>
</body>
</html>
```

#### 步骤 2: 检查模板变量

确保模板中使用的所有变量都在 form-handler.js 中传递：

打开 `js/form-handler.js`，找到 `sendEmailWithEmailJS` 函数，确保包含：

```javascript
const templateParams = {
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
```

#### 步骤 3: 修改 Settings 配置

在 EmailJS 模板的 **Settings** 标签：

```
To email: info@h-guardian.com
From email: noreply@h-guardian.com  ← 使用通用地址
From name: H-Guardian Website Contact Form
Reply-to: {{from_email}}  ← 关键！这样回复会发给客户
Subject: [H-Guardian Website] {{subject}}
```

---

## 完整配置检查清单

### EmailJS Template Settings ✅
- [ ] To email: `info@h-guardian.com`
- [ ] From email: `noreply@h-guardian.com` 或 `website@h-guardian.com`
- [ ] From name: `H-Guardian Website Contact Form`
- [ ] Reply-to: `{{from_email}}`
- [ ] Subject: `[H-Guardian Website] {{subject}}`

### EmailJS Template Content ✅
- [ ] 包含 `{{from_name}}`
- [ ] 包含 `{{from_email}}`
- [ ] 包含 `{{company}}`
- [ ] 包含 `{{phone}}`
- [ ] 包含 `{{country}}`
- [ ] 包含 `{{subject}}`
- [ ] 包含 `{{message}}`
- [ ] 包含 `{{page_url}}`
- [ ] 包含 `{{submission_time}}`

### form-handler.js ✅
- [ ] 收集 `inquiry-name`
- [ ] 收集 `inquiry-email`
- [ ] 收集 `inquiry-subject`
- [ ] 收集 `inquiry-message`
- [ ] 收集 `inquiry-company`
- [ ] 收集 `inquiry-phone`
- [ ] 收集 `inquiry-country`
- [ ] 传递 `reply_to` 参数

---

## 测试步骤

### 1. 在 EmailJS 中测试

1. 访问：https://dashboard.emailjs.com/admin/templates
2. 编辑模板
3. 点击 **Send Test**
4. 填写测试数据：
   ```
   from_name: John Doe
   from_email: john@example.com
   subject: Product Inquiry
   message: I want to know more about your products
   company: Test Company
   phone: +1 234 567 8900
   country: USA
   ```
5. 点击发送
6. 检查 info@h-guardian.com 邮箱

### 2. 在网站测试

1. 访问：https://www.h-guardian.com/contact.html
2. 填写真实表单
3. 提交
4. 检查 info@h-guardian.com 邮箱
5. 确认收到的是用户填写的内容，不是预设内容

---

## 预期效果

### 收到的邮件应该显示：

**发件人**: H-Guardian Website Contact Form <noreply@h-guardian.com>  
**收件人**: info@h-guardian.com  
**主题**: [H-Guardian Website] Product Inquiry  
**回复地址**: john@example.com（客户邮箱）

**邮件内容**:
- 👤 From: John Doe
- 📧 Email: john@example.com
- 🏢 Company: Test Company
- 📱 Phone: +1 234 567 8900
- 🌍 Country: USA
- 📋 Subject: Product Inquiry
- 💬 Message: I want to know more about your products
- 🔗 Page URL: https://www.h-guardian.com/contact.html
- ⏰ Submitted at: 2026-03-11 10:30:45

---

## 需要帮助？

完成配置后，请告诉我：
1. 邮件是否正常显示用户提交的内容？
2. 发件人是否显示为 "H-Guardian Website"？
3. 回复邮件时是否自动回复给客户？
