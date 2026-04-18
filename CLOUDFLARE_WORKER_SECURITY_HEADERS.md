# Cloudflare Workers 安全头部署指南

## 概述

此 Cloudflare Worker 脚本为网站添加全面的安全头，提升网站安全性和 SEO 表现。

## 部署步骤

### 步骤 1: 登录 Cloudflare Dashboard

访问：https://dash.cloudflare.com/

### 步骤 2: 创建 Worker

1. 点击左侧菜单 **Workers & Pages**
2. 点击 **Create application**
3. 点击 **Create Worker**
4. 输入 Worker 名称：`security-headers`
5. 点击 **Deploy**

### 步骤 3: 配置 Worker 代码

1. 点击 **Quick edit**
2. 复制 `cloudflare-security-worker.js` 文件的全部内容
3. 粘贴到 Worker 编辑器中
4. 点击 **Save and deploy**

### 步骤 4: 添加路由

1. 在 Worker 页面，点击 **Triggers** 标签
2. 在 **Routes** 部分，点击 **Add route**
3. 输入路由模式：
   - `h-guardian.com/*`
   - `www.h-guardian.com/*`
4. 选择 Worker: `security-headers`
5. 点击 **Add route**

### 步骤 5: 测试配置

访问 https://www.h-guardian.com/ 并检查响应头

使用在线工具验证:
- https://securityheaders.com/
- https://www.ssllabs.com/ssltest/

## 安全头说明

### 已添加的安全头

1. **Strict-Transport-Security (HSTS)**
   - 强制使用 HTTPS 连接
   - 有效期：1 年
   - 包含子域名
   - 支持预加载

2. **X-Content-Type-Options**
   - 防止 MIME 类型嗅探
   - 值：nosniff

3. **X-Frame-Options**
   - 防止点击劫持攻击
   - 值：DENY (不允许任何 iframe 嵌入)

4. **X-XSS-Protection**
   - 启用浏览器 XSS 过滤器
   - 值：1; mode=block

5. **Referrer-Policy**
   - 控制引荐来源信息发送
   - 值：strict-origin-when-cross-origin

6. **Permissions-Policy**
   - 限制浏览器功能使用
   - 禁用：geolocation, microphone, camera, payment 等

7. **Content-Security-Policy (CSP)**
   - 控制可加载的资源
   - 允许的来源：self, EmailJS, Google Fonts, Cloudflare

8. **Cache-Control**
   - 控制页面缓存
   - HTML 页面：1 小时缓存

9. **Cross-Origin Policies**
   - 增强跨域安全性
   - 包含：COEP, COOP, CORP

## 验证安全头

### 使用 curl 命令检查

```bash
curl -I https://www.h-guardian.com/
```

### 期望看到的安全头

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()
Content-Security-Policy: default-src 'self'; ...
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
```

## 自定义 CSP

如果需要根据实际需求调整 CSP，修改以下部分:

```javascript
newResponse.headers.set(
  'Content-Security-Policy',
  "default-src 'self'; " +
  "script-src 'self' 'unsafe-inline' https://cdn.emailjs.com; " +
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
  // ... 根据实际需要调整
)
```

## 故障排除

### 问题 1: 网站功能异常

如果某些功能无法使用，检查 CSP 配置:
- 打开浏览器开发者工具
- 查看 Console 中的 CSP 违规报告
- 将需要的域名添加到 CSP 允许列表

### 问题 2: 图片不显示

确保 CSP 中包含:
```
img-src 'self' data: https: blob:;
```

### 问题 3: 字体不显示

确保 CSP 中包含:
```
font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;
```

### 问题 4: 表单提交失败

确保 CSP 中包含:
```
connect-src 'self' https://api.emailjs.com;
```

## 性能优化建议

### 1. 启用 Brotli 压缩

在 Cloudflare Dashboard:
- **Caching** → **Optimization**
- 开启 **Brotli**

### 2. 启用自动 HTTPS 重写

在 Cloudflare Dashboard:
- **SSL/TLS** → **Edge Certificates**
- 开启 **Always Use HTTPS**

### 3. 启用 HTTP/2

在 Cloudflare Dashboard:
- **Network**
- 确保 **HTTP/2** 和 **HTTP/3 (with QUIC)** 已开启

### 4. 设置浏览器缓存

在 Cloudflare Dashboard:
- **Caching** → **Browser Cache TTL**
- 设置为 **4 hours** 或更长

## 监控和维护

### 1. 监控 CSP 违规

添加 CSP 报告端点:

```javascript
newResponse.headers.set(
  'Content-Security-Policy-Report-Only',
  "default-src 'self'; report-uri https://your-domain.com/csp-report"
)
```

### 2. 定期检查安全头

使用以下工具定期检查:
- https://securityheaders.com/
- https://observatory.mozilla.org/
- https://www.ssllabs.com/ssltest/

### 3. 更新 Worker

当需要修改安全头配置时:
1. 在 Cloudflare Dashboard 编辑 Worker
2. 修改代码
3. 点击 **Save and deploy**
4. 清除 Cloudflare 缓存

## 安全最佳实践

### 定期审查

- 每月检查一次安全头配置
- 审查 CSP 违规报告
- 更新允许的外部域名列表

### 最小权限原则

- 只允许必要的资源来源
- 禁用不需要的浏览器功能
- 定期清理不再使用的外部服务

### 文档更新

- 记录所有 CSP 允许的外部域名
- 说明每个域名的用途
- 保持文档与实际配置同步

## 联系支持

如有问题，请联系:
- Cloudflare 支持：https://support.cloudflare.com/
- 网站管理员：info@h-guardian.com

---

最后更新：2026-04-18
