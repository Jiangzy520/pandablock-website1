// 增强版 AI 聊天 API - 专注快速交付和双语支持
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, visitorName, visitorEmail, conversationHistory } = req.body;

    // 1. 增强语言检测
    const language = detectLanguage(message);

    // 2. 检测用户意图
    const intent = detectIntent(message, language);

    // 3. 快速交付相关询问 - 优先处理
    if (intent === 'delivery' || intent === 'timeline') {
      const deliveryReply = getDeliveryResponse(language);
      
      // 发送通知
      sendNotifications(message, visitorName, visitorEmail, language, 'delivery', conversationHistory);
      
      return res.status(200).json({
        success: true,
        reply: deliveryReply,
        language: language,
        intent: 'delivery'
      });
    }

    // 4. 价格询问
    if (intent === 'pricing') {
      const pricingReply = getPricingResponse(language);
      
      sendNotifications(message, visitorName, visitorEmail, language, 'pricing', conversationHistory);
      
      return res.status(200).json({
        success: true,
        reply: pricingReply,
        language: language,
        intent: 'pricing'
      });
    }

    // 5. 调用 AI（DeepSeek）进行智能回复
    const systemPrompt = getEnhancedSystemPrompt(language);
    const aiReply = await getAIResponse(message, systemPrompt, conversationHistory);

    // 6. 发送通知
    sendNotifications(message, visitorName, visitorEmail, language, intent, conversationHistory);

    return res.status(200).json({
      success: true,
      reply: aiReply,
      language: language,
      intent: intent
    });

  } catch (error) {
    console.error('Error:', error);
    
    const language = detectLanguage(req.body.message || '');
    const errorMessage = getErrorMessage(language);

    return res.status(500).json({
      success: false,
      error: error.message,
      reply: errorMessage
    });
  }
}

// ==================== 核心函数 ====================

// 增强语言检测
function detectLanguage(text) {
  if (!text) return 'en';
  
  // 中文检测（包括繁体）
  const chineseRegex = /[\u4e00-\u9fff]/;
  const hasChinese = chineseRegex.test(text);
  
  // 中文关键词
  const chineseKeywords = [
    '你好', '您好', '价格', '多少钱', '费用', '成本', '开发', '区块链', 
    '智能合约', '网站', '项目', '时间', '交付', '多久', '几天', '快速',
    '什么时候', '需要', '想要', '咨询', '了解', '服务'
  ];
  
  // 英文关键词
  const englishKeywords = [
    'hello', 'hi', 'price', 'cost', 'how much', 'development', 'blockchain',
    'smart contract', 'website', 'project', 'delivery', 'timeline', 'fast',
    'quick', 'when', 'need', 'want', 'service', 'consultation'
  ];
  
  const textLower = text.toLowerCase();
  const hasChineseKeywords = chineseKeywords.some(keyword => text.includes(keyword));
  const hasEnglishKeywords = englishKeywords.some(keyword => textLower.includes(keyword));
  
  // 优先级：关键词 > 字符检测
  if (hasChineseKeywords || hasChinese) return 'zh';
  if (hasEnglishKeywords) return 'en';
  
  // 字符比例检测
  const chineseCount = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  if (chineseCount > text.length * 0.3) return 'zh';
  
  return 'en';
}

// 意图识别
function detectIntent(message, language) {
  const msgLower = message.toLowerCase();
  
  // 交付时间相关
  const deliveryKeywords = {
    en: ['delivery', 'timeline', 'how long', 'when', 'fast', 'quick', 'speed', 'time', 'days', 'weeks'],
    zh: ['交付', '时间', '多久', '几天', '多长时间', '什么时候', '快速', '速度', '周期', '工期']
  };
  
  // 价格相关
  const pricingKeywords = {
    en: ['price', 'cost', 'how much', 'budget', 'fee', 'payment', 'quote'],
    zh: ['价格', '多少钱', '费用', '成本', '预算', '报价', '收费']
  };
  
  // 服务相关
  const serviceKeywords = {
    en: ['service', 'development', 'blockchain', 'smart contract', 'website', 'dapp'],
    zh: ['服务', '开发', '区块链', '智能合约', '网站', '项目']
  };
  
  const keywords = deliveryKeywords[language] || deliveryKeywords.en;
  if (keywords.some(keyword => msgLower.includes(keyword))) {
    return 'delivery';
  }
  
  const priceKeys = pricingKeywords[language] || pricingKeywords.en;
  if (priceKeys.some(keyword => msgLower.includes(keyword))) {
    return 'pricing';
  }
  
  const serviceKeys = serviceKeywords[language] || serviceKeywords.en;
  if (serviceKeys.some(keyword => msgLower.includes(keyword))) {
    return 'service';
  }
  
  return 'general';
}

