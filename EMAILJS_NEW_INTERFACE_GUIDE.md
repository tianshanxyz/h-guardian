# EmailJS 新界面服务创建指南

## 在 EmailJS 新界面中创建邮件服务

### 步骤 1: 访问服务页面

1. 登录：https://dashboard.emailjs.com/
2. 点击左侧 **Email Services**
3. 点击 **Add New Service**

### 步骤 2: 选择正确的服务类型

在 "Add New Service" 页面，您会看到多个选项：

#### 选项 1: **Email API** (推荐)
- 图标：信封图标
- 描述：使用 EmailJS 的默认邮件服务
- 无需配置邮箱
- 直接点击 **Create**

#### 选项 2: **Gmail**
- 需要 Google 账号
- 需要 OAuth 授权

#### 选项 3: **Outlook/Hotmail**
- 需要 Microsoft 账号

#### 选项 4: **Custom SMTP**
- 需要 SMTP 服务器信息

### 步骤 3: 选择 "Email API"

**请查找带有信封图标的 "Email API" 选项**，这通常是第一个选项。

如果看不到 "Email API"，可能叫：
- "Default Service"
- "Email Service"
- 或者图标是信封的选项

### 步骤 4: 创建服务

1. 点击 "Email API" 选项
2. 点击 **Create** 按钮
3. 系统会自动生成 Service ID
4. 复制这个 Service ID

### 步骤 5: 更新网站代码

1. 访问：https://github.com/tianshanxyz/h-guardian/blob/main/js/form-handler.js
2. 点击右上角铅笔图标
3. 按 Cmd+F 搜索 `serviceId`
4. 将旧的 Service ID 替换为新的
5. 提交更改

### 示例：

**旧配置：**
```javascript
serviceId: 'service_9zp6s9v',  // 旧的 Gmail/iCloud 服务
```

**新配置：**
```javascript
serviceId: 'service_xxxxxxxxx',  // 新的 Email API 服务 ID
```

### 步骤 6: 测试

1. 等待 Cloudflare 重新部署（1-2 分钟）
2. 清除浏览器缓存：Cmd+Shift+R
3. 访问：https://www.h-guardian.com/contact.html
4. 测试表单提交

---

## 如果找不到 "Email API"

如果在服务选项中看不到 "Email API"，请：

1. **截取 "Add New Service" 页面的屏幕截图**
2. **发送给我**
3. 我会告诉您选择哪个选项

通常在新界面中，EmailJS 可能会把 "Email API" 称为：
- "Default Service"
- "Built-in Service" 
- "Email Service"
- 或者直接是 "API" 选项

---

## 验证服务是否创建成功

创建后，在 Email Services 页面，您应该看到：

- **Service Name**: Email API 或类似名称
- **Status**: Active
- **Service ID**: service_xxxxxxxxx 格式

---

**请尝试找到 "Email API" 选项并创建服务，然后告诉我新的 Service ID！**