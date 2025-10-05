// AI 自动回复 API - 使用 DeepSeek + 智能语言识别
export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, visitorName, visitorEmail, conversationHistory } = req.body;

    // 1. 检测客户消息的语言
    const language = detectLanguage(message);

    // 2. 检测用户意图（是否询问价格、是否有项目需求等）
    const intent = detectIntent(message, language);

    // 3. 构建对话上下文（用于 AI 理解对话历史）
    let conversationContext = '';
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext = conversationHistory.map(msg =>
        `${msg.isUser ? '客户' : 'AI'}: ${msg.text}`
      ).join('\n');
    }

    // 4. 如果是询问价格，直接返回标准回复
    if (intent === 'pricing') {
      const pricingReply = getPricingResponse(language);

      // 发送通知（异步，不阻塞响应）
      sendTelegramNotification(message, visitorName, visitorEmail, language, 'pricing', conversationHistory).catch(console.error);
      sendEmailNotification(message, visitorName, visitorEmail, pricingReply, language, conversationHistory).catch(console.error);

      return res.status(200).json({
        success: true,
        reply: pricingReply,
        language: language
      });
    }

    // 5. 调用 DeepSeek API（使用对应语言的 System Prompt + 对话历史）
    const systemPrompt = getSystemPrompt(language, conversationContext);

    // 构建消息数组（包含对话历史）
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];

    // 添加对话历史（最多保留最近 5 轮对话）
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-10); // 最多 10 条消息（5 轮对话）
      recentHistory.forEach(msg => {
        messages.push({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        });
      });
    }

    // 添加当前消息
    messages.push({
      role: 'user',
      content: message
    });

    const aiResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!aiResponse.ok) {
      throw new Error('DeepSeek API 调用失败');
    }

    const aiData = await aiResponse.json();
    const reply = aiData.choices[0].message.content;

    // 6. 发送通知（异步，不阻塞响应）
    sendTelegramNotification(message, visitorName, visitorEmail, language, intent, conversationHistory).catch(console.error);
    sendEmailNotification(message, visitorName, visitorEmail, reply, language, conversationHistory).catch(console.error);

    return res.status(200).json({
      success: true,
      reply: reply,
      language: language
    });

  } catch (error) {
    console.error('Error:', error);

    // 根据语言返回错误消息
    const language = detectLanguage(req.body.message || '');
    const errorMessage = language === 'zh'
      ? '抱歉，我现在无法回复。请直接通过 Telegram (@PandaBlock_Labs) 或邮箱 (hayajaiahk@gmail.com) 联系我们。'
      : 'Sorry, I cannot respond right now. Please contact us directly via Telegram (@PandaBlock_Labs) or email (hayajaiahk@gmail.com).';

    return res.status(500).json({
      success: false,
      error: error.message,
      reply: errorMessage
    });
  }
}

// ==================== 辅助函数 ====================

// 1. 语言检测函数
function detectLanguage(text) {
  // 检测中文字符（包括简体和繁体）
  const chineseRegex = /[\u4e00-\u9fa5]/g;
  const chineseMatches = text.match(chineseRegex);
  const chineseCount = chineseMatches ? chineseMatches.length : 0;

  // 如果中文字符占比超过 20%，判定为中文
  if (chineseCount > text.length * 0.2) {
    return 'zh';
  }

  // 默认返回英文
  return 'en';
}

// 2. 意图识别函数
function detectIntent(message, language) {
  const messageLower = message.toLowerCase();

  // 价格相关关键词
  const pricingKeywords = {
    zh: ['收费', '价格', '多少钱', '费用', '报价', '成本', '预算', '怎么收', '如何收费'],
    en: ['price', 'cost', 'how much', 'pricing', 'quote', 'fee', 'budget', 'charge', 'payment']
  };

  // 项目需求关键词
  const projectKeywords = {
    zh: ['需要', '想做', '开发', '项目', '合作', '定制', '帮我', '能不能'],
    en: ['need', 'want', 'develop', 'project', 'build', 'create', 'custom', 'can you', 'help me']
  };

  // 检测是否询问价格
  if (pricingKeywords[language].some(kw => messageLower.includes(kw))) {
    return 'pricing';
  }

  // 检测是否有项目需求
  if (projectKeywords[language].some(kw => messageLower.includes(kw))) {
    return 'project_inquiry';
  }

  return 'general';
}

