# ⚠️ 需要手动推送更新

## 已完成的更新

✅ 已更新文件：`js/form-handler.js`
- Service ID: `service_uv0j9z9`
- 邮箱：`joyma01@icloud.com`

## 需要您手动推送

### 方法 1: 使用 GitHub Desktop（推荐）

1. 打开 GitHub Desktop
2. 选择 `h-guardian` 仓库
3. 您会看到 `form-handler.js` 有更改
4. 填写提交信息：`Update EmailJS service ID to service_uv0j9z9`
5. 点击 **Commit to main**
6. 点击 **Push origin**

### 方法 2: 命令行推送

在终端执行：
```bash
cd /Users/maxiaoha/Desktop/NANJING\ FREEMAN/website
git add js/form-handler.js
git commit -m "Update EmailJS service ID to service_uv0j9z9"
git push origin main
```

### 方法 3: GitHub 网页上传

1. 访问：https://github.com/tianshanxyz/h-guardian/blob/main/js/form-handler.js
2. 点击编辑图标
3. 粘贴更新后的代码
4. 填写提交信息
5. 点击 **Commit changes**

---

## 推送后的测试步骤

### 1. 清除浏览器缓存
- **Mac**: Cmd + Shift + R
- **Windows**: Ctrl + Shift + R

### 2. 打开 Console（F12）

### 3. 访问联系页面
https://www.h-guardian.com/contact.html

### 4. 填写并提交表单
```
Name: Test User
Email: your-test-email@example.com
Company: Test Company
Subject: EmailJS Test
Message: Testing new EmailJS service
```

### 5. 检查 Console 日志
应该看到：
```
✅ EmailJS initialized successfully
📝 Form submission started
📧 Sending email via EmailJS...
✅ Email sent successfully
✅ Form submitted successfully
```

### 6. 检查邮箱
- **收件箱**: joyma01@icloud.com
- 主题：`[H-Guardian Website] EmailJS Test`

---

## Cloudflare 会自动部署

推送到 GitHub 后：
1. Cloudflare Pages 会自动检测更改
2. 自动重新部署（约 1-2 分钟）
3. 无需手动操作

您可以访问 Cloudflare Dashboard 查看部署状态：
https://dash.cloudflare.com/

---

## 如果仍然失败

请提供：
1. Console 中的错误信息
2. EmailJS Dashboard 中的发送历史截图
3. Cloudflare 部署状态
