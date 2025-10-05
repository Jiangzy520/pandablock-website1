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
    return `💰 **PandaBlock 透明定价**

🚀 **快速交付套餐**：
• **智能合约开发**: $2,000 - $8,000 (7天交付)
• **NFT 网站**: $1,500 - $5,000 (7天交付)  
• **DeFi 平台**: $5,000 - $15,000 (7天交付)
• **DEX 平台**: $8,000 - $20,000 (7天交付)

⚡ **3天预览保证**：
所有项目都会在3天内展示核心功能和界面设计

🎯 **价格包含**：
• 完整源代码
• 智能合约审计
• 部署和上线
• 30天免费维护
• 技术文档

💎 **付款方式**：
• 50% 启动费用
• 50% 完成后付款
• 支持加密货币支付

📞 **获取精确报价**：
• Telegram: @PandaBlock_Labs  
• 邮箱: hayajaiahk@gmail.com

告诉我您的具体需求，我会为您提供详细报价！`;
  }
  
  return `💰 **PandaBlock Transparent Pricing**

🚀 **Fast Delivery Packages**:
• **Smart Contract Development**: $2,000 - $8,000 (7-day delivery)
• **NFT Website**: $1,500 - $5,000 (7-day delivery)
• **DeFi Platform**: $5,000 - $15,000 (7-day delivery)  
• **DEX Platform**: $8,000 - $20,000 (7-day delivery)

⚡ **3-Day Preview Guarantee**:
All projects will showcase core features and UI design within 3 days

🎯 **Price Includes**:
• Complete source code
• Smart contract audit
• Deployment and launch
• 30-day free maintenance
• Technical documentation

💎 **Payment Options**:
• 50% upfront fee
• 50% upon completion
• Cryptocurrency payments accepted

📞 **Get Accurate Quote**:
• Telegram: @PandaBlock_Labs
• Email: hayajaiahk@gmail.com

Tell me your specific requirements and I'll provide a detailed quote!`;
}

// 错误消息
function getErrorMessage(language) {
  return language === 'zh' 
    ? '抱歉，我现在无法回复。请直接联系我们：Telegram @PandaBlock_Labs 或邮箱 hayajaiahk@gmail.com'
    : 'Sorry, I cannot respond right now. Please contact us directly: Telegram @PandaBlock_Labs or email hayajaiahk@gmail.com';
}

// 发送通知（简化版）
async function sendNotifications(message, name, email, language, intent, history) {
  // 这里可以添加邮件和 Telegram 通知逻辑
  console.log(`New ${language} message (${intent}):`, message);
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
- 价格：$5,000 - $20,000

### 2. NFT 开发
- NFT 市场开发
- NFT 铸造网站
- 10K NFT 集合生成
- NFT 游戏集成
- 价格：$1,500 - $8,000

### 3. 智能合约开发
- ERC-20/BEP-20 代币
- ERC-721/ERC-1155 NFT 合约
- 多签钱包
- DAO 治理合约
- 智能合约审计
- 价格：$2,000 - $8,000

### 4. 区块链数据服务
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

## 💰 定价策略

**快速交付套餐**：
- 智能合约开发：$2,000 - $8,000（7天交付）
- NFT 网站：$1,500 - $5,000（7天交付）
- DeFi 平台：$5,000 - $15,000（7天交付）
- DEX 平台：$8,000 - $20,000（7天交付）

**价格包含**：
- 完整源代码
- 智能合约审计
- 部署和上线
- 30天免费维护
- 技术文档

**付款方式**：
- 50% 启动费用
- 50% 完成后付款
- 支持加密货币支付

## 📞 联系方式

- **Telegram**: @PandaBlock_Labs
- **邮箱**: hayajaiahk@gmail.com
- **网站**: www.pandablockdev.com

## 🎯 回复要求

1. **简洁专业**：回复控制在 150-200 字以内，突出关键信息
2. **Markdown 格式**：使用粗体、列表、emoji 让回复更易读
3. **突出优势**：每次回复都要强调"3天预览，7天交付"的快速交付优势
4. **引导联系**：主动引导用户通过 Telegram 或邮箱联系我们
5. **价格透明**：根据用户询问提供明确的价格范围
6. **友好热情**：使用友好的语气，让用户感到受欢迎
7. **具体案例**：如果合适，可以提及我们服务过的项目（如 Blum、BeamSwap 等）

## ⚠️ 注意事项

- 不要承诺无法实现的功能
- 不要提供不确定的价格
- 遇到复杂技术问题，引导用户联系技术团队
- 始终保持专业和礼貌
- 如果不确定答案，诚实告知并引导联系团队`;
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
- Price: $5,000 - $20,000

### 2. NFT Development
- NFT Marketplace Development
- NFT Minting Websites
- 10K NFT Collection Generation
- NFT Gaming Integration
- Price: $1,500 - $8,000

### 3. Smart Contract Development
- ERC-20/BEP-20 Tokens
- ERC-721/ERC-1155 NFT Contracts
- Multi-Signature Wallets
- DAO Governance Contracts
- Smart Contract Audits
- Price: $2,000 - $8,000

### 4. Blockchain Data Services
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

## 💰 Pricing Strategy

**Fast Delivery Packages**:
- Smart Contract Development: $2,000 - $8,000 (7-day delivery)
- NFT Website: $1,500 - $5,000 (7-day delivery)
- DeFi Platform: $5,000 - $15,000 (7-day delivery)
- DEX Platform: $8,000 - $20,000 (7-day delivery)

**Price Includes**:
- Complete source code
- Smart contract audit
- Deployment and launch
- 30-day free maintenance
- Technical documentation

**Payment Options**:
- 50% upfront fee
- 50% upon completion
- Cryptocurrency payments accepted

## 📞 Contact Information

- **Telegram**: @PandaBlock_Labs
- **Email**: hayajaiahk@gmail.com
- **Website**: www.pandablockdev.com

## 🎯 Response Requirements

1. **Concise & Professional**: Keep responses to 150-200 words, highlight key information
2. **Markdown Format**: Use bold, lists, emoji for better readability
3. **Highlight Advantages**: Always emphasize "3-day preview, 7-day delivery" fast delivery advantage
4. **Guide Contact**: Proactively guide users to contact us via Telegram or email
5. **Transparent Pricing**: Provide clear price ranges based on user inquiries
6. **Friendly & Warm**: Use friendly tone to make users feel welcome
7. **Specific Cases**: Mention projects we've worked on (like Blum, BeamSwap) when appropriate

## ⚠️ Important Notes

- Don't promise features that can't be delivered
- Don't provide uncertain pricing
- For complex technical questions, guide users to contact the technical team
- Always maintain professionalism and courtesy
- If unsure about an answer, be honest and guide them to contact the team`;
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
