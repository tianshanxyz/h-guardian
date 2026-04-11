# 清除 Cloudflare 缓存指南

## 为什么需要清除缓存

Functions 代码已更新，但 Cloudflare 边缘节点可能还在使用旧的缓存响应。

## 操作步骤

### 步骤 1: 清除 Cloudflare 缓存

1. 登录 https://dash.cloudflare.com/
2. 选择域名 `h-guardian.com`
3. 进入 **Caching** > **Configuration**
4. 点击 **Purge Everything**（清除所有内容）
5. 等待 2-3 分钟

### 步骤 2: 清除浏览器缓存

**Windows**: Ctrl + Shift + R
**Mac**: Cmd + Shift + R

### 步骤 3: 测试验证

```bash
# 测试根域名
curl -I https://h-guardian.com

# 预期输出：
# HTTP/2 301
# Location: https://www.h-guardian.com/
```

## 如果仍然不行

### 方案 A: 检查 Functions 部署状态

1. 访问 https://pages.cloudflare.com/
2. 选择项目 `h-guardian`
3. 查看 **Deployments** 标签
4. 确认最新部署是否包含 Functions

### 方案 B: 禁用缓存（临时测试）

```bash
curl -H "Cache-Control: no-cache" -I https://h-guardian.com
```

### 方案 C: 使用不同的测试方式

```bash
# 使用不同的 User-Agent
curl -A "Mozilla/5.0 (Test)" -I https://h-guardian.com
```

## 预期结果

清除缓存后：
- `https://h-guardian.com` → **301 重定向** → `https://www.h-guardian.com`
- 总访问时间 < 1秒
