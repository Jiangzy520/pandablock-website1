# PandaBlock 网站项目说明

## 📋 项目概述

这是 **PandaBlock** 区块链开发公司的官方网站项目。

- **网站名称**: PandaBlock
- **原品牌名**: Rock'n'Block（已更名为 PandaBlock）
- **网站域名**: https://www.pandablockdev.com
- **部署平台**: Vercel
- **Git 仓库**: https://github.com/Jiangzy520/pandablock-website1.git

---

## 🗂️ 项目结构

```
rocknblock.io/
├── index.html                    # 主页
├── simple-chat-widget.js         # AI 聊天窗口组件
├── blog/                         # 博客文章页面（369个文件）
├── ko-kr/                        # 韩语版本页面（33个文件）
├── portfolio/                    # 作品集页面（10个文件）
├── api/                          # API 接口
│   └── chat.js                   # AI 聊天 API
└── 其他 HTML 页面                # 服务介绍、案例等页面
```

**总文件数**: 约 780 个 HTML 页面

---

## 🔧 开发工作流程

### 1. **修改文件**
在 `rocknblock.io/` 目录下修改相应的文件。

### 2. **提交到 Git**
```bash
cd /home/jzy/桌面/WEB3开发平台/rocknblock.io
git add -A
git commit -m "描述修改内容"
git push origin main
```

### 3. **自动部署**
- 推送到 GitHub 后，Vercel 会自动检测并部署
- 部署时间：约 2-3 分钟
- 部署完成后访问：https://www.pandablockdev.com

### 4. **清除缓存测试**
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

---

## 📧 联系方式配置

### **邮箱**
- `hayajaiahk@gmail.com`

### **Telegram**
- 链接: https://t.me/PandaBlock_Labs
- 显示文本: "Telegram" 或 "TG"

### **社交媒体**
- **X (Twitter)**: 保留
- **Facebook**: 保留
- **LinkedIn**: 已删除

---

## 🤖 AI 聊天窗口

### **配置文件**
`simple-chat-widget.js`

### **关键配置**
```javascript
const CONFIG = {
  apiEndpoint: '/api/chat',
  position: 'bottom-right',
  primaryColor: '#4CAF50',
  botName: 'PandaBlock Support',
  welcomeMessage: '欢迎消息...',
  version: '2.0.7',  // 版本号，修改后强制刷新缓存
  emailNotification: 'hayajaiahk@gmail.com'
};
```

### **邮件通知**
- 访客发送消息时，会自动发送邮件到 `hayajaiahk@gmail.com`
- 使用 FormSubmit.co 服务
- 首次使用需要验证邮箱

---

## 📝 联系表单

### **表单位置**
- 每个页面底部的 "Write to us 写信给我们" 部分
- 弹窗表单（点击 "Start a project" 按钮）

### **表单字段**
1. **Your name** - 姓名
2. **Number** - 联系号码
3. **Contact method** - 联系方式下拉菜单
   - Email
   - Telegram
4. **Message** - 消息内容

### **邮件通知**
- 表单提交后自动发送邮件到 `hayajaiahk@gmail.com`
- 使用 FormSubmit.co 服务
- 首次使用需要点击验证链接

---

## 🎨 品牌信息

### **品牌名称**
- **当前**: PandaBlock
- **旧名**: Rock'n'Block（已全部替换）

### **CEO 信息**
- **姓名**: Kelvin 或 Dan E.
- **显示**: "Kelvin, CEO | PandaBlock" 或 "Dan E. CEO | PandaBlock"

### **品牌颜色**
- **主色**: 绿色 `#4CAF50`
- **辅助色**: 深灰 `#2c3e50`

---

## 🔄 最近的重要修改

### **2025-10-05**

1. ✅ **添加 Email 选项到联系表单**
   - 下拉菜单现在有 Email 和 Telegram 两个选项
   - 影响 695 个文件

2. ✅ **优化 AI 聊天窗口字体**
   - 字体大小: 14px → 15px
   - 行高: 1.5 → 1.6
   - 字体颜色: #1a1a1a → #2c3e50
   - 增加字母间距: 0.3px

3. ✅ **删除 LinkedIn 链接**
   - 导航栏只保留 TG 和 X
   - 影响 780 个文件

4. ✅ **修复首页链接**
   - Logo 点击返回 `/` 而不是 `/index.html@r=0.html`

5. ✅ **统一品牌名称**
   - 所有 Rock'n'Block 替换为 PandaBlock

6. ✅ **删除 Calendly 链接**
   - 只保留 Telegram 和 Email

---

## 🧪 测试清单

### **每次修改后需要测试**

- [ ] 主页加载正常
- [ ] AI 聊天窗口可以打开
- [ ] AI 聊天窗口字体清晰易读
- [ ] 联系表单可以提交
- [ ] 联系表单下拉菜单有 Email 和 Telegram 选项
- [ ] Telegram 按钮链接正确
- [ ] Email 按钮链接正确
- [ ] Logo 点击返回主页
- [ ] 导航栏只显示 TG 和 X
- [ ] 品牌名称显示为 PandaBlock

---

## 📚 常用命令

### **查看文件数量**
```bash
find . -name "*.html" | wc -l
```

### **批量查找文本**
```bash
grep -r "搜索内容" --include="*.html" .
```

### **批量替换文本**
使用 Python 脚本（参考 `replace_brand_name.py`）

### **检查 Git 状态**
```bash
git status
```

### **查看最近提交**
```bash
git log --oneline -10
```

---

## ⚠️ 注意事项

1. **修改前先备份**
   - Git 会自动保存历史版本
   - 可以随时回滚：`git reset --hard <commit_hash>`

2. **批量修改要小心**
   - 先在单个文件测试
   - 确认无误后再批量执行

3. **版本号管理**
   - 修改 `simple-chat-widget.js` 后要更新 `version`
   - 强制用户刷新缓存

4. **邮件通知测试**
   - 首次使用需要验证邮箱
   - 检查垃圾邮件文件夹

5. **清除缓存**
   - 每次部署后要硬刷新浏览器
   - `Ctrl + Shift + R` 或 `Cmd + Shift + R`

---

## 🆘 常见问题

### **Q: 修改后网站没有更新？**
A: 
1. 检查 Git 是否推送成功
2. 等待 Vercel 部署完成（2-3分钟）
3. 清除浏览器缓存（Ctrl + Shift + R）

### **Q: 邮件通知没有收到？**
A:
1. 检查垃圾邮件文件夹
2. 确认已点击 FormSubmit.co 验证链接
3. 等待 1-2 分钟

### **Q: AI 聊天窗口不显示？**
A:
1. 检查 `simple-chat-widget.js` 是否正确加载
2. 清除浏览器缓存
3. 检查浏览器控制台是否有错误

### **Q: 如何批量修改所有页面？**
A:
1. 创建 Python 脚本（参考现有脚本）
2. 使用正则表达式匹配和替换
3. 先在少量文件测试
4. 确认无误后批量执行

---

## 📞 技术支持

如有问题，请联系：
- **邮箱**: hayajaiahk@gmail.com
- **Telegram**: https://t.me/PandaBlock_Labs

---

**最后更新**: 2025-10-05
**维护者**: PandaBlock Team

