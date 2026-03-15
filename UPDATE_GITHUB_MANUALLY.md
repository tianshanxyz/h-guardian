# ⚠️ 请手动更新 GitHub 代码

## 由于网络问题，需要手动更新

### 步骤 1: 访问文件

打开浏览器访问：
```
https://github.com/tianshanxyz/h-guardian/blob/main/js/form-handler.js
```

### 步骤 2: 点击编辑

点击右上角的 **铅笔图标**

### 步骤 3: 找到 Service ID

按 **Cmd+F** 搜索：`serviceId`

### 步骤 4: 修改代码

**找到这一行（大约第 17-18 行）：**

```javascript
serviceId: 'service_uv0j9z9',  // 旧的
```

**改为：**

```javascript
serviceId: 'service_j0lhwp4',  // iCloud SMTP 服务
```

### 步骤 5: 提交

1. 滚动到页面底部
2. 在 "Commit changes" 输入：
   ```
   Update EmailJS service to service_j0lhwp4 (iCloud SMTP)
   ```
3. 选择 **Commit directly to the main branch**
4. 点击绿色按钮 **Commit changes**

### 步骤 6: 验证

访问提交历史：
```
https://github.com/tianshanxyz/h-guardian/commits/main
```

应该看到您刚才的提交。

---

## 完成后测试

### 1. 等待部署
- 访问：https://dash.cloudflare.com/
- Workers & Pages → h-guardian → Deployments
- 等待 1-2 分钟

### 2. 清除缓存
- 按 **Cmd+Shift+R**

### 3. 测试表单
1. 访问：https://www.h-guardian.com/contact.html
2. 打开 Console（F12）
3. 填写并提交表单
4. 观察 Console 日志

### 4. 检查邮箱
- 检查：**info@h-guardian.com**
- 应该收到测试邮件

---

## 如果仍然报错

请提供：
1. Console 截图
2. 错误信息
3. EmailJS Email History 截图

---

**请现在完成 GitHub 代码更新，然后测试表单！**
