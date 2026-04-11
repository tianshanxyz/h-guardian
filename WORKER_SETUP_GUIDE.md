# Cloudflare Worker 修改指南

## Worker 功能

这个 Worker 将实现以下功能：
1. ✅ 将 `h-guardian.com` 重定向到 `www.h-guardian.com`
2. ✅ 强制 HTTP 重定向到 HTTPS
3. ✅ 添加安全响应头
4. ✅ 添加性能优化头

---

## 修改步骤

### 步骤 1: 访问 Cloudflare Workers

1. 登录 https://dash.cloudflare.com/
2. 选择域名 `h-guardian.com`
3. 点击左侧菜单 **Workers & Pages**
4. 找到你的 Worker（名称应该是 `h-guardian`）
5. 点击 Worker 名称进入编辑页面

### 步骤 2: 编辑 Worker 代码

在 Worker 编辑界面，你会看到类似这样的代码：

```javascript
// 原来的 Worker 代码
```

**删除所有原有代码**，然后复制以下新代码：

```javascript
// Cloudflare Worker for H-Guardian
// Handles root domain redirect and HTTPS enforcement

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 获取请求头信息
    const userAgent = request.headers.get('User-Agent') || '';
    
    // 1. 如果访问的是根域名 h-guardian.com，重定向到 www.h-guardian.com
    if (url.hostname === 'h-guardian.com') {
      url.hostname = 'www.h-guardian.com';
      url.protocol = 'https:';
      
      // 创建 301 永久重定向响应
      return new Response(null, {
        status: 301,
        headers: {
          'Location': url.toString(),
          'Cache-Control': 'public, max-age=86400',
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
        }
      });
    }
    
    // 2. 如果使用的是 HTTP，重定向到 HTTPS
    if (url.protocol === 'http:' && url.hostname === 'www.h-guardian.com') {
      url.protocol = 'https:';
      
      return new Response(null, {
        status: 301,
        headers: {
          'Location': url.toString(),
          'Cache-Control': 'public, max-age=86400',
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
        }
      });
    }
    
    // 3. 添加安全响应头
    const response = await fetch(request);
    const newHeaders = new Headers(response.headers);
    
    // 安全头
    newHeaders.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    newHeaders.set('X-Content-Type-Options', 'nosniff');
    newHeaders.set('X-Frame-Options', 'DENY');
    newHeaders.set('X-XSS-Protection', '1; mode=block');
    newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // 性能优化头
    newHeaders.set('Cache-Control', 'public, max-age=3600');
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }
};
```

### 步骤 3: 保存并部署

1. 点击 **Save and Deploy** 或 **Deploy** 按钮
2. 等待部署完成（通常几秒钟）

### 步骤 4: 验证 Worker 配置

1. 在 Worker 详情页面
2. 点击 **Triggers** 标签
3. 确认 **Custom Domains** 中已包含 `h-guardian.com`
4. 如果没有，点击 **Add Custom Domain** 添加

---

## 测试验证

部署完成后，运行以下测试：

### 测试 1: 根域名重定向

```bash
curl -I https://h-guardian.com
```

**预期结果**：
```
HTTP/2 301
Location: https://www.h-guardian.com/
```

### 测试 2: HTTP 到 HTTPS 重定向

```bash
curl -I http://www.h-guardian.com
```

**预期结果**：
```
HTTP/2 301
Location: https://www.h-guardian.com/
```

### 测试 3: 性能测试

```bash
curl -w "\n总时间: %{time_total}s\n" -o /dev/null -s https://www.h-guardian.com
```

**预期结果**：
```
总时间: < 1秒
```

---

## 工作原理

### 根域名重定向逻辑

```
用户访问: https://h-guardian.com
    ↓
Worker 拦截请求
    ↓
检查 hostname === 'h-guardian.com'
    ↓
返回 301 重定向到 https://www.h-guardian.com/
    ↓
用户浏览器自动跳转到 www.h-guardian.com
```

### 响应头优化

Worker 还会为所有响应添加以下安全头：
- `Strict-Transport-Security` - 强制 HTTPS
- `X-Content-Type-Options` - 防止 MIME 类型嗅探
- `X-Frame-Options` - 防止点击劫持
- `X-XSS-Protection` - XSS 防护
- `Referrer-Policy` - Referrer 策略

---

## 常见问题

### Q: Worker 部署需要多长时间？
A: 通常几秒钟，最长不超过 1 分钟。

### Q: 301 重定向对 SEO 有影响吗？
A: 301 是永久重定向，搜索引擎会正确处理，不会影响 SEO。

### Q: 如果 Worker 不工作怎么办？
A: 
1. 检查 Worker 代码是否有语法错误
2. 确认 Custom Domain 已正确配置
3. 查看 Worker 日志排查错误
4. 清除浏览器缓存后重试

### Q: 可以只保留一个域名吗？
A: 可以，但建议保留根域名并重定向到 www，这是最佳实践。

---

## 性能优化效果

使用 Worker 后：
- ✅ 根域名立即重定向到 www
- ✅ 所有请求强制 HTTPS
- ✅ 添加安全响应头
- ✅ 提升网站安全性和 SEO

---

## 需要帮助？

如果遇到问题：
1. 查看 Cloudflare Workers 文档: https://developers.cloudflare.com/workers/
2. 查看 Worker 日志: 在 Worker 详情页 > Logs
3. 联系 Cloudflare 支持: https://support.cloudflare.com/
