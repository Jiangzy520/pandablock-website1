// 测试环境变量
module.exports = async function handler(req, res) {
  const hasDeepSeekKey = !!process.env.DEEPSEEK_API_KEY;
  const hasResendKey = !!process.env.RESEND_API_KEY;
  
  return res.status(200).json({
    environment: 'production',
    timestamp: new Date().toISOString(),
    environmentVariables: {
      DEEPSEEK_API_KEY: hasDeepSeekKey ? 'configured' : 'missing',
      RESEND_API_KEY: hasResendKey ? 'configured' : 'missing'
    },
    message: hasDeepSeekKey && hasResendKey ? 'All environment variables configured' : 'Some environment variables are missing'
  });
}

