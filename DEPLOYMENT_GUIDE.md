# 网站部署指南 - Cloudflare Pages

## 概述

本指南将帮助您将 H-Guardian 网站部署到 Cloudflare Pages，并绑定自定义域名 www.h-guardian.com。

---

## 步骤 1: 创建 GitHub 仓库

1. 访问 https://github.com/ 并登录您的账号
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写信息：
   - Repository name: `h-guardian-website`
   - Description: H-Guardian Official Website
   - 选择 "Public"
   - **不要**勾选 "Add a README file"
4. 点击 "Create repository"

---

## 步骤 2: 上传网站文件

在创建仓库后，您会看到 "push an existing folder" 的说明。按照以下步骤：

### 方法 A: 使用 Git 命令行（推荐）

```bash
# 1. 进入网站目录
cd /Users/maxiaoha/Desktop/NANJING\ FREEMAN/website

# 2. 初始化 Git 仓库（如果还没有）
git init

# 3. 添加所有文件
git add .

# 4. 提交更改
git commit -m "Initial commit - H-Guardian Website"

# 5. 添加远程仓库（替换为您的仓库URL）
git remote add origin https://github.com/YOUR_USERNAME/h-guardian-website.git

# 6. 推送到 GitHub
git push -u origin main
```

### 方法 B: 使用 GitHub Desktop

1. 下载并安装 GitHub Desktop: https://desktop.github.com/
2. 打开 GitHub Desktop
3. 选择 "Add an Existing Repository"
4. 选择网站文件夹
5. 点击 "Commit to main"
6. 点击 "Publish repository"

### 方法 C: 直接上传（如果没有 Git）

1. 在 GitHub 仓库页面，点击 "uploading an existing file"
2. 拖放所有网站文件到上传区域
3. 填写提交信息: "Initial commit"
4. 点击 "Commit changes"

---

## 步骤 3: 连接 Cloudflare Pages

1. 访问 https://pages.cloudflare.com/ 并登录 Cloudflare 账号
2. 点击 "Create a project"
3. 选择 "Connect to Git"
4. 选择 GitHub 并授权
5. 选择您刚创建的 `h-guardian-website` 仓库
6. 配置设置：
   - Project name: `h-guardian`
   - Production branch: `main`
   - Build settings: 
     - Build command: (留空)
     - Build output directory: `/` (根目录)
7. 点击 "Save and Deploy"

---

## 步骤 4: 添加自定义域名

部署完成后：

1. 在 Cloudflare Pages 项目中，点击 "Custom domains"
2. 点击 "Set up a custom domain"
3. 输入您的域名: `www.h-guardian.com`
4. 点击 "Activate Domain"

Cloudflare 会自动配置 SSL 证书和 DNS 设置。

---

## 步骤 5: 配置 DNS（如果需要）

如果 Cloudflare 提示需要手动配置 DNS：

1. 登录 Cloudflare 仪表板
2. 选择您的域名
3. 进入 "DNS" 设置
4. 添加以下记录：

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| CNAME | www | h-guardian.pages.dev | Proxied |

---

## 步骤 6: 转移域名 DNS（可选）

如果您希望 Cloudflare 管理您的整个域名 DNS：

1. 在 Cloudflare 中添加您的域名
2. 按照指示更新域名的 Nameservers
3. 等待 DNS 传播（通常几分钟到几小时）

---

## 验证部署

部署完成后，访问以下地址验证：
- Cloudflare 分配的临时域名: `https://h-guardian.pages.dev`
- 您的自定义域名: `https://www.h-guardian.com`

---

## 后续更新

当您更新网站后，只需将更改推送到 GitHub，Cloudflare Pages 会自动重新部署：

```bash
git add .
git commit -m "Update website"
git push
```

---

## 支持

如有问题，请检查：
1. GitHub 仓库是否正确创建
2. Cloudflare 是否已连接到正确的仓库
3. 域名 DNS 是否正确配置
4. SSL 证书是否已激活

---

## 文件清单

确保以下文件都已上传到 GitHub：

```
/website
├── index.html
├── products.html
├── factory.html
├── customization.html
├── contact.html
├── 404.html
├── privacy-policy.html
├── terms-of-service.html
├── product-detail.html
├── disposable-mask-for-adults.html
├── disposable-mask-for-teens.html
├── disposable-mask-for-kids.html
├── double-nose-clip-mask.html
├── sitemap.xml
├── robots.txt
├── site.webmanifest
├── css/
│   ├── style.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── language.js
│   └── form-handler.js
├── lang/
│   ├── en.json
│   ├── fr.json
│   ├── es.json
│   └── ar.json
├── images/
│   └── (所有图片文件)
└── FORM_CONFIG_GUIDE.md (可选)
```

---

如有任何问题，请随时询问！
