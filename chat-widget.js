// PandaBlock 在线客服系统
// 集成 Tawk.to + AI 自动回复

(function() {
  // 配置
  const CONFIG = {
    tawkPropertyId: '你的Tawk.to属性ID', // 需要替换
    tawkWidgetId: '你的Tawk.to小部件ID',   // 需要替换
    aiApiEndpoint: '/api/chat',
    enableAI: true,
    aiAutoReplyDelay: 2000 // AI 自动回复延迟（毫秒）
  };

  // 加载 Tawk.to
  function loadTawkTo() {
    var Tawk_API = Tawk_API || {};
    var Tawk_LoadStart = new Date();
    
    (function() {
      var s1 = document.createElement("script");
      var s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/' + CONFIG.tawkPropertyId + '/' + CONFIG.tawkWidgetId;
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();

    // Tawk.to 事件监听
    if (typeof Tawk_API !== 'undefined') {
      // 当访客发送消息时
      Tawk_API.onChatMessageVisitor = function(message) {
        console.log('访客消息:', message);
        
        if (CONFIG.enableAI) {
          handleAIResponse(message);
        }
      };

      // 当聊天开始时
      Tawk_API.onChatStarted = function() {
        console.log('聊天已开始');
        
        // 发送欢迎消息
        setTimeout(function() {
          Tawk_API.addEvent('chat_started', {
            timestamp: new Date().toISOString()
          });
        }, 1000);
      };

      // 自定义欢迎消息
      Tawk_API.onLoad = function() {
        console.log('Tawk.to 已加载');
        
        // 设置自定义属性
        Tawk_API.setAttributes({
          'name': 'PandaBlock 客服',
          'email': 'hayajaiahk@gmail.com'
        }, function(error) {
          if (error) {
            console.error('设置属性失败:', error);
          }
        });
      };
    }
  }

  // 处理 AI 自动回复
  async function handleAIResponse(message) {
    try {
      // 获取访客信息
      const visitorName = Tawk_API.getWindowType() === 'inline' ? 
        (Tawk_API.visitor?.name || '访客') : '访客';
      const visitorEmail = Tawk_API.visitor?.email || '';

      // 显示"正在输入"状态
      console.log('AI 正在生成回复...');

      // 延迟后调用 AI API
      setTimeout(async function() {
        const response = await fetch(CONFIG.aiApiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: message.message || message,
            visitorName: visitorName,
            visitorEmail: visitorEmail
          })
        });

        const data = await response.json();

        if (data.success && data.reply) {
          // 发送 AI 回复
          Tawk_API.addEvent('ai_reply', {
            message: message.message || message,
            reply: data.reply,
            timestamp: new Date().toISOString()
          });

          console.log('AI 回复:', data.reply);
          
          // 注意：Tawk.to 免费版不支持通过 API 发送消息
          // 需要在 Tawk.to 后台手动回复，或升级到付费版
          // 这里我们只是记录事件，邮件通知已经发送
        } else {
          console.error('AI 回复失败:', data.error);
        }
      }, CONFIG.aiAutoReplyDelay);

    } catch (error) {
      console.error('AI 处理错误:', error);
    }
  }

  // 初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadTawkTo);
  } else {
    loadTawkTo();
  }

  // 添加自定义样式
  const style = document.createElement('style');
  style.textContent = `
    /* Tawk.to 自定义样式 */
    #tawk-bubble-container {
      bottom: 20px !important;
      right: 20px !important;
    }

    @media (max-width: 768px) {
      #tawk-bubble-container {
        bottom: 10px !important;
        right: 10px !important;
      }
    }
  `;
  document.head.appendChild(style);

})();

