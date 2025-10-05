#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
将所有 HTML 文件中的 Rock'n'Block 品牌名称替换为 PandaBlock
"""

import os
import re
from pathlib import Path

def replace_brand_name(content):
    """替换品牌名称"""
    
    # 替换各种形式的 Rock'n'Block
    replacements = [
        (r"Rock'n'Block", "PandaBlock"),
        (r"Rock&#x27;n&#x27;Block", "PandaBlock"),
        (r"Rock&apos;n&apos;Block", "PandaBlock"),
        (r"RocknBlock", "PandaBlock"),
        (r"Rock n Block", "PandaBlock"),
        (r"rocknblock", "pandablock"),
        (r"ROCKNBLOCK", "PANDABLOCK"),
        (r"Rock'n Block", "PandaBlock"),
        (r"Rock n'Block", "PandaBlock"),
    ]
    
    for old, new in replacements:
        content = re.sub(old, new, content, flags=re.IGNORECASE)
    
    # 特殊处理：保留 URL 中的 rocknblock
    # 例如：rocknblock.io, rocknblock-io 等应该保持不变或替换为 pandablockdev.com
    content = re.sub(r'https?://(?:www\.)?rocknblock\.io', 'https://www.pandablockdev.com', content)
    content = re.sub(r'@rocknblock\.io', '@pandablockdev.com', content)
    
    return content

def process_html_file(file_path):
    """处理单个 HTML 文件"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        content = replace_brand_name(content)
        
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
    print("🔄 将所有品牌名称从 Rock'n'Block 替换为 PandaBlock")
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
    print("✅ 批量替换完成！")
    print()
    print("📝 替换内容：")
    print("   ❌ Rock'n'Block")
    print("   ❌ RocknBlock")
    print("   ❌ Rock n Block")
    print("   ✅ PandaBlock")
    print()
    print("🌐 URL 替换：")
    print("   ❌ rocknblock.io")
    print("   ✅ pandablockdev.com")
    print()

if __name__ == '__main__':
    main()

