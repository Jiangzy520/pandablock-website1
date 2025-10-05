// 语言切换功能
(function() {
  // 翻译数据
  const translations = {
    en: {
      // 导航
      'Services': 'Services',
      'Portfolio': 'Portfolio',
      'Blog': 'Blog',
      'Start a project': 'Start a project',
      'Menu': 'Menu',

      // Hero区域
      'Your Blockchain Development Company': 'Your Blockchain Development Company',
      'Step into the world of PandaBlock – your ultimate hub for expert blockchain software solutions.': 'Step into the world of PandaBlock – your ultimate hub for expert blockchain software solutions.',
      'Let\'s Talk About Your Project': 'Let\'s Talk About Your Project',

      // 服务标题
      'Empower Your Business with Expert Blockchain Solutions': 'Empower Your Business with Expert Blockchain Solutions',

      // 服务项目
      'DeFi Software Development': 'DeFi Software Development',
      'We offer comprehensive DeFi software development services, DeFi apps and protocols development on blockchain. Our expertise includes smart contracts, DEX protocols, lending platforms, and asset management solutions.': 'We offer comprehensive DeFi software development services, DeFi apps and protocols development on blockchain. Our expertise includes smart contracts, DEX protocols, lending platforms, and asset management solutions.',

      'NFT Projects Development': 'NFT Projects Development',
      'Explore the possibilities with Rock\'n\'Block\'s NFT Software Development Services. From smart contracts to NFT marketplace development, we specialize in developing unique digital assets on the blockchain. Empower your project with our expertise.': 'Explore the possibilities with Rock\'n\'Block\'s NFT Software Development Services. From smart contracts to NFT marketplace development, we specialize in developing unique digital assets on the blockchain. Empower your project with our expertise.',

      'Smart Contracts Development': 'Smart Contracts Development',
      'At Rock\'n\'Block, we prioritize security, efficiency, and standards adherence, ensuring transparency and reliability in smart contracts development for decentralized applications. Trust us to navigate complexities for your project\'s success in blockchain development.': 'At Rock\'n\'Block, we prioritize security, efficiency, and standards adherence, ensuring transparency and reliability in smart contracts development for decentralized applications. Trust us to navigate complexities for your project\'s success in blockchain development.',

      'Technical Consulting': 'Technical Consulting',
      'Our blockchain consulting services cover tokenomics, white paper design, and technical specification development. We provide expert guidance to shape your digital future and ensure the success of your project in the dynamic blockchain landscape.': 'Our blockchain consulting services cover tokenomics, white paper design, and technical specification development. We provide expert guidance to shape your digital future and ensure the success of your project in the dynamic blockchain landscape.',

      'DApp Development': 'DApp Development',
      'Our end-to-end dApp development services cover the full cycle of blockchain app development process from smart contract development to frontend and backend development, testing, and maintenance, providing comprehensive support from inception to deployment.': 'Our end-to-end dApp development services cover the full cycle of blockchain app development process from smart contract development to frontend and backend development, testing, and maintenance, providing comprehensive support from inception to deployment.',

      'On-Chain Game Platforms Development': 'On-Chain Game Platforms Development',
      'Discover our on chain game development services. Immerse users in reward experiences on blockchain with game mechanics and on chain web3 experiences. Join us in shaping the future of gaming and digital rewards.': 'Discover our on chain game development services. Immerse users in reward experiences on blockchain with game mechanics and on chain web3 experiences. Join us in shaping the future of gaming and digital rewards.',

      // 案例
      'Our Clients': 'Our Clients',
      'Technology Stack:': 'Technology Stack:',

      // 统计数据
      'Rocking Blockchain Expertise': 'Rocking Blockchain Expertise',
      'Expert Blockchain Solutions Delivered': 'Expert Blockchain Solutions Delivered',
      'Years Custom Blockchain Development': 'Years Custom Blockchain Development',
      'Blockchain Experts': 'Blockchain Experts',
      'Dollars Capitalization of Projects': 'Dollars Capitalization of Projects',
      'Innovative Web3 Technology Services': 'Innovative Web3 Technology Services',
      'Blockchain Integration and Development': 'Blockchain Integration and Development',

      // 客户评价
      'What our clients tell about us': 'What our clients tell about us',

      // 流程
      'How We Work': 'How We Work',
      'Initial Consultation': 'Initial Consultation',
      'Conceptualization and Planning': 'Conceptualization and Planning',
      'Design': 'Design',
      'Blockchain Development': 'Blockchain Development',
      'Testing stage': 'Testing stage',
      'Mainnet deployment': 'Mainnet deployment',

      // 联系表单
      'Got a Question, Challenge, or Idea?': 'Got a Question, Challenge, or Idea?',
      'Your name': 'Your name',
      'Message': 'Message',
      'Send': 'Send',
      'We\'ll be in touch soon.': 'We\'ll be in touch soon.',
      'Submission received': 'Submission received',
      'Resume': 'Resume',
      'Oops! Something went wrong': 'Oops! Something went wrong',
      'Refresh the page and try again.': 'Refresh the page and try again.',

      // 地址信息
      'Building C, Hilton International Plaza, No.666 Middle Section of Tianfu Avenue, Wuhou District, Chengdu, Sichuan Province, China': 'Building C, Hilton International Plaza, No.666 Middle Section of Tianfu Avenue, Wuhou District, Chengdu, Sichuan Province, China',
      'Address:': 'Address:',
      'Contact Us': 'Contact Us',
      'Chengdu': 'Chengdu',
      'Seoul': 'Seoul',
      'Dubai': 'Dubai',

      // 公司名称
      'PandaBlock': 'PandaBlock',
      'Rock\'n\'Block': 'PandaBlock',
      'RocknBlock': 'PandaBlock',
      'PandaBlock | Your Blockchain Company for Web3 Solutions': 'PandaBlock | Your Blockchain Company for Web3 Solutions',
      'Unlock the future with PandaBlock': 'Unlock the future with PandaBlock, your premier blockchain development company and trusted partner for cutting-edge Web3 solutions.',
      '© Copyright PandaBlock 2025': '© Copyright PandaBlock 2025',
    },

    zh: {
      // 导航
      'Services': '服务',
      'Portfolio': '案例',
      'Blog': '博客',
      'Start a project': '开始项目',
      'Menu': '菜单',

      // Hero区域
      'Your Blockchain Development Company': '您的区块链开发公司',
      'Step into the world of PandaBlock – your ultimate hub for expert blockchain software solutions.': '进入PandaBlock的世界 - 您的专业区块链软件解决方案中心。',
      'Let\'s Talk About Your Project': '让我们谈谈您的项目',

      // 服务标题
      'Empower Your Business with Expert Blockchain Solutions': '用专业的区块链解决方案赋能您的业务',

      // 服务项目
      'DeFi Software Development': 'DeFi软件开发',
      'We offer comprehensive DeFi software development services, DeFi apps and protocols development on blockchain. Our expertise includes smart contracts, DEX protocols, lending platforms, and asset management solutions.': '我们提供全面的DeFi软件开发服务，包括区块链上的DeFi应用和协议开发。我们的专业领域包括智能合约、DEX协议、借贷平台和资产管理解决方案。',

      'NFT Projects Development': 'NFT项目开发',
      'Explore the possibilities with PandaBlock\'s NFT Software Development Services. From smart contracts to NFT marketplace development, we specialize in developing unique digital assets on the blockchain. Empower your project with our expertise.': '探索PandaBlock的NFT软件开发服务的可能性。从智能合约到NFT市场开发，我们专注于在区块链上开发独特的数字资产。用我们的专业知识赋能您的项目。',

      'Smart Contracts Development': '智能合约开发',
      'At PandaBlock, we prioritize security, efficiency, and standards adherence, ensuring transparency and reliability in smart contracts development for decentralized applications. Trust us to navigate complexities for your project\'s success in blockchain development.': '在PandaBlock，我们优先考虑安全性、效率和标准遵守，确保去中心化应用的智能合约开发的透明度和可靠性。相信我们能够应对复杂性，确保您的区块链开发项目成功。',

      'Technical Consulting': '技术咨询',
      'Our blockchain consulting services cover tokenomics, white paper design, and technical specification development. We provide expert guidance to shape your digital future and ensure the success of your project in the dynamic blockchain landscape.': '我们的区块链咨询服务涵盖代币经济学、白皮书设计和技术规范开发。我们提供专业指导，塑造您的数字未来，确保您的项目在动态的区块链领域取得成功。',

      'DApp Development': 'DApp开发',
      'Our end-to-end dApp development services cover the full cycle of blockchain app development process from smart contract development to frontend and backend development, testing, and maintenance, providing comprehensive support from inception to deployment.': '我们的端到端dApp开发服务涵盖区块链应用开发的全周期，从智能合约开发到前端和后端开发、测试和维护，从构思到部署提供全面支持。',

      'On-Chain Game Platforms Development': '链上游戏平台开发',
      'Discover our on chain game development services. Immerse users in reward experiences on blockchain with game mechanics and on chain web3 experiences. Join us in shaping the future of gaming and digital rewards.': '探索我们的链上游戏开发服务。通过游戏机制和链上web3体验，让用户沉浸在区块链上的奖励体验中。加入我们，共同塑造游戏和数字奖励的未来。',

      // 案例
      'Our Clients': '我们的客户',
      'Technology Stack:': '技术栈：',

      // 统计数据
      'Rocking Blockchain Expertise': '卓越的区块链专业知识',
      'Expert Blockchain Solutions Delivered': '交付的专业区块链解决方案',
      'Years Custom Blockchain Development': '年定制区块链开发经验',
      'Blockchain Experts': '区块链专家',
      'Dollars Capitalization of Projects': '项目总市值（美元）',
      'Innovative Web3 Technology Services': '创新的Web3技术服务',
      'Blockchain Integration and Development': '区块链集成与开发',

      // 客户评价
      'What our clients tell about us': '客户对我们的评价',

      // 流程
      'How We Work': '我们的工作流程',
      'Initial Consultation': '初步咨询',
      'Conceptualization and Planning': '概念化与规划',
      'Design': '设计',
      'Blockchain Development': '区块链开发',
      'Testing stage': '测试阶段',
      'Mainnet deployment': '主网部署',

      // 联系表单
      'Got a Question, Challenge, or Idea?': '有问题、挑战或想法？',
      'Your name': '您的姓名',
      'Message': '留言',
      'Send': '发送',
      'We\'ll be in touch soon.': '我们会尽快与您联系。',
      'Submission received': '提交成功',
      'Resume': '继续',
      'Oops! Something went wrong': '哎呀！出了点问题',
      'Refresh the page and try again.': '刷新页面后重试。',

      // 地址信息
      'Building C, Hilton International Plaza, No.666 Middle Section of Tianfu Avenue, Wuhou District, Chengdu, Sichuan Province, China': '四川省成都市武侯区天府大道中段666号希顿国际广场C座',
      'Address:': '地址：',
      'Contact Us': '联系我们',
      'Chengdu': '成都',
      'Seoul': '首尔',
      'Dubai': '迪拜',

      // 公司名称
      'PandaBlock': '熊猫区块',
      'Rock\'n\'Block': '熊猫区块',
      'RocknBlock': '熊猫区块',
      'PandaBlock | Your Blockchain Company for Web3 Solutions': '熊猫区块 | 您的Web3区块链开发公司',
      'Unlock the future with PandaBlock': '与熊猫区块一起开启未来，您值得信赖的区块链开发公司和Web3解决方案合作伙伴。',
      '© Copyright PandaBlock 2025': '© 版权所有 熊猫区块 2025',
    }
  };

  // 获取当前语言
  function getCurrentLanguage() {
    return localStorage.getItem('language') || 'en';
  }

  // 设置语言
  function setLanguage(lang) {
    localStorage.setItem('language', lang);
    updatePageLanguage(lang);
    updateSwitcherUI(lang);
  }

  // 更新页面语言
  function updatePageLanguage(lang) {
    // 更新文本内容
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
      const key = element.getAttribute('data-translate');
      if (translations[lang] && translations[lang][key]) {
        // 对于按钮和输入框，保留原有的value属性
        if (element.tagName === 'INPUT' && element.type === 'submit') {
          element.value = translations[lang][key];
        } else {
          element.textContent = translations[lang][key];
        }
      }
    });

    // 更新占位符
    const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
    placeholderElements.forEach(element => {
      const key = element.getAttribute('data-translate-placeholder');
      if (translations[lang] && translations[lang][key]) {
        element.setAttribute('placeholder', translations[lang][key]);
      }
    });
  }

  // 更新切换器UI
  function updateSwitcherUI(lang) {
    const zhBtn = document.getElementById('lang-zh');
    const enBtn = document.getElementById('lang-en');
    
    if (zhBtn && enBtn) {
      if (lang === 'zh') {
        zhBtn.classList.add('active');
        enBtn.classList.remove('active');
      } else {
        zhBtn.classList.remove('active');
        enBtn.classList.add('active');
      }
    }
  }

  // 创建语言切换器
  function createLanguageSwitcher() {
    const switcher = document.createElement('div');
    switcher.id = 'language-switcher';
    switcher.innerHTML = `
      <style>
        #language-switcher {
          position: fixed;
          top: 80px;
          left: 20px;
          z-index: 10000;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          padding: 8px 12px;
          border-radius: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        #language-switcher .lang-icon {
          width: 16px;
          height: 16px;
          color: #999;
        }
        
        #language-switcher .lang-buttons {
          display: flex;
          gap: 4px;
          background: rgba(255, 255, 255, 0.1);
          padding: 4px;
          border-radius: 16px;
        }
        
        #language-switcher button {
          padding: 6px 12px;
          border: none;
          background: transparent;
          color: #999;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        #language-switcher button:hover {
          color: #fff;
        }
        
        #language-switcher button.active {
          background: #fff;
          color: #000;
          box-shadow: 0 2px 8px rgba(255, 255, 255, 0.2);
        }
        
        @media (max-width: 768px) {
          #language-switcher {
            top: 10px;
            right: 10px;
            padding: 6px 10px;
          }
          
          #language-switcher button {
            padding: 4px 10px;
            font-size: 12px;
          }
        }
      </style>
      
      <svg class="lang-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
      
      <div class="lang-buttons">
        <button id="lang-zh" data-lang="zh">中文</button>
        <button id="lang-en" data-lang="en">EN</button>
      </div>
    `;
    
    document.body.appendChild(switcher);
    
    // 添加事件监听
    document.getElementById('lang-zh').addEventListener('click', () => setLanguage('zh'));
    document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));
  }

  // 标记可翻译元素
  function markTranslatableElements() {
    // 通用函数：标记元素
    function markElement(selector) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        const text = element.textContent.trim();
        if (translations.en[text]) {
          element.setAttribute('data-translate', text);
        }
      });
    }

    // 导航菜单
    markElement('.navbar-bdss_text_link');
    markElement('.nav-button');

    // Hero区域
    markElement('.title-2');
    markElement('.desktop-subhead-2');
    markElement('.desktop-button-base');

    // 服务标题
    markElement('.heading-2');

    // 服务项目
    markElement('.desktop-h4-4');
    markElement('.expert_text_body');

    // 统计数据
    markElement('.subheading');

    // 流程
    markElement('.desktop-h4-18');
    markElement('.desktop-text-base-6');

    // 联系表单
    markElement('.h3_bdss');
    markElement('.text-bdss');
    markElement('input[type="submit"]');

    // 表单占位符
    const nameInput = document.querySelector('input[name="Name"]');
    if (nameInput) {
      const placeholder = nameInput.getAttribute('placeholder');
      if (translations.en[placeholder]) {
        nameInput.setAttribute('data-translate-placeholder', placeholder);
      }
    }

    const messageInput = document.querySelector('input[name="Message"]');
    if (messageInput) {
      const placeholder = messageInput.getAttribute('placeholder');
      if (translations.en[placeholder]) {
        messageInput.setAttribute('data-translate-placeholder', placeholder);
      }
    }
  }

  // 初始化
  function init() {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    
    // 创建语言切换器
    createLanguageSwitcher();
    
    // 标记可翻译元素
    markTranslatableElements();
    
    // 应用当前语言
    const currentLang = getCurrentLanguage();
    updatePageLanguage(currentLang);
    updateSwitcherUI(currentLang);
  }

  // 启动
  init();
})();

