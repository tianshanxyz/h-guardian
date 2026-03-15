# 网易企业邮箱 550 5.8.1 错误修复

## 错误信息
```
550 5.8.1 Local user only
```

## 问题原因
网易企业邮箱强制要求发件人地址必须是邮箱账户本身（info@h-guardian.com），不能使用其他地址或变量。

---

## 解决方案

### 步骤 1: 检查 EmailJS 模板 Settings

访问：https://dashboard.emailjs.com/admin/templates

编辑 `template_rfge4zj`，在 **Settings** 标签：

**❌ 错误配置（可能导致问题）：**
```
From email: {{from_email}}  ← 这样会变化
```

**✅ 正确配置：**
```
To email: info@h-guardian.com
From email: info@h-guardian.com  ← 必须固定为这个！
From name: H-Guardian Website
Reply-to: {{from_email}}  ← 回复地址用变量
Subject: [H-Guardian Website] {{subject}}
```

**关键点**：
- `From email` 必须固定为 `info@h-guardian.com`
- `Reply-to` 设置为 `{{from_email}}`，这样回复会发给客户

---

### 步骤 2: 检查 form-handler.js

确保代码中没有传递 `to_email` 参数覆盖模板设置。

访问：https://github.com/tianshanxyz/h-guardian/blob/main/js/form-handler.js

找到 `sendEmailWithEmailJS` 函数，确认：

```javascript
const templateParams = {
    from_name: formData['inquiry-name'] || formData['quote-name'] || 'Website Visitor',
    from_email: formData['inquiry-email'] || formData['quote-email'] || '',
    reply_to: formData['inquiry-email'] || formData['quote-email'] || '',  // 这个是对的
    company: formData['inquiry-company'] || formData['quote-company'] || 'Not provided',
    subject: formData['inquiry-subject'] || 'Website Inquiry',
    message: formData['inquiry-message'] || formData['quote-message'] || '',
    phone: formData['inquiry-phone'] || formData['quote-phone'] || 'Not provided',
    country: formData['inquiry-country'] || formData['quote-country'] || 'Not provided',
    page_url: formData.page_url,
    submission_time: formData.submission_time
};
```

**不要包含** `to_email` 参数，因为模板中已经固定了。

---

### 步骤 3: 更新 GitHub 代码（如果需要）

如果代码还没有推送到 GitHub，请更新：

1. 访问：https://github.com/tianshanxyz/h-guardian/blob/main/js/form-handler.js
2. 点击右上角铅笔图标
3. 按 Cmd+F 搜索 `serviceId`
4. 确认是：`service_x9ahpml`
5. 如果没有更新，修改为：`service_x9ahpml`
6. 提交保存

---

## 完整的 EmailJS 配置

### Service 配置（已完成）✅
```
Service ID: service_x9ahpml
Type: SMTP Server
SMTP Host: smtp.qiye.163.com
SMTP Port: 587
Username: info@h-guardian.com
Password: [授权码]
Use SSL/TLS: ✗ 不勾选
```

### Template Settings 配置（需要检查）⚠️
```
To email: info@h-guardian.com
From email: info@h-guardian.com  ← 必须固定！
From name: H-Guardian Website Contact Form
Reply-to: {{from_email}}  ← 回复地址用变量
Subject: [H-Guardian Website] {{subject}}
```

### Template Content 配置
确保包含所有必要的变量：
```html
<div class="field">
    <div class="label">👤 From:</div>
    <div>{{from_name}}</div>
</div>

<div class="field">
    <div class="label">📧 Email:</div>
    <div>{{from_email}}</div>
</div>

<div class="field">
    <div class="label">🏢 Company:</div>
    <div>{{company}}</div>
</div>

<div class="field">
    <div class="label">📱 Phone:</div>
    <div>{{phone}}</div>
</div>

<div class="field">
    <div class="label">🌍 Country:</div>
    <div>{{country}}</div>
</div>

<div class="field">
    <div class="label">📋 Subject:</div>
    <div>{{subject}}</div>
</div>

<div class="field">
    <div class="label">💬 Message:</div>
    <div class="message">{{message}}</div>
</div>
```

---

## 立即执行

### 1. 检查并修改 EmailJS 模板 Settings

1. 访问：https://dashboard.emailjs.com/admin/templates
2. 编辑 `template_rfge4zj`
3. 在 **Settings** 标签
4. 确保 **From email** 是固定的 `info@h-guardian.com`
5. 保存

### 2. 在 EmailJS 中测试

1. 点击 **Send Test**
2. 填写测试数据
3. 检查是否成功

### 3. 检查 GitHub 代码

1. 访问：https://github.com/tianshanxyz/h-guardian/blob/main/js/form-handler.js
2. 确认 `serviceId` 是 `service_x9ahpml`
3. 如果不是，更新并保存

### 4. 等待部署

1. 访问：https://dash.cloudflare.com/
2. Workers & Pages → h-guardian → Deployments
3. 等待 1-2 分钟

### 5. 测试网站表单

1. 清除缓存：Cmd+Shift+R
2. 访问：https://www.h-guardian.com/contact.html
3. 提交表单
4. 检查 Console 和邮箱

---

## 常见问题

### Q: 为什么 From email 不能用变量？

A: 网易企业邮箱（以及大多数 SMTP 服务）为了防止垃圾邮件和钓鱼邮件，强制要求发件人地址必须是认证的用户账户。

### Q: Reply-to 是什么作用？

A: Reply-to 指定了当您点击"回复"按钮时，邮件会发送到哪个地址。设置为客户的邮箱，这样您回复时就直接发给客户了。

### Q: 邮件会显示谁发的？

A: 邮件会显示：
- **发件人名称**：H-Guardian Website Contact Form
- **发件人邮箱**：info@h-guardian.com
- **回复地址**：客户的邮箱（from_email）

---

## 需要帮助？

请告诉我：
1. EmailJS 模板 Settings 中 From email 是什么？
2. Send Test 是否成功？
3. GitHub 代码中的 serviceId 是否是 service_x9ahpml？
