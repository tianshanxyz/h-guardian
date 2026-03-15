# GitHub 网页编辑指南

由于网络问题无法推送，请直接通过 GitHub 网页更新代码。

## ⚠️ 重要提示

**只需要更新 1 个文件的 1 行代码！**

---

## 步骤 1: 访问文件

打开浏览器访问：
```
https://github.com/tianshanxyz/h-guardian/blob/main/js/form-handler.js
```

## 步骤 2: 进入编辑模式

1. 点击右上角的 **铅笔图标** (Edit this file)
2. 页面会进入编辑模式

## 步骤 3: 找到需要修改的行

1. 按 **Cmd+F** (Mac) 或 **Ctrl+F** (Windows) 搜索
2. 输入：`serviceId`
3. 找到第 16-18 行左右的代码

## 步骤 4: 修改 Service ID

**修改前：**
```javascript
const EMAILJS_CONFIG = {
    publicKey: '1_y80J3lBqJfYafV7',
    serviceId: 'service_9zp6s9v',  // ← 旧的
    templateId: 'template_rfge4zj',
    toEmail: 'info@h-guardian.com',
    enabled: true
};
```

**修改后：**
```javascript
const EMAILJS_CONFIG = {
    publicKey: '1_y80J3lBqJfYafV7',
    serviceId: 'service_uv0j9z9',  // ← 改成这个！
    templateId: 'template_rfge4zj',
    toEmail: 'info@h-guardian.com',
    enabled: true
};
```

**只需要改这一行：**
- `service_9zp6s9v` → `service_uv0j9z9`

## 步骤 5: 提交更改

1. 滚动到页面底部
2. 在 "Commit changes" 框中输入：
   ```
   Update EmailJS service ID to service_uv0j9z9
   ```
3. 选择 **Commit directly to the main branch**
4. 点击绿色按钮 **Commit changes**

## 步骤 6: 验证更新

1. 访问提交历史：
   ```
   https://github.com/tianshanxyz/h-guardian/commits/main
   ```
2. 应该看到您刚才的提交

## 步骤 7: 等待 Cloudflare 部署

1. 访问：https://dash.cloudflare.com/
2. Workers & Pages → h-guardian → Deployments
3. 等待 1-2 分钟
4. 状态变为 **Success**

## 步骤 8: 测试表单

1. **清除浏览器缓存**: Cmd+Shift+R
2. **访问**: https://www.h-guardian.com/contact.html
3. **打开 Console**: F12
4. **填写并提交表单**
5. **检查 Console 日志**:
   ```
   ✅ EmailJS initialized successfully
   📧 Sending email via EmailJS...
   ✅ Email sent successfully
   ✅ Form submitted successfully
   ```
6. **检查邮箱**: info@h-guardian.com

---

## 如果找不到需要修改的地方

直接访问这个文件的**原始内容**：
```
https://raw.githubusercontent.com/tianshanxyz/h-guardian/main/js/form-handler.js
```

搜索 `serviceId`，看看当前是什么值。

如果是 `service_9zp6s9v`，就按上面步骤修改为 `service_uv0j9z9`。

---

## 完成！

修改完成后，Cloudflare 会自动重新部署网站（约 1-2 分钟）。

然后测试表单，应该能正常发送邮件到 info@h-guardian.com。

---

**需要帮助？**

修改完成后告诉我，我会帮您验证！