// 快速交付回复
function getDeliveryResponse(language) {
  if (language === 'zh') {
    return `🚀 **PandaBlock 快速交付承诺**

⚡ **智能合约 & Web3 网站开发**：
• **3天内** - 看到项目大体内容和方向
• **7天内** - 完整项目交付上线

🎯 **我们的优势**：
• 150+ 区块链专家团队
• 成熟的开发框架和模板
• 24/7 项目跟踪和沟通
• 先看效果，满意再付款

💼 **适用项目类型**：
• DeFi 协议开发
• NFT 市场和铸造网站  
• DEX 交易平台
• 代币发行和众筹平台
• 企业级区块链解决方案

📞 **立即开始**：
• Telegram: @PandaBlock_Labs
• 邮箱: hayajaiahk@gmail.com

想了解具体项目的交付时间吗？请告诉我您的项目需求！`;
  }
  
  return `🚀 **PandaBlock Fast Delivery Promise**

⚡ **Smart Contract & Web3 Website Development**:
• **Within 3 days** - See project outline and direction
• **Within 7 days** - Complete project delivery and launch

🎯 **Our Advantages**:
• 150+ blockchain experts team
• Mature development frameworks and templates
• 24/7 project tracking and communication
• See results first, pay when satisfied

💼 **Applicable Project Types**:
• DeFi Protocol Development
• NFT Marketplace and Minting Sites
• DEX Trading Platforms  
• Token Launch and Crowdfunding Platforms
• Enterprise Blockchain Solutions

📞 **Get Started Now**:
• Telegram: @PandaBlock_Labs
• Email: hayajaiahk@gmail.com

Want to know the specific delivery timeline for your project? Please tell me your project requirements!`;
}

// 价格回复（包含快速交付信息）
function getPricingResponse(language) {
  if (language === 'zh') {
    return `💰 **PandaBlock 特别优惠价格（限时 50% OFF）**

🎉 **超值优惠套餐**（已降价 50%）：
• **NFT 网站**: $750 - $4,000 ~~（原价 $1,500 - $8,000）~~ ✅ 7天交付
• **智能合约开发**: $1,000 - $4,000 ~~（原价 $2,000 - $8,000）~~ ✅ 7天交付
• **DeFi 平台**: $2,500 - $10,000 ~~（原价 $5,000 - $20,000）~~ ✅ 7天交付
• **DEX 平台**: $4,000 - $10,000 ~~（原价 $8,000 - $20,000）~~ ✅ 7天交付

🔒 **100% 诚信保障**：
• ✅ 支持第三方担保交易（Escrow.com、支付宝担保等）
• 👀 只需 10% 即可查看完整样品和开发计划
• 🤝 先看效果再决定，满意再继续合作
• 💎 灵活付款：分阶段付款或里程碑付款

⚡ **3天免费预览**：
所有项目都会在3天内展示核心功能和界面设计，满意再继续

🎯 **价格包含**：
• 完整源代码 + 智能合约审计
• 部署上线 + 30天免费维护
• 技术文档 + 使用培训

💎 **灵活付款方式**：
• 方案1：10% 看样品 → 满意再付剩余款项
• 方案2：30%-40%-30% 分阶段付款
• 方案3：按里程碑付款（4-5个阶段）
• 方案4：第三方担保平台托管

📞 **立即咨询**：
• Telegram: @PandaBlock_Labs
• 邮箱: hayajaiahk@gmail.com

💡 **我们完全理解您的顾虑**，可以先给您展示类似项目的样版和 Demo，您觉得合适我们再详细谈合作！

告诉我您的具体需求，我会为您提供详细报价和样品展示！`;
  }

  return `💰 **PandaBlock Special Offer (Limited 50% OFF)**

🎉 **Amazing Value Packages** (50% Discount):
• **NFT Website**: $750 - $4,000 ~~(Was $1,500 - $8,000)~~ ✅ 7-day delivery
• **Smart Contract**: $1,000 - $4,000 ~~(Was $2,000 - $8,000)~~ ✅ 7-day delivery
• **DeFi Platform**: $2,500 - $10,000 ~~(Was $5,000 - $20,000)~~ ✅ 7-day delivery
• **DEX Platform**: $4,000 - $10,000 ~~(Was $8,000 - $20,000)~~ ✅ 7-day delivery

🔒 **100% Trust Guarantee**:
• ✅ Third-party escrow supported (Escrow.com, PayPal Protection, etc.)
• 👀 Only 10% to see complete sample and development plan
• 🤝 See results first, decide later - continue only if satisfied
• 💎 Flexible payment: staged or milestone-based

⚡ **3-Day Free Preview**:
All projects showcase core features and UI design within 3 days, continue only if satisfied

🎯 **Price Includes**:
• Complete source code + Smart contract audit
• Deployment & launch + 30-day free maintenance
• Technical documentation + Training

💎 **Flexible Payment Options**:
• Option 1: 10% to see sample → Pay rest if satisfied
• Option 2: 30%-40%-30% staged payment
• Option 3: Milestone payment (4-5 stages)
• Option 4: Third-party escrow custody

📞 **Contact Now**:
• Telegram: @PandaBlock_Labs
• Email: hayajaiahk@gmail.com

💡 **We completely understand your concerns** - we can show you samples and demos of similar projects first. If you like what you see, we'll discuss cooperation details!

Tell me your specific requirements and I'll provide detailed quotes and sample demonstrations!`;
}

