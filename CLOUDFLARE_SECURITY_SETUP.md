# Cloudflare 安全配置快速指南

## 登录 Cloudflare Dashboard
访问：https://dash.cloudflare.com/

---

## 步骤 1: SSL/TLS 设置 🔒

1. 选择您的域名 `h-guardian.com`
2. 点击 **SSL/TLS** 标签
3. 配置以下设置：

### Encryption Mode
- 选择 **Full** 或 **Full (strict)**

### Always Use HTTPS
- SSL/TLS → Edge Certificates
- 开启 **Always Use HTTPS** ✅

### Minimum TLS Version
- 设置为 **1.2**

### Opportunistic Encryption
- 开启 ✅

### TLS 1.3
- 开启 ✅

---

## 步骤 2: 防火墙设置 🛡️

1. 点击 **Security** → **WAF**

### 创建防火墙规则：

#### 规则 1: 阻止恶意爬虫
```
Name: Block Bad Bots
Field: User Agent
Operator: contains
Value: bot, crawler, spider
Action: Block
```

#### 规则 2: 保护管理路径
```
Name: Protect Admin Paths
Field: URI Path
Operator: contains
Value: /wp-admin or /admin or /phpmyadmin
Action: Block
```

---

## 步骤 3: DDoS 保护 🚀

1. **Security** → **Settings**
2. 确保以下设置为 **On**:
   - ✅ DDoS protection
   - ✅ Web Application Firewall (WAF)

3. **Security Level**: 设置为 **Medium**

---

## 步骤 4: Bot 防护 🤖

1. **Security** → **Bots**
2. 开启 **Bot Fight Mode** ✅

---

## 步骤 5: 速率限制 ⚡

1. **Security** → **WAF** → **Rate limiting rules**
2. 创建规则：

```
Name: Limit Page Requests
If incoming requests:
  - URI Path: contains "/"
  - and: Requests > 100
  - and: per: 10 seconds
  - and: from: IP
Then: Block for 10 minutes
```

---

## 步骤 6: Pages 配置 ⚙️

1. **Workers & Pages** → **h-guardian**
2. 点击 **Settings**

### Build settings
- Production branch: `main` ✅
- Build command: (留空) ✅
- Build output directory: `/` ✅

### Custom domains
- 确保 `www.h-guardian.com` 状态为 **Active** ✅

---

## 步骤 7: 缓存配置 💾

1. **Caching** → **Configuration**

### Caching Level
- 设置为 **Standard**

### Browser Cache TTL
- 设置为 **4 hours**

### Development Mode
- 保持 **Off**（除非在调试）

---

## 步骤 8: 监控设置 📊

1. **Analytics** → **Traffic**
2. 查看：
   - 访问量统计
   - 威胁分析
   - 缓存命中率

---

## 步骤 9: 邮件路由设置（可选）📧

如果需要企业邮箱：

1. **Email** → **Email Routing**
2. 开启 **Enable Email Routing**
3. 添加目标邮箱：`info@h-guardian.com`
4. 创建转发规则

---

## 验证配置

### 检查清单：
- [ ] SSL 证书已激活（浏览器显示锁图标）
- [ ] HTTPS 强制跳转正常工作
- [ ] 防火墙规则已启用
- [ ] Bot Fight Mode 已开启
- [ ] 速率限制已配置

### 测试工具：
1. SSL 测试: https://www.ssllabs.com/ssltest/
2. 安全头测试: https://securityheaders.com/
3. Cloudflare 测试: https://www.cloudflare.com/ssl/encrypted-sni

---

## 常见问题

### Q: 网站显示 "Too many redirects"
A: 检查 SSL/TLS 设置，确保选择 **Full** 模式

### Q: 图片不显示
A: 检查 Caching → Configuration，清除缓存

### Q: 表单提交失败
A: 检查防火墙规则，确保没有阻止 EmailJS

---

## 需要帮助？

Cloudflare 支持: https://support.cloudflare.com/
文档: https://developers.cloudflare.com/
