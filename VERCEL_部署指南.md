# 🚀 Vercel 部署指南 - PandaBlock 网站

## ❌ 当前部署错误原因

### 问题 1：缺少环境变量
您的 AI 客服系统需要 **DeepSeek API Key**，但 Vercel 项目中没有配置。

### 问题 2：API 配置问题
`vercel.json` 中的 API 配置可能与实际项目结构不匹配。

---

## ✅ 解决方案

### 方案 A：保留 AI 客服功能（推荐）

#### 步骤 1：配置环境变量

1. **访问 Vercel 项目设置**
   ```
   https://vercel.com/jzys-projects/pandablock-website1/settings/environment-variables
   ```

2. **添加环境变量**
   - 变量名：`DEEPSEEK_API_KEY`
   - 值：您的 DeepSeek API Key
   - 环境：Production, Preview, Development（全选）

3. **（可选）添加邮件通知环境变量**
   - `EMAIL_USER`：您的邮箱地址
   - `EMAIL_PASS`：您的邮箱密码或应用专用密码
   - `EMAIL_TO`：接收通知的邮箱地址

4. **（可选）添加 Telegram 通知环境变量**
   - `TELEGRAM_BOT_TOKEN`：您的 Telegram Bot Token
   - `TELEGRAM_CHAT_ID`：您的 Telegram Chat ID

#### 步骤 2：重新部署

1. **访问 Vercel 部署页面**
   ```
   https://vercel.com/jzys-projects/pandablock-website1
   ```

2. **点击最新的部署**

3. **点击右上角的 "Redeploy" 按钮**

4. **取消勾选 "Use existing Build Cache"**

5. **点击 "Redeploy"**

---

### 方案 B：禁用 AI 客服功能（快速修复）

如果您暂时不需要 AI 客服功能，可以禁用它：

#### 步骤 1：删除 API 目录

```bash
cd /home/jzy/桌面/WEB3开发平台/rocknblock.io
rm -rf api/
```

#### 步骤 2：从 HTML 中移除聊天组件

编辑 `index.html`，删除或注释掉以下代码：

```html
<!-- 删除这些行 -->
<script src="simple-chat-widget.js?v=2.0.1"></script>
<script src="chat-widget.js"></script>
```

#### 步骤 3：提交并推送

```bash
git add -A
git commit -m "🔧 临时禁用 AI 客服功能"
git push origin main
```

---

## 📋 当前 vercel.json 配置

我已经简化了 `vercel.json` 配置，移除了可能导致错误的 API 配置：

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## 🔍 检查部署状态

### 1. 查看部署日志

访问：https://vercel.com/jzys-projects/pandablock-website1/deployments

点击最新的部署，查看详细日志。

### 2. 常见错误及解决方法

#### 错误：`Missing environment variable`
**原因**：缺少 `DEEPSEEK_API_KEY` 环境变量
**解决**：按照"方案 A - 步骤 1"配置环境变量

#### 错误：`Build failed`
**原因**：构建配置问题
**解决**：确保 `package.json` 中的 `build` 脚本正确

#### 错误：`Function invocation failed`
**原因**：API 函数运行时错误
**解决**：检查 `api/chat.js` 代码和环境变量

---

## 🎯 推荐配置

### 完整的环境变量配置

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `DEEPSEEK_API_KEY` | DeepSeek AI API 密钥 | ✅ 是 |
| `EMAIL_USER` | 发送通知的邮箱 | ❌ 否 |
| `EMAIL_PASS` | 邮箱密码 | ❌ 否 |
| `EMAIL_TO` | 接收通知的邮箱 | ❌ 否 |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot Token | ❌ 否 |
| `TELEGRAM_CHAT_ID` | Telegram Chat ID | ❌ 否 |

---

## 📝 部署检查清单

在重新部署之前，请确认：

- [ ] ✅ `vercel.json` 配置正确
- [ ] ✅ `package.json` 存在且配置正确
- [ ] ✅ 环境变量已配置（如果使用 AI 客服）
- [ ] ✅ `api/chat.js` 文件存在（如果使用 AI 客服）
- [ ] ✅ 所有 HTML 文件中的品牌名称已更新
- [ ] ✅ 所有联系方式已更新

---

## 🚀 快速修复步骤

### 如果您想立即修复部署错误：

1. **提交当前的 vercel.json 更改**
   ```bash
   cd /home/jzy/桌面/WEB3开发平台/rocknblock.io
   git add vercel.json
   git commit -m "🔧 简化 Vercel 配置，移除 API 路由配置"
   git push origin main
   ```

2. **等待 Vercel 自动部署（2-3 分钟）**

3. **如果仍然失败，配置环境变量**
   - 访问：https://vercel.com/jzys-projects/pandablock-website1/settings/environment-variables
   - 添加 `DEEPSEEK_API_KEY`
   - 重新部署

---

## 💡 提示

### 获取 DeepSeek API Key

1. 访问：https://platform.deepseek.com/
2. 注册账号
3. 进入 API Keys 页面
4. 创建新的 API Key
5. 复制 Key 并添加到 Vercel 环境变量

### 测试 API 功能

部署成功后，访问：
```
https://www.pandablockdev.com
```

点击右下角的聊天按钮，发送消息测试 AI 客服功能。

---

## 📞 需要帮助？

如果部署仍然失败，请提供：
1. Vercel 部署日志的截图
2. 错误信息的详细内容
3. 您选择的解决方案（方案 A 或 方案 B）

我会立即帮您解决！

---

**更新时间**：2025-10-05
**文档版本**：1.0

