#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PaperDivider - 文献智能分割工具
用于将文献素材库按优先级策略分批次处理

功能：
1. 读取Excel格式的文献素材库
2. 按优先级策略排序：相关度等级 → 发表年份 → 期刊质量
3. 分批次输出，控制每批次文献数量
4. 支持自定义批次大小

作者: AI Research Assistant
版本: 1.0.0
"""

import pandas as pd
import argparse
import json
import sys
import os
from typing import List, Dict, Tuple, Optional
from pathlib import Path


# 相关度等级映射
RELEVANCE_GRADE_MAP = {
    'A': 4,
    'B': 3,
    'C': 2,
    'D': 1,
    'a': 4,
    'b': 3,
    'c': 2,
    'd': 1,
    '高': 4,
    '中': 3,
    '低': 2,
    '无': 1,
}

# 期刊质量分级（常见顶级期刊）
TOP_JOURNALS = {
    # Nature系列
    'nature', 'nature medicine', 'nature biotechnology', 'nature genetics',
    'nature cell biology', 'nature neuroscience', 'nature physics',
    # Science系列
    'science', 'science translational medicine', 'science signaling',
    # Cell系列
    'cell', 'cancer cell', 'molecular cell', 'cell stem cell',
    # 医学顶刊
    'the lancet', 'new england journal of medicine', 'nejm', 'jama',
    'bmj', 'annals of internal medicine',
    # 计算机顶刊
    'ieee transactions on pattern analysis and machine intelligence',
    'journal of the acm', 'communications of the acm',
    # 其他知名期刊
    'pnas', 'proceedings of the national academy of sciences',
}

HIGH_QUALITY_JOURNALS = {
    # 各领域高影响因子期刊
    'plos one', 'scientific reports', 'frontiers', 'biomed research international',
    'journal of biological chemistry', 'bioinformatics', 'nucleic acids research',
    'journal of clinical investigation', 'journal of experimental medicine',
}


def get_journal_quality(journal_name: str) -> int:
    """
    评估期刊质量等级
    
    Args:
        journal_name: 期刊名称
        
    Returns:
        质量等级：3=顶级, 2=高质量, 1=普通
    """
    if pd.isna(journal_name):
        return 1
    
    journal_lower = str(journal_name).lower().strip()
    
    # 检查是否为顶级期刊
    for top_journal in TOP_JOURNALS:
        if top_journal in journal_lower:
            return 3
    
    # 检查是否为高质量期刊
    for high_journal in HIGH_QUALITY_JOURNALS:
        if high_journal in journal_lower:
            return 2
    
    return 1


def parse_relevance_grade(grade_str: str) -> int:
    """
    解析相关度等级
    
    Args:
        grade_str: 相关度等级字符串
        
    Returns:
        数值等级：4=A, 3=B, 2=C, 1=D
    """
    if pd.isna(grade_str):
        return 1
    
    grade_str = str(grade_str).strip()
    
    # 直接映射
    if grade_str in RELEVANCE_GRADE_MAP:
        return RELEVANCE_GRADE_MAP[grade_str]
    
    # 尝试提取第一个字符
    if grade_str and grade_str[0] in RELEVANCE_GRADE_MAP:
        return RELEVANCE_GRADE_MAP[grade_str[0]]
    
    return 1


def parse_year(year_str) -> int:
    """
    解析发表年份
    
    Args:
        year_str: 年份字符串或数字
        
    Returns:
        年份数值，无法解析返回0
    """
    if pd.isna(year_str):
        return 0
    
    # 如果是数字
    if isinstance(year_str, (int, float)):
        return int(year_str) if year_str >= 1900 else 0
    
    # 字符串解析
    year_str = str(year_str).strip()
    
    # 尝试提取4位数字年份
    import re
    match = re.search(r'\b(19|20)\d{2}\b', year_str)
    if match:
        return int(match.group())
    
    return 0


def load_excel(file_path: str) -> pd.DataFrame:
    """
    加载Excel文件
    
    Args:
        file_path: Excel文件路径
        
    Returns:
        DataFrame对象
    """
    try:
        # 尝试读取Excel
        df = pd.read_excel(file_path)
        
        # 标准化列名
        df.columns = [col.strip().lower() for col in df.columns]
        
        # 尝试识别关键列
        column_mapping = identify_columns(df)
        
        return df, column_mapping
    except Exception as e:
        raise ValueError(f"无法读取Excel文件: {str(e)}")


def identify_columns(df: pd.DataFrame) -> Dict[str, str]:
    """
    自动识别Excel列名映射
    
    Args:
        df: DataFrame对象
        
    Returns:
        列名映射字典
    """
    mapping = {
        'id': None,
        'title': None,
        'author': None,
        'year': None,
        'journal': None,
        'abstract': None,
        'relevance': None,
        'zotero_id': None,
        'direct_section': None,
        'indirect_section': None,
        'contribution': None,
    }
    
    # 列名关键词映射
    keywords = {
        'id': ['编号', '序号', 'id', 'no', 'number'],
        'title': ['标题', '题目', 'title', '篇名'],
        'author': ['作者', '第一作者', 'author', 'authors'],
        'year': ['年份', '发表年', 'year', 'date', '发表年限'],
        'journal': ['期刊', '来源', 'journal', 'source', '出版物'],
        'abstract': ['摘要', 'abstract', 'summary'],
        'relevance': ['相关度', '等级', 'relevance', 'grade', '评级', '质量等级'],
        'zotero_id': ['zotero', '定位', '标识'],
        'direct_section': ['直接相关', '最直接相关', '主章节'],
        'indirect_section': ['间接相关', '副章节'],
        'contribution': ['贡献', '应用点', '核心贡献'],
    }
    
    for col in df.columns:
        col_lower = col.lower()
        for key, words in keywords.items():
            for word in words:
                if word in col_lower:
                    if mapping[key] is None:
                        mapping[key] = col
                    break
    
    return mapping


def sort_by_priority(df: pd.DataFrame, column_mapping: Dict[str, str]) -> pd.DataFrame:
    """
    按优先级策略排序文献
    
    优先级：相关度等级 → 发表年份 → 期刊质量
    
    Args:
        df: 原始DataFrame
        column_mapping: 列名映射
        
    Returns:
        排序后的DataFrame
    """
    # 创建排序用的临时列
    df = df.copy()
    
    # 相关度等级
    relevance_col = column_mapping.get('relevance')
    if relevance_col and relevance_col in df.columns:
        df['_relevance_score'] = df[relevance_col].apply(parse_relevance_grade)
    else:
        df['_relevance_score'] = 1
    
    # 发表年份
    year_col = column_mapping.get('year')
    if year_col and year_col in df.columns:
        df['_year'] = df[year_col].apply(parse_year)
    else:
        df['_year'] = 0
    
    # 期刊质量
    journal_col = column_mapping.get('journal')
    if journal_col and journal_col in df.columns:
        df['_journal_quality'] = df[journal_col].apply(get_journal_quality)
    else:
        df['_journal_quality'] = 1
    
    # 排序：相关度降序 → 年份降序 → 期刊质量降序
    df = df.sort_values(
        by=['_relevance_score', '_year', '_journal_quality'],
        ascending=[False, False, False]
    )
    
    # 删除临时列
    df = df.drop(columns=['_relevance_score', '_year', '_journal_quality'])
    
    return df


def divide_into_batches(
    df: pd.DataFrame,
    batch_size: int = 50,
    column_mapping: Optional[Dict[str, str]] = None
) -> List[pd.DataFrame]:
    """
    将文献分割成批次
    
    Args:
        df: 排序后的DataFrame
        batch_size: 每批次文献数量
        column_mapping: 列名映射
        
    Returns:
        批次列表
    """
    # 按相关度等级分组
    if column_mapping and column_mapping.get('relevance'):
        relevance_col = column_mapping['relevance']
        if relevance_col in df.columns:
            # 按相关度等级分组
            grouped = df.groupby(
                df[relevance_col].apply(parse_relevance_grade),
                sort=False
            )
            
            batches = []
            current_batch = []
            current_size = 0
            
            # 按优先级顺序处理每个等级组
            for grade in [4, 3, 2, 1]:  # A, B, C, D
                if grade in grouped.groups:
                    group = grouped.get_group(grade)
                    
                    for _, row in group.iterrows():
                        current_batch.append(row)
                        current_size += 1
                        
                        if current_size >= batch_size:
                            batches.append(pd.DataFrame(current_batch))
                            current_batch = []
                            current_size = 0
            
            # 添加剩余文献
            if current_batch:
                batches.append(pd.DataFrame(current_batch))
            
            return batches
    
    # 默认：简单分割
    batches = []
    for i in range(0, len(df), batch_size):
        batches.append(df.iloc[i:i + batch_size])
    
    return batches


def format_batch_for_output(
    batch_df: pd.DataFrame,
    batch_index: int,
    column_mapping: Dict[str, str]
) -> str:
    """
    格式化批次为文本输出
    
    Args:
        batch_df: 批次DataFrame
        batch_index: 批次序号
        column_mapping: 列名映射
        
    Returns:
        格式化的文本
    """
    output = f"=== 第 {batch_index + 1} 批次文献 ===\n\n"
    output += f"文献数量: {len(batch_df)} 篇\n\n"
    
    # 获取列名
    id_col = column_mapping.get('id')
    title_col = column_mapping.get('title')
    author_col = column_mapping.get('author')
    year_col = column_mapping.get('year')
    journal_col = column_mapping.get('journal')
    abstract_col = column_mapping.get('abstract')
    relevance_col = column_mapping.get('relevance')
    zotero_col = column_mapping.get('zotero_id')
    direct_col = column_mapping.get('direct_section')
    contribution_col = column_mapping.get('contribution')
    
    for idx, row in batch_df.iterrows():
        # 编号
        if id_col and id_col in batch_df.columns:
            paper_id = row[id_col]
        else:
            paper_id = idx + 1
        
        output += f"【文献 {paper_id}】\n"
        
        # 标题
        if title_col and title_col in batch_df.columns:
            output += f"标题: {row[title_col]}\n"
        
        # 作者
        if author_col and author_col in batch_df.columns:
            output += f"作者: {row[author_col]}\n"
        
        # 年份
        if year_col and year_col in batch_df.columns:
            output += f"年份: {row[year_col]}\n"
        
        # 期刊
        if journal_col and journal_col in batch_df.columns:
            output += f"期刊: {row[journal_col]}\n"
        
        # 相关度
        if relevance_col and relevance_col in batch_df.columns:
            output += f"相关度等级: {row[relevance_col]}\n"
        
        # Zotero标识
        if zotero_col and zotero_col in batch_df.columns:
            output += f"Zotero标识: {row[zotero_col]}\n"
        
        # 相关章节
        if direct_col and direct_col in batch_df.columns:
            output += f"相关章节: {row[direct_col]}\n"
        
        # 核心贡献
        if contribution_col and contribution_col in batch_df.columns:
            output += f"核心贡献: {row[contribution_col]}\n"
        
        # 摘要
        if abstract_col and abstract_col in batch_df.columns:
            abstract = str(row[abstract_col])
            if len(abstract) > 500:
                abstract = abstract[:500] + "..."
            output += f"摘要: {abstract}\n"
        
        output += "\n" + "-" * 50 + "\n\n"
    
    return output


def get_statistics(df: pd.DataFrame, column_mapping: Dict[str, str]) -> Dict:
    """
    获取文献统计信息
    
    Args:
        df: DataFrame
        column_mapping: 列名映射
        
    Returns:
        统计信息字典
    """
    stats = {
        'total_count': len(df),
    }
    
    # 相关度分布
    if column_mapping.get('relevance') and column_mapping['relevance'] in df.columns:
        relevance_col = column_mapping['relevance']
        grade_counts = df[relevance_col].apply(parse_relevance_grade).value_counts()
        stats['grade_distribution'] = {
            'A': int(grade_counts.get(4, 0)),
            'B': int(grade_counts.get(3, 0)),
            'C': int(grade_counts.get(2, 0)),
            'D': int(grade_counts.get(1, 0)),
        }
    
    # 年份范围
    if column_mapping.get('year') and column_mapping['year'] in df.columns:
        year_col = column_mapping['year']
        years = df[year_col].apply(parse_year)
        valid_years = years[years > 0]
        if len(valid_years) > 0:
            stats['year_range'] = {
                'min': int(valid_years.min()),
                'max': int(valid_years.max()),
            }
    
    return stats


def main():
    """主函数"""
    parser = argparse.ArgumentParser(
        description='PaperDivider - 文献智能分割工具',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Excel文件格式要求:
  - 编号/序号列: 文献唯一标识
  - 标题列: 文献标题
  - 作者列: 第一作者
  - 年份列: 发表年份
  - 期刊列: 来源期刊
  - 摘要列: 文献摘要
  - 相关度列: A/B/C/D等级
  - Zotero标识列: 快速定位标识
  - 相关章节列: 对应大纲章节
  - 核心贡献列: 论文贡献描述

示例用法:
  python paperdivider.py input.xlsx --batch-size 50 --output ./output/
  python paperdivider.py input.xlsx -b 30 -o ./batches/
        """
    )
    
    parser.add_argument('input', help='输入Excel文件路径')
    parser.add_argument('-b', '--batch-size', type=int, default=50,
                        help='每批次文献数量 (默认: 50)')
    parser.add_argument('-o', '--output', default='./output',
                        help='输出目录 (默认: ./output)')
    parser.add_argument('-f', '--format', choices=['txt', 'json', 'excel'],
                        default='txt', help='输出格式 (默认: txt)')
    parser.add_argument('-v', '--verbose', action='store_true',
                        help='显示详细信息')
    
    args = parser.parse_args()
    
    # 验证批次大小
    if args.batch_size > 75:
        print(f"⚠️ 警告: 批次大小 {args.batch_size} 超过建议值75，可能导致分析质量下降")
        print("建议: 保持每批次50篇以内以获得最佳分析效果")
    
    # 创建输出目录
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        # 加载Excel
        print(f"📂 正在读取文件: {args.input}")
        df, column_mapping = load_excel(args.input)
        print(f"✅ 成功读取 {len(df)} 篇文献")
        
        if args.verbose:
            print(f"\n识别到的列映射:")
            for key, col in column_mapping.items():
                if col:
                    print(f"  {key}: {col}")
        
        # 获取统计信息
        stats = get_statistics(df, column_mapping)
        print(f"\n📊 文献统计:")
        print(f"  总数: {stats['total_count']} 篇")
        if 'grade_distribution' in stats:
            print(f"  相关度分布: A={stats['grade_distribution']['A']}, "
                  f"B={stats['grade_distribution']['B']}, "
                  f"C={stats['grade_distribution']['C']}, "
                  f"D={stats['grade_distribution']['D']}")
        if 'year_range' in stats:
            print(f"  年份范围: {stats['year_range']['min']} - {stats['year_range']['max']}")
        
        # 排序
        print(f"\n🔄 按优先级排序: 相关度 → 年份 → 期刊质量")
        df_sorted = sort_by_priority(df, column_mapping)
        
        # 分批
        print(f"📦 分批处理: 每批 {args.batch_size} 篇")
        batches = divide_into_batches(df_sorted, args.batch_size, column_mapping)
        print(f"✅ 共分为 {len(batches)} 个批次")
        
        # 输出
        print(f"\n💾 输出到: {output_dir}")
        
        for i, batch in enumerate(batches):
            batch_file = output_dir / f"batch_{i+1:03d}.{args.format}"
            
            if args.format == 'txt':
                content = format_batch_for_output(batch, i, column_mapping)
                with open(batch_file, 'w', encoding='utf-8') as f:
                    f.write(content)
            elif args.format == 'json':
                batch.to_json(batch_file, orient='records', force_ascii=False, indent=2)
            elif args.format == 'excel':
                batch.to_excel(batch_file, index=False)
            
            print(f"  批次 {i+1}: {len(batch)} 篇文献 → {batch_file.name}")
        
        # 输出统计摘要
        summary_file = output_dir / "summary.json"
        with open(summary_file, 'w', encoding='utf-8') as f:
            summary = {
                'total_papers': stats['total_count'],
                'batch_size': args.batch_size,
                'total_batches': len(batches),
                'statistics': stats,
                'column_mapping': {k: v for k, v in column_mapping.items() if v},
            }
            json.dump(summary, f, ensure_ascii=False, indent=2)
        
        print(f"\n✅ 处理完成! 摘要已保存到: {summary_file}")
        
    except Exception as e:
        print(f"❌ 错误: {str(e)}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
