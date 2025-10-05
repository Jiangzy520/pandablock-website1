#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
验证品牌名称更新
"""

import glob
import re

def verify_brand_update():
    """验证品牌名称更新"""
    print("🔍 开始验证品牌名称更新...")
    
    # 查找所有 HTML 文件
    html_files = []
    for pattern in ['*.html', '*/*.html', '*/*/*.html', '*/*/*/*.html', '*/*/*/*/*.html']:
        html_files.extend(glob.glob(pattern))
    
    print(f"📊 扫描 {len(html_files)} 个 HTML 文件")
    
    # 检查是否还有 Rock'n'Block 残留
    old_brand_variants = [
        "Rock'n'Block",  # 普通单引号
        "Rock\u2019n\u2019Block",  # Unicode 右单引号
        "Rock\u2019N\u2019Block",  # Unicode 右单引号，大写 N
        "Rock&#x27;n&#x27;Block",  # HTML 实体
        "RocknBlock",
    ]
    
    issues = []
    pandablock_count = 0
    
    for filepath in html_files:
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 检查旧品牌名称
            for variant in old_brand_variants:
                if variant in content:
                    issues.append(f"{filepath}: 发现 {repr(variant)}")
            
            # 统计 PandaBlock 出现次数
            pandablock_count += content.lower().count('pandablock')
        
        except Exception as e:
            print(f"❌ 错误: {filepath}: {e}")
    
    print(f"\n📈 统计结果:")
    print(f"  - PandaBlock 出现次数: {pandablock_count}")
    print(f"  - 发现问题: {len(issues)}")
    
    if issues:
        print(f"\n⚠️  发现以下问题:")
        for issue in issues[:10]:  # 只显示前 10 个
            print(f"  - {issue}")
        if len(issues) > 10:
            print(f"  ... 还有 {len(issues) - 10} 个问题")
        return False
    else:
        print(f"\n✅ 验证通过！所有品牌名称已成功更新为 PandaBlock")
        return True

if __name__ == "__main__":
    success = verify_brand_update()
    exit(0 if success else 1)

