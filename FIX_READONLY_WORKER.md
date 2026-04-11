# 解决只读 Worker 导致的根域名访问慢问题

## 问题分析

Worker 是只读的，说明它是通过 **Cloudflare Pages** 自动创建的，无法直接删除。

## 解决方案

### 方案一：修改 Pages Functions 代码（推荐）

由于 Worker 是只读的，我们需要通过修改项目中的 Functions 代码来控制行为。

#### 步骤 1: 修改 functions/_middleware.js

将现有的 `_middleware.js` 修改为只处理根域名重定向：

```javascript
// Cloudflare Pages Functions Middleware
// 处理根域名重定向到 www

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // 根域名重定向到 www（最高优先级）
  if (url.hostname === 'h-guardian.com') {
    url.hostname = 'www.h-guardian.com';
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
  
  // 继续处理其他请求
  return context.next();
}
```

#### 步骤 2: 提交并部署

```bash
cd "/Users/maxiaoha/Desktop/NANJING FREEMAN/website"
git add functions/_middleware.js
git commit -m "Fix: Redirect root domain to www for performance"
git push origin main
```

#### 步骤 3: 等待部署

Cloudflare Pages 会自动部署 Functions（1-2分钟）。

---

### 方案二：禁用 Pages Functions

如果不需要 Functions 功能，可以完全禁用它：

#### 方法 A: 删除 functions 文件夹

```bash
cd "/Users/maxiaoha/Desktop/NANJING FREEMAN/website"
rm -rf functions/
git add .
git commit -m "Remove Functions to use pure Page Rules"
git push origin main
```

然后确保 Page Rules 已正确设置：
- URL: `h-guardian.com/*`
- Forwarding URL → `https://www.h-guardian.com/$1` (301)

#### 方法 B: 创建空 Functions

创建 `functions/_middleware.js`：

```javascript
// 空的 middleware，让 Page Rules 接管
export async function onRequest(context) {
  return context.next();
}
```

---

### 方案三：使用 wrangler.toml 配置

创建 `wrangler.toml` 文件来配置路由规则：

```toml
name = "h-guardian"
compatibility_date = "2024-01-01"

[site]
bucket = "."

# 禁用默认的 Worker 行为
[build]
command = ""

# 配置路由
[[routes]]
pattern = "h-guardian.com/*"
custom_domain = true
```

---

### 方案四：DNS 级别解决方案（绕过 Worker）

在 Cloudflare DNS 设置中：

1. 进入 **DNS** > **Records**
2. 删除或修改根域名的 Worker 路由
3. 添加 CNAME 记录：
   - Type: CNAME
   - Name: `@`
   - Content: `h-guardian.pages.dev`
   - Proxy status: Proxied

---

## 推荐方案

**首选方案一：修改 Functions 代码**

原因：
- 不需要删除 Worker
- 可以精确控制根域名行为
- 部署简单快速

---

## 验证方法

部署后测试：

```bash
# 测试根域名是否返回 301
curl -I https://h-guardian.com

# 预期输出：
# HTTP/2 301
# Location: https://www.h-guardian.com/

# 测试访问速度
curl -w "总时间: %{time_total}s\n" -o /dev/null -s -L https://h-guardian.com

# 预期：总时间 < 1秒
```

---

## 如果以上都不行

**终极方案：只使用 www 子域名**

1. 在 DNS 中删除根域名的 Worker 路由
2. 只保留 `www.h-guardian.com` 的解析
3. 在网站和营销材料中只使用 www 域名
4. 告诉用户访问 `www.h-guardian.com`

这是最简单可靠的方案，虽然不完美，但能立即解决问题。
