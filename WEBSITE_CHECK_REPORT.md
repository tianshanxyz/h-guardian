# H-Guardian 网站检查报告

## 1. 网站显示检查 ✅

### 首页 (www.h-guardian.com)
- ✅ 页面加载正常
- ✅ 文字内容显示完整
- ✅ 导航菜单正常
- ⚠️ **图片可能未加载** - 需要检查图片路径

### 产品详情页
- ✅ 技术规格表格正常
- ✅ 认证信息正常
- ✅ 产品描述完整
- ⚠️ **产品图片需要确认**

---

## 2. 图片缺失问题排查

### 可能的原因：

1. **图片路径问题**
   - GitHub 仓库中图片是否在正确的文件夹？
   - 检查：`/images/products/` 文件夹是否存在？

2. **Cloudflare Pages 构建问题**
   - 图片文件是否被正确部署？
   - 检查 Cloudflare 部署日志

3. **浏览器缓存**
   - 尝试强制刷新：Ctrl+F5 (Windows) 或 Cmd+Shift+R (Mac)

### 解决方案：

请在浏览器中打开开发者工具（F12）：
1. 切换到 **Console** 标签
2. 查看是否有图片加载错误（404）
3. 截图发给我

或者在浏览器地址栏直接访问：
```
https://www.h-guardian.com/images/products/adult-mask-1.jpg
```

如果显示 404，说明图片没有正确上传到 GitHub。

---

## 3. 表单提交测试指南

### 测试步骤：

1. **打开联系页面**: https://www.h-guardian.com/contact.html

2. **填写测试表单**:
   - Name: Test User
   - Email: 您的测试邮箱
   - Company: Test Company
   - Message: This is a test message

3. **点击提交**

4. **检查邮箱**: info@h-guardian.com

### 预期结果：

如果配置正确，您应该收到一封邮件，包含：
- 发件人：EmailJS
- 主题：[H-Guardian Website] Website Inquiry
- 内容：表单提交的所有信息

### 如果没收到邮件：

1. 检查垃圾邮件文件夹
2. 检查 EmailJS Dashboard 查看发送状态
3. 打开浏览器 Console 查看是否有错误

---

## 4. 安全配置指南

### A. GitHub 安全设置

1. **启用双因素认证 (2FA)**
   - Settings → Password and authentication
   - 开启 Two-factor authentication

2. **设置分支保护**
   - Settings → Branches → Add branch protection rule
   - Branch name: `main`
   - 勾选 "Require pull request reviews"

3. **启用 Dependabot**
   - Settings → Code security and analysis
   - Enable Dependabot alerts

4. **限制访问权限**
   - Settings → Collaborators
   - 只添加必要的协作者

---

### B. Cloudflare 安全设置

1. **启用 SSL/TLS**
   - 进入 SSL/TLS 标签
   - 选择 **Full** 或 **Full (strict)** 模式

2. **配置防火墙规则**
   - Security → WAF
   - 创建规则阻止恶意请求：
   ```
   (ip.geoip.country in {"unknown country"}) and uri.path contains "/wp-"
   ```

3. **启用 DDoS 保护**
   - Security → Settings
   - 确保 DDoS protection 为 **On**

4. **配置 Security Level**
   - Security → Settings
   - Security level: **Medium** (推荐)

5. **启用 Bot Fight Mode**
   - Security → Bots
   - Bot Fight Mode: **On**

6. **配置速率限制**
   - Security → WAF → Rate limiting rules
   - 创建规则限制同一 IP 的请求频率

---

### C. 网站安全增强

1. **添加 security.txt**
   在根目录创建 `.well-known/security.txt`:
   ```
   Contact: mailto:info@h-guardian.com
   Expires: 2027-12-31T23:59:59.000Z
   Preferred-Languages: en, zh
   ```

2. **配置 Content Security Policy (CSP)**
   在 `<head>` 中添加:
   ```html
   <meta http-equiv="Content-Security-Policy" content="
     default-src 'self';
     script-src 'self' 'unsafe-inline' cdn.jsdelivr.net;
     style-src 'self' 'unsafe-inline' fonts.googleapis.com cdnjs.cloudflare.com;
     font-src 'self' fonts.gstatic.com;
     img-src 'self' data: https:;
   ">
   ```

3. **启用 HTTPS 强制跳转**
   - Cloudflare: SSL/TLS → Edge Certificates
   - 开启 **Always Use HTTPS**

4. **添加安全响应头**
   在 Cloudflare 中创建 Page Rule:
   ```
   www.h-guardian.com/*
   Settings:
   - Add Header: Strict-Transport-Security: max-age=31536000
   - Add Header: X-Content-Type-Options: nosniff
   - Add Header: X-Frame-Options: SAMEORIGIN
   - Add Header: X-XSS-Protection: 1; mode=block
   ```

---

## 5. 定期检查清单

### 每周检查：
- [ ] Cloudflare Analytics 查看流量
- [ ] GitHub 依赖更新通知
- [ ] EmailJS 发送统计

### 每月检查：
- [ ] 检查所有页面是否正常工作
- [ ] 测试表单提交功能
- [ ] 审查 Cloudflare 防火墙日志
- [ ] 更新备份

### 每季度检查：
- [ ] 审查访问权限
- [ ] 更新安全配置
- [ ] 检查证书有效期

---

## 6. 紧急联系信息

如遇到安全问题：
1. Cloudflare 支持: https://support.cloudflare.com/
2. GitHub 支持: https://support.github.com/
3. EmailJS 支持: https://www.emailjs.com/support/

---

**下一步行动**:
1. 确认图片是否正常显示
2. 测试表单提交功能
3. 按照安全指南配置各项设置