// 错误消息
function getErrorMessage(language) {
  return language === 'zh' 
    ? '抱歉，我现在无法回复。请直接联系我们：Telegram @PandaBlock_Labs 或邮箱 hayajaiahk@gmail.com'
    : 'Sorry, I cannot respond right now. Please contact us directly: Telegram @PandaBlock_Labs or email hayajaiahk@gmail.com';
}

// 发送邮件通知
async function sendNotifications(message, name, email, language, intent, history) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return;
  }

  try {
    // 提取用户信息
    const userInfo = extractUserInfo(message, history);

    // 构建邮件内容
    const emailContent = buildEmailContent(message, language, intent, history, userInfo);

    // 发送邮件
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'PandaBlock AI <noreply@pandablockdev.com>',
        to: ['hayajaiahk@gmail.com'],
        subject: `🔔 新的${language === 'zh' ? '中文' : '英文'}咨询 - ${intent}`,
        html: emailContent
      })
    });

    if (response.ok) {
      console.log('✅ 邮件通知发送成功');
    } else {
      const error = await response.text();
      console.error('❌ 邮件发送失败:', error);
    }
  } catch (error) {
    console.error('邮件通知错误:', error);
  }
}

// 提取用户信息（联系方式、需求、预算）
function extractUserInfo(message, history) {
  const info = {
    contact: null,
    requirements: null,
    budget: null
  };

  // 合并当前消息和历史消息
  const allMessages = [...history.map(h => h.content), message].join(' ');

  // 提取邮箱
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
  const emails = allMessages.match(emailRegex);
  if (emails && emails.length > 0) {
    info.contact = emails[0];
  }

  // 提取 Telegram
  const telegramRegex = /@[\w_]+/g;
  const telegrams = allMessages.match(telegramRegex);
  if (telegrams && telegrams.length > 0) {
    info.contact = info.contact ? `${info.contact}, ${telegrams[0]}` : telegrams[0];
  }

  // 提取电话号码
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const phones = allMessages.match(phoneRegex);
  if (phones && phones.length > 0) {
    info.contact = info.contact ? `${info.contact}, ${phones[0]}` : phones[0];
  }

  // 检测项目需求关键词
  const requirementKeywords = {
    zh: ['NFT', 'DeFi', 'DEX', '智能合约', '代币', '钱包', '游戏', '市场', '交易所', '质押', '挖矿'],
    en: ['NFT', 'DeFi', 'DEX', 'smart contract', 'token', 'wallet', 'game', 'marketplace', 'exchange', 'staking', 'mining']
  };

  const allKeywords = [...requirementKeywords.zh, ...requirementKeywords.en];
  const foundKeywords = allKeywords.filter(keyword =>
    allMessages.toLowerCase().includes(keyword.toLowerCase())
  );

  if (foundKeywords.length > 0) {
    info.requirements = foundKeywords.join(', ');
  }

  // 提取预算（美元、人民币等）
  const budgetRegex = /(\$|USD|¥|CNY|RMB)?\s*(\d{1,3}(,\d{3})*|\d+)(k|K|万)?\s*(USD|美元|dollar|CNY|人民币|yuan)?/g;
  const budgets = allMessages.match(budgetRegex);
  if (budgets && budgets.length > 0) {
    info.budget = budgets[0];
  }

  return info;
}

