# iCloud SMTP SSL 错误修复指南

## 错误信息
```
412 SMTP: error:0A00010B:SSL routines:tls_validate_record_header:wrong version number
```

## 问题原因
iCloud SMTP 需要使用 **STARTTLS** 或 **SSL/TLS** 加密，但 EmailJS 可能使用了错误的加密方式。

---

## 解决方案

### 方案 1: 修改 iCloud SMTP 配置（推荐）

在 EmailJS 的 SMTP 配置页面，尝试以下配置：

#### 配置 A: 使用 STARTTLS
```
SMTP Host: smtp.mail.me.com
SMTP Port: 587
Username: joyma01@icloud.com
Password: [应用专用密码]
Use SSL/TLS: ✓ 勾选
```

#### 配置 B: 使用 SSL（如果 587 端口不行）
```
SMTP Host: smtp.mail.me.com
SMTP Port: 465
Username: joyma01@icloud.com
Password: [应用专用密码]
Use SSL/TLS: ✓ 勾选
```

#### 配置 C: 不使用加密（某些情况下有效）
```
SMTP Host: smtp.mail.me.com
SMTP Port: 587
Username: joyma01@icloud.com
Password: [应用专用密码]
Use SSL/TLS: ✗ 不勾选
```

---

### 方案 2: 使用 Outlook 邮箱（最简单，推荐）⭐

Outlook 邮箱不需要应用专用密码，配置更简单。

#### 步骤：

1. **在 EmailJS 中选择 Outlook**
   - 回到服务选择页面
   - 点击 **Outlook** 图标

2. **登录 Microsoft 账号**
   - 使用您的 Outlook/Hotmail 邮箱登录
   - 授权 EmailJS

3. **自动配置**
   - EmailJS 会自动配置所有设置
   - 不会报 SSL 错误

4. **复制 Service ID**

5. **更新 GitHub 代码**

---

### 方案 3: 使用 Gmail 邮箱

如果您有 Gmail：

1. **在 EmailJS 中选择 Gmail**
2. **登录 Gmail 并授权**
3. **复制 Service ID**

---

### 方案 4: 使用 QQ 邮箱（如果您有）

QQ 邮箱配置简单，不需要应用专用密码。

```
SMTP Host: smtp.qq.com
SMTP Port: 587
Username: [您的 QQ 号]@qq.com
Password: [授权码]
Use SSL/TLS: ✓ 勾选
```

**获取 QQ 邮箱授权码**：
1. 登录 QQ 邮箱网页版
2. 设置 → 账户
3. 开启 POP3/SMTP 服务
4. 生成授权码

---

## 🎯 强烈推荐：使用 Outlook

因为 iCloud SMTP 的 SSL 配置比较复杂，建议直接使用 Outlook。

### Outlook 配置步骤：

1. **回到 EmailJS 服务选择页面**
2. **点击 Outlook 图标**
3. **登录 Microsoft 账号**
   - 如果有 Outlook/Hotmail 邮箱，直接登录
   - 如果没有，免费注册一个
4. **授权 EmailJS**
5. **复制 Service ID**
6. **更新 GitHub 代码**

---

## 如果坚持使用 iCloud

请尝试以下配置组合：

### 尝试 1: 端口 587 + STARTTLS
```
Host: smtp.mail.me.com
Port: 587
Username: joyma01@icloud.com
Password: [应用专用密码]
Secure: STARTTLS (如果有这个选项)
```

### 尝试 2: 端口 465 + SSL
```
Host: smtp.mail.me.com
Port: 465
Username: joyma01@icloud.com
Password: [应用专用密码]
Secure: SSL/TLS
```

### 尝试 3: 不加密
```
Host: smtp.mail.me.com
Port: 25
Username: joyma01@icloud.com
Password: [应用专用密码]
Secure: None (不加密)
```

---

## 配置成功后的步骤

### 1. 复制 Service ID

配置成功后，复制 Service ID（类似 `service_xxxxxxxxx`）

### 2. 更新 GitHub 代码

1. 访问：https://github.com/tianshanxyz/h-guardian/blob/main/js/form-handler.js
2. 点击右上角铅笔图标
3. 按 Cmd+F 搜索 `serviceId`
4. 修改为：

```javascript
const EMAILJS_CONFIG = {
    publicKey: '1_y80J3lBqJfYafV7',
    serviceId: 'service_xxxxxxxxx',  // ← 新的 Service ID
    templateId: 'template_rfge4zj',
    toEmail: 'info@h-guardian.com',
    enabled: true
};
```

5. 滚动到底部
6. 输入：`Update EmailJS service configuration`
7. 点击 **Commit changes**

### 3. 等待部署

1. 访问：https://dash.cloudflare.com/
2. Workers & Pages → h-guardian → Deployments
3. 等待 1-2 分钟

### 4. 测试表单

1. 清除缓存：Cmd+Shift+R
2. 访问：https://www.h-guardian.com/contact.html
3. 提交表单
4. 检查 info@h-guardian.com 邮箱

---

## 需要帮助？

请告诉我：
1. 您选择哪个方案？
2. 如果选择 Outlook/Gmail，新的 Service ID 是什么？
3. 如果坚持用 iCloud，尝试了哪些配置组合？
