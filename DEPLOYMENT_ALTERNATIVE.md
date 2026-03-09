# 快速部署方案 - Cloudflare Pages 直接上传

如果您不想使用 GitHub，可以使用 Cloudflare Pages 的直接上传功能。

---

## 方案：使用 Wrangler CLI 直接上传

### 步骤 1: 安装 Cloudflare Wrangler

在终端中运行：

```bash
# 安装 Node.js (如果没有)
brew install node

# 安装 Wrangler
npm install -g wrangler
```

### 步骤 2: 登录 Cloudflare

```bash
wrangler login
```

这会打开浏览器，您需要登录您的 Cloudflare 账号并授权。

### 步骤 3: 创建 Cloudflare Pages 项目

```bash
# 进入网站目录
cd /Users/maxiaoha/Desktop/NANJING\ FREEMAN/website

# 创建 Pages 项目并上传
wrangler pages project create h-guardian

# 上传文件
wrangler pages deploy . --project-name=h-guardian
```

---

## 更简单的方案：使用 GitHub Desktop

如果您熟悉桌面应用，这个方案更简单：

### 步骤 1: 下载 GitHub Desktop

访问: https://desktop.github.com/

### 步骤 2: 创建仓库

1. 打开 GitHub Desktop
2. 点击 "Create a New Repository on GitHub"
3. 名称输入: `h-guardian-website`
4. 选择 "Public"
5. 点击 "Create Repository"

### 步骤 3: 添加网站文件

1. 出现提示 "No commits yet"
2. 点击 "Add a repository"
3. 选择网站文件夹: `/Users/maxiaoha/Desktop/NANJING FREEMAN/website`
4. 勾选所有文件
5. 填写提交信息: "Initial commit"
6. 点击 "Commit to main"

### 步骤 4: 发布

1. 点击 "Publish repository"
2. 完成后，点击 "View on GitHub"

---

## 然后连接 Cloudflare Pages

无论使用哪种方案，上传完成后：

1. 访问 https://pages.cloudflare.com/
2. 点击 "Create a project"
3. 选择 "Connect to Git"
4. 选择 `h-guardian-website` 仓库
5. 设置：
   - Build command: (留空)
   - Build output directory: `/`
6. 点击 "Save and Deploy"

7. 添加自定义域名：
   - 点击 "Custom domains"
   - 输入 `www.h-guardian.com`
   - 点击 "Activate Domain"

---

## 需要我帮您操作吗？

如果您愿意提供您的 GitHub 账号，我可以帮您创建仓库并上传文件。

或者，您可以按照上面的指南手动操作，有任何问题随时问我！
