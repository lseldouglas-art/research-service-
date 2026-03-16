import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

// 数据库配置
const DATABASE_CONFIG = {
  scopus: {
    name: 'Scopus',
    fieldTitleAbsKey: 'TITLE-ABS-KEY',
    fieldTitle: 'TITLE',
    operators: { and: 'AND', or: 'OR', not: 'AND NOT', near: 'W/', wildcard: '*', truncation: '?' },
  },
  'web-of-science': {
    name: 'Web of Science',
    fieldTitleAbsKey: 'TS',
    fieldTitle: 'TI',
    operators: { and: 'AND', or: 'OR', not: 'NOT', near: 'NEAR/', wildcard: '*', truncation: '$' },
  },
  'google-scholar': {
    name: 'Google Scholar',
    fieldTitleAbsKey: '',
    fieldTitle: 'intitle:',
    operators: { and: ' ', or: 'OR', not: '-', near: 'AROUND()', wildcard: '*', truncation: '' },
  },
  pubmed: {
    name: 'PubMed',
    fieldTitleAbsKey: '[Title/Abstract]',
    fieldTitle: '[Title]',
    operators: { and: 'AND', or: 'OR', not: 'NOT', near: '', wildcard: '*', truncation: '' },
  },
  embase: {
    name: 'Embase',
    fieldTitleAbsKey: 'ab,ti,kw',
    fieldTitle: 'ti',
    operators: { and: 'AND', or: 'OR', not: 'NOT', near: 'NEAR/', wildcard: '*', truncation: '?' },
  },
  'cnki': {
    name: '中国知网',
    fieldTitleAbsKey: 'TKA',
    fieldTitle: 'TI',
    operators: { and: '+', or: ' + ', not: 'NOT', near: '', wildcard: '*', truncation: '' },
  },
  'wanfang': {
    name: '万方数据',
    fieldTitleAbsKey: '主题',
    fieldTitle: '题名',
    operators: { and: 'AND', or: 'OR', not: 'NOT', near: '', wildcard: '*', truncation: '' },
  },
  'cqvip': {
    name: '维普',
    fieldTitleAbsKey: 'M',
    fieldTitle: 'T',
    operators: { and: '*', or: '+', not: '-', near: '', wildcard: '?', truncation: '' },
  },
};

