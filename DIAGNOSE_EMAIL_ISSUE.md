# 🔍 邮件通知问题诊断指南

**问题**：AI 聊天后没有收到邮件通知  
**时间**：2025-10-05  

---

## 📋 排查步骤

### 步骤 1：检查 Vercel 函数日志（最重要！）

#### 方法 1：通过 Vercel Dashboard

1. **访问 Vercel Dashboard**
   ```
   https://vercel.com/dashboard
   ```

2. **选择项目**
   - 找到 `pandablock-website1` 项目
   - 点击进入

3. **查看函数日志**
   - 点击顶部的 "Logs" 或 "Functions" 标签
   - 选择 `/api/chat` 函数
   - 查看最近的调用记录

4. **查找关键日志**

   **成功的日志应该包含**：
   ```
   📧 开始发送邮件通知...
   API Key 存在: true
   📊 提取的用户信息: { contact: '...', requirements: '...', budget: '...' }
   📤 准备发送邮件到: [ 'hayajaiahk@gmail.com' ]
   📧 邮件主题: 🔔 新的中文咨询 - general
   ✅ 邮件通知发送成功！邮件 ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

   **失败的日志可能显示**：
   ```
   ❌ RESEND_API_KEY 未配置
   或
   ❌ 邮件发送失败，状态码: 403
   ❌ 错误详情: { error: "..." }
   ```

#### 方法 2：通过 Vercel CLI

```bash
cd rocknblock.io
vercel logs --follow
```

然后在网站上发送测试消息，观察实时日志。

---

### 步骤 2：检查环境变量

1. **访问 Vercel 项目设置**
   ```
   https://vercel.com/dashboard → 选择项目 → Settings → Environment Variables
   ```

2. **检查 RESEND_API_KEY**
   - 确认 `RESEND_API_KEY` 是否存在
   - 确认它在 Production、Preview、Development 环境都已配置
   - 确认值的格式是 `re_xxxxxxxxxx`

3. **如果不存在或无效**
   - 访问 https://resend.com/api-keys
   - 创建新的 API Key
   - 在 Vercel 中添加/更新环境变量
   - **重新部署项目**（重要！）

---

### 步骤 3：检查 Resend Dashboard

1. **访问 Resend Dashboard**
   ```
   https://resend.com/emails
   ```

2. **查看发送记录**
   - 检查是否有最近的发送记录
   - 查看发送状态（Sent/Failed/Bounced）
   - 如果有失败记录，查看失败原因

3. **检查 API Key 状态**
   - 访问 https://resend.com/api-keys
   - 确认 API Key 是否有效
   - 检查是否超过配额

---

### 步骤 4：检查邮箱

1. **检查收件箱**
   - 登录 hayajaiahk@gmail.com
   - 查找来自 `onboarding@resend.dev` 的邮件

2. **检查垃圾邮件文件夹** ⭐ 最常见原因
   - Gmail → 左侧菜单 → 垃圾邮件
   - 搜索 "PandaBlock" 或 "onboarding@resend.dev"

3. **检查所有邮件**
   - 搜索 "PandaBlock"
   - 搜索 "新的中文咨询"
   - 搜索 "新的英文咨询"

---

## 🐛 常见问题和解决方案

### 问题 1：日志显示 "RESEND_API_KEY 未配置"

**原因**：环境变量未设置或未生效

**解决方案**：
1. 在 Vercel 中添加 `RESEND_API_KEY` 环境变量
2. 值从 https://resend.com/api-keys 获取
3. **重新部署项目**（重要！）

```bash
# 触发重新部署
cd rocknblock.io
git commit --allow-empty -m "Trigger redeploy"
git push
```

---

### 问题 2：日志显示 "邮件发送失败，状态码: 403"

**原因**：API Key 无效或权限不足

**解决方案**：
1. 访问 https://resend.com/api-keys
2. 删除旧的 API Key
3. 创建新的 API Key（确保有发送邮件权限）
4. 在 Vercel 中更新 `RESEND_API_KEY`
5. 重新部署项目

---

### 问题 3：日志显示 "邮件发送失败，状态码: 429"

**原因**：超过 Resend 免费配额

**解决方案**：
1. 访问 https://resend.com/overview
2. 查看当前使用量
3. 如果超过配额：
   - 等待配额重置（每月重置）
   - 或升级到付费计划

---

### 问题 4：没有任何邮件相关日志

**原因**：邮件发送代码可能没有被执行

**可能的原因**：
1. 代码部署失败
2. 函数执行出错，提前返回
3. 异步调用被忽略

**解决方案**：
1. 检查 Vercel 部署状态
2. 查看完整的函数日志
3. 确认 AI 回复是否成功

---

### 问题 5：邮件在垃圾邮件文件夹

**原因**：Gmail 将来自 `onboarding@resend.dev` 的邮件标记为垃圾邮件

**解决方案**：
1. 将邮件标记为"非垃圾邮件"
2. 将 `onboarding@resend.dev` 添加到联系人
3. 创建过滤器自动移到收件箱：
   - Gmail → 设置 → 过滤器和屏蔽的地址
   - 创建新过滤器
   - 发件人：`onboarding@resend.dev`
   - 操作：永不发送到垃圾邮件

---

## 🧪 测试邮件发送

### 方法 1：通过网站测试

1. **访问网站**
   ```
   https://www.pandablockdev.com
   ```

2. **发送测试消息**
   ```
   你好，我想做一个 NFT 项目
   ```

3. **等待 1-2 分钟**

4. **检查邮箱和 Vercel 日志**

---

### 方法 2：直接调用 API 测试

创建测试文件 `test-email.html`：

```html
<!DOCTYPE html>
<html>
<head>
  <title>测试邮件发送</title>
