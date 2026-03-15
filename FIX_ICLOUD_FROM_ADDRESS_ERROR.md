# iCloud SMTP From Address 错误修复

## 错误信息
```
550 5.7.0 From address is not one of your addresses
```

## 问题原因
iCloud SMTP 强制要求发件人地址必须是您自己的 iCloud 邮箱（joyma01@icloud.com），不能使用其他地址如 noreply@h-guardian.com。

---

## 解决方案

### 方案 1: 使用 iCloud 邮箱作为发件人（推荐）

在 EmailJS 模板的 **Settings** 标签：

```
To email: info@h-guardian.com
From email: joyma01@icloud.com  ← 必须使用 iCloud 邮箱
From name: H-Guardian Website  ← 显示名称可以自定义
Reply-to: {{from_email}}  ← 这样回复会发给客户
Subject: [H-Guardian Website] {{subject}}
```

**说明**：
- `From email`: 必须是 `joyma01@icloud.com`（iCloud 要求）
- `From name`: 显示为 "H-Guardian Website"（客户看到的是这个）
- `Reply-to`: 设置为 `{{from_email}}`，您回复时会自动发给客户

**效果**：
- 客户看到的发件人：**H-Guardian Website** <joyma01@icloud.com>
- 虽然邮箱地址仍然显示，但主要显示的是品牌名称
- 您回复时直接回复给客户，不会发给自己的 iCloud

---

### 方案 2: 配置 iCloud 别名（高级）

如果您有 h-guardian.com 的企业邮箱，可以设置转发：

1. 在 iCloud 设置中添加别名
2. 将 noreply@h-guardian.com 转发到 joyma01@icloud.com
3. 在 EmailJS 中使用别名

但这个方法比较复杂，不推荐。

---

### 方案 3: 使用其他邮件服务（推荐长期方案）

如果不想显示 iCloud 邮箱，可以使用以下服务：

#### Gmail
- 免费
- 需要应用专用密码
- 发件人可以设置为自定义名称

#### Outlook
- 免费
- 不需要应用专用密码
- 配置简单

#### SendGrid / Mailgun
- 专业的邮件发送服务
- 可以自定义发件人域名
- 免费额度足够使用

---

## 🎯 立即执行：使用方案 1

### 步骤 1: 修改 EmailJS Settings

访问：https://dashboard.emailjs.com/admin/templates

编辑 `template_rfge4zj`，在 **Settings** 标签：

```
┌─────────────────────────────────────────┐
│ Settings                                │
├─────────────────────────────────────────┤
│ To email: info@h-guardian.com           │
│ From email: joyma01@icloud.com          │ ← 必须这样
│ From name: H-Guardian Website           │
│ Reply-to: {{from_email}}                │
│ Subject: [H-Guardian Website] {{subject}}│
└─────────────────────────────────────────┘
```

### 步骤 2: 保存并测试

1. 点击 **Save**
2. 点击 **Send Test**
3. 填写测试数据
4. 检查 info@h-guardian.com 邮箱

### 步骤 3: 验证效果

收到的邮件应该显示：

**发件人**: H-Guardian Website <joyma01@icloud.com>  
**收件人**: info@h-guardian.com  
**主题**: [H-Guardian Website] Test Subject  
**回复地址**: test@example.com（客户的邮箱）

---

## 关于隐私的说明

### 当前配置的效果：

✅ **优点**：
- 主要显示的是 "H-Guardian Website"（品牌名称）
- 回复邮件时直接发给客户，不会发给自己的 iCloud
- 配置简单，立即生效

⚠️ **缺点**：
- 邮箱地址 joyma01@icloud.com 仍然会显示在邮件头中
- 但普通用户不会注意到，他们主要看到的是发件人名称

### 如果非常在意隐私：

建议注册一个专门的工作邮箱：
- 注册新的 Gmail/Outlook：hguardian.official@gmail.com
- 在 EmailJS 中使用这个邮箱
- 这样就不会暴露个人邮箱

---

## 完整配置示例

### EmailJS Template Settings:
```
To email: info@h-guardian.com
From email: joyma01@icloud.com
From name: H-Guardian Website Contact Form
Reply-to: {{from_email}}
Subject: [H-Guardian Website] {{subject}}
```

### EmailJS Template Content:
使用之前提供的完整 HTML 模板

### form-handler.js:
确保传递所有必要的变量：
```javascript
const templateParams = {
    from_name: formData['inquiry-name'] || 'Website Visitor',
    from_email: formData['inquiry-email'] || '',
    reply_to: formData['inquiry-email'] || '',
    company: formData['inquiry-company'] || 'Not provided',
    subject: formData['inquiry-subject'] || 'Website Inquiry',
    message: formData['inquiry-message'] || '',
    phone: formData['inquiry-phone'] || 'Not provided',
    country: formData['inquiry-country'] || 'Not provided',
    page_url: formData.page_url,
    submission_time: formData.submission_time
};
```

---

## 测试清单

测试时请确认：
- [ ] 邮件成功发送到 info@h-guardian.com
- [ ] 发件人显示为 "H-Guardian Website"
- [ ] 邮件内容包含用户提交的所有信息
- [ ] Subject 字段正确显示
- [ ] 点击"回复"时，回复地址是客户的邮箱

---

**现在请：**
1. 修改 From email 为 `joyma01@icloud.com`
2. 修改 From name 为 `H-Guardian Website`
3. 保存并测试
4. 告诉我结果！
