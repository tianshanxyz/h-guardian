# EmailJS 模板配置指南

## 问题诊断

错误信息：`422 - The recipients address is empty`

**原因**：EmailJS 模板中没有正确设置收件人邮箱地址。

---

## 解决方案

### 步骤 1: 登录 EmailJS Dashboard

访问：https://dashboard.emailjs.com/

### 步骤 2: 进入模板设置

1. 点击左侧 **Email Templates**
2. 找到模板 `template_rfge4zj`
3. 点击 **Edit**

### 步骤 3: 配置收件人邮箱

在模板编辑页面：

#### 方法 A: 固定收件人（推荐）

在 **Settings** 标签页：
1. 找到 **To email** 字段
2. 输入：`info@h-guardian.com`
3. 保存设置

#### 方法 B: 使用变量

如果您希望动态设置收件人：
1. 在 **To email** 输入：`{{to_email}}`
2. 在代码中传递 `to_email` 参数

**推荐使用方法 A**，固定发送到 info@h-guardian.com

---

## 完整的模板配置

### Email Settings 标签

```
To email: info@h-guardian.com
From name: {{from_name}}
From email: {{from_email}}
Reply-to: {{from_email}}
Subject: [H-Guardian Website] {{subject}}
```

### Email Content 标签

使用以下模板：

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .header { background: #339999; color: white; padding: 20px; }
        .content { padding: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #333; }
        .footer { background: #f4f4f4; padding: 15px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>New Website Inquiry</h2>
    </div>
    
    <div class="content">
        <p>You have received a new inquiry from the H-Guardian website:</p>
        
        <div class="field">
            <div class="label">From:</div>
            <div>{{from_name}}</div>
        </div>
        
        <div class="field">
            <div class="label">Email:</div>
            <div>{{from_email}}</div>
        </div>
        
        <div class="field">
            <div class="label">Company:</div>
            <div>{{company}}</div>
        </div>
        
        <div class="field">
            <div class="label">Phone:</div>
            <div>{{phone}}</div>
        </div>
        
        <div class="field">
            <div class="label">Country:</div>
            <div>{{country}}</div>
        </div>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        
        <div class="field">
            <div class="label">Subject:</div>
            <div>{{subject}}</div>
        </div>
        
        <div class="field">
            <div class="label">Message:</div>
            <div style="background: #f9f9f9; padding: 15px; border-left: 3px solid #339999;">
                {{message}}
            </div>
        </div>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        
        <div class="field">
            <div class="label">Page URL:</div>
            <div><a href="{{page_url}}">{{page_url}}</a></div>
        </div>
        
        <div class="field">
            <div class="label">Submitted at:</div>
            <div>{{submission_time}}</div>
        </div>
    </div>
    
    <div class="footer">
        <p>This is an automated message from H-Guardian website contact form.</p>
        <p>Please reply to {{from_email}} to respond to this inquiry.</p>
    </div>
</body>
</html>
```

---

## 验证配置

### 检查清单

- [ ] To email 已设置为 `info@h-guardian.com`
- [ ] From name 使用 `{{from_name}}`
- [ ] From email 使用 `{{from_email}}`
- [ ] Reply-to 已设置
- [ ] Subject 包含 `{{subject}}`
- [ ] 模板内容包含所有必要变量

### 测试发送

1. 在 EmailJS 模板编辑页面
2. 点击 **Send Test** 按钮
3. 填写测试数据：
   ```
   from_name: Test User
   from_email: your-email@example.com
   subject: Test Email
   message: This is a test message
   ```
4. 点击发送
5. 检查 info@h-guardian.com 是否收到

---

## 常见问题

### Q1: 仍然显示 "recipients address is empty"

**解决方案：**
1. 确保 To email 字段不是空的
2. 不要使用 `{{to_email}}` 变量，直接写邮箱地址
3. 保存后刷新页面确认设置已保存

### Q2: 收到邮件但格式不对

**解决方案：**
1. 检查 Email Content 是否使用 HTML 格式
2. 确保所有变量都用 `{{}}` 包裹
3. 使用上面的 HTML 模板

### Q3: 测试成功但网站提交失败

**解决方案：**
1. 清除浏览器缓存
2. 检查 Console 日志
3. 确认 Public Key、Service ID、Template ID 正确

---

## 快速修复步骤

如果不确定哪里出错，请按以下步骤重新配置：

### 1. 删除旧模板

1. Email Templates → 选择模板
2. 点击 **Delete**

### 2. 创建新模板

1. 点击 **Create New Template**
2. 选择 **Custom Template**
3. 粘贴上面的 HTML 内容
4. 在 Settings 中设置 To email: `info@h-guardian.com`
5. 保存并记录新的 Template ID

### 3. 更新网站代码

更新 `js/form-handler.js` 中的 Template ID：

```javascript
const EMAILJS_CONFIG = {
    publicKey: '1_y80J3lBqJfYafV7',
    serviceId: 'service_9zp6s9v',
    templateId: 'YOUR_NEW_TEMPLATE_ID',  // 更新这里
    toEmail: 'info@h-guardian.com',
    enabled: true
};
```

### 4. 推送到 GitHub

```bash
git add .
git commit -m "Update EmailJS template ID"
git push
```

---

## 完成后的测试

1. 访问 https://www.h-guardian.com/contact.html
2. 打开 Console（F12）
3. 填写并提交表单
4. 应该看到：
   ```
   ✅ Email sent successfully
   ✅ Form submitted successfully
   ```
5. 检查 info@h-guardian.com 邮箱

---

**需要帮助？**

如果仍然有问题，请截图 EmailJS 模板设置页面发给我。
