#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复所有 HTML 文件中的首页链接
将 index.html@r=0.html 替换为 index.html
"""

import os
import re
from pathlib import Path

def fix_homepage_links(content):
    """修复首页链接"""
    
    # 替换 index.html@r=0.html 为 index.html
    content = content.replace('index.html@r=0.html', 'index.html')
    content = content.replace('index.html@r=0', 'index.html')
    
    # 也修复可能的其他变体
    content = re.sub(r'index\.html@[^"\'>\s]+', 'index.html', content)
    
    return content

def process_html_file(file_path):
    """处理单个 HTML 文件"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        content = fix_homepage_links(content)
        
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
    print("🔧 修复所有 HTML 文件中的首页链接")
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
    print("✅ 批量修复完成！")
    print()
    print("📝 修复内容：")
    print("   ❌ index.html@r=0.html")
    print("   ✅ index.html")
    print()

if __name__ == '__main__':
    main()

