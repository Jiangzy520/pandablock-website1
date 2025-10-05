// PandaBlock 增强版 AI 聊天组件 - 专注快速交付
(function() {
  'use strict';

  // 配置
  const CONFIG = {
    apiEndpoint: '/api/chat',
    position: 'bottom-right',
    primaryColor: '#4CAF50',
    botName: 'PandaBlock AI',
    // 双语欢迎消息
    welcomeMessages: {
      en: `👋 **Welcome to PandaBlock!**

🚀 **Fast Web3 Development**:
• Smart contracts & websites in **7 days**
• See results in **3 days**
• 150+ blockchain experts

💡 **Quick Questions**:
• "How fast can you deliver?"
• "What's the price for NFT website?"
• "Tell me about your services"

How can I help you today?`,
      zh: `👋 **欢迎来到 PandaBlock！**

🚀 **快速 Web3 开发**：
• 智能合约和网站 **7天交付**
• **3天内**看到效果
• 150+ 区块链专家团队

💡 **常见问题**：
• "你们多快能交付？"
• "NFT网站开发多少钱？"
• "介绍一下你们的服务"

今天我能为您做些什么？`
    },
    version: '3.0.3' // 修复数字高亮顺序问题
  };

  // 检测用户语言
  function detectUserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('zh')) return 'zh';
    return 'en';
  }

  // 获取欢迎消息
  function getWelcomeMessage() {
    const userLang = detectUserLanguage();
    return CONFIG.welcomeMessages[userLang] || CONFIG.welcomeMessages.en;
  }

  // 创建聊天窗口 HTML
  const chatHTML = `
    <div id="pandablock-chat-widget" class="pb-chat-widget">
      <!-- 聊天按钮 -->
      <div id="pb-chat-button" class="pb-chat-button">
        <div class="pb-chat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.43 14.98 3.17 16.21L2 22L7.79 20.83C9.02 21.57 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="white"/>
            <path d="M8 11H16M8 15H13" stroke="${CONFIG.primaryColor}" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="pb-pulse-ring"></div>
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
                <span class="pb-status-text">在线 | Online</span>
              </div>
            </div>
          </div>
          <button id="pb-chat-close" class="pb-chat-close">×</button>
        </div>

        <!-- 消息区域 -->
        <div id="pb-chat-messages" class="pb-chat-messages">
          <div class="pb-message pb-message-bot">
            <div class="pb-message-avatar">🐼</div>
            <div class="pb-message-content">
              <div class="pb-message-text">${getWelcomeMessage()}</div>
              <div class="pb-message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            </div>
          </div>
        </div>

        <!-- 快速回复按钮 -->
        <div id="pb-quick-replies" class="pb-quick-replies">
          <button class="pb-quick-reply" data-message-en="How fast can you deliver?" data-message-zh="你们多快能交付？">
            ⚡ 交付时间 | Delivery Time
          </button>
          <button class="pb-quick-reply" data-message-en="What's the price for smart contract development?" data-message-zh="智能合约开发多少钱？">
            💰 价格咨询 | Pricing
          </button>
          <button class="pb-quick-reply" data-message-en="Tell me about your services" data-message-zh="介绍一下你们的服务">
            🛠️ 服务介绍 | Services
          </button>
        </div>

        <!-- 输入区域 -->
        <div class="pb-chat-input-area">
          <div class="pb-chat-input-wrapper">
            <input type="text" id="pb-chat-input" placeholder="输入消息... | Type a message..." maxlength="500">
            <button id="pb-chat-send" class="pb-chat-send">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div class="pb-typing-indicator" id="pb-typing" style="display: none;">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    </div>
  `;

  // CSS 样式
  const chatCSS = `
    <style>
    .pb-chat-widget {
      position: fixed;
      ${CONFIG.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
      bottom: 20px;
      z-index: 2147483647 !important; /* 最大 z-index 值，确保在所有元素之上 */
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .pb-chat-button {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, ${CONFIG.primaryColor}, #45a049);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
      transition: all 0.3s ease;
      position: relative;
      animation: float 3s ease-in-out infinite;
      z-index: 2147483647 !important; /* 确保按钮在最上层 */
      pointer-events: auto !important; /* 确保可以点击 */
    }

    .pb-chat-button:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 25px rgba(76, 175, 80, 0.4);
    }

    .pb-pulse-ring {
      position: absolute;
      width: 60px;
      height: 60px;
      border: 2px solid ${CONFIG.primaryColor};
      border-radius: 50%;
      animation: pulse 2s infinite;
      opacity: 0.6;
    }

    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.6; }
      50% { transform: scale(1.2); opacity: 0.3; }
      100% { transform: scale(1.4); opacity: 0; }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-5px); }
    }

    .pb-chat-window {
      width: 380px;
      height: 600px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      position: absolute;
      bottom: 80px;
      ${CONFIG.position.includes('right') ? 'right: 0;' : 'left: 0;'}
      overflow: hidden;
      animation: slideUp 0.3s ease-out;
      z-index: 10001;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .pb-chat-header {
      background: linear-gradient(135deg, ${CONFIG.primaryColor}, #45a049);
      color: white;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .pb-chat-header-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .pb-chat-avatar {
      font-size: 24px;
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pb-chat-title {
      font-weight: 600;
      font-size: 16px;
    }

    .pb-chat-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      opacity: 0.9;
    }

    .pb-status-dot {
      width: 8px;
      height: 8px;
      background: #4ade80;
      border-radius: 50%;
      animation: blink 2s infinite;
    }

    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0.3; }
    }

    .pb-chat-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto !important; /* 强制启用滚动 */
      overflow-x: hidden;
      background: #f8fafc;
      max-height: 100%; /* 确保有最大高度 */
      -webkit-overflow-scrolling: touch; /* iOS 平滑滚动 */
    }

    .pb-message {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .pb-message-bot {
      align-self: flex-start;
    }

    .pb-message-user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .pb-message-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }

    .pb-message-user .pb-message-avatar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
    }

    .pb-message-content {
      max-width: 280px;
    }

    .pb-message-text {
      background: white;
      padding: 12px 16px;
      border-radius: 18px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      white-space: pre-wrap;
      line-height: 1.4;
      color: #1e293b !important; /* 深色文字，确保可读 */
      font-size: 14px;
      font-weight: 500;
    }

    .pb-message-user .pb-message-text {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white !important;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
      font-weight: 600;
    }

    /* 机器人消息中的强调文字 */
    .pb-message-bot .pb-message-text strong {
      color: #4CAF50 !important;
      font-weight: 700;
    }

    /* 机器人消息中的链接 */
    .pb-message-bot .pb-message-text a {
      color: #2196F3 !important;
      text-decoration: underline;
      font-weight: 600;
    }

    /* Emoji 和图标更大 */
    .pb-message-text {
      font-size: 15px;
    }

    .pb-message-time {
      font-size: 11px;
      color: #64748b;
      margin-top: 4px;
      text-align: right;
    }

    .pb-quick-replies {
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      background: white;
      border-top: 1px solid #e2e8f0;
    }

    .pb-quick-reply {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 8px 16px;
      font-size: 13px;
      color: #1e293b;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }

    .pb-quick-reply:hover {
      background: ${CONFIG.primaryColor};
      color: white;
      transform: translateY(-1px);
    }

    .pb-chat-input-area {
      background: white;
      border-top: 1px solid #e2e8f0;
      padding: 16px;
    }

    .pb-chat-input-wrapper {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    #pb-chat-input {
      flex: 1;
      border: 1px solid #e2e8f0;
      border-radius: 24px;
      padding: 12px 16px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s ease;
    }

    #pb-chat-input:focus {
      border-color: ${CONFIG.primaryColor};
    }

    .pb-chat-send {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    }

    .pb-chat-send:hover {
      background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .pb-typing-indicator {
      display: flex;
      gap: 4px;
      padding: 8px 0;
      align-items: center;
    }

    .pb-typing-indicator span {
      width: 6px;
      height: 6px;
      background: #64748b;
      border-radius: 50%;
      animation: typing 1.4s infinite;
    }

    .pb-typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .pb-typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-10px); }
    }

    /* 移动端适配 */
    @media (max-width: 480px) {
      .pb-chat-widget {
        right: 10px !important;
        left: auto !important;
        bottom: 20px !important; /* 降低位置，避免被右侧按钮遮挡 */
        z-index: 2147483647 !important;
      }

      .pb-chat-button {
        width: 56px !important;
        height: 56px !important;
        right: 0 !important;
        box-shadow: 0 4px 20px rgba(76, 175, 80, 0.4) !important; /* 增强阴影，更明显 */
      }

      .pb-pulse-ring {
        width: 56px !important;
        height: 56px !important;
      }

      .pb-chat-window {
        width: calc(100vw - 20px) !important;
        height: 70vh !important; /* 使用视口高度的70%，避免被键盘遮挡 */
        max-height: 600px !important;
        bottom: 10px !important;
        right: 0 !important;
        left: 0 !important;
        margin: 0 10px !important;
        border-radius: 12px !important;
        max-width: none !important;
        display: flex !important;
        flex-direction: column !important;
      }

      .pb-chat-header {
        flex-shrink: 0 !important; /* 头部不缩小 */
      }

      .pb-chat-messages {
        padding: 12px !important;
        flex: 1 !important; /* 消息区域占据剩余空间 */
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important; /* iOS 平滑滚动 */
      }

      .pb-message-content {
        max-width: calc(100vw - 100px) !important;
      }

      .pb-quick-replies {
        padding: 8px 12px !important;
        flex-shrink: 0 !important; /* 快捷回复不缩小 */
      }

      .pb-quick-reply {
        padding: 6px 12px !important;
        font-size: 12px !important;
      }

      .pb-chat-input-area {
        padding: 12px !important;
        flex-shrink: 0 !important; /* 输入区域不缩小 */
        background: white !important;
        border-top: 1px solid #e0e0e0 !important;
      }

      #pb-chat-input {
        font-size: 16px !important; /* 防止 iOS 缩放 */
      }
    }

    /* 超小屏幕适配 */
    @media (max-width: 360px) {
      .pb-chat-window {
        width: calc(100vw - 10px) !important;
        margin: 0 5px !important;
      }

      .pb-message-content {
        max-width: calc(100vw - 80px) !important;
      }
    }
    </style>
  `;

  // 初始化聊天组件
  function initChat() {
    // 添加 CSS
    document.head.insertAdjacentHTML('beforeend', chatCSS);
    
    // 添加 HTML
    document.body.insertAdjacentHTML('beforeend', chatHTML);
    
    // 绑定事件
    bindEvents();
    
    // 显示欢迎消息后的快速回复
    setTimeout(() => {
      const quickReplies = document.getElementById('pb-quick-replies');
      if (quickReplies) {
        quickReplies.style.display = 'flex';
      }
    }, 1000);
  }

  // 绑定事件
  function bindEvents() {
    const chatButton = document.getElementById('pb-chat-button');
    const chatWindow = document.getElementById('pb-chat-window');
    const closeButton = document.getElementById('pb-chat-close');
    const sendButton = document.getElementById('pb-chat-send');
    const input = document.getElementById('pb-chat-input');
    const quickReplies = document.querySelectorAll('.pb-quick-reply');

    // 打开/关闭聊天窗口
    chatButton.addEventListener('click', () => {
      const isVisible = chatWindow.style.display !== 'none';
      chatWindow.style.display = isVisible ? 'none' : 'block';
      
      if (!isVisible) {
        input.focus();
        // 隐藏未读标记
        const badge = document.querySelector('.pb-unread-badge');
        if (badge) badge.style.display = 'none';
      }
    });

    closeButton.addEventListener('click', () => {
      chatWindow.style.display = 'none';
    });

    // 发送消息
    sendButton.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });

    // 快速回复
    quickReplies.forEach(button => {
      button.addEventListener('click', () => {
        const userLang = detectUserLanguage();
        const message = userLang === 'zh' 
          ? button.dataset.messageZh 
          : button.dataset.messageEn;
        
        input.value = message;
        sendMessage();
        
        // 隐藏快速回复
        document.getElementById('pb-quick-replies').style.display = 'none';
      });
    });
  }

  // 发送消息
  async function sendMessage() {
    const input = document.getElementById('pb-chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // 添加用户消息
    addMessage(message, true);
    input.value = '';
    
    // 显示输入指示器
    showTyping();
    
    try {
      // 调用 API
      const response = await fetch(CONFIG.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      
      const data = await response.json();
      
      // 隐藏输入指示器
      hideTyping();
      
      if (data.success) {
        addMessage(data.reply, false);
      } else {
        addMessage('抱歉，我现在无法回复。请直接联系我们。', false);
      }
      
    } catch (error) {
      hideTyping();
      addMessage('网络连接出现问题，请稍后重试。', false);
    }
  }

  // 格式化消息文本（支持 Markdown 样式）
  function formatMessage(text) {
    if (!text) return '';

    // 转义 HTML
    text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // **粗体** -> <strong>（绿色）
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // 数字高亮（如 7天、3天、150+）- 在 HTML 标签内也能匹配
    text = text.replace(/(\d+[\+]?)\s*(天|days?|experts?|分钟|minutes?)/gi, '<span style="color: #FF6B6B; font-weight: 700; font-size: 16px;">$1</span> $2');

    // Emoji 放大
    text = text.replace(/(👋|🚀|💡|⚡|🔒|🤝|🐼|✅|❌|📱|💰|🔧)/g, '<span style="font-size: 20px;">$1</span>');

    // 换行
    text = text.replace(/\n/g, '<br>');

    // 列表项 (• 或 -)
    text = text.replace(/^[•\-]\s*(.+)$/gm, '<div style="margin-left: 12px; color: #334155;">• $1</div>');

    return text;
  }

  // 添加消息
  function addMessage(text, isUser) {
    const messagesContainer = document.getElementById('pb-chat-messages');
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    // 格式化消息文本
    const formattedText = isUser ? text : formatMessage(text);

    const messageHTML = `
      <div class="pb-message ${isUser ? 'pb-message-user' : 'pb-message-bot'}">
        <div class="pb-message-avatar">${isUser ? '👤' : '🐼'}</div>
        <div class="pb-message-content">
          <div class="pb-message-text">${formattedText}</div>
          <div class="pb-message-time">${time}</div>
        </div>
      </div>
    `;

    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);

    // 强制滚动到底部
    setTimeout(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
  }

  // 显示/隐藏输入指示器
  function showTyping() {
    document.getElementById('pb-typing').style.display = 'flex';
  }

  function hideTyping() {
    document.getElementById('pb-typing').style.display = 'none';
  }

  // 移动端键盘检测和适配
  function handleMobileKeyboard() {
    if (window.innerWidth > 480) return; // 仅在移动端执行

    const chatInput = document.getElementById('pb-chat-input');
    const chatWindow = document.querySelector('.pb-chat-window');
    const chatMessages = document.getElementById('pb-chat-messages');

    if (!chatInput || !chatWindow) return;

    // 输入框获得焦点时（键盘弹出）
    chatInput.addEventListener('focus', () => {
      // 延迟执行，等待键盘完全弹出
      setTimeout(() => {
        // 滚动到输入框位置
        chatInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // 确保消息区域可以滚动
        if (chatMessages) {
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
      }, 300);
    });

    // 输入框失去焦点时（键盘收起）
    chatInput.addEventListener('blur', () => {
      // 恢复正常滚动
      setTimeout(() => {
        if (chatMessages) {
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
      }, 100);
    });

    // 监听视口大小变化（键盘弹出/收起会改变视口高度）
    let lastHeight = window.innerHeight;
    window.addEventListener('resize', () => {
      const currentHeight = window.innerHeight;

      // 如果高度减少超过150px，说明键盘弹出了
      if (lastHeight - currentHeight > 150) {
        if (chatWindow && chatWindow.style.display !== 'none') {
          // 调整聊天窗口高度
          chatWindow.style.height = `${currentHeight * 0.6}px`;
        }
      } else if (currentHeight - lastHeight > 150) {
        // 键盘收起，恢复原始高度
        if (chatWindow && chatWindow.style.display !== 'none') {
          chatWindow.style.height = '70vh';
        }
      }

      lastHeight = currentHeight;
    });
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initChat();
      handleMobileKeyboard();
    });
  } else {
    initChat();
    handleMobileKeyboard();
  }

  // 调试：确保聊天按钮可见
  setTimeout(() => {
    const chatWidget = document.getElementById('pandablock-chat-widget');
    const chatButton = document.getElementById('pb-chat-button');
    if (chatWidget && chatButton) {
      console.log('✅ PandaBlock Chat Widget loaded successfully');
      console.log('Chat button position:', window.getComputedStyle(chatButton).position);
      console.log('Chat button z-index:', window.getComputedStyle(chatButton).zIndex);
      console.log('Chat button visibility:', window.getComputedStyle(chatButton).visibility);
      console.log('Chat button display:', window.getComputedStyle(chatButton).display);
    } else {
      console.error('❌ PandaBlock Chat Widget failed to load');
    }
  }, 1000);

})();
