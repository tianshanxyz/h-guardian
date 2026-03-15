# EmailJS SMTP Server 配置指南

## SMTP 配置信息

在 EmailJS 的 SMTP server 配置页面，填写以下信息：

### 方案 1: 使用 iCloud 邮箱的 SMTP（推荐，因为您已有 iCloud）

```
SMTP Host: smtp.mail.me.com
SMTP Port: 587
Username: joyma01@icloud.com
Password: [应用专用密码]
```

### 方案 2: 使用 Gmail 的 SMTP

```
SMTP Host: smtp.gmail.com
SMTP Port: 587
Username: your-email@gmail.com
Password: [应用专用密码]
```

### 方案 3: 使用 Outlook 的 SMTP

```
SMTP Host: smtp.office365.com
SMTP Port: 587
Username: your-email@outlook.com
Password: [您的 Outlook 密码]
```

---

## ⚠️ 重要：iCloud 需要应用专用密码

iCloud 邮箱不能使用普通密码，必须生成应用专用密码。

### 生成 iCloud 应用专用密码步骤：

#### 步骤 1: 访问 Apple ID 页面

打开浏览器访问：
```
https://appleid.apple.com/
```

#### 步骤 2: 登录

使用您的 Apple ID 登录：
- Apple ID: joyma01@icloud.com
- 输入密码

#### 步骤 3: 进入安全设置

1. 找到 **"Security"** 或 **"安全"** 标签
2. 向下滚动找到 **"App-Specific Passwords"** 或 **"应用专用密码"**
3. 点击 **"Generate Password"** 或 **"生成密码"**

#### 步骤 4: 创建应用专用密码

1. **Label/标签**: 输入 `EmailJS`
2. 点击 **"Next"** 或 **"下一步"**
3. 系统会生成一个密码，格式类似：
   ```
   abcd-efgh-ijkl-mnop
   ```
   或
   ```
   xxxxxxxxxxxxxxxxxxxx
   ```

4. **复制这个密码**（不要关闭页面）

#### 步骤 5: 在 EmailJS 中使用

回到 EmailJS 的 SMTP 配置页面：

```
SMTP Host: smtp.mail.me.com
SMTP Port: 587
Username: joyma01@icloud.com
Password: [粘贴刚才生成的应用专用密码]
```

#### 步骤 6: 完成配置

1. 点击 **Next** 或 **Create**
2. EmailJS 会测试连接
3. 如果成功，会显示 Service ID
4. 复制 Service ID

---

## 完整配置示例

### iCloud SMTP 配置：

```
┌─────────────────────────────────────┐
│ SMTP Server Configuration           │
├─────────────────────────────────────┤
│ Host: smtp.mail.me.com              │
│ Port: 587                           │
│ Username: joyma01@icloud.com        │
│ Password: xxxx-xxxx-xxxx-xxxx       │ ← 应用专用密码
│                                     │
│ [Create Service]                    │
└─────────────────────────────────────┘
```

---

## 如果找不到应用专用密码选项

### 方法 1: 直接访问

打开这个链接：
```
https://support.apple.com/zh-cn/HT204397
```

### 方法 2: 通过 iCloud.com

1. 访问：https://www.icloud.com/
2. 登录 joyma01@icloud.com
3. 点击头像 → 账户设置
4. 找到 "应用专用密码"
5. 生成密码

---

## 配置成功后的步骤

### 1. 复制 Service ID

配置成功后，EmailJS 会显示：
```
Service created successfully!
Service ID: service_xxxxxxxxx
```

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
6. 输入：`Update to use iCloud SMTP`
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

## 常见问题

### Q: 应用专用密码生成后还是认证失败？

A: 请检查：
1. 密码是否正确复制（没有多余空格）
2. 是否使用了正确的 iCloud 邮箱
3. SMTP Host 是否正确（smtp.mail.me.com）
4. Port 是否正确（587）

### Q: 找不到应用专用密码选项？

A: 可能原因：
1. 没有开启双重认证
2. Apple ID 设置问题

解决：
1. 先开启 Apple ID 的双重认证
2. 然后再生成应用专用密码

### Q: 还是不行怎么办？

A: 考虑使用其他邮箱：
- Gmail（需要应用专用密码）
- Outlook（可以直接用密码）
- QQ 邮箱（需要授权码）

---

**现在请：**
1. 生成 iCloud 应用专用密码
2. 在 EmailJS 中填写 SMTP 配置
3. 复制新的 Service ID
4. 告诉我新的 Service ID

我会帮您更新代码！
