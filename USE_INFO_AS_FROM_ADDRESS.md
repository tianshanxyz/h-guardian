# 使用 info@h-guardian.com 作为发件人

## 问题分析

您想用 `info@h-guardian.com` 作为发件人邮箱，这是完全合理的！

但是，当前 EmailJS 使用的是 **iCloud SMTP**，iCloud 强制要求发件人必须是 iCloud 邮箱。

---

## 解决方案：配置 h-guardian.com 企业邮箱 SMTP

### 前提条件

您需要有 `h-guardian.com` 域名的企业邮箱，并且知道 SMTP 配置信息。

常见的企业邮箱服务商：
- 腾讯企业邮箱（Exmail）
- 网易企业邮箱
- Google Workspace（G Suite）
- Microsoft 365
- Zoho Mail
- 阿里云企业邮箱

---

## 步骤 1: 获取企业邮箱 SMTP 信息

### 如果您已有企业邮箱

登录您的企业邮箱管理后台，找到 SMTP 配置信息：

**腾讯企业邮箱示例**：
```
SMTP Host: smtp.exmail.qq.com
SMTP Port: 587 或 465
Username: info@h-guardian.com
Password: [您的邮箱密码或授权码]
```

**网易企业邮箱示例**：
```
SMTP Host: smtp.163.com
SMTP Port: 587 或 465
Username: info@h-guardian.com
Password: [授权码]
```

**Google Workspace 示例**：
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
Username: info@h-guardian.com
Password: [应用专用密码]
```

**Microsoft 365 示例**：
```
SMTP Host: smtp.office365.com
SMTP Port: 587
Username: info@h-guardian.com
Password: [您的邮箱密码]
```

### 如果您还没有企业邮箱

需要联系您的域名管理员或邮箱服务商获取 SMTP 信息。

---

## 步骤 2: 在 EmailJS 中创建新的 SMTP 服务

### 删除旧的 iCloud 服务（可选）

1. 访问：https://dashboard.emailjs.com/admin/services
2. 找到 iCloud 服务（service_j0lhwp4）
3. 点击删除（可选，保留也可以）

### 创建新的 SMTP 服务

1. 访问：https://dashboard.emailjs.com/admin/services
2. 点击 **Add New Service**
3. 选择 **SMTP server**
4. 填写配置：

```
┌─────────────────────────────────────────┐
│ SMTP Server Configuration               │
├─────────────────────────────────────────┤
│ Service Name: H-Guardian Official       │
│                                         │
│ SMTP Host: [您的 SMTP 服务器地址]          │
│ SMTP Port: 587                          │
│                                         │
│ Username: info@h-guardian.com           │
│ Password: [您的邮箱密码或授权码]           │
│                                         │
│ [ ] Use SSL/TLS                         │
│                                         │
│ [Create Service]                        │
└─────────────────────────────────────────┘
```

5. 点击 **Create** 或 **Next**
6. EmailJS 会测试连接
7. 如果成功，复制新的 **Service ID**

---

## 步骤 3: 更新 EmailJS 模板配置

### 修改 Settings

1. 访问：https://dashboard.emailjs.com/admin/templates
2. 编辑 `template_rfge4zj`
3. 在 **Settings** 标签：

```
To email: info@h-guardian.com
From email: info@h-guardian.com  ← 现在可以使用了！
From name: H-Guardian Website
Reply-to: {{from_email}}
Subject: [H-Guardian Website] {{subject}}
```

### 保存并测试

1. 点击 **Save**
2. 点击 **Send Test**
3. 填写测试数据
4. 检查 info@h-guardian.com 邮箱

---

## 步骤 4: 更新网站代码

### 更新 form-handler.js

1. 访问：https://github.com/tianshanxyz/h-guardian/blob/main/js/form-handler.js
2. 点击右上角铅笔图标
3. 按 Cmd+F 搜索 `serviceId`
4. 修改为新的 Service ID：

```javascript
const EMAILJS_CONFIG = {
    publicKey: '1_y80J3lBqJfYafV7',
    serviceId: 'service_xxxxxxxxx',  ← 新的 SMTP 服务 ID
    templateId: 'template_rfge4zj',
    toEmail: 'info@h-guardian.com',
    enabled: true
};
```

5. 滚动到底部
6. 输入：`Update to use h-guardian.com SMTP`
7. 点击 **Commit changes**

---

## 常见企业邮箱 SMTP 配置参考

### 腾讯企业邮箱（Exmail）
```
SMTP Host: smtp.exmail.qq.com
SMTP Port: 587 (TLS) 或 465 (SSL)
需要开启 SMTP 服务
可能需要在企业邮箱后台获取授权码
```

### 网易企业邮箱
```
SMTP Host: smtp.163.com
SMTP Port: 587 (TLS) 或 465 (SSL)
需要在设置中开启 SMTP/POP3/IMAP
使用授权码而不是登录密码
```

### Google Workspace
```
SMTP Host: smtp.gmail.com
SMTP Port: 587 (TLS)
需要开启 SMTP 服务
可能需要生成应用专用密码
```

### Microsoft 365 / Outlook
```
SMTP Host: smtp.office365.com
SMTP Port: 587 (STARTTLS)
使用邮箱登录密码
需要开启 SMTP 认证
```

### Zoho Mail
```
SMTP Host: smtp.zoho.com
SMTP Port: 587 (TLS) 或 465 (SSL)
需要在设置中生成应用专用密码
```

### 阿里云企业邮箱
```
SMTP Host: smtp.qiye.aliyun.com
SMTP Port: 587 (TLS) 或 465 (SSL)
使用邮箱密码或授权码
```

---

## 如果您不确定 SMTP 配置

### 方法 1: 检查域名邮箱设置

1. 登录您的域名管理后台（ResellerClub 或其他）
2. 查找 "Email" 或 "Mail" 设置
3. 查看是否有企业邮箱配置
4. 找到 SMTP 服务器信息

### 方法 2: 联系邮箱管理员

如果您是企业邮箱的管理员，请检查：
- 企业邮箱服务商是什么
- SMTP 服务器地址
- 是否需要开启 SMTP 服务
- 是否需要使用授权码

### 方法 3: 使用 Gmail/Outlook 转发

如果无法获取企业邮箱 SMTP，可以：
1. 设置 info@h-guardian.com 自动转发到 Gmail
2. 在 EmailJS 中使用 Gmail SMTP
3. 发件人设置为 info@h-guardian.com（Gmail 允许设置自定义发件人）

---

## 测试清单

配置完成后，请测试：

- [ ] SMTP 服务创建成功
- [ ] Service ID 已复制
- [ ] 模板 Settings 中 From email: info@h-guardian.com
- [ ] 网站代码已更新 Service ID
- [ ] GitHub 代码已推送
- [ ] Cloudflare 已重新部署
- [ ] Send Test 成功
- [ ] info@h-guardian.com 收到测试邮件
- [ ] 发件人显示为 info@h-guardian.com
- [ ] 网站表单提交成功

---

## 需要帮助？

请告诉我：
1. 您的企业邮箱服务商是什么？（腾讯、网易、Google、Microsoft 等）
2. 是否知道 SMTP 服务器地址？
3. 是否需要我帮您查找 SMTP 配置信息？

我会根据您的具体情况提供详细的配置步骤！
