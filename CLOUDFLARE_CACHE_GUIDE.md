# Cloudflare 缓存检查和清除指南

## 🔍 如何检查缓存是否生效

### 方法 1: 使用浏览器开发者工具
1. 打开网站 (www.h-guardian.com)
2. 按 F12 打开开发者工具
3. 切换到 Network (网络) 标签
4. 刷新页面
5. 查看静态资源 (CSS/JS/图片) 的响应头
6. 应该看到 `cf-cache-status: HIT` 或 `cf-cache-status: MISS`

### 方法 2: 使用 curl 命令
```bash
# 检查 CSS 文件缓存状态
curl -I https://www.h-guardian.com/css/style.css

# 查看响应头中的缓存相关字段
# 应该看到:
# - cf-cache-status: HIT (已缓存) 或 MISS (未缓存)
# - cache-control: public, max-age=31536000, immutable
# - age: xxx (缓存已存在的时间，秒)
```

### 方法 3: 使用在线工具
- https://www.giftofspeed.com/cache-checker/
- https://httpstatus.io/

## 🧹 如何清除 Cloudflare 缓存

### 方法 1: Cloudflare Dashboard (推荐)
1. 登录 https://dash.cloudflare.com
2. 选择您的域名 (h-guardian.com)
3. 点击左侧菜单 "Caching" (缓存)
4. 点击 "Configuration" (配置)
5. 找到 "Purge Cache" (清除缓存) 部分
6. 点击 "Purge Everything" (清除所有内容)
7. 确认清除

### 方法 2: 清除特定文件
1. 在 Caching > Configuration 页面
2. 选择 "Custom Purge" (自定义清除)
3. 输入要清除的文件 URL，例如：
   - `https://www.h-guardian.com/css/style.css`
   - `https://www.h-guardian.com/js/lazy-load.js`
4. 点击 "Purge" (清除)

### 方法 3: 使用 API (高级)
```bash
# 需要您的 Cloudflare API Token
curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

## ⚡ 额外的速度优化建议

### 1. 启用 Cloudflare 自动优化
1. 登录 Cloudflare Dashboard
2. 进入 "Speed" > "Optimization"
3. 启用以下选项：
   - Auto Minify (自动压缩): 勾选 HTML, CSS, JavaScript
   - Brotli Compression: 开启
   - Early Hints: 开启
   - HTTP/2 to Origin: 开启
   - HTTP/3 (with QUIC): 开启

### 2. 启用 Rocket Loader (谨慎使用)
- Speed > Optimization > Rocket Loader
- 可以延迟加载 JavaScript
- **注意**: 可能会影响表单功能，需要测试

### 3. 图片优化
- Speed > Optimization > Polish
- 开启 "Lossless" 或 "Lossy" 图片优化
- 开启 "WebP" 转换

### 4. 缓存规则优化
在 Rules > Page Rules 中添加：
```
URL: *h-guardian.com/images/*
设置: Cache Level - Cache Everything
      Edge Cache TTL - 1 month
```

## 📊 速度测试工具

1. **Google PageSpeed Insights**
   - https://pagespeed.web.dev/
   - 测试并查看性能评分

2. **GTmetrix**
   - https://gtmetrix.com/
   - 详细的性能分析报告

3. **WebPageTest**
   - https://www.webpagetest.org/
   - 多地点测试，查看首屏时间

4. **Pingdom**
   - https://tools.pingdom.com/
   - 简单易用的速度测试

## 🎯 预期效果

缓存生效后，您应该看到：
- **首次访问**: 2-5 秒加载时间
- **重复访问**: 0.5-1.5 秒加载时间 (大部分资源来自缓存)
- **PageSpeed 评分**: 提升到 80+ (移动端) / 90+ (桌面端)

## 🚨 如果速度仍然慢

请检查以下可能原因：

1. **服务器位置**: Cloudflare 免费版只使用部分数据中心
2. **图片过大**: 检查是否有未压缩的大图片
3. **第三方脚本**: Google Fonts, Font Awesome 可能加载慢
4. **网络问题**: 您的本地网络连接状况
5. **DNS 解析**: 检查 DNS 设置是否正确

## 📞 需要帮助？

如果清除缓存后速度仍然不理想，请提供：
1. 您的 Cloudflare 账户邮箱 (可以私信)
2. 速度测试截图 (PageSpeed Insights 结果)
3. 浏览器开发者工具的网络面板截图
