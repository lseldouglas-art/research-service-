import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

// 数据库配置
const DATABASE_CONFIG = {
  scopus: {
    name: 'Scopus',
    language: 'en',
    fieldTitleAbsKey: 'TITLE-ABS-KEY',
    fieldTitle: 'TITLE',
    operators: {
      and: 'AND',
      or: 'OR',
      not: 'AND NOT',
      near: 'W/',
      wildcard: '*',
      truncation: '?',
    },
    example: 'TITLE-ABS-KEY("machine learning") AND NOT TITLE("review")',
  },
  'web-of-science': {
    name: 'Web of Science',
    language: 'en',
    fieldTitleAbsKey: 'TS',
    fieldTitle: 'TI',
    operators: {
      and: 'AND',
      or: 'OR',
      not: 'NOT',
      near: 'NEAR/',
      wildcard: '*',
      truncation: '$',
    },
    example: 'TS=("machine learning") NOT TI=("review")',
  },
  'google-scholar': {
    name: 'Google Scholar',
    language: 'en',
    fieldTitleAbsKey: '',
    fieldTitle: 'intitle:',
    operators: {
      and: ' ',
      or: 'OR',
      not: '-',
      near: 'AROUND()',
      wildcard: '*',
      truncation: '',
    },
    example: '"machine learning" -intitle:review',
  },
  pubmed: {
    name: 'PubMed',
    language: 'en',
    fieldTitleAbsKey: '[Title/Abstract]',
    fieldTitle: '[Title]',
    operators: {
      and: 'AND',
      or: 'OR',
      not: 'NOT',
      near: '"term1"[Title/Abstract] AND "term2"[Title/Abstract]',
      wildcard: '*',
      truncation: '',
    },
    example: '"machine learning"[Title/Abstract] NOT "review"[Title]',
  },
  embase: {
    name: 'Embase',
    language: 'en',
    fieldTitleAbsKey: 'ab,ti,kw',
    fieldTitle: 'ti',
    operators: {
      and: 'AND',
      or: 'OR',
      not: 'NOT',
      near: 'NEAR/',
      wildcard: '*',
      truncation: '?',
    },
    example: 'ab,ti,kw("machine learning") NOT ti("review")',
  },
  'cnki': {
    name: '中国知网',
    language: 'zh',
    fieldTitleAbsKey: 'TKA',
    fieldTitle: 'TI',
    operators: {
      and: '+',
      or: ' + ',
      not: 'NOT',
      near: '',
      wildcard: '*',
      truncation: '',
    },
    example: "TKA=('机器学习' + '深度学习') NOT TI=('综述' + '研究进展')",
  },
  'wanfang': {
    name: '万方数据',
    language: 'zh',
    fieldTitleAbsKey: '主题',
    fieldTitle: '题名',
    operators: {
      and: 'AND',
      or: 'OR',
      not: 'NOT',
      near: '',
      wildcard: '*',
      truncation: '',
    },
    example: '主题:("机器学习" OR "深度学习") NOT 题名:("综述")',
  },
  'cqvip': {
    name: '维普',
    language: 'zh',
    fieldTitleAbsKey: 'M',
    fieldTitle: 'T',
    operators: {
      and: '*',
      or: '+',
      not: '-',
      near: '',
      wildcard: '?',
      truncation: '',
    },
    example: 'M=(机器学习+深度学习) -T=(综述)',
  },
};

