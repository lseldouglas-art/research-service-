import { NextRequest, NextResponse } from 'next/server';
import * as xlsx from 'xlsx';

// 相关度等级映射
const RELEVANCE_GRADE_MAP: Record<string, number> = {
  'A': 4, 'B': 3, 'C': 2, 'D': 1,
  'a': 4, 'b': 3, 'c': 2, 'd': 1,
  '高': 4, '中': 3, '低': 2, '无': 1,
};

// 解析相关度等级
function parseRelevanceGrade(gradeStr: string | undefined): number {
  if (!gradeStr) return 1;
  const str = String(gradeStr).trim();
  
  if (RELEVANCE_GRADE_MAP[str]) return RELEVANCE_GRADE_MAP[str];
  if (str[0] && RELEVANCE_GRADE_MAP[str[0]]) return RELEVANCE_GRADE_MAP[str[0]];
  
  return 1;
}

// 解析年份
function parseYear(yearStr: string | number | undefined): number {
  if (!yearStr) return 0;
  if (typeof yearStr === 'number') return yearStr >= 1900 ? yearStr : 0;
  
  const str = String(yearStr).trim();
  const match = str.match(/\b(19|20)\d{2}\b/);
  return match ? parseInt(match[0]) : 0;
}

// 识别列名
function identifyColumns(headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {};
  
  const keywords: Record<string, string[]> = {
    'id': ['编号', '序号', 'id', 'no', 'number'],
    'title': ['标题', '题目', 'title', '篇名'],
    'author': ['作者', '第一作者', 'author'],
    'year': ['年份', '发表年', 'year', '发表年限'],
    'journal': ['期刊', '来源', 'journal', 'source'],
    'abstract': ['摘要', 'abstract', 'summary'],
    'relevance': ['相关度', '等级', 'relevance', 'grade', '评级'],
    'zotero_id': ['zotero', '定位', '标识'],
    'direct_section': ['直接相关', '最直接相关', '主章节', '直接'],
    'indirect_section': ['间接相关', '副章节', '间接'],
    'contribution': ['贡献', '应用点', '核心贡献'],
  };
  
  for (const col of headers) {
    const colLower = col.toLowerCase();
    for (const [key, words] of Object.entries(keywords)) {
      for (const word of words) {
        if (colLower.includes(word.toLowerCase())) {
          if (!mapping[key]) {
            mapping[key] = col;
          }
          break;
        }
      }
    }
  }
  
  return mapping;
}

interface PaperInfo {
  id: string;
  title: string;
  author: string;
  year: string;
  journal: string;
  abstract: string;
  relevance: string;
  zoteroId: string;
  directSection: string;
  indirectSection: string;
  contribution: string;
  _sortScore: number;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const batchSize = parseInt(formData.get('batchSize') as string) || 50;
    
    if (!file) {
      return NextResponse.json({ error: '请上传文件' }, { status: 400 });
    }
    
    // 读取文件内容
    const buffer = await file.arrayBuffer();
    const workbook = xlsx.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];
    
    if (data.length < 2) {
      return NextResponse.json({ error: '文件内容为空' }, { status: 400 });
    }
    
    // 获取表头和数据
    const headers = data[0].map(h => String(h || '').trim());
    const rows = data.slice(1).filter(row => row && row.some(cell => cell));
    const columnMapping = identifyColumns(headers);
    
    // 辅助函数：安全获取单元格值
    const getCellValue = (row: unknown[], colName: string): string => {
      const col = columnMapping[colName];
      if (!col) return '';
      const colIndex = headers.indexOf(col);
      if (colIndex === -1 || !row[colIndex]) return '';
      return String(row[colIndex]);
    };
    
    // 构建论文列表
    const papers: PaperInfo[] = rows.map((row, index) => {
      const relevance = parseRelevanceGrade(getCellValue(row, 'relevance'));
      const year = parseYear(getCellValue(row, 'year'));
      
      return {
        id: getCellValue(row, 'id') || String(index + 1),
        title: getCellValue(row, 'title'),
        author: getCellValue(row, 'author'),
        year: getCellValue(row, 'year'),
        journal: getCellValue(row, 'journal'),
        abstract: getCellValue(row, 'abstract'),
        relevance: getCellValue(row, 'relevance'),
        zoteroId: getCellValue(row, 'zotero_id'),
        directSection: getCellValue(row, 'direct_section'),
        indirectSection: getCellValue(row, 'indirect_section'),
        contribution: getCellValue(row, 'contribution'),
        _sortScore: relevance * 10000 + year,
      };
    });
    
    // 排序：相关度 → 年份
    papers.sort((a, b) => b._sortScore - a._sortScore);
    
    // 分批
    const batches: Array<{
      index: number;
      paperCount: number;
      papers: Array<{
        id: string;
        title: string;
        author: string;
        year: string;
        relevance: string;
        abstract: string;
        zoteroId: string;
        directSection: string;
        contribution: string;
      }>;
    }> = [];
    
    for (let i = 0; i < papers.length; i += batchSize) {
      const batchPapers = papers.slice(i, i + batchSize).map(p => ({
        id: p.id,
        title: p.title,
        author: p.author,
        year: p.year,
        relevance: p.relevance,
        abstract: p.abstract,
        zoteroId: p.zoteroId,
        directSection: p.directSection,
        contribution: p.contribution,
      }));
      
      batches.push({
        index: Math.floor(i / batchSize),
        paperCount: batchPapers.length,
        papers: batchPapers,
      });
    }
    
    // 统计信息
    const gradeDistribution = { A: 0, B: 0, C: 0, D: 0 };
    let minYear = 3000, maxYear = 0;
    
    for (const paper of papers) {
      const grade = parseRelevanceGrade(paper.relevance);
      if (grade === 4) gradeDistribution.A++;
      else if (grade === 3) gradeDistribution.B++;
      else if (grade === 2) gradeDistribution.C++;
      else gradeDistribution.D++;
      
      const year = parseYear(paper.year);
      if (year > 0) {
        minYear = Math.min(minYear, year);
        maxYear = Math.max(maxYear, year);
      }
    }
    
    return NextResponse.json({
      totalPapers: papers.length,
      totalBatches: batches.length,
      batches,
      statistics: {
        gradeDistribution,
        yearRange: {
          min: minYear === 3000 ? 0 : minYear,
          max: maxYear,
        },
      },
    });
    
  } catch (error) {
    console.error('Error in literature split:', error);
    return NextResponse.json(
      { error: '处理文件时出错，请检查文件格式' },
      { status: 500 }
    );
  }
}
