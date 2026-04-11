# 解决 h-guardian.com 访问慢问题的完整方案

## 问题现状

| 域名 | 访问速度 | 问题 |
|------|----------|------|
| `www.h-guardian.com` | 0.0013秒 | ✅ 极速 |
| `h-guardian.com` | 4.34秒 | ❌ 仍然很慢 |

**根本原因**：根域名没有正确重定向到 www，导致直接访问根域名时存在性能问题。

---

## 方案一：删除 Worker，使用纯 Page Rules（推荐）

### 步骤 1: 删除 Worker

1. 登录 https://dash.cloudflare.com/
2. 选择域名 `h-guardian.com`
3. 进入 **Workers & Pages**
4. 找到 Worker `h-guardian`
5. 点击 **Manage** 或 **Settings**
6. 点击 **Delete** 删除 Worker

### 步骤 2: 设置 Page Rules

1. 进入 **Rules** > **Page Rules**
2. 创建新规则：
   - **URL**: `h-guardian.com/*`
   - **Setting**: Forwarding URL
   - **Status Code**: 301 - Permanent Redirect
   - **Destination URL**: `https://www.h-guardian.com/$1`
3. 保存并部署

### 步骤 3: 清除缓存

1. 进入 **Caching** > **Configuration**
2. 点击 **Purge Everything**

---

## 方案二：修改 Worker 代码（如果必须保留 Worker）

如果 Worker 用于其他功能，修改 Worker 代码：

```javascript
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 1. 根域名立即重定向到 www（最高优先级）
    if (url.hostname === 'h-guardian.com') {
      url.hostname = 'www.h-guardian.com';
      url.protocol = 'https:';
      
      return new Response(null, {
        status: 301,
        headers: {
          'Location': url.toString(),
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }
    
    // 2. 其他请求正常处理
    return fetch(request);
  }
};
```

---

## 方案三：DNS 级别解决方案

### 使用 CNAME 扁平化

1. 进入 **DNS** > **Records**
2. 添加记录：
   - **Type**: CNAME
   - **Name**: `@` (根域名)
   - **Content**: `h-guardian.pages.dev`
   - **Proxy status**: Proxied

注意：某些 DNS 提供商不支持根域名的 CNAME，但 Cloudflare 支持 CNAME 扁平化。

---

## 验证方法

测试命令：

```bash
# 测试根域名是否返回 301
curl -I https://h-guardian.com

# 预期输出：
# HTTP/2 301
# Location: https://www.h-guardian.com/

# 测试总时间
curl -w "总时间: %{time_total}s\n" -o /dev/null -s -L https://h-guardian.com

# 预期输出：
# 总时间: < 1秒
```

---

## 推荐操作顺序

1. **首选方案一**：删除 Worker + 设置 Page Rules
2. **如果 Worker 必须保留**：使用方案二修改 Worker 代码
3. **最后尝试方案三**：DNS CNAME 配置

---

## 预期结果

修复后：
- `https://h-guardian.com` → 301 重定向 → `https://www.h-guardian.com`
- 总访问时间 < 1秒
- 用户体验良好
