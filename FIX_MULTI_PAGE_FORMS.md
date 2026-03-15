# 修复多页面表单提交问题

## 问题分析

### Contact 页面 ✅
字段 ID：
- `inquiry-name`
- `inquiry-email`
- `inquiry-company`
- `inquiry-phone`
- `inquiry-country`
- `inquiry-subject`
- `inquiry-message`

### Customization 页面 ❌
字段 ID：
- `company-name` → 应该映射到 `company`
- `contact-person` → 应该映射到 `from_name`
- `email` → 应该映射到 `from_email`
- `phone` → 应该映射到 `phone`
- `country` → 应该映射到 `country`
- `product-type` → 应该映射到 `product_interest`
- `order-quantity` → 应该映射到 `quantity`
- `sample-needed` → 应该映射到 `sample_needed`
- `customization-details` → 应该映射到 `message`
- `additional-notes` → 应该映射到 `additional_notes`

### Products 页面 ❌
字段 ID：
- `name` → 应该映射到 `from_name`
- `email` → 应该映射到 `from_email`
- `country` → 应该映射到 `country`
- `phone` → 应该映射到 `phone`
- `product-interest` → 应该映射到 `product_interest`
- `quantity` → 应该映射到 `quantity`
- `message` → 应该映射到 `message`

---

## 解决方案

### 更新 form-handler.js

修改 `collectFormData` 函数，使其能够处理不同页面的表单字段。

**文件位置**：`js/form-handler.js`

**修改后的代码**：

```javascript
// 收集表单数据 - 支持多页面
function collectFormData(form) {
    const formData = {};
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        const id = input.id;
        const name = input.name;
        const value = input.value.trim();
        
        if (id || name) {
            // 使用 id 或 name 作为键
            const key = id || name;
            
            // 智能映射不同页面的字段
            if (id === 'company-name' || name === 'company-name') {
                formData['company'] = value;
            } else if (id === 'contact-person' || name === 'contact-person') {
                formData['from_name'] = value;
            } else if (id === 'name' || name === 'name') {
                formData['from_name'] = value;
            } else if (id === 'email' || name === 'email') {
                formData['from_email'] = value;
            } else if (id === 'phone' || name === 'phone') {
                formData['phone'] = value;
            } else if (id === 'country' || name === 'country') {
                formData['country'] = value;
            } else if (id === 'product-type' || name === 'product-type') {
                formData['product_interest'] = value;
            } else if (id === 'product-interest' || name === 'product-interest') {
                formData['product_interest'] = value;
            } else if (id === 'order-quantity' || name === 'order-quantity') {
                formData['quantity'] = value;
            } else if (id === 'quantity' || name === 'quantity') {
                formData['quantity'] = value;
            } else if (id === 'sample-needed' || name === 'sample-needed') {
                formData['sample_needed'] = value;
            } else if (id === 'customization-details' || name === 'customization-details') {
                formData['message'] = value;
            } else if (id === 'additional-notes' || name === 'additional-notes') {
                formData['additional_notes'] = value;
            } else if (id === 'message' || name === 'message') {
                formData['message'] = value;
            } else if (id === 'website' || name === 'website') {
                formData['website'] = value;
            } else if (id === 'inquiry-name' || name === 'inquiry-name') {
                formData['from_name'] = value;
            } else if (id === 'inquiry-email' || name === 'inquiry-email') {
                formData['from_email'] = value;
            } else if (id === 'inquiry-company' || name === 'inquiry-company') {
                formData['company'] = value;
            } else if (id === 'inquiry-phone' || name === 'inquiry-phone') {
                formData['phone'] = value;
            } else if (id === 'inquiry-country' || name === 'inquiry-country') {
                formData['country'] = value;
            } else if (id === 'inquiry-subject' || name === 'inquiry-subject') {
                formData['subject'] = value;
            } else if (id === 'inquiry-message' || name === 'inquiry-message') {
                formData['message'] = value;
            } else {
                // 其他字段直接使用 id/name 作为键
                formData[key] = value;
            }
        }
    });
    
    // 添加页面信息
    formData.page_url = window.location.href;
    formData.page_title = document.title;
    formData.submission_time = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    // 添加用户代理信息
    formData.user_agent = navigator.userAgent;
    formData.language = navigator.language;
    
    return formData;
}
```

---

## 或者：更简单的方案

### 修改所有表单使用统一的字段名

#### Customization 页面

打开 `customization.html`，找到表单字段，修改 `id` 和 `name`：

**原代码**（第 898 行）：
```html
<input type="text" id="company-name" class="form-control" required>
```

**改为**：
```html
<input type="text" id="inquiry-company" name="inquiry-company" class="form-control" required>
```

**原代码**（第 903 行）：
```html
<input type="text" id="contact-person" class="form-control" required>
```

**改为**：
```html
<input type="text" id="inquiry-name" name="inquiry-name" class="form-control" required>
```

**原代码**（第 923 行）：
```html
<input type="text" id="country" class="form-control" required>
```

**改为**：
```html
<input type="text" id="inquiry-country" name="inquiry-country" class="form-control" required>
```

依此类推...

#### Products 页面

打开 `products.html`，找到表单字段，修改 `id` 和 `name`：

**原代码**（第 651 行）：
```html
<input type="text" id="name" name="name" required>
```

**改为**：
```html
<input type="text" id="inquiry-name" name="inquiry-name" required>
```

**原代码**（第 672 行）：
```html
<input type="email" id="email" name="email" required>
```

**改为**：
```html
<input type="email" id="inquiry-email" name="inquiry-email" required>
```

---

## 🎯 推荐方案：更新 form-handler.js

**优点**：
- 不需要修改 HTML
- 支持所有页面的表单
- 更灵活

**步骤**：

1. 访问：https://github.com/tianshanxyz/h-guardian/blob/main/js/form-handler.js
2. 点击右上角铅笔图标
3. 找到 `collectFormData` 函数（大约第 38-68 行）
4. 替换为上面的完整代码
5. 提交保存

---

## 测试步骤

### 1. 更新代码后
等待 Cloudflare 部署完成（1-2 分钟）

### 2. 测试 Customization 页面
1. 访问：https://www.h-guardian.com/customization.html
2. 填写表单
3. 提交
4. 检查 info@h-guardian.com 邮箱
5. 确认所有字段都正确显示

### 3. 测试 Products 页面
1. 访问：https://www.h-guardian.com/products.html
2. 填写表单
3. 提交
4. 检查邮箱
5. 确认所有字段都正确显示

---

## 需要帮助？

请告诉我：
1. 您选择哪个方案？（更新 form-handler.js 或 修改 HTML）
2. 测试后邮件中是否包含了所有字段？
3. 还有哪些字段缺失？

我会继续帮您优化！
