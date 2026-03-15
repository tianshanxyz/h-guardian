# 网易企业邮箱 SMTP SSL 错误修复

## 错误信息
```
412 SMTP: error:0A00010B:SSL routines:tls_validate_record_header:wrong version number
```

## 问题原因
端口和 SSL/TLS 加密方式不匹配。

---

## 解决方案（3 种配置，逐一尝试）

### 配置 A: 端口 587 + STARTTLS（推荐）⭐

```
SMTP Host: smtp.qiye.163.com
SMTP Port: 587
Username: info@h-guardian.com
Password: [授权码]
Use SSL/TLS: ✗ 不勾选！
```

**说明**：端口 587 使用 STARTTLS，不是传统的 SSL/TLS

---

### 配置 B: 端口 465 + SSL

```
SMTP Host: smtp.qiye.163.com
SMTP Port: 465
Username: info@h-guardian.com
Password: [授权码]
Use SSL/TLS: ✓ 勾选
```

**说明**：端口 465 使用传统的 SSL 加密

---

### 配置 C: 端口 25（备用）

```
SMTP Host: smtp.qiye.163.com
SMTP Port: 25
Username: info@h-guardian.com
Password: [授权码]
Use SSL/TLS: ✗ 不勾选
```

**说明**：端口 25 是标准 SMTP 端口，但可能被防火墙阻止

---

## 🎯 推荐执行顺序

### 第一步：尝试配置 A（端口 587）

```
SMTP Host: smtp.qiye.163.com
SMTP Port: 587
Username: info@h-guardian.com
Password: [您的授权码]
Use SSL/TLS: ✗ 不勾选！
```

1. 在 EmailJS SMTP 配置页面
2. 填写以上信息
3. **不要勾选** "Use SSL/TLS"
4. 点击 **Create**
5. 等待测试连接

**如果成功** → 完成配置

**如果失败** → 尝试配置 B

---

### 第二步：尝试配置 B（端口 465）

```
SMTP Host: smtp.qiye.163.com
SMTP Port: 465
Username: info@h-guardian.com
Password: [您的授权码]
Use SSL/TLS: ✓ 勾选
```

1. 修改端口为 465
2. **勾选** "Use SSL/TLS"
3. 点击 **Create**
4. 等待测试连接

**如果成功** → 完成配置

**如果失败** → 尝试配置 C

---

### 第三步：尝试配置 C（端口 25）

```
SMTP Host: smtp.qiye.163.com
SMTP Port: 25
Username: info@h-guardian.com
Password: [您的授权码]
Use SSL/TLS: ✗ 不勾选
```

---

## 完整配置示例

### 成功的配置（最可能是配置 A）

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
│ Password: ••••••••••••                  │
│                                         │
│ ☐ Use SSL/TLS  ← 注意：不勾选！          │
│                                         │
│ [Create Service]                        │
└─────────────────────────────────────────┘
```

---

## 验证成功

创建成功后，您会看到：

```
✅ Service created successfully!
Service ID: service_xxxxxxxxx
```

---

## 后续步骤

### 1. 复制 Service ID

记录新的 Service ID（类似 `service_xxxxxxxxx`）

### 2. 更新 EmailJS 模板 Settings

访问：https://dashboard.emailjs.com/admin/templates

编辑 `template_rfge4zj`，在 **Settings** 标签：

```
To email: info@h-guardian.com
From email: info@h-guardian.com
From name: H-Guardian Website
Reply-to: {{from_email}}
Subject: [H-Guardian Website] {{subject}}
```

### 3. 测试发送

1. 点击 **Send Test**
2. 填写测试数据
3. 检查 info@h-guardian.com 邮箱

### 4. 更新网站代码

访问：https://github.com/tianshanxyz/h-guardian/blob/main/js/form-handler.js

编辑 `serviceId`：

```javascript
const EMAILJS_CONFIG = {
    publicKey: '1_y80J3lBqJfYafV7',
    serviceId: 'service_xxxxxxxxx',  // ← 新的 163 SMTP 服务 ID
    templateId: 'template_rfge4zj',
    toEmail: 'info@h-guardian.com',
    enabled: true
};
```

提交保存。

---

## 常见问题

### Q: 为什么端口 587 不勾选 SSL/TLS？

A: 端口 587 使用 STARTTLS 加密协议，它是在 SMTP 连接建立后升级到 TLS 加密。EmailJS 的 "Use SSL/TLS" 选项指的是传统的 SSL 加密（用于端口 465）。

### Q: 仍然报错怎么办？

A: 尝试：
1. 检查授权码是否正确
2. 确认网易企业邮箱已开启 SMTP 服务
3. 尝试不同的端口配置
4. 联系网易企业邮箱客服确认 SMTP 设置

### Q: 授权码在哪里获取？

A: 
1. 登录：https://qiye.163.com/
2. 设置 → POP3/SMTP/IMAP
3. 开启 SMTP 服务
4. 生成授权码

---

## 现在请尝试

**先尝试配置 A**：
```
Host: smtp.qiye.163.com
Port: 587
Username: info@h-guardian.com
Password: [授权码]
Use SSL/TLS: ✗ 不勾选
```

**告诉我结果**：
- 如果成功，复制 Service ID
- 如果失败，告诉我错误信息，我们尝试配置 B