// 矩阵式检索策略构建提示词
function generateMatrixConstructionPrompt(keyword: string, database: string): string {
  const config = DATABASE_CONFIG[database as keyof typeof DATABASE_CONFIG];
  const isChinese = config?.name?.includes('中国') || config?.name?.includes('万方') || config?.name?.includes('维普');

  if (isChinese) {
    return `我需要为"${keyword}"这一具体研究方向构建一个系统性的矩阵式检索策略。请帮我进行主题解构并生成多阶段检索计划。

【第一步：主题系统性解构】
请将研究主题分解为以下维度：

1. **核心概念维度**
   - 核心术语（必须包含）
   - 同义词/近义词（应该包含）
   - 相关术语（可以包含）
   - 缩写/简称变体

2. **方法技术维度**
   - 研究方法关键词
   - 技术/工艺关键词
   - 实验技术关键词
   - 分析方法关键词

3. **应用场景维度**
   - 主要应用领域
   - 具体应用场景
   - 产业应用关键词

4. **时间维度**
   - 研究发展阶段
   - 最新进展关键词

5. **排除维度**
   - 明确不相关的主题
   - 常见误检关键词

【第二步：矩阵式检索计划】
基于上述解构，生成一个分阶段的检索计划：

**阶段一：核心检索**
- 目标：获取核心相关文献
- 策略：仅使用核心概念，高查准率
- 检索式：

**阶段二：扩展检索**
- 目标：扩大覆盖面，提高查全率
- 策略：加入同义词和相关术语
- 检索式：

**阶段三：精准过滤**
- 目标：排除不相关文献
- 策略：使用排除词过滤
- 检索式：

**综合检索式**（平衡查全率与查准率）：

【输出格式要求】

请严格按以下格式输出：

【主题解构】

**核心概念**
- 核心术语：xxx
- 同义词/近义词：xxx, xxx, xxx
- 相关术语：xxx, xxx
- 缩写变体：xxx

**方法技术**
- 研究方法：xxx
- 技术关键词：xxx

**应用场景**
- 应用领域：xxx
- 应用场景：xxx

**排除关键词**
- 不相关主题：xxx
- 常见误检词：xxx

【矩阵式检索计划】

**阶段一：核心检索**
检索式：
\`\`\`
${config?.fieldTitleAbsKey}=('xxx' + 'xxx')
\`\`\`
预期效果：查准率高，文献量较少

**阶段二：扩展检索**
检索式：
\`\`\`
${config?.fieldTitleAbsKey}=('xxx' + 'xxx' + 'xxx') AND ${config?.fieldTitleAbsKey}=('xxx' + 'xxx')
\`\`\`
预期效果：查全率提高，文献量适中

**阶段三：精准检索**
检索式：
\`\`\`
${config?.fieldTitleAbsKey}=('xxx' + 'xxx') NOT ${config?.fieldTitle}=('排除词1' + '排除词2')
\`\`\`
预期效果：高相关度，排除干扰

【最终推荐检索式】
\`\`\`
（综合平衡后的最佳检索式）
\`\`\`

【使用建议】
- 针对该领域的特殊检索建议
- 需要注意的陷阱
- 后续优化方向`;
  }

  // 英文数据库
  return `I need to build a systematic matrix search strategy for the specific research topic: "${keyword}". Please help me deconstruct the topic and generate a multi-stage search plan for ${config?.name}.

【Step 1: Systematic Topic Deconstruction】

1. **Core Concept Dimension**
   - Core terms (MUST include)
   - Synonyms/Related terms (SHOULD include)
   - Variant spellings (British/American)
   - Abbreviations/Acronyms

2. **Methodology Dimension**
   - Research methods keywords
   - Technical approaches
   - Experimental techniques
   - Analysis methods

3. **Application Dimension**
   - Main application fields
   - Specific application scenarios
   - Industry applications

4. **Temporal Dimension**
   - Research development stages
   - Recent advances keywords

5. **Exclusion Dimension**
   - Clearly unrelated topics
   - Common false positive keywords

【Step 2: Matrix Search Plan】

Based on the deconstruction, generate a phased search plan:

**Phase 1: Core Search**
- Goal: Retrieve core relevant literature
- Strategy: Use only core concepts, high precision
- Search query:

**Phase 2: Expanded Search**
- Goal: Expand coverage, improve recall
- Strategy: Include synonyms and related terms
- Search query:

**Phase 3: Precision Filter**
- Goal: Exclude irrelevant literature
- Strategy: Use exclusion terms
- Search query:

**Comprehensive Search Query** (Balanced recall and precision):

【Output Format】

【Topic Deconstruction】

**Core Concepts**
- Core terms: xxx
- Synonyms: xxx, xxx, xxx
- Related terms: xxx, xxx
- Abbreviations: xxx

**Methodology**
- Research methods: xxx
- Technical keywords: xxx

**Applications**
- Application fields: xxx
- Application scenarios: xxx

**Exclusion Keywords**
- Unrelated topics: xxx
- Common false positives: xxx

【Matrix Search Plan】

**Phase 1: Core Search**
Query:
\`\`\`
${config?.fieldTitleAbsKey}("xxx" OR "xxx")
\`\`\`
Expected: High precision, fewer results

**Phase 2: Expanded Search**
Query:
\`\`\`
${config?.fieldTitleAbsKey}("xxx" OR "xxx" OR "xxx") AND ${config?.fieldTitleAbsKey}("xxx" OR "xxx")
\`\`\`
Expected: Improved recall, moderate results

**Phase 3: Precision Search**
Query:
\`\`\`
${config?.fieldTitleAbsKey}("xxx" OR "xxx") ${config?.operators.not} ${config?.fieldTitle}("exclude1" OR "exclude2")
\`\`\`
Expected: High relevance, filtered noise

【Final Recommended Query】
\`\`\`
(Balanced optimal search query)
\`\`\`

【Usage Recommendations】
- Special search tips for this field
- Common pitfalls to avoid
- Optimization directions`;
}

