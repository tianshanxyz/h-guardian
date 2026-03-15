# 网易企业邮箱 SMTP 配置指南

## 网易企业邮箱 SMTP 信息

```
SMTP Host: smtp.qiye.163.com
SMTP Port: 587 (推荐) 或 465
Username: info@h-guardian.com
Password: [您的邮箱密码或客户端授权码]
```

---

## 步骤 1: 获取邮箱密码/授权码

### 方法 A: 使用邮箱密码（如果已开启 SMTP）

如果您已经开启了 SMTP/POP3/IMAP 服务，可以直接使用邮箱登录密码。

### 方法 B: 生成客户端授权码（推荐）

1. **登录网易企业邮箱网页版**
   - 访问：https://qiye.163.com/
   - 登录：info@h-guardian.com

2. **进入设置**
   - 点击右上角的 **设置** ⚙️
   - 选择 **POP3/SMTP/IMAP**

3. **开启 SMTP 服务**
   - 找到 "SMTP 服务" 选项
   - 勾选 **开启 SMTP 服务**
   - 如果需要，点击 **生成授权码**
   - 复制生成的授权码（类似：`XXXXXXXXXXXX`）

---

## 步骤 2: 在 EmailJS 中创建 SMTP 服务

### 1. 访问 EmailJS

登录：https://dashboard.emailjs.com/admin/services

### 2. 添加新服务

1. 点击 **Add New Service**
2. 选择 **SMTP server**（右下角绿色图标）

### 3. 填写配置

```
┌─────────────────────────────────────────┐
│ SMTP Server Configuration               │
├─────────────────────────────────────────┤
│ Service Name: H-Guardian 163 Enterprise │
│                                         │
│ SMTP Host: smtp.qiye.163.com            │
│ SMTP Port: 587                          │
│                                         │
│ Username: info@h-guardian.com           │
│ Password: [您的密码或授权码]               │
│                                         │
│ ☑ Use SSL/TLS                           │
│                                         │
│ [Create Service]                        │
└─────────────────────────────────────────┘
```

**重要**：
- 勾选 **Use SSL/TLS**
- Port 587 使用 STARTTLS
- Port 465 使用 SSL

### 4. 创建并复制 Service ID

1. 点击 **Create** 或 **Next**
2. EmailJS 会测试连接
3. 如果成功，显示 **Service created successfully**
4. 复制 **Service ID**（类似 `service_xxxxxxxxx`）

---

## 步骤 3: 更新 EmailJS 模板配置

### 1. 访问模板设置

访问：https://dashboard.emailjs.com/admin/templates

### 2. 编辑模板

1. 找到 `template_rfge4zj`
2. 点击 **Edit**

### 3. 修改 Settings

在 **Settings** 标签：

```
To email: info@h-guardian.com
From email: info@h-guardian.com  ← 现在可以使用了！
From name: H-Guardian Website
Reply-to: {{from_email}}
Subject: [H-Guardian Website] {{subject}}
```

### 4. 保存

点击 **Save** 保存设置

---

## 步骤 4: 测试发送

### 在 EmailJS 测试

1. 在模板编辑页面，点击 **Send Test**
2. 填写测试数据：
   ```
   from_name: Test User
   from_email: test@example.com
   subject: Test Subject
   message: This is a test message
   company: Test Company
   phone: +86 123 4567 8900
   country: China
   ```
3. 点击 **Send**
4. 检查 info@h-guardian.com 邮箱

**预期效果**：
- 发件人：H-Guardian Website <info@h-guardian.com>
- 收件人：info@h-guardian.com
- 主题：[H-Guardian Website] Test Subject
- 邮件内容包含所有测试信息

---

## 步骤 5: 更新网站代码

### 1. 更新 form-handler.js

访问：https://github.com/tianshanxyz/h-guardian/blob/main/js/form-handler.js

点击右上角铅笔图标，找到：

```javascript
const EMAILJS_CONFIG = {
    publicKey: '1_y80J3lBqJfYafV7',
    serviceId: 'service_j0lhwp4',  // 旧的 iCloud 服务
    templateId: 'template_rfge4zj',
    toEmail: 'info@h-guardian.com',
    enabled: true
};
```

改为：

```javascript
const EMAILJS_CONFIG = {
    publicKey: '1_y80J3lBqJfYafV7',
    serviceId: 'service_xxxxxxxxx',  // ← 新的 163 SMTP 服务 ID
    templateId: 'template_rfge4zj',
    toEmail: 'info@h-guardian.com',
    enabled: true
};
```

### 2. 提交更改

滚动到底部：
- Commit message: `Update to use 163 enterprise email SMTP`
- 点击 **Commit changes**

### 3. 等待部署

Cloudflare 会自动重新部署（1-2 分钟）

---

## 步骤 6: 测试网站表单

### 1. 清除缓存
按 **Cmd+Shift+R** 强制刷新

### 2. 访问联系页面
https://www.h-guardian.com/contact.html

### 3. 填写并提交表单
```
Name: Test User
Email: test@example.com
Company: Test Company
Subject: Product Inquiry
Message: Testing with 163 enterprise email
```

### 4. 检查邮箱
查看 info@h-guardian.com 是否收到邮件

**预期效果**：
- ✅ 发件人显示：H-Guardian Website <info@h-guardian.com>
- ✅ 邮件内容包含用户提交的所有信息
- ✅ Subject 正确显示选择的选项
- ✅ 回复时会回复给客户

---

## 常见问题解决

### 问题 1: 认证失败

**错误**：`Authentication failed`

**解决**：
1. 检查密码是否正确
2. 如果开启了二次验证，需要使用授权码而不是登录密码
3. 确认 SMTP 服务已开启

### 问题 2: 连接超时

**错误**：`Connection timed out`

**解决**：
1. 检查端口是否正确（587 或 465）
2. 确认勾选了 **Use SSL/TLS**
3. 检查防火墙设置

### 问题 3: SMTP 服务未开启

**错误**：`SMTP service not enabled`

**解决**：
1. 登录网易企业邮箱网页版
2. 设置 → POP3/SMTP/IMAP
3. 开启 SMTP 服务
4. 生成授权码

---

## 完整配置总结

### EmailJS Service
```
Type: SMTP Server
Service Name: H-Guardian 163 Enterprise
SMTP Host: smtp.qiye.163.com
SMTP Port: 587
Username: info@h-guardian.com
Password: [授权码]
Use SSL/TLS: ✓
```

### EmailJS Template Settings
```
To email: info@h-guardian.com
From email: info@h-guardian.com
From name: H-Guardian Website
Reply-to: {{from_email}}
Subject: [H-Guardian Website] {{subject}}
```

### form-handler.js
```javascript
serviceId: 'service_xxxxxxxxx'  // 新的 163 SMTP 服务 ID
```

---

## 现在请执行

1. **登录网易企业邮箱**，开启 SMTP 服务，获取授权码
2. **在 EmailJS 创建 SMTP 服务**，使用上面的配置
3. **复制新的 Service ID**
4. **告诉我新的 Service ID**

我会帮您更新网站代码！
