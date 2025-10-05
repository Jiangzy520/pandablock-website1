# 🐼 PandaBlock 网站项目

---

## 📋 项目概述

**项目名称**: PandaBlock 区块链开发公司官网  
**项目类型**: 静态网站（Webflow 生成）  
**主要语言**: HTML, CSS, JavaScript  
**服务器**: Python HTTP Server (端口 8000)  
**项目路径**: `/home/jzy/桌面/WEB3开发平台/rocknblock.io`

---

## 🚀 快速启动

### **启动本地服务器**

```bash
cd /home/jzy/桌面/WEB3开发平台/rocknblock.io
python3 -m http.server 8000
```

### **访问网站**

```
http://localhost:8000/index.html
```

### **停止服务器**

```bash
pkill -f "python3 -m http.server 8000"
```

### **重启服务器**

```bash
pkill -f "python3 -m http.server 8000" 2>/dev/null
sleep 2
cd /home/jzy/桌面/WEB3开发平台/rocknblock.io
python3 -m http.server 8000 &
```

---

## 📁 项目结构

```
rocknblock.io/
├── index.html                      # 主页（英文）
├── pandablock-custom.css           # 自定义样式（熊猫头像、CEO头像等）
├── language-switcher.js            # 语言切换器（已禁用）
├── panda-blockchain-twitter.png    # 熊猫头像（用于Hero区和CEO）
├── panda-twitter-profile-hd.png    # 熊猫头像备选
├── twitter-banner-pandablock.png   # 推特背景图
├── twitter-banner-v2.png           # 推特背景图备选
├── twitter-banner-preview.html     # 推特背景图预览页面
├── blog/                           # 博客文章
├── portfolio/                      # 项目案例
├── portfolio-technologies/         # 技术栈页面
└── ko-kr/                          # 韩文版本（未使用）
```

---

## 🎨 已完成的定制

### **1. 品牌替换**
- ✅ 所有 "RocknBlock" 已替换为 "PandaBlock"
- ✅ Logo 和品牌元素已更新

### **2. Hero 区域熊猫图片**
- ✅ 3D 图形已替换为 AI 生成的区块链主题熊猫
- ✅ 图片位置: `.image-23477` (CSS class)
- ✅ 图片来源: `panda-blockchain-twitter.png`
- ✅ 特效: 青色和紫色科技光晕 + 呼吸灯动画

### **3. CEO 信息**
- ✅ CEO 名字: **Kelvin, CEO | PandaBlock**
- ✅ CEO 头像: 熊猫区块链头像（`.ellipse-199`）
- ✅ 头像来源: `panda-blockchain-twitter.png`
- ✅ 特效: 圆形显示 + 科技光晕

### **4. 社交媒体链接**
- ✅ 推特链接: https://x.com/Bryanrodd20
- ✅ Telegram: https://t.me/PandaBlockChannel
- ✅ LinkedIn: https://www.linkedin.com/company/panda-block/
- ✅ 位置: 导航栏顶部 + 页脚

### **5. 语言设置**
- ✅ 网站语言: 全英文
- ✅ 语言切换器: 已删除
- ✅ 中文版本: 已禁用

---

## 🎯 关键文件说明

### **index.html**
- 主页文件
- 包含所有页面内容
- 引用 `pandablock-custom.css` 进行定制

### **pandablock-custom.css**
- 自定义样式文件
- 包含以下定制:
  - Hero 区域熊猫图片替换
  - CEO 头像替换为熊猫
  - 科技光晕效果
  - 呼吸灯动画

**关键 CSS 类**:
```css
.image-23477        /* Hero 区域熊猫图片 */
.ellipse-199        /* CEO 头像 */
@keyframes pandaGlow /* 呼吸灯动画 */
```

### **language-switcher.js**
- 语言切换功能（已禁用）
- 在 `index.html` 中已注释掉引用

---

## 🐦 推特资源

### **推特账号信息**
- **账号**: @Bryanrodd20
- **链接**: https://x.com/Bryanrodd20

### **推特资源文件**
- `panda-blockchain-twitter.png` - 推特头像（768x768）
- `twitter-banner-pandablock.png` - 推特背景图（1500x500）⭐推荐
- `twitter-banner-v2.png` - 推特背景图备选（1500x500）
- `twitter-banner-preview.html` - 背景图预览页面

### **推荐推特配置**
**名字**: PandaBlock | Web3 Development
**介绍**:
```
🐼 Blockchain Innovation Lab
💻 DeFi | NFT | Smart Contracts | dApp Development
🏆 150+ Blockchain Experts
💰 $1B+ Project Capitalization
🌏 Building Next-Gen Web3 Applications
```

---

## 📱 Telegram 资源

