#!/usr/bin/env python3
"""
更新所有页面的联系表单
1. 添加 Email 和 WhatsApp 选项到下拉菜单
2. 添加邮件通知功能
"""

import os
import re
from pathlib import Path

def update_contact_form(file_path):
    """更新单个 HTML 文件的联系表单"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 1. 更新下拉菜单选项（添加 Email 选项）
        # 查找 select 标签并添加选项
        select_pattern = r'(<select[^>]*fs-selectcustom-hideinitial="true"[^>]*>\s*)<option value="Telegram">Telegram</option>(\s*</select>)'

        select_replacement = r'''\1<option value="Email">Email</option>
<option value="Telegram">Telegram</option>\2'''

        content = re.sub(select_pattern, select_replacement, content, flags=re.DOTALL)
        
        # 2. 更新表单的 action 属性，添加 FormSubmit.co 邮件通知
        # 查找表单标签
        form_pattern = r'(<form[^>]*method="get"[^>]*class="form_bdss"[^>]*>)'
        
        # 检查是否已经有 action 属性
        if 'action=' not in content or 'formsubmit.co' not in content:
            form_replacement = r'<form method="post" action="https://formsubmit.co/hayajaiahk@gmail.com" name="wf-form-" data-name="Contact form" class="form_bdss">'
            
            # 替换所有表单标签
            content = re.sub(
                r'<form[^>]*method="get"[^>]*name="wf-form-"[^>]*class="form_bdss"[^>]*>',
                form_replacement,
                content
            )
        
        # 3. 在表单中添加隐藏字段（FormSubmit.co 配置）
        # 查找第一个 form-field 之前的位置
        if '_subject' not in content:
            hidden_fields = '''
<!-- FormSubmit.co 配置 -->
<input type="hidden" name="_subject" value="🔔 PandaBlock 网站新咨询">
<input type="hidden" name="_template" value="table">
<input type="hidden" name="_captcha" value="false">
<input type="hidden" name="_next" value="https://rocknblock.io/index.html#contact">
<input type="text" name="_honey" style="display:none">
'''
            
            # 在第一个 wrap-form-field_bdss 之前插入
            content = content.replace(
                '<div class="wrap-form-field_bdss">',
                hidden_fields + '<div class="wrap-form-field_bdss">',
                1  # 只替换第一个
            )
        
        # 只有在内容发生变化时才写入文件
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
        
    except Exception as e:
        print(f"❌ 处理文件 {file_path} 时出错: {e}")
        return False

def main():
    """主函数"""
    print("🚀 开始更新联系表单...")
    print("=" * 60)
    
    # 获取所有 HTML 文件
    html_files = []
    
    # 根目录的 HTML 文件
    for file in Path('.').glob('*.html'):
        html_files.append(file)
    
    # blog 目录
    blog_dir = Path('./blog')
    if blog_dir.exists():
        for file in blog_dir.glob('*.html'):
            html_files.append(file)
    
    # ko-kr 目录
    ko_dir = Path('./ko-kr')
    if ko_dir.exists():
        for file in ko_dir.glob('*.html'):
            html_files.append(file)
        
        # ko-kr/blog 目录
        ko_blog_dir = ko_dir / 'blog'
        if ko_blog_dir.exists():
            for file in ko_blog_dir.glob('*.html'):
                html_files.append(file)
    
    # portfolio 目录
    portfolio_dir = Path('./portfolio')
    if portfolio_dir.exists():
        for file in portfolio_dir.glob('*.html'):
            html_files.append(file)
    
    # ko-kr/portfolio 目录
    ko_portfolio_dir = Path('./ko-kr/portfolio')
    if ko_portfolio_dir.exists():
        for file in ko_portfolio_dir.glob('*.html'):
            html_files.append(file)
    
    print(f"📁 找到 {len(html_files)} 个 HTML 文件")
    print()
    
    updated_count = 0
    skipped_count = 0
    
    for file_path in html_files:
        if update_contact_form(file_path):
            print(f"✅ 已更新: {file_path}")
            updated_count += 1
        else:
            skipped_count += 1
    
    print()
    print("=" * 60)
    print(f"✅ 更新完成！")
    print(f"   - 已更新: {updated_count} 个文件")
    print(f"   - 已跳过: {skipped_count} 个文件（无需更新）")
    print()
    print("📧 邮件通知配置:")
    print("   - 接收邮箱: hayajaiahk@gmail.com")
    print("   - 服务提供商: FormSubmit.co")
    print()
    print("⚠️  重要提示:")
    print("   1. 首次使用需要验证邮箱（点击 FormSubmit.co 发送的验证链接）")
    print("   2. 验证后，所有表单提交都会自动发送到您的邮箱")
    print("   3. 表单现在支持两种联系方式：Email、Telegram")
    print()

if __name__ == '__main__':
    main()

