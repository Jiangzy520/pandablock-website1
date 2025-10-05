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
