# GitHub 分支保护设置指南

## 什么是分支保护？

分支保护规则可以防止他人意外删除或推送不合规的代码到您的 `main` 分支。

---

## 设置步骤

### 步骤 1: 进入仓库设置

1. 访问您的仓库：https://github.com/tianshanxyz/h-guardian
2. 点击 **Settings** 标签（右侧）

### 步骤 2: 创建分支保护规则

1. 在左侧菜单点击 **Branches**
2. 点击 **Add branch protection rule**
3. Branch name pattern: 输入 `main`
4. 点击 **Create**

### 步骤 3: 配置保护规则

勾选以下选项：

#### 基础保护（必选）✅

- [x] **Require a pull request before merging**
  - 要求合并前必须通过 Pull Request
  - 建议勾选：
    - [ ] Require approvals (需要审核通过)
    - [ ] Dismiss stale pull request approvals when new commits are pushed

- [x] **Require status checks to pass before merging**
  - 要求状态检查通过才能合并
  - 由于是静态网站，暂时不需要配置

- [x] **Require branches to be up to date before merging**
  - 要求分支在合并前是最新的

#### 高级保护（推荐）✅

- [x] **Do not allow bypassing the above settings**
  - 不允许绕过上述设置

- [x] **Restrict who can push to matching branches**
  - 限制谁可以推送到匹配的分支
  - 只允许您自己（tianshanxyz）

- [x] **Allow force pushes only for repository owners**
  - 只允许仓库所有者进行强制推送

- [ ] **Allow deletions**
  - ⚠️ 不要勾选此项，防止分支被删除

### 步骤 4: 保存规则

点击 **Create** 或 **Save changes** 按钮

---

## 验证设置

### 测试 1: 尝试直接推送

在本地终端尝试：
```bash
git push origin main
```

如果保护规则生效，您应该看到错误提示，要求先创建 Pull Request。

### 测试 2: 检查规则状态

1. 返回仓库主页
2. 点击 **Settings** → **Branches**
3. 您应该看到创建的规则列表

---

## 日常使用流程

### 更新网站的正确方式：

#### 方法 1: 直接推送（如果您是唯一开发者）

如果您是唯一维护者，可以简化设置：
- 只勾选 **Require status checks**
- 不勾选 PR 要求

#### 方法 2: 使用 Pull Request（推荐）

1. **创建新分支**:
   ```bash
   git checkout -b update-website
   ```

2. **修改文件**:
   ```bash
   # 修改文件...
   git add .
   git commit -m "Update website content"
   ```

3. **推送到新分支**:
   ```bash
   git push origin update-website
   ```

4. **创建 Pull Request**:
   - 访问 GitHub 仓库
   - 点击 "Compare & pull request"
   - 填写 PR 描述
   - 点击 "Create pull request"

5. **合并 PR**:
   - 检查更改
   - 点击 "Merge pull request"
   - 确认合并

---

## 其他安全设置

### 1. 启用双因素认证 (2FA)

1. 点击右上角头像 → **Settings**
2. 左侧点击 **Password and authentication**
3. 在 "Two-factor authentication" 下点击 **Enable 2FA**
4. 按照提示设置（推荐使用认证器 App）

### 2. 设置依赖更新提醒

1. 进入仓库 **Settings**
2. 点击 **Code security and analysis**
3. 启用：
   - [x] **Dependabot alerts**
   - [x] **Dependabot security updates**

### 3. 限制访问权限

1. 进入仓库 **Settings**
2. 点击 **Collaborators**
3. 只添加必要的协作者
4. 为每个协作者设置适当的权限

---

## Cloudflare Pages 自动部署配置

### 连接 GitHub 自动部署：

1. 访问 https://dash.cloudflare.com/
2. 进入 **Workers & Pages** → **h-guardian**
3. 点击 **Settings**
4. 在 **Build & deployments** 部分：
   - Production branch: `main`
   - 确保 **Connected to Git** 状态为绿色

### 启用预览部署：

1. 在 Pages 项目页面
2. 点击 **Settings** → **Build & deployments**
3. 在 **Previews** 部分：
   - 开启 **Production branch** 的预览
   - 这样每次 PR 都会生成预览链接

---

## 故障排除

### Q: 无法推送代码到 main 分支？
A: 这是正常的！您需要：
1. 创建新分支
2. 推送到新分支
3. 创建 Pull Request
4. 合并到 main

### Q: 如何紧急修复？
A: 仓库所有者可以：
1. 临时关闭保护规则
2. 进行紧急修复
3. 重新开启保护规则

### Q: Dependabot 一直提示更新？
A: 可以：
1. 查看 Dependabot alerts
2. 点击 "Create security update PR"
3. 审核并合并

---

## 最佳实践

1. ✅ 永远不要直接在 main 分支上工作
2. ✅ 为每个功能/修复创建新分支
3. ✅ 使用描述性的 commit 信息
4. ✅ 定期拉取最新代码
5. ✅ 在合并前测试更改
6. ✅ 启用 2FA 保护账号

---

## 需要帮助？

GitHub 文档: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
