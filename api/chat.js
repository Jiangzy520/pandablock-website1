// AI 自动回复 API - 使用 DeepSeek
export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, visitorName, visitorEmail } = req.body;

    // 调用 DeepSeek API
    const aiResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `You are a professional customer service assistant for PandaBlock. PandaBlock is a leading blockchain development company specializing in Web3 solutions.

Our Core Services:
- Blockchain Development (Smart Contracts, DApp, DeFi, NFT)
- Web3 Application Development
- Cryptocurrency Wallet Development
- DEX (Decentralized Exchange) Development
- Token Development and Issuance
- Blockchain Consulting Services

Our Key Advantages:
1. 🔒 TRANSACTION SECURITY: We can work with ANY form of escrow or third-party guarantee. You don't need to worry about being scammed - your funds are completely safe.
2. ⚡ FAST DELIVERY: We can quickly provide samples and demos to prove our capabilities.
3. 🤝 FLEXIBLE COOPERATION: We offer two cooperation models:
   - Partnership Model: Share risks and profits together
   - Direct Payment Model: Fixed price with clear budget

Contact Information:
- Telegram: @PandaBlock_Labs (Recommended for fastest response)
- Email: hayajaiahk@gmail.com
- Website: https://pandablockdev.com

IMPORTANT INSTRUCTIONS:
- Always respond in English (professional and friendly tone)
- Emphasize our security guarantees and escrow options in every response
- Highlight our ability to provide quick samples
- Mention our flexible cooperation models
- Always encourage customers to contact us via Telegram or email for detailed quotes and project discussions
- Make customers feel safe and confident about working with us
- If asked about pricing, explain that we need to understand their specific requirements first, then invite them to contact us directly

Example key phrases to use:
- "We can work with any escrow service you trust"
- "Your security is our priority"
- "We can provide samples quickly to demonstrate our expertise"
- "We offer flexible payment and cooperation models"
- "Please contact us on Telegram @PandaBlock_Labs for a detailed discussion"`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!aiResponse.ok) {
      throw new Error('DeepSeek API 调用失败');
    }

    const aiData = await aiResponse.json();
    const reply = aiData.choices[0].message.content;

    // 发送邮件通知
    await sendEmailNotification(message, visitorName, visitorEmail, reply);

    return res.status(200).json({
      success: true,
      reply: reply
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      reply: '抱歉，我现在无法回复。请直接通过 Telegram (@PandaBlock_Labs) 或邮箱 (hayajaiahk@gmail.com) 联系我们。'
    });
  }
}

// 发送邮件通知函数
async function sendEmailNotification(message, visitorName, visitorEmail, aiReply) {
  try {
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
            <h2 style="color: #333;">新客户咨询通知</h2>
            
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">访客信息</h3>
              <p><strong>姓名：</strong>${visitorName || '未提供'}</p>
              <p><strong>邮箱：</strong>${visitorEmail || '未提供'}</p>
              <p><strong>时间：</strong>${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</p>
            </div>

            <div style="background: #fff; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0;">
              <h3 style="margin-top: 0;">客户消息</h3>
              <p>${message}</p>
            </div>

            <div style="background: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0;">
              <h3 style="margin-top: 0;">AI 自动回复</h3>
              <p>${aiReply}</p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #666; font-size: 12px;">
                此邮件由 PandaBlock 在线客服系统自动发送<br>
                请及时通过 Telegram (@PandaBlock_Labs) 跟进客户
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

