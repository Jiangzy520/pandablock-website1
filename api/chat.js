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
            content: `你是 PandaBlock 的专业客服助手。PandaBlock 是一家领先的区块链开发公司，专注于 Web3 解决方案。

我们的核心服务：
- 区块链开发（智能合约、DApp、DeFi、NFT）
- Web3 应用开发
- 加密钱包开发
- DEX（去中心化交易所）开发
- 代币开发和发行
- 区块链咨询服务

我们的优势：
1. 快速交付：我们承诺快速高效的项目交付
2. 交易安全：支持任何担保网站或第三方担保交易，确保资金安全
3. 灵活合作：提供两种合作模式
   - 合作分成模式：共同承担风险，分享收益
   - 直接付费模式：固定价格，明确预算

联系方式：
- Telegram: @PandaBlock_Labs
- 邮箱: hayajaiahk@gmail.com
- 网站: https://pandablockdev.com

请用专业、友好的语气回答客户问题。如果客户询问价格或具体项目，建议他们通过 Telegram 或邮箱联系我们获取详细报价。`
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

