#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
删除所有 HTML 文件中的 Calendly 按钮
只保留 Email 和 Telegram 联系方式
"""

import os
import re
from pathlib import Path

def remove_calendly_button(content):
    """删除 Calendly 按钮"""
    
    # 模式1: 删除完整的 Calendly 链接块
    pattern1 = r'<a[^>]*href="https://calendly\.com/[^"]*"[^>]*>.*?</a>'
    content = re.sub(pattern1, '', content, flags=re.IGNORECASE | re.DOTALL)
    
    # 模式2: 删除包含 "Calendly" 文本的按钮
    pattern2 = r'<a[^>]*class="[^"]*button-link-block[^"]*"[^>]*>.*?Calendly.*?</a>'
    content = re.sub(pattern2, '', content, flags=re.IGNORECASE | re.DOTALL)
    
    # 模式3: 删除任何包含 calendly.com 的链接
    pattern3 = r'<a[^>]*href="[^"]*calendly\.com[^"]*"[^>]*>.*?</a>'
    content = re.sub(pattern3, '', content, flags=re.IGNORECASE | re.DOTALL)
    
    return content

def process_html_file(file_path):
    """处理单个 HTML 文件"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        content = remove_calendly_button(content)
        
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
    print("=" * 60)
    print("🗑️  删除所有 HTML 文件中的 Calendly 按钮")
    print("=" * 60)
    print()
    
    # 获取所有 HTML 文件
    html_files = list(Path('.').rglob('*.html'))
    
    # 排除某些目录
    exclude_dirs = {'node_modules', '.git', 'dist', 'build'}
    html_files = [
        f for f in html_files 
        if not any(excluded in f.parts for excluded in exclude_dirs)
    ]
    
    total_files = len(html_files)
    updated_files = 0
    
    print(f"📊 找到 {total_files} 个 HTML 文件")
    print()
    
    for i, file_path in enumerate(html_files, 1):
        if i % 50 == 0:
            print(f"处理进度: [{i}/{total_files}]")
        
        if process_html_file(file_path):
            updated_files += 1
    
    print()
    print("=" * 60)
    print("📊 更新统计：")
    print(f"   总文件数: {total_files}")
    print(f"   已更新: {updated_files}")
    print(f"   未修改: {total_files - updated_files}")
    print("=" * 60)
    print()
    print("✅ 批量删除完成！")
    print()
    print("📝 已删除内容：")
    print("   ❌ Calendly 按钮")
    print("   ❌ 所有指向 calendly.com 的链接")
    print()
    print("✅ 保留内容：")
    print("   ✅ Email 按钮")
    print("   ✅ Telegram 联系方式")
    print()

if __name__ == '__main__':
    main()