// 提示词模板
const PROMPT_TEMPLATES = {
  'stable': {
    name: '稳定版',
    description: '回复稳定，适合大多数常规检索需求',
    generatePrompt: (keyword: string, database: string) => {
      const config = DATABASE_CONFIG[database as keyof typeof DATABASE_CONFIG];
      const isChinese = config?.language === 'zh';
      
      if (isChinese) {
        return `我需要为"${keyword}"领域做文献调研来写综述。怎么设计一个直接能在${config.name}上用的检索式？

要求：
1. 核心要求和同义词必须用"${config.fieldTitleAbsKey}"字段检索（涵盖标题、关键词、摘要）
2. 必须在"${config.fieldTitle}"字段排除某些容易检索进来的不相关干扰词
3. 要包含所有关键的命名变体或同义词
4. 请避免使用复杂的专业检索算符

请按以下格式输出：
【检索式】
（直接可复制的检索式）

【检索词说明】
- 核心概念：xxx
- 同义词/变体：xxx
- 排除词：xxx

【检索策略说明】
简要说明检索策略的设计思路`;
      }
      
      return `我需要为"${keyword}"领域做文献调研来写综述。导师给了这个关键词，你觉得应该怎么设计可以直接用于${config?.name || '数据库'}的高级检索式？

要求：
1. 必须包含所有命名变体
2. 采用摘要级"${config?.fieldTitleAbsKey}"检索该领域
3. 采用标题级排除"${config?.fieldTitle}"某些容易检索入的不相关文献
4. 使用${config?.name || '数据库'}支持的检索算符

示例格式：
${config?.fieldTitleAbsKey}("term1" OR "term2") ${config?.operators.not} ${config?.fieldTitle}("excluded term")

请按以下格式输出：
【检索式】
（直接可复制的检索式）

【检索词说明】
- 核心概念：xxx
- 同义词/变体：xxx
- 排除词：xxx

【检索策略说明】
简要说明检索策略的设计思路`;
    },
  },
  'advanced': {
    name: '高级版',
    description: '提供多种检索策略，跨学科适用性更强',
    generatePrompt: (keyword: string, database: string) => {
      const config = DATABASE_CONFIG[database as keyof typeof DATABASE_CONFIG];
      const isChinese = config?.language === 'zh';
      
      if (isChinese) {
        return `我需要为"${keyword}"领域做文献调研来写综述。请为我设计一个可以直接用于${config.name}的高级检索式。

需求：
1. 全面性：必须包含核心概念的所有命名变体
2. 检索广度：必须采用摘要级检索来构建核心概念的语义群
3. 检索精度：必须采用标题级排除来过滤不相关文献

检索策略构建指南：
1. 首先判断主题复杂度：单一概念主题 vs 多概念复合主题
2. 单一概念：构建一个全面的语义群
3. 多概念主题：分解为2-3个核心概念，每个概念独立构建语义群
4. 逻辑组合：在语义群内部使用OR连接所有扩展术语；在不同概念的语义群之间使用AND连接

请基于以上需求和指南，为我的主题构建最优检索式：

输出格式：
【检索式】
（直接可复制的检索式）

【检索策略分析】
- 主题类型：单一概念/多概念复合
- 核心概念拆解：xxx
- 检索词扩展：xxx
- 排除策略：xxx

【使用建议】
针对该领域的检索建议`;
      }
      
      return `我需要为"${keyword}"领域做文献调研来写综述。请为我设计一个可以直接用于${config?.name || '数据库'}的高级检索式。

需求：
1. 全面性：必须包含核心概念的所有命名变体，并熟练运用截词符和通配符
2. 检索广度：必须采用摘要级检索来构建核心概念的语义群
3. 检索精度：必须采用标题级排除来过滤不相关文献

检索策略构建指南：
1. 首先判断主题复杂度：单一概念主题 vs 多概念复合主题
2. 单一概念：构建一个全面的语义群
3. 多概念主题：分解为2-3个核心概念，每个概念独立构建语义群
4. 邻近优先：对于由多个单词组成的术语，优先使用邻近运算符（如W/3~5）
5. 逻辑组合：在语义群内部使用OR连接所有扩展术语；在不同概念的语义群之间使用AND连接

请基于以上需求和指南，为我的主题构建最优检索式：

输出格式：
【检索式】
（直接可复制的检索式）

【检索策略分析】
- 主题类型：单一概念/多概念复合
- 核心概念拆解：xxx
- 检索词扩展：xxx
- 排除策略：xxx

【使用建议】
针对该领域的检索建议`;
    },
  },
  'comprehensive': {
    name: '全覆盖版',
    description: '同时生成多个数据库的检索式，覆盖中英文文献',
    generatePrompt: (keyword: string, database: string) => {
      return `我需要为"${keyword}"领域做文献调研来写综述。请为我设计一套完整的检索方案，覆盖中英文主流数据库。

请分别为以下数据库生成检索式：
1. Scopus（英文）
2. Web of Science（英文）
3. PubMed（生物医学领域）
4. 中国知网（中文）
5. 万方数据（中文）

需求：
1. 全面性：必须包含核心概念的所有命名变体和同义词
2. 中英文对应：确保中英文检索词语义对应准确
3. 数据库适配：使用各数据库支持的检索算符和字段标签

输出格式：

【核心概念分析】
- 主题拆解：xxx
- 英文术语：xxx
- 中文术语：xxx

【Scopus检索式】
（直接可复制的检索式）

【Web of Science检索式】
（直接可复制的检索式）

【PubMed检索式】
（直接可复制的检索式）

【中国知网检索式】
（直接可复制的检索式）

【万方数据检索式】
（直接可复制的检索式）

【检索建议】
综合检索策略和使用建议`;
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    const { keyword, database, template } = await request.json();
    
    if (!keyword) {
      return NextResponse.json({ error: '请输入研究领域或关键词' }, { status: 400 });
    }

    if (!database) {
      return NextResponse.json({ error: '请选择目标数据库' }, { status: 400 });
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    // 选择提示词模板
    const templateConfig = PROMPT_TEMPLATES[template as keyof typeof PROMPT_TEMPLATES] || PROMPT_TEMPLATES.stable;
    const prompt = templateConfig.generatePrompt(keyword, database);

    // 系统提示词
    const systemPrompt = `你是一位专业的文献检索专家，擅长为各个学科领域构建高质量、全面的检索式。
你的任务是：
1. 准确理解用户的研究主题
2. 分析主题的核心概念和相关概念
3. 扩展所有相关的同义词、命名变体
4. 构建符合目标数据库语法的高级检索式
5. 确保检索式既全面（查全率高）又精确（查准率合理）

注意事项：
- 英文术语需考虑英式/美式拼写差异
- 中文术语需考虑同义词、近义词、缩写
- 学术术语需考虑学科变体
- 适当使用截词符扩展词形变化
- 排除明显不相关的干扰词`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: prompt },
    ];

    // 使用流式输出
    const stream = client.stream(messages, {
      temperature: 0.3, // 低温度保证输出稳定
    });

    // 创建可读流用于SSE
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.content) {
              const text = chunk.content.toString();
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error generating search query:', error);
    return NextResponse.json(
      { error: '生成检索式时出错，请稍后重试' },
      { status: 500 }
    );
  }
}

// 导出数据库配置供前端使用
export async function GET() {
  return NextResponse.json({
    databases: Object.entries(DATABASE_CONFIG).map(([key, value]) => ({
      id: key,
      name: value.name,
      language: value.language,
      example: value.example,
    })),
    templates: Object.entries(PROMPT_TEMPLATES).map(([key, value]) => ({
      id: key,
      name: value.name,
      description: value.description,
    })),
  });
}
