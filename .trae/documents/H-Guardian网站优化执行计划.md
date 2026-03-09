# H-Guardian 网站优化执行计划

## 阶段一：关键修复（立即执行）

### 1. 修复产品详情页链接错误
- 修复 `disposable-mask-for-adults.html` 中相关产品链接
- 将 `product-teen.html` → `disposable-mask-for-teens.html`
- 将 `product-kids.html` → `disposable-mask-for-kids.html`
- 同步修复其他产品详情页的相同问题

### 2. 首页Certification板块简化
- 移除Tab切换方式，改为简洁的图标横向展示
- 只保留4个核心认证：CE、FDA、SGS、ISO
- 添加"View All Certifications"按钮链接到Factory页面
- 减少首屏高度，提升用户体验

### 3. 添加图片懒加载
- 为所有产品图片添加 `loading="lazy"` 属性
- 为Factory页面的流程图片添加懒加载
- 首屏关键图片保持立即加载

### 4. 添加SEO标签
- 为所有页面添加Open Graph标签
- 添加Twitter Card标签
- 添加canonical URL标签

---

## 阶段二：功能完善

### 5. 多语言系统处理
- 暂时隐藏未完成的语言选项（法语、西班牙语、阿拉伯语）
- 保留英语和语言切换器框架，方便后续扩展

### 6. 添加返回顶部按钮
- 添加固定位置的返回顶部按钮
- 滚动超过300px时显示
- 平滑滚动动画

### 7. 表单验证反馈优化
- 添加实时验证样式（成功/错误边框颜色）
- 添加验证提示文字
- 改善提交按钮加载状态

---

## 阶段三：页面补充

### 8. 创建隐私政策页面
- 创建 `privacy-policy.html`
- 更新Footer链接

### 9. 创建服务条款页面
- 创建 `terms-of-service.html`
- 更新Footer链接

### 10. 创建404错误页面
- 创建 `404.html`
- 设计友好的错误提示页面

---

## 预期效果

| 优化项 | 预期效果 |
|--------|----------|
| 链接修复 | 消除404错误，改善用户体验 |
| Certification简化 | 首屏高度减少约200px，加载更快 |
| 图片懒加载 | 首屏加载时间减少30-50% |
| SEO标签 | 提升搜索引擎收录效果 |
| 返回顶部 | 改善长页面导航体验 |

---

是否批准执行此优化计划？