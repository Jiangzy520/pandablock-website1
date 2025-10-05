// PandaBlock 简易在线客服系统
// 自定义聊天窗口 + AI 自动回复

(function() {
  'use strict';

  // 配置
  const CONFIG = {
    apiEndpoint: '/api/chat',
    position: 'bottom-right', // bottom-right, bottom-left
    primaryColor: '#4CAF50',
    botName: 'PandaBlock Support',
    welcomeMessage: 'Hello! 👋 I\'m PandaBlock\'s AI assistant.\n\nWe specialize in blockchain and Web3 development services.\n\n🔒 Safe transactions with escrow options\n⚡ Fast delivery with quick samples\n🤝 Flexible cooperation models\n\nHow can I help you today?',
    version: '2.1.1', // 版本号，用于强制刷新缓存
    emailNotification: 'hayajaiahk@gmail.com', // 接收通知的邮箱
    telegramBotToken: '', // Telegram Bot Token（可选）
    telegramChatId: '' // Telegram Chat ID（可选）
  };

  // 创建聊天窗口 HTML
  const chatHTML = `
    <div id="pandablock-chat-widget" class="pb-chat-widget">
      <!-- 聊天按钮 -->
      <div id="pb-chat-button" class="pb-chat-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.43 14.98 3.17 16.21L2 22L7.79 20.83C9.02 21.57 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="white"/>
          <path d="M8 11H16M8 15H13" stroke="${CONFIG.primaryColor}" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span class="pb-unread-badge" style="display: none;">1</span>
      </div>

      <!-- 聊天窗口 -->
      <div id="pb-chat-window" class="pb-chat-window" style="display: none;">
        <!-- 头部 -->
        <div class="pb-chat-header">
          <div class="pb-chat-header-info">
            <div class="pb-chat-avatar">🐼</div>
            <div>
              <div class="pb-chat-title">${CONFIG.botName}</div>
              <div class="pb-chat-status">
                <span class="pb-status-dot"></span>
                在线
              </div>
            </div>
          </div>
          <button id="pb-chat-close" class="pb-chat-close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- 消息区域 -->
        <div id="pb-chat-messages" class="pb-chat-messages">
          <div class="pb-message pb-message-bot">
            <div class="pb-message-avatar">🐼</div>
            <div class="pb-message-content">
              <div class="pb-message-text">${CONFIG.welcomeMessage}</div>
              <div class="pb-message-time">${getCurrentTime()}</div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="pb-chat-input-container">
          <input 
            type="text" 
            id="pb-chat-input" 
            class="pb-chat-input" 
            placeholder="输入消息..."
            maxlength="500"
          />
          <button id="pb-chat-send" class="pb-chat-send">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 10L18 2L10 18L8 11L2 10Z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <!-- Powered by -->
        <div class="pb-chat-footer">
          <a href="https://pandablockdev.com" target="_blank" style="color: #666; text-decoration: none; font-size: 12px; font-weight: 500;">
            Powered by PandaBlock
          </a>
        </div>
      </div>
    </div>
  `;

  // 创建样式
  const chatCSS = `
    .pb-chat-widget {
      position: fixed;
      ${CONFIG.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
      bottom: 100px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    .pb-chat-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${CONFIG.primaryColor};
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      position: relative;
    }

    .pb-chat-button:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(0,0,0,0.2);
    }

    .pb-unread-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #f44336;
      color: white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    }

    .pb-chat-window {
      position: absolute;
      bottom: 80px;
      ${CONFIG.position.includes('right') ? 'right: 0;' : 'left: 0;'}
      width: 380px;
      height: 600px;
      max-height: calc(100vh - 120px);
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: slideUp 0.3s ease;
    }

    /* 确保 flex 布局正确 */
    .pb-chat-window > * {
      flex-shrink: 0;
    }

    .pb-chat-window .pb-chat-messages {
      flex-shrink: 1;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .pb-chat-header {
      background: ${CONFIG.primaryColor};
      color: white;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .pb-chat-header-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .pb-chat-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .pb-chat-title {
      font-weight: 600;
      font-size: 16px;
    }

    .pb-chat-status {
      font-size: 12px;
      opacity: 0.9;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .pb-status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #8BC34A;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .pb-chat-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.8;
      transition: opacity 0.2s;
    }

    .pb-chat-close:hover {
      opacity: 1;
    }

    .pb-chat-messages {
      flex: 1 1 auto !important;
      overflow-y: scroll !important;
      overflow-x: hidden !important;
      padding: 16px;
      background: #f5f5f5;
      min-height: 0 !important; /* 修复 flex 子元素滚动问题 */
      max-height: 400px !important; /* 强制设置最大高度 */
      -webkit-overflow-scrolling: touch !important; /* iOS 平滑滚动 */
      position: relative !important;
    }

    /* 自定义滚动条样式 */
    .pb-chat-messages::-webkit-scrollbar {
      width: 6px;
    }

    .pb-chat-messages::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    .pb-chat-messages::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 3px;
    }

    .pb-chat-messages::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    .pb-message {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .pb-message-bot {
      justify-content: flex-start;
    }

    .pb-message-user {
      justify-content: flex-end;
    }

    .pb-message-user .pb-message-content {
      background: ${CONFIG.primaryColor};
      color: white;
    }

    .pb-message-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }

    .pb-message-content {
      background: #f5f5f5;  /* AI 消息：浅灰色背景（更好的对比度） */
      padding: 10px 14px;
      border-radius: 12px;
      max-width: 70%;
    }

    .pb-message-text {
      font-size: 15px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-wrap: break-word;
      color: #1a1a1a !important;  /* 深黑色文字，确保清晰可读 */
      font-weight: 500;  /* 中等粗细，更清晰 */
      letter-spacing: 0.2px;  /* 增加字母间距，提高可读性 */
    }

    .pb-message-user .pb-message-content {
      background: ${CONFIG.primaryColor};  /* 用户消息：绿色背景 */
    }

    .pb-message-user .pb-message-text {
      color: white !important;  /* 用户消息：白色文字 */
    }

    .pb-message-time {
      font-size: 11px;
      opacity: 0.6;
      margin-top: 4px;
    }

    .pb-typing-indicator {
      display: flex;
      gap: 4px;
      padding: 10px 14px;
    }

    .pb-typing-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #999;
      animation: typing 1.4s infinite;
    }

    .pb-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .pb-typing-dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-10px); }
    }

    .pb-chat-input-container {
      display: flex;
      gap: 8px;
      padding: 16px;
      background: white;
      border-top: 1px solid #e0e0e0;
    }

    .pb-chat-input {
      flex: 1;
      border: 1px solid #e0e0e0;
      border-radius: 20px;
      padding: 10px 16px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }

    .pb-chat-input:focus {
      border-color: ${CONFIG.primaryColor};
    }

    .pb-chat-send {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: ${CONFIG.primaryColor};
      border: none;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .pb-chat-send:hover {
      transform: scale(1.1);
    }

    .pb-chat-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pb-chat-footer {
      padding: 10px;
      text-align: center;
      background: #f5f5f5;
      border-top: 1px solid #e0e0e0;
    }

    .pb-chat-footer a {
      color: #666 !important;
      text-decoration: none !important;
      font-size: 12px !important;
      font-weight: 500 !important;
      transition: color 0.2s ease;
    }

    .pb-chat-footer a:hover {
      color: ${CONFIG.primaryColor} !important;
    }

    @media (max-width: 480px) {
      .pb-chat-window {
        width: calc(100vw - 40px);
        height: calc(100vh - 120px);
      }
    }
  `;

  // 对话历史存储（存储在内存中）
  let conversationHistory = [];

  // 获取当前时间
  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }

  // 添加消息到聊天窗口
  function addMessage(text, isUser = false) {
    const messagesContainer = document.getElementById('pb-chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `pb-message pb-message-${isUser ? 'user' : 'bot'}`;

    const currentTime = getCurrentTime();

    messageDiv.innerHTML = `
      ${!isUser ? '<div class="pb-message-avatar">🐼</div>' : ''}
      <div class="pb-message-content">
        <div class="pb-message-text">${text}</div>
        <div class="pb-message-time">${currentTime}</div>
      </div>
      ${isUser ? '<div class="pb-message-avatar">👤</div>' : ''}
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // 将消息添加到对话历史（排除欢迎消息）
    if (conversationHistory.length > 0 || isUser) {
      conversationHistory.push({
        text: text,
        isUser: isUser,
        time: currentTime,
        timestamp: new Date().toISOString()
      });
    }
  }

  // 显示输入中指示器
  function showTypingIndicator() {
    const messagesContainer = document.getElementById('pb-chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'pb-typing';
    typingDiv.className = 'pb-message pb-message-bot';
    typingDiv.innerHTML = `
      <div class="pb-message-avatar">🐼</div>
      <div class="pb-message-content">
        <div class="pb-typing-indicator">
          <div class="pb-typing-dot"></div>
          <div class="pb-typing-dot"></div>
          <div class="pb-typing-dot"></div>
        </div>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // 移除输入中指示器
  function hideTypingIndicator() {
    const typingDiv = document.getElementById('pb-typing');
    if (typingDiv) {
      typingDiv.remove();
    }
  }

  // 发送邮件通知
  async function sendEmailNotification(message) {
    try {
      // 方法1: 使用隐藏的表单提交到 FormSubmit.co
      const form = document.createElement('form');
      form.action = `https://formsubmit.co/${CONFIG.emailNotification}`;
      form.method = 'POST';
      form.style.display = 'none';

      // 添加表单字段
      const fields = {
        '_subject': '🔔 PandaBlock 网站新消息',
        '_template': 'table',
        '_captcha': 'false',
        '_next': window.location.href, // 提交后返回当前页面
        '访客消息': message,
        '时间': new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
        '页面URL': window.location.href,
        '浏览器': navigator.userAgent
      };

      for (const [key, value] of Object.entries(fields)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }

      document.body.appendChild(form);

      // 在新窗口提交表单（不影响当前页面）
      const popup = window.open('', 'emailNotification', 'width=1,height=1');
      form.target = 'emailNotification';
      form.submit();

      // 3秒后关闭弹窗和移除表单
      setTimeout(() => {
        if (popup) popup.close();
        form.remove();
      }, 3000);

      console.log('✅ 邮件通知已发送到:', CONFIG.emailNotification);

      // 方法2: 同时使用 Telegram 通知（如果配置了）
      if (CONFIG.telegramBotToken && CONFIG.telegramChatId) {
        sendTelegramNotification(message);
      }
    } catch (error) {
      console.error('❌ 邮件通知发送失败:', error);
    }
  }

  // 发送 Telegram 通知（可选）
  async function sendTelegramNotification(message) {
    try {
      const text = `🔔 *PandaBlock 网站新消息*\n\n📝 消息: ${message}\n⏰ 时间: ${new Date().toLocaleString('zh-CN')}\n🌐 页面: ${window.location.href}`;

      await fetch(`https://api.telegram.org/bot${CONFIG.telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: CONFIG.telegramChatId,
          text: text,
          parse_mode: 'Markdown'
        })
      });

      console.log('✅ Telegram 通知已发送');
    } catch (error) {
      console.error('❌ Telegram 通知发送失败:', error);
    }
  }

  // 发送消息到 AI
  async function sendMessageToAI(message) {
    // 发送邮件通知（异步，不阻塞 AI 回复）
    sendEmailNotification(message);

    try {
      const response = await fetch(CONFIG.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          visitorName: '网站访客',
          visitorEmail: '',
          conversationHistory: conversationHistory  // 发送完整对话历史
        })
      });

      const data = await response.json();

      hideTypingIndicator();

      if (data.success && data.reply) {
        addMessage(data.reply, false);
      } else {
        addMessage('抱歉，我现在无法回复。请直接通过 Telegram (@PandaBlock_Labs) 或邮箱 (hayajaiahk@gmail.com) 联系我们。', false);
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      hideTypingIndicator();
      addMessage('网络连接失败，请稍后再试。您也可以直接通过 Telegram (@PandaBlock_Labs) 联系我们。', false);
    }
  }

  // 初始化聊天窗口
  function initChatWidget() {
    // 添加样式
    const styleElement = document.createElement('style');
    styleElement.textContent = chatCSS;
    document.head.appendChild(styleElement);

    // 添加 HTML
    document.body.insertAdjacentHTML('beforeend', chatHTML);

    // 绑定事件
    const chatButton = document.getElementById('pb-chat-button');
    const chatWindow = document.getElementById('pb-chat-window');
    const chatClose = document.getElementById('pb-chat-close');
    const chatInput = document.getElementById('pb-chat-input');
    const chatSend = document.getElementById('pb-chat-send');

    // 打开/关闭聊天窗口
    chatButton.addEventListener('click', () => {
      const isVisible = chatWindow.style.display !== 'none';
      chatWindow.style.display = isVisible ? 'none' : 'block';
      if (!isVisible) {
        chatInput.focus();
      }
    });

    chatClose.addEventListener('click', () => {
      chatWindow.style.display = 'none';
    });

    // 发送消息
    function sendMessage() {
      const message = chatInput.value.trim();
      if (!message) return;

      // 添加用户消息
      addMessage(message, true);
      chatInput.value = '';

      // 显示输入中
      showTypingIndicator();

      // 发送到 AI
      sendMessageToAI(message);
    }

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatWidget);
  } else {
    initChatWidget();
  }

})();

