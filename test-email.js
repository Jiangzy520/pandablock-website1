// 测试邮件发送功能
// 使用方法：在浏览器控制台运行此代码

async function testEmailNotification() {
  console.log('🧪 开始测试邮件通知功能...\n');
  
  const testCases = [
    {
      name: '测试 1：简单问候',
      message: '你好',
      conversationHistory: []
    },
    {
      name: '测试 2：询问价格',
      message: '开发一个 NFT 网站多少钱？',
      conversationHistory: []
    },
    {
      name: '测试 3：包含联系方式',
      message: '我的 Telegram 是 @test_user，想开发一个 NFT 项目，预算 $3000',
      conversationHistory: [
        { role: 'user', content: '你好' },
        { role: 'assistant', content: '您好！欢迎来到 PandaBlock...' }
      ]
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n📧 ${testCase.name}`);
    console.log('━'.repeat(50));
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: testCase.message,
          conversationHistory: testCase.conversationHistory
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ API 调用成功');
        console.log('📝 消息:', testCase.message);
        console.log('🌍 语言:', data.language);
        console.log('🎯 意图:', data.intent);
        console.log('💬 AI 回复:', data.reply.substring(0, 100) + '...');
        console.log('\n⏳ 请检查邮箱 hayajaiahk@gmail.com');
        console.log('📧 邮件主题应该是: 🔔 新的' + (data.language === 'zh' ? '中文' : '英文') + '咨询 - ' + data.intent);
      } else {
        console.error('❌ API 调用失败:', data.error);
      }
      
      // 等待 2 秒再发送下一个测试
      if (testCase !== testCases[testCases.length - 1]) {
        console.log('\n⏳ 等待 2 秒...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
    } catch (error) {
      console.error('❌ 测试失败:', error);
    }
  }
  
  console.log('\n' + '━'.repeat(50));
  console.log('🎉 测试完成！');
  console.log('\n📋 下一步：');
  console.log('1. 检查邮箱 hayajaiahk@gmail.com（包括垃圾邮件文件夹）');
  console.log('2. 应该收到 3 封邮件通知');
  console.log('3. 如果没收到，查看 Vercel 函数日志');
  console.log('4. 访问 https://vercel.com → 项目 → Functions → /api/chat');
}

// 运行测试
testEmailNotification();

