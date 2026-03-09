# Git 推送指南

由于网络环境限制，请使用以下方法将本地代码推送到 GitHub：

---

## 方法 1: 使用 GitHub Desktop（推荐）

1. **下载 GitHub Desktop**:
   https://desktop.github.com/

2. **克隆您的仓库**:
   - 打开 GitHub Desktop
   - 选择 "Clone a repository"
   - 选择 `tianshanxyz/h-guardian`
   - 选择本地保存路径

3. **复制网站文件**:
   - 将 `/Users/maxiaoha/Desktop/NANJING FREEMAN/website` 目录下的所有文件
   - 复制到克隆的 `h-guardian` 文件夹中

4. **提交并推送**:
   - GitHub Desktop 会自动检测到更改
   - 填写提交信息: "Initial commit - H-Guardian Website"
   - 点击 "Commit to main"
   - 点击 "Push origin"

---

## 方法 2: 使用命令行（需要 GitHub CLI）

1. **安装 GitHub CLI**:
   ```bash
   brew install gh
   ```

2. **登录 GitHub**:
   ```bash
   gh auth login
   ```
   - 选择 "GitHub.com"
   - 选择 "HTTPS"
   - 选择 "Login with a web browser"
   - 复制一次性代码

3. **推送**:
   ```bash
   cd /Users/maxiaoha/Desktop/NANJING\ FREEMAN/website
   gh repo push origin main
   ```

---

## 方法 3: 手动上传（最简单）

1. 访问: https://github.com/tianshanxyz/h-guardian
2. 点击 "uploading an existing file"
3. 拖放所有网站文件
4. 填写提交信息
5. 点击 "Commit changes"

---

## 已准备好的文件

所有网站文件已准备好，位于:
```
/Users/maxiaoha/Desktop/NANJING FREEMAN/website
```

包含:
- ✅ 125 个文件
- ✅ 所有 HTML 页面
- ✅ 所有 CSS/JS 文件
- ✅ 所有图片
- ✅ 翻译文件 (en.json, fr.json, es.json, ar.json)
- ✅ sitemap.xml, robots.txt, site.webmanifest

---

## 推送后下一步

1. 访问 https://pages.cloudflare.com/
2. 点击 "Create a project" → "Connect to Git"
3. 选择 `h-guardian` 仓库
4. 设置 Build output directory 为 `/`
5. 添加自定义域名 `www.h-guardian.com`

---

需要帮助请告诉我！