// 3. 获取 System Prompt（根据语言）
function getSystemPrompt(language, conversationContext = '') {
  const prompts = {
    zh: `你是 PandaBlock（熊猫区块）的专业客服助手。PandaBlock 是一家领先的区块链开发公司，专注于 Web3 解决方案。

我们的核心服务：
- 区块链开发（智能合约、DApp、DeFi、NFT）
- Web3 应用开发
- 加密货币钱包开发
- DEX（去中心化交易所）开发
- 代币开发和发行
- 区块链咨询服务

我们的核心优势：
1. 🔒 交易安全：我们支持任何形式的第三方担保交易（如 Escrow），您完全不用担心被骗，资金绝对安全。我们是正规的区块链开发公司，可以签订正式合同。
2. ⚡ 快速交付：我们可以快速提供样品和演示，证明我们的实力。
3. 🤝 灵活合作：我们提供两种合作模式
   - 合伙模式：共同承担风险和利润
   - 直接付款模式：固定价格，预算明确

联系方式：
- Telegram: @PandaBlock_Labs（推荐，响应最快）
- 邮箱: hayajaiahk@gmail.com

重要指示 - 对话引导流程：
1. **首次咨询**：当客户首次咨询时，先表示感谢，然后主动询问："感谢您的咨询！为了更好地帮助您，请告诉我您的具体需求是什么？"
2. **需求确认**：当客户描述需求后，先确认理解客户需求，然后回复："好的，我已经记录了您的需求。请留下您的联系方式（邮箱或 Telegram），我们的团队会在 24 小时内与您联系，为您提供详细的解决方案和报价。"
3. **联系方式收集**：如果客户提供了联系方式，表示感谢并确认："感谢您提供联系方式！我们的团队已收到您的需求，会尽快通过 [客户提供的方式] 与您联系。期待与您合作！🚀"

回复风格：
- 始终用中文回复（专业且友好的语气）
- 在每次回复中强调我们的安全保障和担保选项
- 强调我们是正规公司，不存在欺骗性质
- 突出我们快速提供样品的能力
- 提及我们灵活的合作模式
- 主动引导客户提供需求和联系方式
- 让客户感到安全和有信心与我们合作

关键短语示例：
- "我们可以使用您信任的任何担保服务，如 Escrow"
- "您的安全是我们的首要任务，我们是正规公司"
- "我们可以快速提供样品来展示我们的专业能力"
- "我们提供灵活的付款和合作模式"
- "请留下您的联系方式，我们会尽快与您联系"

${conversationContext ? `\n对话上下文：\n${conversationContext}` : ''}`,

    en: `You are a professional customer service assistant for PandaBlock. PandaBlock is a leading blockchain development company specializing in Web3 solutions.

Our Core Services:
- Blockchain Development (Smart Contracts, DApp, DeFi, NFT)
- Web3 Application Development
- Cryptocurrency Wallet Development
- DEX (Decentralized Exchange) Development
- Token Development and Issuance
- Blockchain Consulting Services

Our Key Advantages:
1. 🔒 TRANSACTION SECURITY: We can work with ANY form of escrow or third-party guarantee. You don't need to worry about being scammed - your funds are completely safe. We are a legitimate blockchain development company and can sign formal contracts.
2. ⚡ FAST DELIVERY: We can quickly provide samples and demos to prove our capabilities.
3. 🤝 FLEXIBLE COOPERATION: We offer two cooperation models:
   - Partnership Model: Share risks and profits together
   - Direct Payment Model: Fixed price with clear budget

Contact Information:
- Telegram: @PandaBlock_Labs (Recommended for fastest response)
- Email: hayajaiahk@gmail.com

IMPORTANT INSTRUCTIONS - Conversation Flow:
1. **First Inquiry**: When a customer first contacts you, thank them and proactively ask: "Thank you for your inquiry! To better assist you, could you please tell me about your specific requirements?"
2. **Requirement Confirmation**: After the customer describes their needs, confirm understanding and reply: "Great! I've recorded your requirements. Please leave your contact information (email or Telegram), and our team will reach out within 24 hours with a detailed solution and quote."
3. **Contact Collection**: If the customer provides contact info, thank them and confirm: "Thank you for providing your contact information! Our team has received your requirements and will contact you via [customer's preferred method] soon. Looking forward to working with you! 🚀"

Response Style:
- Always respond in English (professional and friendly tone)
- Emphasize our security guarantees and escrow options in every response
- Emphasize that we are a legitimate company with no fraudulent practices
- Highlight our ability to provide quick samples
- Mention our flexible cooperation models
- Proactively guide customers to provide requirements and contact information
- Make customers feel safe and confident about working with us

Example key phrases to use:
- "We can work with any escrow service you trust"
- "Your security is our priority - we are a legitimate company"
- "We can provide samples quickly to demonstrate our expertise"
- "We offer flexible payment and cooperation models"
- "Please leave your contact information so we can reach out to you"

${conversationContext ? `\nConversation Context:\n${conversationContext}` : ''}`
  };

  return prompts[language] || prompts.en;
}

