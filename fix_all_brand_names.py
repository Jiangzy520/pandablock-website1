#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
全面修复所有 HTML 文件中的品牌名称
将 Rock'n'Block 替换为 PandaBlock
"""

import os
import re
from pathlib import Path

def fix_brand_names(file_path):
    """修复单个文件中的品牌名称"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 替换所有 Rock'n'Block 变体
        replacements = [
            (r"Rock'n'Block", "PandaBlock"),  # 普通单引号
            (r"Rock'n'Block", "PandaBlock"),  # Unicode 右单引号
            (r"Rock&#x27;n&#x27;Block", "PandaBlock"),  # HTML 实体
            (r"Rock&apos;n&apos;Block", "PandaBlock"),  # XML 实体
            (r"Rock'N'Block", "PandaBlock"),
            (r"Rock'N'Block", "PandaBlock"),  # Unicode 右单引号
            (r"RocknBlock", "PandaBlock"),
            (r"rocknblock", "pandablock"),
        ]
        
        for pattern, replacement in replacements:
            content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
        
        # 如果内容有变化，写回文件
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
    print("🔍 开始扫描所有 HTML 文件...")
    
    # 获取当前目录
    root_dir = Path('.')
    
    # 查找所有 HTML 文件
    html_files = list(root_dir.rglob('*.html'))
    
    print(f"📊 找到 {len(html_files)} 个 HTML 文件")
    
    modified_count = 0
    
    for html_file in html_files:
        if fix_brand_names(html_file):
            modified_count += 1
            print(f"✅ 已修复: {html_file}")
    
    print(f"\n🎉 完成！共修改了 {modified_count} 个文件")

if __name__ == "__main__":
    main()

