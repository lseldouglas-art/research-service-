#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SearchTxt - 文献检索与段落关联工具
用于根据段落大纲检索对应的文献内容

功能：
1. 读取段落大纲和文献素材库
2. 根据章节标识匹配相关文献
3. 生成段落-文献关联文件
4. 支持模糊匹配和精确匹配

作者: AI Research Assistant
版本: 1.0.0
"""

import pandas as pd
import argparse
import json
import sys
import os
import re
from typing import List, Dict, Tuple, Optional
from pathlib import Path


def load_material_library(file_path: str) -> Tuple[pd.DataFrame, Dict[str, str]]:
    """
    加载文献素材库
    
    Args:
        file_path: Excel或CSV文件路径
        
    Returns:
        DataFrame和列名映射
    """
    try:
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)
        
        # 标准化列名
        df.columns = [col.strip().lower() for col in df.columns]
        
        # 识别列名
        column_mapping = {}
        keywords = {
            'id': ['编号', '序号', 'id', 'no', 'number'],
            'title': ['标题', '题目', 'title', '篇名'],
            'author': ['作者', '第一作者', 'author'],
            'year': ['年份', '发表年', 'year', '发表年限'],
            'abstract': ['摘要', 'abstract', 'summary'],
            'zotero_id': ['zotero', '定位', '标识'],
            'direct_section': ['直接相关', '最直接相关', '主章节', '直接'],
            'indirect_section': ['间接相关', '副章节', '间接'],
            'contribution': ['贡献', '应用点', '核心贡献'],
            'relevance': ['相关度', '等级', 'relevance', 'grade'],
        }
        
        for col in df.columns:
            col_lower = col.lower()
            for key, words in keywords.items():
                for word in words:
                    if word in col_lower:
                        if key not in column_mapping:
                            column_mapping[key] = col
                        break
        
        return df, column_mapping
    except Exception as e:
        raise ValueError(f"无法读取文件: {str(e)}")


def parse_outline(outline_text: str) -> List[Dict]:
    """
    解析段落大纲
    
    Args:
        outline_text: 大纲文本
        
    Returns:
        段落列表，每个段落包含编号、标题、层级
    """
    paragraphs = []
    
    lines = outline_text.strip().split('\n')
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # 匹配章节编号模式
        # 格式：1. / 1.1 / 1.1.1 / 一、/ (1) 等
        patterns = [
            r'^(\d+(?:\.\d+)*)\s*[\.\、\s]\s*(.+)$',  # 1. 标题 或 1.1 标题
            r'^([一二三四五六七八九十]+)[\、\s]+(.+)$',  # 一、标题
            r'^\((\d+)\)\s*(.+)$',  # (1) 标题
            r'^【(.+?)】(.+)$',  # 【标题】描述
        ]
        
        matched = False
        for pattern in patterns:
            match = re.match(pattern, line)
            if match:
                section_num = match.group(1)
                title = match.group(2).strip()
                
                # 计算层级
                if '.' in str(section_num):
                    level = len(str(section_num).split('.'))
                elif section_num in '一二三四五六七八九十':
                    level = 1
                else:
                    level = 1
                
                paragraphs.append({
                    'section': str(section_num),
                    'title': title,
                    'level': level,
                    'full_line': line,
                })
                matched = True
                break
        
        if not matched and line:
            # 尝试作为普通段落
            paragraphs.append({
                'section': '',
                'title': line,
                'level': 0,
                'full_line': line,
            })
    
    return paragraphs


def match_literature_to_paragraph(
    paragraph: Dict,
    df: pd.DataFrame,
    column_mapping: Dict[str, str],
    match_mode: str = 'both'
) -> List[Dict]:
    """
    将文献匹配到段落
    
    Args:
        paragraph: 段落信息
        df: 文献DataFrame
        column_mapping: 列名映射
        match_mode: 匹配模式 (direct/indirect/both)
        
    Returns:
        匹配的文献列表
    """
    matched_papers = []
    
    section_title = paragraph.get('title', '')
    section_num = paragraph.get('section', '')
    
    direct_col = column_mapping.get('direct_section')
    indirect_col = column_mapping.get('indirect_section')
    
    for idx, row in df.iterrows():
        is_match = False
        match_type = ''
        
        # 直接相关匹配
        if match_mode in ['direct', 'both'] and direct_col and direct_col in df.columns:
            direct_section = str(row[direct_col]) if pd.notna(row[direct_col]) else ''
            if section_title in direct_section or section_num in direct_section:
                is_match = True
                match_type = '直接相关'
        
        # 间接相关匹配
        if match_mode in ['indirect', 'both'] and indirect_col and indirect_col in df.columns:
            indirect_section = str(row[indirect_col]) if pd.notna(row[indirect_col]) else ''
            if section_title in indirect_section or section_num in indirect_section:
                is_match = True
                match_type = '间接相关' if not match_type else '直接+间接相关'
        
        if is_match:
            paper_info = extract_paper_info(row, column_mapping, idx)
            paper_info['match_type'] = match_type
            matched_papers.append(paper_info)
    
    return matched_papers


def extract_paper_info(row: pd.Series, column_mapping: Dict[str, str], idx: int) -> Dict:
    """
    提取文献信息
    
    Args:
        row: DataFrame行
        column_mapping: 列名映射
        idx: 行索引
        
    Returns:
        文献信息字典
    """
    info = {'index': idx + 1}
    
    # 提取各字段
    fields = {
        'id': '编号',
        'title': '标题',
        'author': '作者',
        'year': '年份',
        'abstract': '摘要',
        'zotero_id': 'Zotero标识',
        'contribution': '核心贡献',
        'relevance': '相关度',
    }
    
    for key, label in fields.items():
        col = column_mapping.get(key)
        if col and col in row.index:
            value = row[col]
            if pd.notna(value):
                info[label] = str(value)
    
    return info


def generate_paragraph_file(
    paragraph: Dict,
    papers: List[Dict],
    output_format: str = 'txt'
) -> str:
    """
    生成段落关联文献文件内容
    
    Args:
        paragraph: 段落信息
        papers: 关联文献列表
        output_format: 输出格式
        
    Returns:
        文件内容
    """
    if output_format == 'txt':
        content = f"{'=' * 60}\n"
        content += f"段落: {paragraph.get('section', '')} {paragraph.get('title', '')}\n"
        content += f"层级: {paragraph.get('level', 0)}\n"
        content += f"关联文献数: {len(papers)} 篇\n"
        content += f"{'=' * 60}\n\n"
        
        for i, paper in enumerate(papers, 1):
            content += f"【文献 {i}】({paper.get('match_type', '')})\n"
            for key, value in paper.items():
                if key not in ['index', 'match_type']:
                    content += f"{key}: {value}\n"
            content += "\n" + "-" * 40 + "\n\n"
        
        return content
    
    elif output_format == 'json':
        return json.dumps({
            'paragraph': paragraph,
            'papers': papers,
            'count': len(papers),
        }, ensure_ascii=False, indent=2)
    
    elif output_format == 'markdown':
        content = f"## {paragraph.get('section', '')} {paragraph.get('title', '')}\n\n"
        content += f"**层级**: {paragraph.get('level', 0)} | **关联文献数**: {len(papers)} 篇\n\n"
        
        for i, paper in enumerate(papers, 1):
            content += f"### 文献 {i} ({paper.get('match_type', '')})\n\n"
            content += "| 字段 | 内容 |\n|------|------|\n"
            for key, value in paper.items():
                if key not in ['index', 'match_type']:
                    content += f"| {key} | {value} |\n"
            content += "\n"
        
        return content
    
    return ""


def main():
    """主函数"""
    parser = argparse.ArgumentParser(
        description='SearchTxt - 文献检索与段落关联工具',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例用法:
  # 从段落大纲检索文献
  python searchtxt.py outline.txt --library material.xlsx --output ./paragraphs/
  
  # 从JSON大纲检索
  python searchtxt.py outline.json --library material.xlsx -f json
  
  # 仅匹配直接相关文献
  python searchtxt.py outline.txt -l material.xlsx --mode direct
        """
    )
    
    parser.add_argument('outline', help='段落大纲文件 (txt/json)')
    parser.add_argument('-l', '--library', required=True, help='文献素材库文件')
    parser.add_argument('-o', '--output', default='./output', help='输出目录')
    parser.add_argument('-f', '--format', choices=['txt', 'json', 'markdown'],
                        default='txt', help='输出格式')
    parser.add_argument('-m', '--mode', choices=['direct', 'indirect', 'both'],
                        default='both', help='匹配模式')
    parser.add_argument('--combine', action='store_true',
                        help='合并输出为单个文件')
    parser.add_argument('-v', '--verbose', action='store_true',
                        help='显示详细信息')
    
    args = parser.parse_args()
    
    # 创建输出目录
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        # 加载文献素材库
        print(f"📂 正在加载文献素材库: {args.library}")
        df, column_mapping = load_material_library(args.library)
        print(f"✅ 成功加载 {len(df)} 篇文献")
        
        if args.verbose:
            print(f"\n识别到的列映射:")
            for key, col in column_mapping.items():
                if col:
                    print(f"  {key}: {col}")
        
        # 加载大纲
        print(f"\n📄 正在解析段落大纲: {args.outline}")
        if args.outline.endswith('.json'):
            with open(args.outline, 'r', encoding='utf-8') as f:
                outline_data = json.load(f)
                if isinstance(outline_data, list):
                    paragraphs = outline_data
                else:
                    outline_text = outline_data.get('outline', '') or outline_data.get('content', '')
                    paragraphs = parse_outline(outline_text)
        else:
            with open(args.outline, 'r', encoding='utf-8') as f:
                outline_text = f.read()
            paragraphs = parse_outline(outline_text)
        
        print(f"✅ 解析到 {len(paragraphs)} 个段落")
        
        if args.verbose:
            print("\n段落列表:")
            for p in paragraphs[:10]:
                print(f"  {p.get('section', '')} {p.get('title', '')[:30]}...")
            if len(paragraphs) > 10:
                print(f"  ... 还有 {len(paragraphs) - 10} 个段落")
        
        # 匹配文献
        print(f"\n🔍 开始匹配文献 (模式: {args.mode})")
        all_results = []
        total_matches = 0
        
        for paragraph in paragraphs:
            papers = match_literature_to_paragraph(
                paragraph, df, column_mapping, args.mode
            )
            
            if papers:
                total_matches += len(papers)
                
                result = {
                    'paragraph': paragraph,
                    'papers': papers,
                    'count': len(papers),
                }
                all_results.append(result)
                
                if args.verbose:
                    section = paragraph.get('section', '')
                    title = paragraph.get('title', '')[:30]
                    print(f"  {section} {title}: {len(papers)} 篇文献")
        
        print(f"✅ 共匹配 {total_matches} 篇次文献")
        
        # 输出
        print(f"\n💾 输出到: {output_dir}")
        
        if args.combine:
            # 合并输出
            combined_file = output_dir / f"all_paragraphs.{args.format}"
            
            if args.format == 'json':
                with open(combined_file, 'w', encoding='utf-8') as f:
                    json.dump(all_results, f, ensure_ascii=False, indent=2)
            else:
                with open(combined_file, 'w', encoding='utf-8') as f:
                    for result in all_results:
                        content = generate_paragraph_file(
                            result['paragraph'],
                            result['papers'],
                            args.format
                        )
                        f.write(content)
                        f.write("\n\n")
            
            print(f"  合并文件: {combined_file.name}")
        else:
            # 分别输出
            for i, result in enumerate(all_results, 1):
                section = result['paragraph'].get('section', str(i))
                # 清理文件名
                safe_section = re.sub(r'[^\w\-.]', '_', str(section))
                output_file = output_dir / f"paragraph_{safe_section}.{args.format}"
                
                content = generate_paragraph_file(
                    result['paragraph'],
                    result['papers'],
                    args.format
                )
                
                with open(output_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                if args.verbose:
                    print(f"  段落 {section}: {output_file.name}")
        
        # 输出统计摘要
        summary_file = output_dir / "summary.json"
        summary = {
            'total_paragraphs': len(paragraphs),
            'matched_paragraphs': len(all_results),
            'total_matches': total_matches,
            'match_mode': args.mode,
            'output_format': args.format,
        }
        
        with open(summary_file, 'w', encoding='utf-8') as f:
            json.dump(summary, f, ensure_ascii=False, indent=2)
        
        print(f"\n✅ 处理完成! 摘要已保存到: {summary_file}")
        print(f"\n📊 统计:")
        print(f"  段落总数: {len(paragraphs)}")
        print(f"  有匹配的段落: {len(all_results)}")
        print(f"  总匹配文献次数: {total_matches}")
        
    except Exception as e:
        print(f"❌ 错误: {str(e)}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
