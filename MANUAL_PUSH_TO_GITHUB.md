# ⚠️ 需要手动推送到 GitHub

由于网络连接问题，无法自动推送到 GitHub。请按以下步骤手动推送：

## 方案 1: 使用 GitHub Desktop（最简单）⭐

1. **打开 GitHub Desktop**

2. **查看更改**
   - 左侧会看到 "Changes" 标签
   - 找到 `js/form-handler.js`

3. **提交更改**
   - 在底部输入：
     - Summary: `Update EmailJS service to service_uv0j9z9`
     - Description: `Use Email API service, send to info@h-guardian.com`
   - 点击蓝色按钮 **Commit to main**

4. **推送到 GitHub**
   - 点击右上角 **Push origin**
   - 等待推送完成

5. **验证**
   - 访问：https://github.com/tianshanxyz/h-guardian/commits/main
   - 应该看到最新的提交记录

## 方案 2: 命令行推送

在终端执行以下命令：

```bash
# 1. 进入网站目录
cd /Users/maxiaoha/Desktop/NANJING\ FREEMAN/website

# 2. 添加更改的文件
git add js/form-handler.js

# 3. 提交
git commit -m "Update EmailJS service to service_uv0j9z9"

# 4. 先拉取远程代码（避免冲突）
git pull origin main --rebase

# 5. 推送
git push origin main
```

如果第 4 步失败，说明网络问题，请使用方案 1。

## 方案 3: 直接编辑 GitHub 文件

1. **访问文件**
   https://github.com/tianshanxyz/h-guardian/blob/main/js/form-handler.js

2. **点击编辑图标**
   - 点击右上角的铅笔图标

3. **找到 Service ID 配置**
   ```javascript
   const EMAILJS_CONFIG = {
       publicKey: '1_y80J3lBqJfYafV7',
       serviceId: 'service_9zp6s9v',  // ← 改成 service_uv0j9z9
       templateId: 'template_rfge4zj',
       toEmail: 'info@h-guardian.com',
       enabled: true
   };
   ```

4. **修改并保存**
   - 将 `service_9zp6s9v` 改为 `service_uv0j9z9`
   - 滚动到底部
   - 输入提交信息：`Update EmailJS service ID`
   - 点击 **Commit changes**

## 推送后的验证步骤

### 1. 检查 GitHub 代码

访问：https://github.com/tianshanxyz/h-guardian/blob/main/js/form-handler.js

搜索 `service_uv0j9z9`，确认已更新。

### 2. 等待 Cloudflare 部署

1. 访问：https://dash.cloudflare.com/
2. Workers & Pages → h-guardian → Deployments
3. 应该看到新的部署（约 1-2 分钟）
4. 状态应该是 **Success** ✅

### 3. 测试表单

1. **清除缓存**: Cmd+Shift+R
2. **访问**: https://www.h-guardian.com/contact.html
3. **打开 Console**: F12
4. **填写表单**:
   ```
   Name: Test
   Email: your-email@example.com
   Subject: Test
   Message: Testing form submission
   ```
5. **提交**
6. **检查 Console**:
   ```
   ✅ Email sent successfully
   ✅ Form submitted successfully
   ```
7. **检查邮箱**: info@h-guardian.com

## EmailJS 配置确认

请再次确认 EmailJS Dashboard 设置：

1. 访问：https://dashboard.emailjs.com/admin/templates
2. 编辑模板 `template_rfge4zj`
3. **Settings** 标签：
   - **To email**: `info@h-guardian.com` ⭐
   - From name: `{{from_name}}`
   - From email: `{{from_email}}`
   - Reply-to: `{{from_email}}`
   - Subject: `[H-Guardian Website] {{subject}}`
4. 保存

## 需要帮助？

如果推送后仍然收不到邮件，请提供：
1. Console 截图
2. EmailJS Email History 截图
3. Cloudflare 部署状态截图
