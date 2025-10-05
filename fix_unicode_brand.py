#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复 Unicode 右单引号的品牌名称
"""

import os
from pathlib import Path

def fix_file(file_path):
    """修复单个文件"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 替换 Unicode 右单引号版本的 Rock'n'Block (U+2019)
        content = content.replace("Rock'n'Block", "PandaBlock")
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        
        return False
    
    except Exception as e:
        print(f"❌ 错误: {file_path}: {e}")
        return False

def main():
    """主函数"""
    print("🔍 开始修复 Unicode 右单引号...")
    
    root_dir = Path('.')
    html_files = list(root_dir.rglob('*.html'))
    
    print(f"📊 找到 {len(html_files)} 个 HTML 文件")
    
    modified_count = 0
    
    for html_file in html_files:
        if fix_file(html_file):
            modified_count += 1
            print(f"✅ 已修复: {html_file}")
    
    print(f"\n🎉 完成！共修改了 {modified_count} 个文件")

if __name__ == "__main__":
    main()

