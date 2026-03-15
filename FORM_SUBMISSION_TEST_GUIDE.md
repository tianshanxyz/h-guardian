# 表单提交测试指南

## 问题已修复 ✅

我已经修复了 form-handler.js 文件，添加了 EmailJS 初始化代码。

---

## 测试步骤

### 步骤 1: 清除浏览器缓存

由于文件已更新，需要清除缓存：

**Windows/Linux:**
- Ctrl + Shift + Delete
- 或者 Ctrl + F5 强制刷新

**Mac:**
- Cmd + Shift + R 强制刷新

### 步骤 2: 打开开发者工具

1. 按 **F12** 打开开发者工具
2. 切换到 **Console** 标签

### 步骤 3: 检查 EmailJS 初始化

刷新页面后，您应该看到以下日志：
```
✅ EmailJS initialized successfully
Found X form(s) to initialize
✅ Form handler initialized
```

如果没有看到，请在 Console 中输入：
```javascript
HGuardianForms.getStatus()
```

应该返回：
```javascript
{
  emailjsLoaded: true,
  emailjsInitialized: true,
  formsCount: 4
}
```

### 步骤 4: 测试表单提交

1. 访问：https://www.h-guardian.com/contact.html

2. 填写测试表单：
   ```
   Name: Test User
   Email: your-test-email@example.com
   Company: Test Company
   Phone: +86 123 4567 8900
   Country: China
   Subject: Form Test
   Message: This is a test message to verify EmailJS is working correctly.
   ```

3. 点击 **Submit** 按钮

4. 观察 Console 日志：
   ```
   📝 Form submission started
   Form data collected: {...}
   📧 Sending email via EmailJS...
   Config: {...}
   Template params: {...}
   ✅ Email sent successfully: {...}
   ✅ Form submitted successfully: {...}
   ```

### 步骤 5: 检查邮箱

查看 **info@h-guardian.com** 是否收到邮件：

**邮件内容应包含：**
- 发件人：EmailJS
- 主题：[H-Guardian Website] Form Test
- 正文：所有表单字段信息

---

## 常见问题排查

### 问题 1: EmailJS SDK not loaded

**症状：**
```
❌ EmailJS SDK not loaded
```

**解决方案：**
1. 检查页面源代码
2. 确认有以下 script 标签：
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
   ```
3. 确保在 form-handler.js **之前**加载

### 问题 2: Invalid public key

**症状：**
```
❌ EmailJS send error: Invalid public key
```

**解决方案：**
1. 登录 EmailJS Dashboard
2. 检查 Public Key 是否正确
3. 确认是 `1_y80J3lBqJfYafV7`

### 问题 3: Service not found

**症状：**
```
❌ EmailJS send error: Service not found
```

**解决方案：**
1. 检查 Service ID 是否正确
2. 确认是 `service_9zp6s9v`
3. 在 EmailJS Dashboard 确认服务已激活

### 问题 4: Template not found

**症状：**
```
❌ EmailJS send error: Template not found
```

**解决方案：**
1. 检查 Template ID 是否正确
2. 确认是 `template_rfge4zj`
3. 在 EmailJS Dashboard 确认模板存在

---

## EmailJS 模板变量配置

确保您的 EmailJS 模板包含以下变量：

```
Subject: [H-Guardian Website] {{subject}}

Body:
You have received a new inquiry from the H-Guardian website:

From: {{from_name}}
Email: {{from_email}}
Company: {{company}}
Phone: {{phone}}
Country: {{country}}

Subject: {{subject}}

Message:
{{message}}

---
Page URL: {{page_url}}
Submitted at: {{submission_time}}
User Agent: {{user_agent}}
```

**变量列表：**
- `{{from_name}}`
- `{{from_email}}`
- `{{company}}`
- `{{phone}}`
- `{{country}}`
- `{{subject}}`
- `{{message}}`
- `{{page_url}}`
- `{{submission_time}}`
- `{{user_agent}}`

---

## 调试工具

### 测试 EmailJS 连接

在浏览器 Console 中输入：
```javascript
HGuardianForms.testEmailJS()
```

应该输出：
```
Testing EmailJS connection...
✅ EmailJS SDK loaded
Config: {publicKey: "...", serviceId: "...", templateId: "..."}
```

### 手动触发测试提交

```javascript
// 获取第一个表单
const form = document.querySelector('form[id]');

// 模拟提交
form.dispatchEvent(new Event('submit', { cancelable: true }));
```

---

## 成功率检查

### EmailJS Dashboard

1. 登录 https://dashboard.emailjs.com/
2. 点击 **Email History**
3. 查看最近的发送记录
4. 状态应该是 **Sent** ✅

### 发送限额

- 免费版每月：200 封邮件
- 当前周期已用：查看 Dashboard
- 重置日期：查看 Dashboard

---

## 如果仍然失败

### 备选方案 1: 使用 Formspree

1. 注册 https://formspree.io/
2. 创建表单获取 Form ID
3. 更新 form-handler.js:
   ```javascript
   const FORMSPREE_CONFIG = {
       formId: 'YOUR_FORM_ID',
       enabled: true
   };
   ```

### 备选方案 2: 使用 Cloudflare Workers

可以使用 Cloudflare Workers 创建后端 API 来处理表单提交。

### 备选方案 3: 使用 Netlify Forms

如果迁移到 Netlify，可以使用他们的内置表单功能。

---

## 成功标志 ✅

当一切正常时，您会看到：

1. Console 显示：
   ```
   ✅ EmailJS initialized successfully
   ✅ Form handler initialized
   ✅ Email sent successfully
   ✅ Form submitted successfully
   ```

2. 页面显示绿色成功消息：
   ```
   ✓ Thank you! Your message has been sent successfully. 
     We will contact you within 24 hours.
   ```

3. info@h-guardian.com 收到邮件

4. EmailJS Dashboard 显示发送成功

---

**测试完成后，请告诉我结果！**
