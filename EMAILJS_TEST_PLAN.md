# EmailJS 测试计划

## 🔍 问题修复

### 发现的问题
所有表单页面都缺少 EmailJS SDK，导致提交时报错"EmailJS not loaded"

### 已修复的页面

| 页面 | 修复内容 | 状态 |
|------|----------|------|
| `customization.html` | 添加 EmailJS SDK + 初始化 | ✅ 完成 |
| `contact.html` | 添加 EmailJS SDK + 初始化 | ✅ 完成 |
| `products.html` | 添加 EmailJS SDK + 初始化 | ✅ 完成 |
| `optimized-contact.html` | 添加 EmailJS SDK + 初始化 | ✅ 完成 |
| `product-detail.html` | 添加 EmailJS SDK + 初始化 | ✅ 完成 |
| `index.html` | 已有 EmailJS SDK | ✅ 正常 |

### 修复代码

所有页面现在都包含：

```html
<!-- EmailJS SDK -->
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script>
    // Initialize EmailJS
    (function() {
        emailjs.init('1_y80J3lBqJfYafV7');
        console.log('✅ EmailJS initialized on [page-name] page');
    })();
</script>
```

---

##  测试计划

### 等待部署完成后测试

**预计时间**: 2-3 分钟（等待 Cloudflare 自动部署）

### 测试表单列表

请按顺序测试以下 8 个表单：

#### 1. Customization 表单
- **URL**: https://www.h-guardian.com/customization.html
- **测试数据**:
  - Company Name: `Test Company AI`
  - Contact Person: `John AI Test`
  - Email: `test-ai@example.com`
  - Phone: `+86 123 4567 8900`
  - Product Type: `adult-mask`
  - Order Quantity: `500000-1000000`
  - Customization Details: `AI test customization request. Please send catalog and price list.`

#### 2. Contact 表单
- **URL**: https://www.h-guardian.com/contact.html
- **测试数据**:
  - Name: `AI Tester 1`
  - Email: `test-ai-1@example.com`
  - Company: `AI Test Corp`
  - Inquiry Type: `Sales Inquiry`
  - Message: `AI automated test message. Please confirm receipt.`

#### 3. Homepage Quick Quote
- **URL**: https://www.h-guardian.com/
- **测试数据**:
  - Product Type: `kn95`
  - Quantity: `200000`
  - Email: `test-ai-home@example.com`

#### 4. Products Page Inquiry
- **URL**: https://www.h-guardian.com/products.html
- **测试数据**:
  - Name: `AI Products Tester`
  - Email: `test-ai-products@example.com`
  - Company: `AI Products Inc`
  - Phone: `+86 987 6543 2100`
  - Country: `United States`
  - Product Interest: `adult-mask`
  - Message: `AI test from products page. Send me your best price.`

#### 5. Optimized Contact Form
- **URL**: https://www.h-guardian.com/optimized-contact.html
- **测试数据**:
  - Name: `AI Optimized Test`
  - Email: `test-ai-optimized@example.com`
  - Phone: `+86 555 666 7777`
  - Company: `AI Optimized Ltd`
  - Subject: `AI Test Inquiry`
  - Message: `Testing optimized contact form.`

#### 6. Product Detail - Main Inquiry Form
- **URL**: https://www.h-guardian.com/product-detail.html?product=adult-mask
- **测试数据**:
  - Name: `AI Detail Test`
  - Email: `test-ai-detail@example.com`
  - Company: `AI Detail Corp`
  - Phone: `+86 111 222 3333`
  - Country: `China`
  - Message: `AI test from product detail page.`

#### 7. Product Detail - Quick Inquiry
- **URL**: https://www.h-guardian.com/product-detail.html?product=adult-mask
- **测试数据**:
  - Email: `test-ai-quick@example.com`
  - Quantity: `300000`
  - Urgency: `standard`
  - **操作**: 点击"Get Quote" → 显示价格 → 点击"Contact Sales"

#### 8. Products Page - Card Inquiry (每个产品卡片)
- **URL**: https://www.h-guardian.com/products.html
- **测试数据**: 同第 4 个表单

---

## ✅ 验证步骤

### 步骤 1: 打开浏览器控制台

访问每个页面后，按 `F12` 打开控制台，应该看到：

```
✅ EmailJS initialized on [page-name] page
```

### 步骤 2: 提交表单

填写测试数据并提交表单。

### 步骤 3: 检查控制台日志

提交后应该看到：

```
📧 Sending [form-type] email...
Template params: {...}
✅ Email sent successfully: {...}
```

### 步骤 4: 检查邮箱

登录 info@h-guardian.com 邮箱，应该收到 8 封邮件，每封包含：

- **发件人**: 测试邮箱地址
- **主题**: 包含表单类型
- **内容**: 
  - 客户姓名/公司
  - 邮箱地址
  - 产品兴趣
  - 数量
  - 留言
  - 来源页面 URL
  - 提交时间

---

## 📊 预期结果

### 成功标志

- ✅ 所有 8 个表单都能提交
- ✅ 所有提交都显示成功消息
- ✅ 控制台显示 `✅ Email sent successfully`
- ✅ info@h-guardian.com 收到 8 封邮件
- ✅ 邮件内容完整正确

### 失败处理

如果仍然失败，请检查：

1. **控制台错误**：
   - 打开浏览器控制台（F12）
   - 查看红色错误信息
   - 截图发给我

2. **网络请求**：
   - 控制台 → Network 标签
   - 筛选 `emailjs` 请求
   - 查看请求状态

3. **EmailJS 状态**：
   ```javascript
   // 在控制台输入
   typeof emailjs  // 应该返回 "object"
   ```

---

## 🚀 部署状态

| 步骤 | 状态 |
|------|------|
| Git 提交 | ✅ **成功** (`ec78dbe`) |
| GitHub 推送 | ⏳ **网络问题** |
| Cloudflare 部署 | ⏳ **等待推送后自动部署** |

---

## 📝 测试时间表

1. **现在**: 代码已提交，等待网络恢复推送
2. **推送后 1-2 分钟**: Cloudflare 自动部署
3. **部署后**: 开始测试所有 8 个表单
4. **测试完成**: 检查 info@h-guardian.com 邮箱

---

## 🎯 测试检查清单

- [ ] customization.html 表单提交成功
- [ ] contact.html 表单提交成功
- [ ] index.html 表单提交成功
- [ ] products.html 表单提交成功
- [ ] optimized-contact.html 表单提交成功
- [ ] product-detail.html (主表单) 提交成功
- [ ] product-detail.html (快速询价) 提交成功
- [ ] info@h-guardian.com 收到 8 封测试邮件
- [ ] 所有邮件内容完整

---

**修复完成，等待部署后即可开始测试！** 🎉

**创建日期**: 2026-04-18  
**修复内容**: 为所有页面添加 EmailJS SDK
