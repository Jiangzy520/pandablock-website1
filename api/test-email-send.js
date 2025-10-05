// 测试邮件发送
module.exports = async function handler(req, res) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  
  console.log('🧪 测试邮件发送');
  console.log('API Key 存在:', !!RESEND_API_KEY);
  
  if (!RESEND_API_KEY) {
    return res.status(500).json({ 
      error: 'RESEND_API_KEY not configured',
      success: false
    });
  }
  
  try {
    const emailData = {
      from: 'PandaBlock AI <onboarding@resend.dev>',
      to: ['hayajaiahk@gmail.com'],
      subject: '🧪 测试邮件 - ' + new Date().toISOString(),
      html: `
        <h1>测试邮件</h1>
        <p>这是一封测试邮件，发送时间：${new Date().toLocaleString('zh-CN')}</p>
        <p>如果您收到这封邮件，说明邮件发送功能正常工作。</p>
      `
    };
    
    console.log('📤 发送测试邮件到:', emailData.to);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify(emailData)
    });
    
    const responseData = await response.json();
    
    console.log('📧 Resend API 响应状态:', response.status);
    console.log('📧 Resend API 响应数据:', responseData);
    
    if (response.ok) {
      return res.status(200).json({
        success: true,
        message: '邮件发送成功',
        emailId: responseData.id,
        timestamp: new Date().toISOString()
      });
    } else {
      return res.status(500).json({
        success: false,
        error: '邮件发送失败',
        status: response.status,
        details: responseData
      });
    }
  } catch (error) {
    console.error('❌ 邮件发送异常:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}

