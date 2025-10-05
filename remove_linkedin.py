#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
删除所有 HTML 文件中的 LinkedIn 链接
"""

import os
import re
from pathlib import Path

def remove_linkedin_links(content):
    """删除 LinkedIn 相关链接"""
    
    # 模式1: 删除完整的 LinkedIn 链接块（包括 <a> 标签）
    pattern1 = r'<a[^>]*href="https://www\.linkedin\.com/[^"]*"[^>]*>.*?</a>'
    content = re.sub(pattern1, '', content, flags=re.IGNORECASE | re.DOTALL)
    
    # 模式2: 删除包含 "LI" 文本的社交媒体链接
    pattern2 = r'<a[^>]*class="[^"]*social-media-link[^"]*"[^>]*>\s*<div[^>]*>LI</div>\s*</a>'
    content = re.sub(pattern2, '', content, flags=re.IGNORECASE | re.DOTALL)
    
    # 模式3: 删除 footer 中的 LinkedIn 链接
    pattern3 = r'<a[^>]*linkedin[^>]*class="link-text-footer[^"]*"[^>]*>LinkedIn</a>'
    content = re.sub(pattern3, '', content, flags=re.IGNORECASE | re.DOTALL)
    
    # 模式4: 删除任何包含 linkedin.com 的链接
    pattern4 = r'<a[^>]*href="[^"]*linkedin\.com[^"]*"[^>]*>.*?</a>'
    content = re.sub(pattern4, '', content, flags=re.IGNORECASE | re.DOTALL)
    
    return content

def process_html_file(file_path):
    """处理单个 HTML 文件"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        content = remove_linkedin_links(content)
        
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
    print("🗑️  删除所有 HTML 文件中的 LinkedIn 链接")
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
        print(f"处理 [{i}/{total_files}]: {file_path}")
        
        if process_html_file(file_path):
            print(f"  ✅ 已更新")
            updated_files += 1
        else:
            print(f"  ⏭️  未修改")
    
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
    print("   1. ❌ 导航栏中的 LinkedIn (LI) 链接")
    print("   2. ❌ Footer 中的 LinkedIn 链接")
    print("   3. ❌ 所有指向 linkedin.com 的链接")
    print()
    print("✅ 保留内容：")
    print("   1. ✅ Telegram (TG) 链接")
    print("   2. ✅ X (Twitter) 链接")
    print()

if __name__ == '__main__':
    main()

