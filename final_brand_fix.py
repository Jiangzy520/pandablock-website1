#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
最终品牌名称修复脚本
"""

import os
import glob

def fix_file(filepath):
    """修复单个文件"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # 所有可能的 Rock'n'Block 变体
        variants = [
            "Rock'n'Block",  # Unicode 右单引号 U+2019
            "Rock'n'Block",  # 普通单引号
            "Rock&#x27;n&#x27;Block",  # HTML 实体
        ]
        
        for variant in variants:
            content = content.replace(variant, "PandaBlock")
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        
        return False
    
    except Exception as e:
        print(f"错误 {filepath}: {e}")
        return False

def main():
    """主函数"""
    print("🔍 开始最终修复...")
    
    # 查找所有 HTML 文件
    html_files = []
    for pattern in ['*.html', '*/*.html', '*/*/*.html', '*/*/*/*.html']:
        html_files.extend(glob.glob(pattern))
    
    print(f"📊 找到 {len(html_files)} 个 HTML 文件")
    
    modified = 0
    for filepath in html_files:
        if fix_file(filepath):
            modified += 1
            print(f"✅ {filepath}")
    
    print(f"\n🎉 完成！修改了 {modified} 个文件")

if __name__ == "__main__":
    main()