// 4. 获取标准收费回复
function getPricingResponse(language) {
  const responses = {
    zh: `感谢您的咨询！我们的收费方式灵活多样：

1. 💰 **定价方式**：根据项目难度和复杂程度定价
2. 🤝 **合作模式**：
   - 固定价格模式
   - 按阶段付款模式
   - 合伙分成模式
3. 🔒 **安全保障**：可以通过第三方担保平台交易，确保双方权益

我们是正规的区块链开发公司，不存在任何欺骗性质。支持：
✅ 第三方担保交易（如 Escrow）
✅ 签订正式合同
✅ 分阶段验收付款

请详细描述您的项目需求，我会将您的需求发送给我们的团队，我们会在 24 小时内给您详细报价。

📱 **推荐联系方式**：
- Telegram: @PandaBlock_Labs（最快响应）
- 邮箱: hayajaiahk@gmail.com

期待与您合作！🚀`,

    en: `Thank you for your inquiry! We offer flexible pricing options:

1. 💰 **Pricing Method**: Based on project complexity and difficulty
2. 🤝 **Cooperation Models**:
   - Fixed Price Model
   - Milestone-based Payment Model
   - Partnership/Revenue Sharing Model
3. 🔒 **Security Guarantee**: Third-party escrow services accepted to ensure security for both parties

We are a legitimate blockchain development company with no fraudulent practices. We support:
✅ Third-party escrow transactions (e.g., Escrow)
✅ Formal contract signing
✅ Milestone-based acceptance and payment

Please provide detailed information about your project requirements, and I will forward them to our team. We will provide you with a detailed quote within 24 hours.

📱 **Recommended Contact**:
- Telegram: @PandaBlock_Labs (Fastest response)
- Email: hayajaiahk@gmail.com

Looking forward to working with you! 🚀`
  };

  return responses[language] || responses.en;
}