// 迭代优化提示词
function generateOptimizationPrompt(
  originalQuery: string,
  falsePositiveTitles: string,
  database: string
): string {
  const config = DATABASE_CONFIG[database as keyof typeof DATABASE_CONFIG];
  const isChinese = config?.name?.includes('中国') || config?.name?.includes('万方') || config?.name?.includes('维普');

  if (isChinese) {
    return `我正在使用以下检索式在${config?.name}中进行文献检索，但发现了一些不相关的文献被误检出来。

【原始检索式】
\`\`\`
${originalQuery}
\`\`\`

【误检文献标题】
${falsePositiveTitles.split('\n').map((title, i) => `${i + 1}. ${title}`).join('\n')}

请分析这些误检文献的共性特征，并生成优化后的检索策略。

【分析任务】

1. **误检文献共性分析**
   请分析上述误检文献标题中的共同特征：
   - 是否存在共同的关键词/主题？
   - 是否属于某个特定但不相关的子领域？
   - 是否有共同的文献类型（如综述、会议摘要等）？
   - 是否有时间或地域特征？

2. **检索策略优化建议**
   基于分析结果，提出以下优化方案：
   - 需要增加的排除词
   - 需要修改的检索逻辑
   - 是否需要调整字段限定

3. **优化后检索式**
   生成改进后的检索式

【输出格式】

【误检文献共性分析】

**共同关键词**
- 发现的共同词：xxx
- 出现频率：x/x

**不相关主题**
- 识别出的不相关主题：xxx

**文献类型**
- 误检文献类型：xxx

【优化建议】

**新增排除词**
- xxx（原因：xxx）
- xxx（原因：xxx）

**检索逻辑调整**
- 建议修改：xxx

【优化后检索式】

**版本1：保守优化**（仅排除最明显的干扰）
\`\`\`
${originalQuery} NOT ${config?.fieldTitle}('排除词')
\`\`\`

**版本2：激进优化**（排除所有识别出的干扰）
\`\`\`
${originalQuery} NOT ${config?.fieldTitle}('排除词1' + '排除词2' + '排除词3')
\`\`\`

**版本3：平衡优化**（推荐）
\`\`\`
（平衡查全率与查准率的最优检索式）
\`\`\`

【预期效果】
- 优化前预估误检率：xx%
- 优化后预估误检率：xx%
- 文献量变化：约减少 xx%

【下一步建议】
- 如效果仍不理想，可继续迭代优化
- 建议记录每次优化的效果变化`;
  }

  // 英文数据库
  return `I'm using the following search query in ${config?.name}, but found some irrelevant literature was mistakenly retrieved.

【Original Query】
\`\`\`
${originalQuery}
\`\`\`

【False Positive Titles】
${falsePositiveTitles.split('\n').map((title, i) => `${i + 1}. ${title}`).join('\n')}

Please analyze the common characteristics of these false positives and generate an optimized search strategy.

【Analysis Tasks】

1. **Common Characteristics Analysis**
   Analyze the common features in the false positive titles:
   - Are there common keywords/themes?
   - Do they belong to a specific but unrelated subfield?
   - Is there a common document type (reviews, conference abstracts, etc.)?
   - Are there temporal or geographical patterns?

2. **Optimization Suggestions**
   Based on the analysis, propose:
   - Exclusion terms to add
   - Search logic modifications
   - Field restriction adjustments

3. **Optimized Query**
   Generate the improved search query

【Output Format】

【False Positive Analysis】

**Common Keywords**
- Found common terms: xxx
- Frequency: x/x

**Unrelated Topics**
- Identified unrelated themes: xxx

**Document Types**
- False positive types: xxx

【Optimization Suggestions】

**New Exclusion Terms**
- xxx (reason: xxx)
- xxx (reason: xxx)

**Search Logic Adjustments**
- Suggested modification: xxx

【Optimized Queries】

**Version 1: Conservative** (exclude only obvious noise)
\`\`\`
${originalQuery} ${config?.operators.not} ${config?.fieldTitle}("exclude")
\`\`\`

**Version 2: Aggressive** (exclude all identified noise)
\`\`\`
${originalQuery} ${config?.operators.not} ${config?.fieldTitle}("exclude1" OR "exclude2" OR "exclude3")
\`\`\`

**Version 3: Balanced** (Recommended)
\`\`\`
(Balanced optimal search query)
\`\`\`

【Expected Results】
- Pre-optimization false positive rate: ~xx%
- Post-optimization false positive rate: ~xx%
- Expected reduction in results: ~xx

【Next Steps】
- If results still not ideal, continue iterative optimization
- Track effectiveness changes with each iteration`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyword, database, model, type, originalQuery, falsePositiveTitles } = body;

    if (!database) {
      return NextResponse.json({ error: '请选择目标数据库' }, { status: 400 });
    }

    // 初始化LLM客户端
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    let prompt: string;
    let systemPrompt: string;

    if (type === 'matrix-construction') {
      // 矩阵式检索策略构建
      if (!keyword) {
        return NextResponse.json({ error: '请输入具体研究方向' }, { status: 400 });
      }
      prompt = generateMatrixConstructionPrompt(keyword, database);
      systemPrompt = `你是一位资深的文献检索专家，擅长构建系统性的矩阵式检索策略。

你的任务是：
1. 对研究主题进行多维度系统性解构
2. 识别核心概念、方法、应用等各个维度
3. 生成分阶段的矩阵式检索计划
4. 提供平衡查全率与查准率的最终推荐

注意事项：
- 解构要全面，覆盖研究主题的各个维度
- 检索式要符合目标数据库的语法规范
- 要考虑同义词、变体、缩写等扩展
- 要合理设置排除词，避免误检
- 分阶段检索策略要有明确的预期效果说明`;
    } else if (type === 'iterative-optimization') {
      // 迭代优化
      if (!originalQuery || !falsePositiveTitles) {
        return NextResponse.json({ error: '请提供原始检索式和误检文献标题' }, { status: 400 });
      }
      prompt = generateOptimizationPrompt(originalQuery, falsePositiveTitles, database);
      systemPrompt = `你是一位资深的文献检索专家，擅长分析和优化检索策略。

你的任务是：
1. 分析误检文献的共性特征
2. 识别不相关的主题和关键词
3. 提供多种优化版本的检索式
4. 预估优化效果并给出下一步建议

注意事项：
- 分析要客观，基于误检文献的实际内容
- 优化建议要具体可行
- 提供多个版本的检索式供选择
- 考虑查全率与查准率的平衡
- 检索式要符合目标数据库的语法规范`;
    } else {
      return NextResponse.json({ error: '无效的请求类型' }, { status: 400 });
    }

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: prompt },
    ];

    const selectedModel = model || 'deepseek-r1-250528';

    // 使用流式输出
    const stream = client.stream(messages, {
      model: selectedModel,
      temperature: 0.3,
    });

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
    console.error('Error in focused search:', error);
    return NextResponse.json(
      { error: '处理请求时出错，请稍后重试' },
      { status: 500 }
    );
  }
}
