#!/usr/bin/env python3
"""
添加 Email 选项到联系表单
只添加 Email 选项，不添加 WhatsApp
"""

import os
import re
from pathlib import Path

def update_html_file(file_path):
    """更新单个 HTML 文件"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 查找并替换 select 标签中的选项
        # 匹配模式：<select...><option value="Telegram">Telegram</option></select>
        pattern = r'(<select[^>]*class="form-select_bdss[^>]*>)<option value="Telegram">Telegram</option>(</select>)'
        
        # 检查是否已经有 Email 选项
        if 'option value="Email"' in content:
            return False, "已存在 Email 选项"
        
        # 替换为包含 Email 和 Telegram 的选项
        replacement = r'\1<option value="Email">Email</option><option value="Telegram">Telegram</option>\2'
        
        content = re.sub(pattern, replacement, content)
        
        # 检查是否有修改
        if content == original_content:
            return False, "未找到匹配的表单"
        
        # 写回文件
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return True, "成功添加 Email 选项"
        
    except Exception as e:
        return False, f"错误: {str(e)}"

def main():
    """主函数"""
    print("🔧 开始添加 Email 选项到联系表单...")
    print()
    
    # 要处理的目录列表
    directories = [
        '.',           # 根目录
        'blog',        # 博客目录
        'ko-kr',       # 韩语目录
        'portfolio',   # 作品集目录
    ]
    
    updated_count = 0
    skipped_count = 0
    error_count = 0
    
    for directory in directories:
        dir_path = Path(directory)
        if not dir_path.exists():
            print(f"⚠️  目录不存在: {directory}")
            continue
        
        # 查找所有 HTML 文件
        html_files = list(dir_path.glob('*.html'))
        
        print(f"📁 处理目录: {directory} ({len(html_files)} 个文件)")
        
        for html_file in html_files:
            success, message = update_html_file(html_file)
            
            if success:
                updated_count += 1
                print(f"  ✅ {html_file.name}")
            elif "已存在" in message:
                skipped_count += 1
            elif "未找到" in message:
                skipped_count += 1
            else:
                error_count += 1
                print(f"  ❌ {html_file.name}: {message}")
    
    print()
    print("=" * 60)
    print(f"✅ 成功更新: {updated_count} 个文件")
    print(f"⏭️  跳过: {skipped_count} 个文件")
    print(f"❌ 错误: {error_count} 个文件")
    print("=" * 60)
    print()
    print("📝 修改内容:")
    print("   - 在联系表单下拉菜单中添加 Email 选项")
    print("   - 保留 Telegram 选项")
    print("   - 选项顺序: Email, Telegram")
    print()

if __name__ == "__main__":
    main()