// 5. 发送 Telegram 通知（包含对话历史）
async function sendTelegramNotification(message, visitorName, visitorEmail, language, intent, conversationHistory = []) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  // 如果没有配置 Telegram，跳过
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('Telegram 未配置，跳过推送');
    return;
  }

  const intentEmoji = {
    pricing: '💰',
    project_inquiry: '🚀',
    general: '💬'
  };

  const intentText = {
    pricing: '询问价格',
    project_inquiry: '项目需求',
    general: '一般咨询'
  };

  // 构建对话历史文本
  let conversationText = '';
  if (conversationHistory && conversationHistory.length > 0) {
    conversationText = '\n\n📜 *对话历史*\n';
    conversationHistory.forEach((msg, index) => {
      const label = msg.isUser ? '👤 客户' : '🤖 AI';
      conversationText += `${label}: ${msg.text}\n`;
    });
  }

  const text = `
${intentEmoji[intent]} *新客户咨询通知*

📋 *咨询类型*: ${intentText[intent]}

👤 *访客信息*
姓名: ${visitorName || '未提供'}
邮箱: ${visitorEmail || '未提供'}
语言: ${language === 'zh' ? '🇨🇳 中文' : '🇺🇸 English'}
${conversationText}
💬 *最新消息*
${message}

⏰ *时间*
${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}

---
⚡ 请及时跟进客户！
  `.trim();

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: 'Markdown'
      })
    });

    if (!response.ok) {
      console.error('Telegram 推送失败:', await response.text());
    }
  } catch (error) {
    console.error('Telegram 推送失败:', error);
  }
}

// 6. 发送邮件通知函数（包含完整对话历史）
async function sendEmailNotification(message, visitorName, visitorEmail, aiReply, language, conversationHistory = []) {
  try {
    // 构建完整对话历史 HTML
    let conversationHTML = '';
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHTML = '<div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">';
      conversationHTML += '<h3 style="margin-top: 0;">📜 完整对话记录</h3>';

      conversationHistory.forEach((msg, index) => {
        const bgColor = msg.isUser ? '#e8f5e9' : '#e3f2fd';
        const borderColor = msg.isUser ? '#4CAF50' : '#2196F3';
        const icon = msg.isUser ? '👤' : '🤖';
        const label = msg.isUser ? '客户' : 'AI';

        conversationHTML += `
          <div style="background: ${bgColor}; border-left: 4px solid ${borderColor}; padding: 10px; margin: 10px 0; border-radius: 3px;">
            <p style="margin: 0; font-size: 12px; color: #666;"><strong>${icon} ${label}</strong> - ${msg.time || ''}</p>
            <p style="margin: 5px 0 0 0; white-space: pre-wrap;">${msg.text}</p>
          </div>
        `;
      });

      conversationHTML += '</div>';
    }

    // 使用 Resend API 发送邮件（免费额度：每月 3000 封）
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'PandaBlock 客服 <onboarding@resend.dev>',
        to: 'hayajaiahk@gmail.com',
        subject: `🔔 新客户咨询 - ${visitorName || '访客'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">🔔 新客户咨询通知</h2>

            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">👤 访客信息</h3>
              <p><strong>姓名：</strong>${visitorName || '未提供'}</p>
              <p><strong>邮箱：</strong>${visitorEmail || '未提供'}</p>
              <p><strong>语言：</strong>${language === 'zh' ? '🇨🇳 中文' : '🇺🇸 English'}</p>
              <p><strong>时间：</strong>${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</p>
            </div>

            ${conversationHTML}

            <div style="background: #fff; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0;">
              <h3 style="margin-top: 0;">💬 最新客户消息</h3>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>

            <div style="background: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0;">
              <h3 style="margin-top: 0;">🤖 AI 最新回复</h3>
              <p style="white-space: pre-wrap;">${aiReply}</p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #666; font-size: 12px;">
                ⚡ 此邮件由 PandaBlock 在线客服系统自动发送<br>
                📱 请及时通过 Telegram (@PandaBlock_Labs) 跟进客户<br>
                📧 或直接回复客户邮箱: ${visitorEmail || '未提供'}
              </p>
            </div>
          </div>
        `
      })
    });

    if (!response.ok) {
      console.error('邮件发送失败:', await response.text());
    }
  } catch (error) {
    console.error('发送邮件通知失败:', error);
  }
}

