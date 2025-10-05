#!/usr/bin/env python3
"""
批量更新所有页面的联系方式
- 移除所有 WhatsApp 链接
- 确保所有页面都有 AI 客服组件
- 统一 Telegram 和邮箱地址
"""

import os
import re
from pathlib import Path

# 配置
TELEGRAM_URL = "https://t.me/PandaBlock_Labs"
EMAIL = "hayajaiahk@gmail.com"
CHAT_WIDGET_SCRIPT = '<script src="/simple-chat-widget.js"></script>'

def remove_whatsapp_links(content):
    """移除所有 WhatsApp 相关的链接和按钮"""
    
    # 模式1: 移除完整的 WhatsApp 链接块（包括 <a> 标签）
    # 匹配从 <a href="...whatsapp..." 到对应的 </a>
    pattern1 = r'<a[^>]*href="https://api\.whatsapp\.com/send\?phone=[^"]*"[^>]*>.*?</a>'
    content = re.sub(pattern1, '', content, flags=re.DOTALL | re.IGNORECASE)
    
    # 模式2: 移除 WhatsApp 按钮块（button-link-block）
    pattern2 = r'<a[^>]*whatsapp[^>]*class="button-link-block_bdss[^>]*>.*?</a>'
    content = re.sub(pattern2, '', content, flags=re.DOTALL | re.IGNORECASE)
    
    # 模式3: 移除包含 "Whatsup" 文本的按钮
    pattern3 = r'<a[^>]*class="button-link-block_bdss[^>]*>.*?Whatsup.*?</a>'
    content = re.sub(pattern3, '', content, flags=re.DOTALL | re.IGNORECASE)
    
    # 模式4: 移除 widget 中的 WhatsApp 链接
    pattern4 = r'<a[^>]*data-w-id="[^"]*"[^>]*href="https://api\.whatsapp\.com[^>]*>.*?</a>'
    content = re.sub(pattern4, '', content, flags=re.DOTALL | re.IGNORECASE)
    
    # 模式5: 移除 CSS 中的 whatsapp-mode 样式
    pattern5 = r'input\.whatsapp-mode\s*\{[^}]*\}'
    content = re.sub(pattern5, '', content, flags=re.DOTALL)
    
    # 模式6: 移除表单中的 WhatsApp 选项
    pattern6 = r'<option value="WhatsApp">WhatsApp</option>'
    content = re.sub(pattern6, '', content, flags=re.IGNORECASE)

    # 模式7: 移除 JavaScript 中的 whatsapp-mode 相关代码
    pattern7 = r'input\.classList\.(add|remove|contains)\("whatsapp-mode"\);?'
    content = re.sub(pattern7, '', content)

    # 模式8: 移除 if 语句中的 whatsapp-mode 检查
    pattern8 = r'if \(input\.classList\.contains\("whatsapp-mode"\)\) return;?\s*'
    content = re.sub(pattern8, '', content)

    return content

def add_chat_widget(content):
    """添加 AI 客服组件（如果还没有）"""
    if 'simple-chat-widget.js' in content:
        return content
    
    # 在 </body> 前添加
    if '</body>' in content:
        content = content.replace('</body>', f'  {CHAT_WIDGET_SCRIPT}\n</body>')
    
    return content

def update_telegram_links(content):
    """统一 Telegram 链接"""
    # 更新所有 t.me 链接
    pattern = r'https://t\.me/[^"\s]+'
    content = re.sub(pattern, TELEGRAM_URL, content)
    
    return content

def update_email_links(content):
    """统一邮箱地址"""
    # 更新 mailto 链接中的邮箱
    pattern = r'mailto:[^"?\s]+'
    content = re.sub(pattern, f'mailto:{EMAIL}', content)
    
    return content

def process_file(file_path):
    """处理单个 HTML 文件"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 应用所有更新
        content = remove_whatsapp_links(content)
        content = add_chat_widget(content)
        content = update_telegram_links(content)
        content = update_email_links(content)
        
        # 只有内容改变时才写入
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        
        return False
    
    except Exception as e:
        print(f"❌ 处理文件失败 {file_path}: {e}")
        return False

def main():
    """主函数"""
    print("🔧 开始批量更新所有页面...")
    print()
    
    # 查找所有 HTML 文件
    html_files = []
    for root, dirs, files in os.walk('.'):
        # 跳过特定目录
        dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', '__pycache__']]
        
        for file in files:
            if file.endswith('.html') and not file.startswith('test-'):
                html_files.append(os.path.join(root, file))
    
    print(f"📁 找到 {len(html_files)} 个 HTML 文件")
    print()
    
    updated_count = 0
    
    for file_path in html_files:
        print(f"处理: {file_path}")
        if process_file(file_path):
            updated_count += 1
            print("  ✅ 已更新")
        else:
            print("  ⏭️  无需更新")
    
    print()
    print("━" * 50)
    print(f"📊 更新统计：")
    print(f"   总文件数: {len(html_files)}")
    print(f"   已更新: {updated_count}")
    print(f"   未修改: {len(html_files) - updated_count}")
    print("━" * 50)
    print()
    print("✅ 批量更新完成！")
    print()
    print("📝 更新内容：")
    print("   1. ❌ 移除所有 WhatsApp 联系方式")
    print("   2. ✅ 统一 Telegram: @PandaBlock_Labs")
    print(f"   3. ✅ 统一邮箱: {EMAIL}")
    print("   4. ➕ 添加 AI 客服组件到所有页面")
    print()

if __name__ == '__main__':
    main()

