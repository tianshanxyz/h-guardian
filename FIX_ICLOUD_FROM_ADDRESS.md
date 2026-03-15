# iCloud SMTP 发件人地址错误修复

## 错误信息
```
550 5.7.0 From address is not one of your addresses
```

## 问题原因
iCloud SMTP 要求发件人地址必须是 `joyma01@icloud.com`，但 EmailJS 模板可能使用了其他地址。

---

## 解决方案

### 步骤 1: 修改 EmailJS 模板配置

1. 访问：https://dashboard.emailjs.com/admin/templates
2. 找到模板 `template_rfge4zj`
3. 点击 **Edit**

### 步骤 2: 修改 Settings 配置

在 **Settings** 标签页：

#### From email 设置
```
From email: joyma01@icloud.com  ← 必须与 iCloud 邮箱一致
```

#### To email 设置
```
To email: info@h-guardian.com
```

#### Reply-to 设置
```
Reply-to: {{from_email}}  ← 这样回复会发给网站访客
```

#### Subject 设置
```
Subject: [H-Guardian Website] {{subject}}
```

### 步骤 3: 保存模板

点击 **Save** 保存更改

### 步骤 4: 测试

1. 在 EmailJS Dashboard 点击 **Send Test**
2. 填写测试数据
3. 检查 info@h-guardian.com 是否收到

---

## 完整的 EmailJS 配置

### Service 配置 (已完成)
```
Service ID: service_j0lhwp4
Type: SMTP Server
SMTP Host: smtp.mail.me.com
SMTP Port: 587 或 465
Username: joyma01@icloud.com
Password: [应用专用密码]
```

### Template 配置 (需要修改)
```
Settings 标签:
- To email: info@h-guardian.com
- From email: joyma01@icloud.com  ← 关键！
- From name: {{from_name}}
- Reply-to: {{from_email}}
- Subject: [H-Guardian Website] {{subject}}
```

---

## 修改后测试

### 1. 在 EmailJS 测试
1. Dashboard → Email Templates
2. 编辑模板
3. 点击 **Send Test**
4. 填写测试信息
5. 检查邮箱

### 2. 在网站测试
1. 清除缓存：Cmd+Shift+R
2. 访问：https://www.h-guardian.com/contact.html
3. 提交表单
4. 检查 Console 日志
5. 检查 info@h-guardian.com 邮箱

---

## 如果还是报错

请提供：
1. EmailJS 模板 Settings 标签截图
2. Console 错误信息
3. EmailJS Email History 截图
