# EmailJS Gmail 服务权限修复指南

## 错误信息
```
412 - Gmail API: Request had insufficient authentication scopes
```

## 问题原因

EmailJS 使用的 Gmail 服务没有足够的权限发送邮件。需要重新配置 Gmail 服务。

---

## 解决方案（3 选 1）

### 方案 1: 使用 EmailJS 默认邮箱服务（最简单）⭐推荐

EmailJS 提供免费的默认邮箱服务，不需要配置 Gmail。

#### 步骤：

1. **删除当前 Gmail 服务**
   - EmailJS Dashboard → Email Services
   - 找到 `service_9zp6s9v`
   - 点击删除

2. **创建新的默认服务**
   - 点击 **Add New Service**
   - 选择 **Email API**（不是 Gmail!）
   - 点击 **Create**
   - 记录新的 Service ID

3. **更新网站代码**
   
   打开 `js/form-handler.js`，找到：
   ```javascript
   const EMAILJS_CONFIG = {
       publicKey: '1_y80J3lBqJfYafV7',
       serviceId: 'service_9zp6s9v',  // 旧的
       templateId: 'template_rfge4zj',
       toEmail: 'info@h-guardian.com',
       enabled: true
   };
   ```
   
   改为：
   ```javascript
   const EMAILJS_CONFIG = {
       publicKey: '1_y80J3lBqJfYafV7',
       serviceId: 'YOUR_NEW_SERVICE_ID',  // 新的 Service ID
       templateId: 'template_rfge4zj',
       toEmail: 'info@h-guardian.com',
       enabled: true
   };
   ```

4. **推送到 GitHub**
   ```bash
   git add .
   git commit -m "Update EmailJS service ID"
   git push
   ```

5. **等待 Cloudflare 自动部署**（约 1-2 分钟）

---

### 方案 2: 修复 Gmail 服务权限（复杂）

如果您坚持使用 Gmail 发送，需要：

1. **重新连接 Gmail**
   - EmailJS Dashboard → Email Services
   - 点击您的 Gmail 服务
   - 点击 **Reconnect**
   - 登录 Google 账号并授予所有权限

2. **启用 Gmail API**
   - 访问 Google Cloud Console
   - 启用 Gmail API
   - 创建 OAuth 凭据
   - 这比较复杂，不推荐

---

### 方案 3: 使用 Outlook/Hotmail 服务

1. **创建 Outlook 服务**
   - EmailJS Dashboard → Email Services
   - 点击 **Add New Service**
   - 选择 **Outlook**
   - 登录 Microsoft 账号授权

2. **更新 Service ID**
   - 记录新的 Service ID
   - 更新 `js/form-handler.js`

---

## 推荐：使用方案 1 的详细步骤

### 第 1 步：创建 Email API 服务

1. 登录 https://dashboard.emailjs.com/
2. 点击左侧 **Email Services**
3. 点击 **Add New Service**
4. 选择 **Email API**（图标是一个信封）
5. 点击 **Create**
6. 复制 Service ID（类似 `service_xxxxxxx`）

### 第 2 步：更新模板设置

1. 点击 **Email Templates**
2. 选择 `template_rfge4zj`
3. 在 **Settings** 标签：
   - To email: `info@h-guardian.com`
   - From name: `{{from_name}}`
   - From email: `{{from_email}}`
   - Reply-to: `{{from_email}}`
   - Subject: `[H-Guardian Website] {{subject}}`
4. 保存

### 第 3 步：更新代码

编辑 `js/form-handler.js`：

```javascript
const EMAILJS_CONFIG = {
    publicKey: '1_y80J3lBqJfYafV7',
    serviceId: 'service_XXXXXXX',  // 填入新的 Service ID
    templateId: 'template_rfge4zj',
    toEmail: 'info@h-guardian.com',
    enabled: true
};
```

### 第 4 步：测试

1. 访问 https://www.h-guardian.com/contact.html
2. 打开 Console（F12）
3. 填写表单并提交
4. 应该看到成功消息

---

## 验证成功

成功的标志：

**Console 显示：**
```
✅ EmailJS initialized successfully
📝 Form submission started
📧 Sending email via EmailJS...
✅ Email sent successfully
✅ Form submitted successfully
```

**页面显示：**
```
✓ Thank you! Your message has been sent successfully. 
  We will contact you within 24 hours.
```

**邮箱收到邮件**

---

## 需要帮助？

请告诉我：
1. 您选择哪个方案？
2. 新的 Service ID 是什么？
3. 测试后 Console 显示什么？