### **推荐用户名**
1. **@PandaBlockOfficial** ⭐推荐 - 官方账号
2. **@PandaBlockLabs** ⭐推荐 - 技术实验室
3. **@PandaBlockWeb3** - Web3 主题

### **Telegram 头像文件**
- `panda-blockchain-twitter.png` - 推荐头像（768x768）
- `telegram-avatar-pandablock.png` - 备选头像 1（1024x1024）
- `telegram-avatar-v2.png` - 备选头像 2（1024x1024）
- `telegram-avatar-preview.html` - 头像预览页面

### **Telegram 文档**
- `TELEGRAM_PROFILE_OPTIONS.md` - 完整配置方案
- `TELEGRAM_SETUP_GUIDE.md` - 详细设置指南
- `TELEGRAM_QUICK_REFERENCE.txt` - 快速参考

### **推荐 Telegram 简介**
```
🐼 Official Telegram of PandaBlock
⛓️ Leading Blockchain Development Company
💻 DeFi | NFT | Smart Contracts | dApp
🏆 150+ Blockchain Experts
💰 $1B+ Project Capitalization
🌐 Building the Future of Web3

📧 Contact: contact@pandablock.io
🌐 Website: pandablock.io
```

### **预览链接**
- 头像预览: http://localhost:8000/telegram-avatar-preview.html

---

## 🛠️ 常见操作

### **修改 CEO 信息**
1. 打开 `index.html`
2. 搜索 "Kelvin, CEO"
3. 修改文字
4. 刷新浏览器

### **修改熊猫图片**
1. 替换 `panda-blockchain-twitter.png` 文件
2. 或修改 `pandablock-custom.css` 中的图片 URL
3. 硬刷新浏览器 (Ctrl + Shift + R)

### **修改推特链接**
1. 打开 `index.html`
2. 搜索 "https://x.com/Bryanrodd20"
3. 替换为新的推特链接
4. 刷新浏览器

### **添加新的社交媒体链接**
1. 在导航栏找到社交媒体链接区域
2. 复制现有链接的 HTML 结构
3. 修改链接和文字
4. 保存并刷新

---

## 🎨 视觉效果说明

### **熊猫图片光晕效果**
- **颜色**: 青色 (#00D4FF) + 紫色 (#8A2BE2) + 粉色 (#FF00FF)
- **动画**: 3秒呼吸灯循环
- **效果**: 科技感光晕

### **品牌配色**
- **主色**: `#00D4FF` (青色 - 区块链蓝)
- **辅色**: `#8A2BE2` (紫色 - 加密紫)
- **强调色**: `#FF00FF` (粉色 - Web3 粉)
- **背景**: `#0A0E27` (深蓝黑)

---

## 📝 更新历史

### **2025-10-05**
- ✅ 删除中英文切换功能
- ✅ 更新推特链接为 @Bryanrodd20
- ✅ 更新 CEO 名字为 Kelvin
- ✅ 替换 CEO 头像为熊猫头像
- ✅ 网站全英文化

### **2025-10-04**
- ✅ Hero 区域 3D 图形替换为熊猫图片
- ✅ 添加科技光晕和呼吸灯动画
- ✅ 生成推特头像和背景图
- ✅ 创建推特配置方案

### **更早**
- ✅ RocknBlock 品牌替换为 PandaBlock
- ✅ 语言切换器位置调整

---

## 🔧 技术栈

- **前端**: HTML5, CSS3, JavaScript
- **框架**: Webflow (生成的静态网站)
- **字体**: Poppins, Lato, Inter
- **图标**: SVG
- **服务器**: Python HTTP Server
- **版本控制**: Git (可选)

---

## 📞 联系信息

- **网站**: https://pandablock.io (或 http://localhost:8000)
- **推特**: https://x.com/Bryanrodd20
- **Telegram**: https://t.me/PandaBlockChannel
- **LinkedIn**: https://www.linkedin.com/company/panda-block/

---

## 💡 提示

### **浏览器缓存**
修改 CSS 或图片后，务必硬刷新浏览器：
```
Ctrl + Shift + R (Linux/Windows)
Cmd + Shift + R (Mac)
```

### **图片优化**
- 推特头像: 400x400px 最小（使用 1024x1024 更清晰）
- 推特背景: 1500x500px 标准尺寸
- Hero 图片: 建议 1024x1024 或更大

### **性能优化**
- 图片已压缩为 WebP 格式
- CSS 已最小化
- JavaScript 已优化

---

## 🎯 下次使用 Augment 时

**告诉 Augment**:
- "启动 PandaBlock 网站服务器"
- "修改 CEO 信息"
- "更新推特链接"
- "替换熊猫图片"
- "查看项目说明"

**Augment 会自动**:
- 读取本 README.md 文件
- 了解项目结构和配置
- 快速定位需要修改的文件
- 执行相应操作

---

**🐼 PandaBlock - Building the Future of Web3**

