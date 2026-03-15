# 表单提交问题排查清单

## 请提供以下信息

### 1. 浏览器 Console 日志

打开联系页面，按 F12，提交表单后，Console 显示什么？

**可能的情况：**

#### 情况 A: 显示成功 ✅
```
✅ EmailJS initialized successfully
📧 Sending email via EmailJS...
✅ Email sent successfully
✅ Form submitted successfully
```
**→ 说明代码正常，问题在 EmailJS 配置**

#### 情况 B: 显示 404 错误 ❌
```
❌ EmailJS send error: Not Found
```
**→ Template ID 错误或模板不存在**

#### 情况 C: 显示 401 错误 ❌
```
❌ EmailJS send error: Unauthorized
```
**→ Public Key 或 Service ID 错误**

#### 情况 D: 仍然打开本地邮箱 ❌
```
There was an issue with automatic submission...
```
**→ EmailJS SDK 未加载或初始化失败**

---

## 快速诊断步骤

### 步骤 1: 检查代码是否更新

在浏览器 Console 输入：
```javascript
HGuardianForms.getStatus()
```

应该显示：
```javascript
{
  emailjsLoaded: true,
  emailjsInitialized: true,
  formsCount: 4
}
```

如果 `emailjsLoaded: false`，说明页面缓存未更新。

**解决**: 强制刷新 Cmd+Shift+R

### 步骤 2: 测试 EmailJS 连接

在 Console 输入：
```javascript
HGuardianForms.testEmailJS()
```

应该显示：
```
Testing EmailJS connection...
✅ EmailJS SDK loaded
Config: {publicKey: "1_y80J3lBqJfYafV7", serviceId: "service_uv0j9z9", ...}
```

### 步骤 3: 检查 EmailJS Dashboard

访问：https://dashboard.emailjs.com/

#### 检查 Service
1. 点击 **Email Services**
2. 找到 `service_uv0j9z9`
3. 确认状态是 **Active**
4. 确认类型是 **Email API**（不是 Gmail）

#### 检查 Template
1. 点击 **Email Templates**
2. 找到 `template_rfge4zj`
3. 点击 **Settings** 标签
4. 确认 **To email** 是 `joyma01@icloud.com` 或 `info@h-guardian.com`

#### 检查发送历史
1. 点击 **Email History**
2. 查看是否有最近的发送记录
3. 状态是什么？

---

## 常见问题解决方案

### 问题 1: 代码未更新

**症状**: Console 显示旧的 Service ID

**解决**:
1. 清除浏览器缓存
2. 强制刷新（Cmd+Shift+R）
3. 如果还不行，尝试无痕模式

### 问题 2: GitHub 代码未推送

**症状**: 网站还是旧版本

**检查**:
1. 访问 https://github.com/tianshanxyz/h-guardian/blob/main/js/form-handler.js
2. 查看代码中 Service ID 是否是 `service_uv0j9z9`
3. 如果不是，说明没有推送到 GitHub

**解决**: 使用 GitHub Desktop 推送更改

### 问题 3: EmailJS 模板配置错误

**症状**: Console 显示发送成功但没收到邮件

**检查**:
1. EmailJS Dashboard → Email Templates
2. 编辑模板
3. Settings 标签 → To email 字段
4. 必须是 `joyma01@icloud.com`

**解决**: 更新 To email 并保存

### 问题 4: Cloudflare 缓存

**症状**: GitHub 已更新但网站还是旧的

**解决**:
1. 访问 Cloudflare Dashboard
2. 选择 h-guardian.com
3. Caching → Configuration
4. 点击 **Purge Everything**
5. 等待 30 秒

---

## 完整测试流程

### 1. 确认 GitHub 代码已更新

访问：https://github.com/tianshanxyz/h-guardian/blob/main/js/form-handler.js

搜索 `service_uv0j9z9`，确认存在。

### 2. 清除所有缓存

**Chrome/Safari**:
```
Cmd + Shift + Delete
选择 "Cached images and files"
点击 "Clear data"
```

**Cloudflare**:
```
Dashboard → Caching → Purge Everything
```

### 3. 重新测试

1. 打开无痕窗口
2. 访问 https://www.h-guardian.com/contact.html
3. 打开 Console（F12）
4. 填写表单
5. 提交
6. 截图 Console 输出

### 4. 检查 EmailJS

1. 访问 https://dashboard.emailjs.com/
2. 查看 Email History
3. 是否有发送记录？
4. 状态是什么？

---

## 请告诉我

1. **Console 显示什么？**（截图或复制文字）
2. **GitHub 代码是否已更新？**（Service ID 是 service_uv0j9z9 吗？）
3. **EmailJS Dashboard 有发送记录吗？**
4. **Cloudflare 部署状态？**（成功还是失败？）

根据您的回答，我会提供具体的解决方案。