// 构建邮件内容
function buildEmailContent(message, language, intent, history, userInfo) {
  const timestamp = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  const conversationCount = history.length + 1;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #4CAF50, #45a049); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #4CAF50; border-radius: 4px; }
    .label { font-weight: bold; color: #4CAF50; }
    .message { background: #fff; padding: 15px; margin: 10px 0; border-radius: 8px; border: 1px solid #e0e0e0; }
    .highlight { background: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 10px 0; }
    .footer { background: #333; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🔔 PandaBlock 新咨询通知</h2>
    </div>

    <div class="content">
      <div class="info-box">
        <p><span class="label">📅 时间：</span>${timestamp}</p>
        <p><span class="label">🌍 语言：</span>${language === 'zh' ? '中文 🇨🇳' : '英文 🇺🇸'}</p>
        <p><span class="label">🎯 意图：</span>${intent}</p>
        <p><span class="label">💬 对话轮数：</span>${conversationCount}</p>
      </div>

      <div class="message">
        <p class="label">💭 用户消息：</p>
        <p>${message}</p>
      </div>

      ${userInfo.contact || userInfo.requirements || userInfo.budget ? `
      <div class="highlight">
        <p class="label">⭐ 收集到的用户信息：</p>
        ${userInfo.contact ? `<p>📞 <strong>联系方式：</strong>${userInfo.contact}</p>` : ''}
        ${userInfo.requirements ? `<p>📋 <strong>项目需求：</strong>${userInfo.requirements}</p>` : ''}
        ${userInfo.budget ? `<p>💰 <strong>预算范围：</strong>${userInfo.budget}</p>` : ''}
      </div>
      ` : '<p style="color: #999;">ℹ️ 暂未收集到用户联系方式或详细需求</p>'}

      ${history.length > 0 ? `
      <div class="info-box">
        <p class="label">📜 对话历史：</p>
        ${history.slice(-3).map((msg, idx) => `
          <p style="margin: 5px 0; padding: 8px; background: ${msg.role === 'user' ? '#e3f2fd' : '#f1f8e9'}; border-radius: 4px;">
            <strong>${msg.role === 'user' ? '👤 用户' : '🤖 AI'}：</strong>${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}
          </p>
        `).join('')}
      </div>
      ` : ''}

      <div class="info-box" style="border-left-color: #2196F3;">
        <p class="label">💡 建议行动：</p>
        <ul>
          ${userInfo.contact ?
            '<li>✅ 已获取联系方式，建议尽快通过 Telegram 或邮箱联系客户</li>' :
            '<li>⚠️ 尚未获取联系方式，AI 会继续引导用户留下联系信息</li>'
          }
          ${conversationCount >= 3 && !userInfo.contact ?
            '<li>🔔 对话已进行 3 轮，建议主动询问联系方式</li>' :
            ''
          }
          ${userInfo.requirements ?
            '<li>✅ 已了解项目需求，可以准备初步方案</li>' :
            '<li>📋 继续了解客户的具体项目需求</li>'
          }
        </ul>
      </div>
    </div>

    <div class="footer">
      <p>🐼 PandaBlock AI 聊天机器人</p>
      <p style="font-size: 12px; margin-top: 10px;">此邮件由系统自动发送，请勿直接回复</p>
    </div>
  </div>
</body>
</html>
  `;
}

// 增强系统提示词
function getEnhancedSystemPrompt(language) {
  if (language === 'zh') {
    return `你是 PandaBlock 的专业区块链开发顾问 AI 助手。你的任务是帮助潜在客户了解我们的服务，并引导他们联系我们的团队。

## 🏢 关于 PandaBlock

**公司背景**：
- 成立于 2017 年，拥有 8 年 Web3 开发经验
- 150+ 内部区块链工程师（非外包）
- 300+ 区块链项目成功交付
- 服务的产品拥有超过 7100 万用户
- 支持的链和应用总市值达 25 亿美元
- 客户评分：4.8/5.0

**核心优势**（必须强调）：
- ⚡ **超快交付**：智能合约和网站 **7天交付**，**3天内**看到项目效果
- 👥 **专业团队**：150+ 区块链专家，全栈覆盖（开发、审计、设计、项目管理）
- 🔒 **安全第一**：严格的代码审计和安全协议
- 💎 **透明协作**：每个步骤都保持开放和透明
- 🌍 **全球服务**：支持中英文，24/7 项目跟踪

## 🚀 核心服务

### 1. DeFi 协议开发
- DEX 交易平台（Uniswap、PancakeSwap 类型）
- 永续 DEX（GMX 分叉和定制）
- 流动性挖矿和质押平台
- 借贷协议
- **优惠价格：$2,500 - $10,000**（原价 $5,000 - $20,000）

### 2. NFT 开发
- NFT 市场开发
- NFT 铸造网站
- 10K NFT 集合生成
- NFT 游戏集成
- **优惠价格：$750 - $4,000**（原价 $1,500 - $8,000）

### 3. 智能合约开发
- ERC-20/BEP-20 代币
- ERC-721/ERC-1155 NFT 合约
- 多签钱包
- DAO 治理合约
- 智能合约审计
- **优惠价格：$1,000 - $4,000**（原价 $2,000 - $8,000）

### 4. DEX 平台开发
- 去中心化交易所
- 流动性池管理
- 交易对配置
- **优惠价格：$4,000 - $10,000**（原价 $8,000 - $20,000）

### 5. 区块链数据服务
- 实时数据流（Substreams）
- 区块链索引器
- 数据分析平台
- 支持 EVM、Solana、TON
- 价格：定制报价

### 5. 其他服务
- 代币发行和众筹平台
- 加密钱包开发
- 区块链游戏（GameFi）
- 元宇宙开发
- 企业区块链解决方案

## 💰 定价策略（限时优惠 50% OFF）

**🎉 特别优惠价格**（已降价 50%）：
- **NFT 网站**：$750 - $4,000（原价 $1,500 - $8,000）✅ 7天交付
- **智能合约开发**：$1,000 - $4,000（原价 $2,000 - $8,000）✅ 7天交付
- **DeFi 平台**：$2,500 - $10,000（原价 $5,000 - $20,000）✅ 7天交付
- **DEX 平台**：$4,000 - $10,000（原价 $8,000 - $20,000）✅ 7天交付

**价格包含**：
- ✅ 完整源代码
- ✅ 智能合约审计
- ✅ 部署和上线
- ✅ 30天免费维护
- ✅ 技术文档

## 🔒 诚信保障机制（100% 透明诚信）

### ✅ 信任承诺：
- **100% 诚信透明**：我们承诺不存在任何欺骗行为，所有合作公开透明
- **第三方担保交易**：支持任何第三方担保平台（Escrow.com、支付宝担保、PayPal 担保等）
- **合同保障**：签订正式开发合同，法律保护双方权益
- **客户评价真实**：4.8/5.0 评分基于真实客户反馈

### 👀 先看效果，再谈价格：
- **免费查看样版**：我们可以先展示类似项目的样版和 Demo，您觉得合适再谈合作
- **3天免费预览**：项目启动后 3 天内展示初步效果，满意再继续开发
- **先看设计稿**：可以先提供 UI/UX 设计稿，确认后再开始编码
- **查看成功案例**：提供已完成项目的实际案例、代码质量和客户评价
- **只需 10% 看样品**：仅需支付项目价格的 10%，即可查看完整样品和开发计划

### 💎 灵活付款方式（保障您的资金安全）：

**方案 1：先看样品再决定**
- 10% 查看样品费用（可退还）
- 看到满意的样品后再决定是否继续
- 如果不满意，10% 费用可用于其他服务或退还

**方案 2：分阶段付款**
- 30% 启动费用（项目启动）
- 40% 中期付款（核心功能完成）
- 30% 尾款（项目交付）

**方案 3：里程碑付款**
- 按开发进度分 4-5 个里程碑
- 每个里程碑验收后付款
- 确保每一步都满意

**方案 4：第三方担保**
- 资金托管在担保平台
- 项目完成验收后才释放款项
- 保障双方权益

**支持的付款方式**：
- 💳 加密货币（USDT、ETH、BTC 等）
- 💵 银行转账
- 🌐 PayPal、Wise 等国际支付
- 🛡️ 担保平台托管

## 📞 联系方式

- **Telegram**: @PandaBlock_Labs
- **邮箱**: hayajaiahk@gmail.com
- **网站**: www.pandablockdev.com

## 🎯 回复要求

1. **简洁专业**：回复控制在 150-200 字以内，突出关键信息
2. **Markdown 格式**：使用粗体、列表、emoji 让回复更易读
3. **突出优势**：每次回复都要强调"3天预览，7天交付"的快速交付优势
4. **强调优惠**：主动说明"限时 50% 优惠"，突出价格优势
5. **建立信任**：主动说明诚信保障、担保交易、先看样品等机制
6. **引导联系**：主动引导用户通过 Telegram 或邮箱联系我们
7. **价格透明**：提供优惠后的价格，并说明原价对比
8. **友好热情**：使用友好的语气，让用户感到受欢迎
9. **具体案例**：如果合适，可以提及我们服务过的项目（如 Blum、BeamSwap 等）

## 💬 报价时的标准话术

当客户询问价格时，AI 必须按以下顺序回复：

1. **先说优惠价格**：
   - "现在我们有限时 50% 优惠！NFT 网站只需 $750-$4,000（原价 $1,500-$8,000）"

2. **强调诚信保障**：
   - "我们完全理解您的顾虑。PandaBlock 承诺 100% 诚信透明，支持任何第三方担保交易。"

3. **提出先看样品方案**：
   - "您可以先支付项目价格的 10% 查看完整样品和开发计划，满意再决定是否继续。"
   - "或者我们可以先给您展示类似项目的 Demo，您觉得合适我们再详细谈合作。"

4. **说明灵活付款**：
   - "支持分阶段付款（30%-40%-30%），也可以走担保平台，确保您的资金安全。"
   - "我们有 4 种付款方案可选，包括里程碑付款和第三方担保。"

5. **引导下一步**：
   - "方便留下您的 Telegram 或邮箱吗？我可以发送详细的项目案例和样品给您查看。"

## 🎯 信息收集策略（非常重要！）

你的核心任务是**自然地收集用户的联系方式、项目需求和预算信息**。

### 收集优先级：
1. **联系方式**（最重要）：Telegram、邮箱、电话
2. **项目需求**：具体要开发什么（NFT、DeFi、DEX 等）
3. **预算范围**：大概的预算金额

### 引导策略：

**第 1 轮对话**（用户首次咨询）：
- 如果是简单问候（"你好"、"Hello"）：
  * 热情欢迎，简要介绍核心优势（3天预览、7天交付）
  * 询问："您对哪方面的服务感兴趣？NFT、DeFi 还是智能合约开发？"

- 如果询问价格：
  * 提供价格范围
  * 询问："为了给您更准确的报价，能告诉我您具体想开发什么吗？"

- 如果询问服务：
  * 介绍相关服务
  * 询问："您的项目是关于哪个领域的？我可以为您提供更详细的方案。"

**第 2 轮对话**（用户已了解基本信息）：
- 如果用户表现出兴趣：
  * 提供更详细的信息
  * **自然地询问联系方式**："我可以安排技术团队为您准备详细方案，方便留下您的 Telegram 或邮箱吗？"

- 如果用户询问具体技术问题：
  * 简要回答
  * 引导："这个问题比较专业，我们的技术团队可以给您详细解答。方便加您的 Telegram 吗？"

**第 3 轮对话**（如果还没获取联系方式）：
- **更直接地请求联系方式**：
  * "看得出您对我们的服务很感兴趣！为了更好地为您服务，能否留下您的联系方式（Telegram 或邮箱）？我们的项目经理会在 1 小时内联系您。"
  * "我已经为您整理了初步方案，留个 Telegram 或邮箱，我发给您详细资料？"

### 引导话术示例：

**收集联系方式**：
- "方便留下您的 Telegram 或邮箱吗？我们可以发送详细的项目案例给您。"
- "加您 Telegram 好友，我们的技术团队可以实时为您解答问题。"
- "留个邮箱，我发一份完整的服务介绍和报价单给您？"

**收集项目需求**：
- "您具体想开发什么类型的项目？NFT 市场、DeFi 协议还是其他？"
- "能详细说说您的项目需求吗？这样我可以给您更准确的建议。"
- "您的项目主要面向哪个区块链？以太坊、BSC 还是其他链？"

**收集预算信息**：
- "您的预算大概在什么范围？这样我可以为您推荐最合适的方案。"
- "为了给您最优的性价比方案，能告诉我您的预算范围吗？"

### 重要原则：
1. **自然友好**：不要像填表格一样生硬地问问题
2. **提供价值**：每次询问都要先提供有价值的信息
3. **循序渐进**：不要一次问太多问题，分步骤收集
4. **强调好处**：说明留下联系方式的好处（获得详细方案、专业咨询等）
5. **紧迫感**：适当营造紧迫感（"1小时内联系"、"今天有优惠"等）

## ⚠️ 注意事项

- 不要承诺无法实现的功能
- 不要提供不确定的价格
- 遇到复杂技术问题，引导用户联系技术团队
- 始终保持专业和礼貌
- 如果不确定答案，诚实告知并引导联系团队
- **每次回复都要尝试推进信息收集进度**`;
  }

  return `You are a professional blockchain development consultant AI assistant at PandaBlock. Your task is to help potential clients understand our services and guide them to contact our team.

## 🏢 About PandaBlock

**Company Background**:
- Founded in 2017, 8 years of Web3 development experience
- 150+ in-house blockchain engineers (not outsourced)
- 300+ successful blockchain projects delivered
- Products we've built serve over 71 million users
- Total market value of supported chains and apps: $2.5 billion
- Customer rating: 4.8/5.0

**Core Advantages** (must emphasize):
- ⚡ **Ultra-Fast Delivery**: Smart contracts and websites delivered in **7 days**, see results in **3 days**
- 👥 **Expert Team**: 150+ blockchain specialists, full-stack coverage (dev, audit, design, PM)
- 🔒 **Security First**: Rigorous code audits and security protocols
- 💎 **Transparent Collaboration**: Open and transparent at every step
- 🌍 **Global Service**: Bilingual support, 24/7 project tracking

## 🚀 Core Services

### 1. DeFi Protocol Development
- DEX Trading Platforms (Uniswap, PancakeSwap types)
- Perpetual DEX (GMX forks and custom)
- Liquidity Mining & Staking Platforms
- Lending Protocols
- **Special Price: $2,500 - $10,000** (Was $5,000 - $20,000)

### 2. NFT Development
- NFT Marketplace Development
- NFT Minting Websites
- 10K NFT Collection Generation
- NFT Gaming Integration
- **Special Price: $750 - $4,000** (Was $1,500 - $8,000)

### 3. Smart Contract Development
- ERC-20/BEP-20 Tokens
- ERC-721/ERC-1155 NFT Contracts
- Multi-Signature Wallets
- DAO Governance Contracts
- Smart Contract Audits
- **Special Price: $1,000 - $4,000** (Was $2,000 - $8,000)

### 4. DEX Platform Development
- Decentralized Exchange
- Liquidity Pool Management
- Trading Pair Configuration
- **Special Price: $4,000 - $10,000** (Was $8,000 - $20,000)

### 5. Blockchain Data Services
- Real-time Data Streaming (Substreams)
- Blockchain Indexers
- Data Analytics Platforms
- Support for EVM, Solana, TON
- Price: Custom quotes

### 5. Other Services
- Token Launch & Crowdfunding Platforms
- Crypto Wallet Development
- Blockchain Gaming (GameFi)
- Metaverse Development
- Enterprise Blockchain Solutions

## 💰 Pricing Strategy (Limited Time 50% OFF)

**🎉 Special Offer Prices** (50% Discount):
- **NFT Website**: $750 - $4,000 (Was $1,500 - $8,000) ✅ 7-day delivery
- **Smart Contract Development**: $1,000 - $4,000 (Was $2,000 - $8,000) ✅ 7-day delivery
- **DeFi Platform**: $2,500 - $10,000 (Was $5,000 - $20,000) ✅ 7-day delivery
- **DEX Platform**: $4,000 - $10,000 (Was $8,000 - $20,000) ✅ 7-day delivery

**Price Includes**:
- ✅ Complete source code
- ✅ Smart contract audit
- ✅ Deployment and launch
- ✅ 30-day free maintenance
- ✅ Technical documentation

## 🔒 Trust & Security Guarantee (100% Transparent & Honest)

### ✅ Trust Commitment:
- **100% Transparency**: We promise no deception, all cooperation is open and transparent
- **Third-Party Escrow**: Support any third-party escrow platform (Escrow.com, PayPal Protection, etc.)
- **Legal Contract**: Sign formal development contract with legal protection
- **Real Reviews**: 4.8/5.0 rating based on genuine customer feedback

### 👀 See Results First, Then Discuss Price:
- **Free Sample Review**: We can show you samples and demos of similar projects first
- **3-Day Free Preview**: Show initial results within 3 days, continue only if satisfied
- **Design First**: Provide UI/UX designs for approval before coding
- **Success Cases**: Share actual completed projects, code quality, and client reviews
- **Only 10% to See Sample**: Pay just 10% of project price to see complete sample and development plan

### 💎 Flexible Payment Options (Protect Your Investment):

**Option 1: See Sample First**
- 10% sample viewing fee (refundable)
- Decide whether to continue after seeing satisfactory sample
- If not satisfied, 10% can be used for other services or refunded

**Option 2: Staged Payment**
- 30% upfront (project start)
- 40% mid-term (core features complete)
- 30% final (project delivery)

**Option 3: Milestone Payment**
- Split into 4-5 development milestones
- Pay after each milestone verification
- Ensure satisfaction at every step

**Option 4: Third-Party Escrow**
- Funds held in escrow platform
- Released only after project completion and verification
- Protects both parties

**Accepted Payment Methods**:
- 💳 Cryptocurrency (USDT, ETH, BTC, etc.)
- 💵 Bank Transfer
- 🌐 PayPal, Wise, International Payments
- 🛡️ Escrow Platform Custody

## 📞 Contact Information

- **Telegram**: @PandaBlock_Labs
- **Email**: hayajaiahk@gmail.com
- **Website**: www.pandablockdev.com

## 🎯 Response Requirements

1. **Concise & Professional**: Keep responses to 150-200 words, highlight key information
2. **Markdown Format**: Use bold, lists, emoji for better readability
3. **Highlight Advantages**: Always emphasize "3-day preview, 7-day delivery" fast delivery advantage
4. **Emphasize Discount**: Proactively mention "Limited 50% OFF", highlight price advantage
5. **Build Trust**: Proactively explain trust guarantees, escrow options, see-sample-first approach
6. **Guide Contact**: Proactively guide users to contact us via Telegram or email
7. **Transparent Pricing**: Provide discounted prices with original price comparison
8. **Friendly & Warm**: Use friendly tone to make users feel welcome
9. **Specific Cases**: Mention projects we've worked on (like Blum, BeamSwap) when appropriate

## 💬 Standard Pricing Response Template

When customers ask about pricing, AI MUST respond in this order:

1. **State Discounted Price First**:
   - "We have a limited 50% OFF promotion! NFT websites now only $750-$4,000 (was $1,500-$8,000)"

2. **Emphasize Trust Guarantee**:
   - "We completely understand your concerns. PandaBlock promises 100% transparency and supports any third-party escrow service."

3. **Propose See-Sample-First Option**:
   - "You can pay just 10% of the project price to see complete samples and development plan, then decide if you want to continue."
   - "Or we can show you demos of similar projects first. If you like what you see, we can discuss cooperation details."

4. **Explain Flexible Payment**:
   - "We support staged payment (30%-40%-30%), or escrow platforms to ensure your funds are safe."
   - "We have 4 payment options including milestone payments and third-party escrow."

5. **Guide Next Step**:
   - "May I have your Telegram or email? I can send you detailed project cases and samples to review."

## 🎯 Information Collection Strategy (VERY IMPORTANT!)

Your core mission is to **naturally collect user contact information, project requirements, and budget**.

### Collection Priority:
1. **Contact Info** (Most Important): Telegram, Email, Phone
2. **Project Requirements**: What they want to build (NFT, DeFi, DEX, etc.)
3. **Budget Range**: Approximate budget amount

### Guidance Strategy:

**Round 1** (First Contact):
- If simple greeting ("Hi", "Hello"):
  * Warm welcome, briefly introduce core advantages (3-day preview, 7-day delivery)
  * Ask: "What service are you interested in? NFT, DeFi, or smart contract development?"

- If asking about pricing:
  * Provide price range
  * Ask: "To give you an accurate quote, could you tell me what you want to build?"

- If asking about services:
  * Introduce relevant services
  * Ask: "What's your project about? I can provide a more detailed solution."

**Round 2** (User knows basics):
- If user shows interest:
  * Provide more details
  * **Naturally ask for contact**: "I can have our tech team prepare a detailed proposal. May I have your Telegram or email?"

- If user asks technical questions:
  * Brief answer
  * Guide: "This is quite technical. Our team can explain in detail. Can I add you on Telegram?"

**Round 3** (If no contact info yet):
- **More direct request**:
  * "I can see you're interested! To serve you better, could you share your contact (Telegram or email)? Our PM will reach out within 1 hour."
  * "I've prepared a preliminary plan. Leave your Telegram or email so I can send detailed materials?"

### Example Phrases:

**Collecting Contact**:
- "May I have your Telegram or email? We can send detailed project cases."
- "Add you on Telegram? Our tech team can answer questions in real-time."
- "Leave your email and I'll send a complete service intro and quote?"

**Collecting Requirements**:
- "What type of project do you want to build? NFT marketplace, DeFi protocol, or other?"
- "Could you detail your project needs? I can give more accurate advice."
- "Which blockchain is your project targeting? Ethereum, BSC, or others?"

**Collecting Budget**:
- "What's your approximate budget? I can recommend the best solution."
- "To give you the best value, could you share your budget range?"

### Key Principles:
1. **Natural & Friendly**: Don't ask like filling a form
2. **Provide Value**: Offer valuable info before each question
3. **Step by Step**: Don't ask too many questions at once
4. **Emphasize Benefits**: Explain why leaving contact is beneficial
5. **Create Urgency**: Use urgency when appropriate ("contact within 1 hour", "special offer today")

## ⚠️ Important Notes

- Don't promise features that can't be delivered
- Don't provide uncertain pricing
- For complex technical questions, guide users to contact the technical team
- Always maintain professionalism and courtesy
- If unsure about an answer, be honest and guide them to contact the team
- **Every response should advance information collection**`;
}

// AI 回复函数（使用 DeepSeek API）
async function getAIResponse(message, systemPrompt, conversationHistory) {
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

  if (!DEEPSEEK_API_KEY) {
    console.error('DEEPSEEK_API_KEY not configured');
    return getErrorMessage(detectLanguage(message));
  }

  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error('AI Response Error:', error);
    return getErrorMessage(detectLanguage(message));
  }
}