</head>
<body>
  <h1>测试邮件发送</h1>
  <button onclick="testEmail()">发送测试消息</button>
  <pre id="result"></pre>

  <script>
    async function testEmail() {
      const result = document.getElementById('result');
      result.textContent = '发送中...';

      try {
        const response = await fetch('https://www.pandablockdev.com/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: '测试邮件通知功能',
            conversationHistory: []
          })
        });

        const data = await response.json();
        result.textContent = JSON.stringify(data, null, 2);

        console.log('✅ API 调用成功');
        console.log('📧 请检查邮箱 hayajaiahk@gmail.com');
        console.log('📊 请查看 Vercel 日志确认邮件发送状态');
      } catch (error) {
        result.textContent = '❌ 错误: ' + error.message;
        console.error('❌ API 调用失败:', error);
      }
    }
  </script>
</body>
</html>
```

---

### 方法 3：使用 curl 测试

```bash
curl -X POST https://www.pandablockdev.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "测试邮件通知",
    "conversationHistory": []
  }'
```

---

## 📊 诊断检查清单

请按顺序检查以下项目：

- [ ] **Vercel 函数日志**
  - [ ] 是否有 "📧 开始发送邮件通知..." 日志？
  - [ ] 是否显示 "API Key 存在: true"？
  - [ ] 是否有 "✅ 邮件通知发送成功" 或 "❌ 邮件发送失败"？

- [ ] **环境变量**
  - [ ] RESEND_API_KEY 是否存在？
  - [ ] 值的格式是否正确（re_xxxxxxxxxx）？
  - [ ] 是否在所有环境（Production/Preview/Development）都配置了？

- [ ] **Resend Dashboard**
  - [ ] 是否有发送记录？
  - [ ] 发送状态是什么（Sent/Failed/Bounced）？
  - [ ] API Key 是否有效？
  - [ ] 是否超过配额？

- [ ] **邮箱检查**
  - [ ] 收件箱是否有邮件？
  - [ ] 垃圾邮件文件夹是否有邮件？
  - [ ] 搜索 "PandaBlock" 是否有结果？

---

## 🔧 快速修复方案

### 如果确认是 API Key 问题：

1. **获取新的 API Key**
   ```
   访问：https://resend.com/api-keys
   点击：Create API Key
   名称：PandaBlock Production
   权限：Full Access
   复制：re_xxxxxxxxxx
   ```

2. **在 Vercel 中更新**
   ```
   访问：https://vercel.com/dashboard
   选择：pandablock-website1
   进入：Settings → Environment Variables
   找到：RESEND_API_KEY
   更新：粘贴新的 API Key
   保存：Save
   ```

3. **重新部署**
   ```bash
   cd rocknblock.io
   git commit --allow-empty -m "🔧 更新 RESEND_API_KEY"
   git push
   ```

4. **等待部署完成**（1-2 分钟）

5. **重新测试**

---

### 如果确认邮件在垃圾邮件：

1. **标记为非垃圾邮件**
   - 打开垃圾邮件文件夹
   - 选择邮件
   - 点击"非垃圾邮件"

2. **创建过滤器**
   - Gmail → 设置 → 过滤器
   - 发件人：onboarding@resend.dev
   - 操作：永不发送到垃圾邮件 + 标记为重要

3. **添加到联系人**
   - 将 onboarding@resend.dev 添加到联系人

---

## 📞 需要进一步帮助？

如果按照以上步骤仍然无法解决，请提供以下信息：

1. **Vercel 函数日志截图**
   - 完整的日志输出
   - 特别是邮件发送相关的日志

2. **环境变量截图**
   - RESEND_API_KEY 是否存在（不要截图实际的 Key 值）

3. **Resend Dashboard 截图**
   - 发送记录
   - API Key 状态

4. **错误信息**
   - 任何错误提示
   - 状态码和错误详情

---

## ✅ 预期的正常流程

### 正常情况下应该看到：

1. **Vercel 日志**：
   ```
   📧 开始发送邮件通知...
   API Key 存在: true
   📊 提取的用户信息: {...}
   📤 准备发送邮件到: ['hayajaiahk@gmail.com']
   📧 邮件主题: 🔔 新的中文咨询 - general
   ✅ 邮件通知发送成功！邮件 ID: re_abc123xyz
   ```

2. **Resend Dashboard**：
   - 状态：Sent ✅
   - 收件人：hayajaiahk@gmail.com
   - 主题：🔔 新的中文咨询 - general

3. **Gmail 收件箱**：
   - 发件人：PandaBlock AI <onboarding@resend.dev>
   - 主题：🔔 新的中文咨询 - general
   - 内容：完整的对话记录和用户信息

---

**开始排查吧！** 🔍

按照上面的步骤逐一检查，找到问题所在。如果需要帮助，随时告诉我！

