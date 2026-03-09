# 表单提交配置指南

## 当前状态

网站表单现在支持三种邮件发送方式：

### 方式1: EmailJS（推荐 - 免费）

**优点：**
- 完全免费（每月200封邮件）
- 无需后端服务器
- 自动发送邮件到 info@h-guardian.com
- 支持邮件模板自定义

**配置步骤：**

1. 访问 https://www.emailjs.com/ 注册账号

2. 创建 Email Service：
   - 点击 "Add New Service"
   - 选择 "Gmail"
   - 连接您的 Gmail 账户（或使用 info@h-guardian.com）

3. 创建 Email Template：
   - 点击 "Create New Template"
   - 模板内容示例：
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

4. 获取配置信息：
   - Public Key: 在 Account > General 页面
   - Service ID: 在 Email Services 页面
   - Template ID: 在 Email Templates 页面

5. 更新 `js/form-handler.js` 文件：
   ```javascript
   const EMAILJS_CONFIG = {
       publicKey: 'YOUR_ACTUAL_PUBLIC_KEY',
       serviceId: 'YOUR_ACTUAL_SERVICE_ID',
       templateId: 'YOUR_ACTUAL_TEMPLATE_ID',
       enabled: true  // 改为 true
   };
   ```

### 方式2: Formspree（备选 - 免费额度较少）

**优点：**
- 配置简单
- 免费版每月50封邮件

**配置步骤：**

1. 访问 https://formspree.io/ 注册账号

2. 创建新表单：
   - 点击 "New Form"
   - 输入接收邮箱：info@h-guardian.com
   - 获取 Form ID（如：xyzabcde）

3. 更新 `js/form-handler.js` 文件：
   ```javascript
   const FORMSPREE_CONFIG = {
       formId: 'YOUR_ACTUAL_FORM_ID',
       enabled: true  // 改为 true
   };
   ```

### 方式3: Mailto（当前默认 - 无需配置）

**说明：**
- 这是当前的默认方式
- 点击提交后会打开用户的邮件客户端
- 用户需要手动发送邮件
- **缺点：需要用户额外操作**

---

## 如何得知有人提交了数据？

### 使用 EmailJS 或 Formspree 时：

1. **邮件通知**：
   - 每次表单提交都会自动发送邮件到 info@h-guardian.com
   - 邮件包含所有表单数据和提交信息

2. **查看统计数据**：
   - EmailJS 控制台可以看到发送历史
   - Formspree 控制台可以看到提交记录

3. **浏览器控制台日志**：
   - 打开浏览器开发者工具 (F12)
   - 查看 Console 标签
   - 每次提交都会记录详细信息

---

## 快速启用指南

### 最简单的方法（推荐）：

1. 注册 EmailJS 账号
2. 创建 Gmail Service
3. 创建 Email Template
4. 复制 Public Key, Service ID, Template ID
5. 编辑 `js/form-handler.js`，填入配置并设置 `enabled: true`

### 测试表单：

打开浏览器控制台，输入：
```javascript
HGuardianForms.testSubmit()
```

---

## 表单位置

网站共有4个表单：

1. **contact.html** - General Inquiry Form (`#general-inquiry-form`)
2. **customization.html** - Customization Quote Form (`#customization-form`)
3. **products.html** - Product Inquiry Form (`#product-inquiry-form`)
4. **产品详情页** - Quick Inquiry Form (`#quick-inquiry`)

所有表单都会自动发送到 info@h-guardian.com

---

## 邮件模板变量

在 EmailJS 模板中可以使用以下变量：

| 变量名 | 说明 |
|--------|------|
| `{{from_name}}` | 提交者姓名 |
| `{{from_email}}` | 提交者邮箱 |
| `{{company}}` | 公司名称 |
| `{{phone}}` | 电话号码 |
| `{{country}}` | 国家 |
| `{{subject}}` | 主题 |
| `{{message}}` | 消息内容 |
| `{{page_url}}` | 提交页面URL |
| `{{submission_time}}` | 提交时间 |
| `{{user_agent}}` | 用户浏览器信息 |

---

## 需要帮助？

如有问题，请检查：
1. EmailJS/ Formspree 配置是否正确
2. 浏览器控制台是否有错误信息
3. 邮箱地址是否正确填写为 info@h-guardian.com
