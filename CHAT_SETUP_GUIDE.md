# 🤖 PandaBlock 在线客服系统部署指南

## 📋 系统概述

已为您的网站集成了完整的 AI 在线客服系统，包括：

✅ **自定义聊天窗口**（无需第三方服务）
✅ **DeepSeek AI 自动回复**（成本低，中文支持好）
✅ **邮件通知**（实时接收客户咨询）
✅ **移动端适配**（响应式设计）

---

## 🚀 快速部署步骤

### 第一步：注册 Resend 邮件服务

1. 访问：https://resend.com/
2. 点击 "Sign Up" 注册账号
3. 验证邮箱后，进入控制台
4. 点击 "API Keys" → "Create API Key"
5. 复制生成的 API Key（格式：`re_xxxxxxxxxx`）

**免费额度**：每月 3000 封邮件，完全够用！

---

### 第二步：配置 Vercel 环境变量

1. 登录 Vercel：https://vercel.com/
2. 进入您的项目：`pandablock-website1`
3. 点击 "Settings" → "Environment Variables"
4. 添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DEEPSEEK_API_KEY` | `sk-bbd5e8b2d6574dd38280aefcb816a2b2` | DeepSeek AI API Key |
| `RESEND_API_KEY` | `re_xxxxxxxxxx` | Resend 邮件服务 API Key |

5. 点击 "Save" 保存

---

### 第三步：推送代码到 GitHub

在终端执行以下命令：

```bash
cd rocknblock.io
git add .
git commit -m "添加AI在线客服系统"
git push origin main
```

Vercel 会自动检测到更新并重新部署。

---

### 第四步：测试客服系统

1. 等待 Vercel 部署完成（约 1-2 分钟）
2. 访问您的网站：https://pandablock-website1.vercel.app
3. 点击右下角的绿色聊天按钮
4. 发送测试消息，例如："你们提供哪些服务？"
5. 检查邮箱 `hayajaiahk@gmail.com` 是否收到通知

---

## 🎨 自定义配置

### 修改聊天窗口颜色

编辑 `simple-chat-widget.js` 文件的第 7 行：

```javascript
primaryColor: '#4CAF50',  // 改成您喜欢的颜色
```

### 修改欢迎消息

编辑 `simple-chat-widget.js` 文件的第 9-10 行：

```javascript
welcomeMessage: '您的自定义欢迎消息'
```

### 修改 AI 回复内容

编辑 `api/chat.js` 文件的第 18-42 行，修改 system prompt。

---

## 📧 邮件通知示例

当客户发送消息时，您会收到如下邮件：

**主题**：🔔 新客户咨询 - 访客

**内容**：
- 访客信息（姓名、邮箱、时间）
- 客户消息
- AI 自动回复内容

---

## 🔧 故障排查

### 问题 1：聊天窗口不显示

**解决方案**：
1. 检查浏览器控制台是否有错误
2. 确认 `simple-chat-widget.js` 文件已正确加载
3. 清除浏览器缓存后重试

### 问题 2：AI 不回复

**解决方案**：
1. 检查 Vercel 环境变量是否正确配置
2. 查看 Vercel 部署日志是否有错误
3. 确认 DeepSeek API Key 是否有效

### 问题 3：没有收到邮件通知

**解决方案**：
1. 检查 Resend API Key 是否正确
2. 查看垃圾邮件文件夹
3. 确认 Resend 账号已验证

---

## 💰 成本估算

| 服务 | 免费额度 | 预计成本 |
|------|----------|----------|
| **Vercel 托管** | 100GB 带宽/月 | 免费 |
| **DeepSeek AI** | 按使用付费 | ¥0.001/千tokens ≈ ¥10-30/月 |
| **Resend 邮件** | 3000 封/月 | 免费 |
| **总计** | - | **约 ¥10-30/月** |

---

## 📱 功能特性

### ✅ 已实现

- [x] 自定义聊天窗口（美观、响应式）
- [x] AI 自动回复（DeepSeek）
- [x] 邮件通知（Resend）
- [x] 移动端适配
- [x] 打字动画效果
- [x] 消息时间戳
- [x] 在线状态显示

### 🔜 可扩展功能

- [ ] 钉钉机器人通知
- [ ] 聊天记录保存
- [ ] 多语言支持
- [ ] 文件上传功能
- [ ] 客服工作时间设置
- [ ] 自动回复规则配置

---

## 🆘 需要帮助？

如果遇到任何问题，请联系：

- **Telegram**: @PandaBlock_Labs
- **邮箱**: hayajaiahk@gmail.com

---

## 📝 更新日志

### v1.0.0 (2025-01-XX)

- ✅ 初始版本发布
- ✅ 集成 DeepSeek AI
- ✅ 添加邮件通知
- ✅ 自定义聊天窗口

---

**祝您使用愉快！🎉**

