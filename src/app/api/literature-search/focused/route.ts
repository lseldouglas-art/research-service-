import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

// 数据库配置
const DATABASE_CONFIG: Record<string, {
  name: string;
  fieldTitleAbsKey: string;
  fieldTitle: string;
  operators: { and: string; or: string; not: string; near: string; wildcard: string; truncation: string };
}> = {
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
};

// 矩阵式检索策略生成 - 稳定版提示词
function generateStableMatrixPrompt(keyword: string, database: string): string {
  const config = DATABASE_CONFIG[database] || DATABASE_CONFIG.scopus;

  return `我需要为我的研究主题："${keyword}" 撰写一篇文献综述。请为我设计一套可直接用于${config.name}高级检索的、结构化的检索策略。

请严格遵循以下需求和步骤：

## 1. 概念分解
首先，从我的主题中，识别出最核心的、不可再分的物理或概念实体（例如，概念A、概念B、概念C）。

## 2. 构建语义群
为每一个核心概念，构建一个全面的语义群。

语义群构建要求：
- 包含该概念的所有相关同义词、近义词、具体子类型、缩写、以及不同拼写方式
- 熟练运用截词符(${config.operators.wildcard})来涵盖词根变化
- 对多词术语优先使用邻近运算符（如 ${config.operators.near}3）
- 所有概念的检索都必须在 ${config.fieldTitleAbsKey} 字段中进行，以保证广度
- 描述研究现象时，必须使用具体的、可操作的过程性词汇，避免使用"影响"、"作用"、"机制"等抽象词

## 3. 组合检索与策略分析
请分别提供以下几种类型的完整${config.name}检索式。

**重要：严禁使用占位符，必须使用完整的语义群和重建的关系条件完整填充，提供一个完整、可直接复制到${config.name}高级检索框使用的最终检索式字符串！**

### A AND B AND C (核心组合)
用于最高精度的检索。

### A AND B (扩展组合1)
放宽一个概念限制。

### A AND C (扩展组合2)
放宽另一个概念限制。

### B AND C (扩展组合3)
放宽第三个概念限制。

对于每一种组合检索式，请附上一段清晰的分析：
- **检索领域代表**：这个检索式主要覆盖了哪个具体的研究方向？
- **使用场景**：应该在什么情况下使用这个检索式？（例如，核心文献过少时，或需要撰写引言背景时）
- **预期结果分析**：它可能会检索到哪一类论文？
- **对综述的价值**：这些结果对文献综述的哪个部分（如引言、主体、讨论）有何具体帮助？

## 4. 精确化策略
最后，请提出一个使用 ${config.operators.not} ${config.fieldTitle} 来过滤无关文献的建议。
- 请举例说明在什么情况下可以使用它
- 提供一个带有 ${config.operators.not} ${config.fieldTitle} 的优化版检索式

---

## 输出格式要求

请严格按照以下格式输出：

【概念分解】
- 概念A：xxx（说明）
- 概念B：xxx（说明）
- 概念C：xxx（说明）

【语义群构建】

**概念A语义群**
- 核心词：xxx
- 同义词：xxx, xxx
- 缩写：xxx
- 子类型：xxx

**概念B语义群**
- 核心词：xxx
- 同义词：xxx, xxx
- 缩写：xxx

**概念C语义群**
- 核心词：xxx
- 同义词：xxx, xxx
- 现象描述词：xxx

【组合检索策略】

**策略一：核心组合 (A AND B AND C)**
\`\`\`
${config.fieldTitleAbsKey}((xxx OR xxx OR xxx)) ${config.operators.and} ${config.fieldTitleAbsKey}((yyy OR yyy)) ${config.operators.and} ${config.fieldTitleAbsKey}((zzz OR zzz))
\`\`\`
- 检索领域代表：xxx
- 使用场景：xxx
- 预期结果：xxx
- 综述价值：xxx

**策略二：扩展组合1 (A AND B)**
\`\`\`
（完整检索式）
\`\`\`
- 分析：xxx

**策略三：扩展组合2 (A AND C)**
\`\`\`
（完整检索式）
\`\`\`
- 分析：xxx

**策略四：扩展组合3 (B AND C)**
\`\`\`
（完整检索式）
\`\`\`
- 分析：xxx

【精确化策略】
- 过滤建议：xxx
- 优化检索式：
\`\`\`
（带排除词的完整检索式）
\`\`\`

请确保所有最终提供的检索式都可以直接复制并粘贴到${config.name}高级检索框中有效运行。`;
}

// 矩阵式检索策略生成 - 扩展版提示词
function generateExtendedMatrixPrompt(keyword: string, database: string): string {
  const config = DATABASE_CONFIG[database] || DATABASE_CONFIG.scopus;

  return `## 任务：为我的研究主题设计一个矩阵式文献检索行动计划

## 预期产出
一个包含4条检索路径的完整行动计划，每条路径都提供可直接在${config.name}中使用的检索式，总体覆盖该研究主题的全部相关文献。

---

## 一、研究主题
我的综述选题是：${keyword}

## 二、核心原则

### 实体原则
检索式应围绕主题中最核心的名词实体构建。
- **识别标准**：选择无法进一步拆分的具体事物、概念或现象
- **描述性的、功能性的词汇应被分解**：其内涵用于定义核心实体之间的关系（如使用邻近算符 ${config.operators.near}N）或转化为具体的现象词
- **避免选择**：形容词性描述或动作性词汇作为核心实体

### 具体性原则
描述研究现象时，必须使用具体的、可操作的过程性词汇，避免使用"影响"、"作用"、"机制"等抽象词。

### 无限制原则
检索式中不得包含年份、文献类型等限制条件。

---

## 三、行动计划生成流程

请严格遵循以下四步，为我生成一个结构清晰、内容完整的行动计划。

### 第一步：解构与角色分配

**识别核心实体**：从我的主题中，识别出最核心的、不可再分的物理或概念实体（通常是名词）。

**分配角色**：将这些核心实体分配到以下角色中，并简要说明理由。

角色分配判断标准：
| 角色 | 定义 | 判断问题 |
|------|------|----------|
| **角色B (核心主体)** | 被研究的对象 | "什么被研究了？" |
| **角色A (背景/环境)** | 研究发生的条件或场景 | "在什么条件下研究？" |
| **角色C (具体现象)** | 被研究的具体过程或行为 | "观察到了什么具体变化或过程？" |

### 第二步：构建语义群

为角色A、B、C的每个核心实体，构建全面的同义词、缩写、相关术语、具体子类型列表。

语义群构建策略：
- **同义词**：使用权威词典或领域术语库
- **缩写**：包含常见缩写简称
- **上下位词**：适当包含更具体的子类型
- **截词符使用**：合理使用${config.operators.wildcard}和${config.operators.truncation}通配符扩展词根

### 第三步：生成矩阵式行动计划

基于以上分析，生成一个包含四个阶段的矩阵式行动计划。

**对于每一条路径，都必须提供**：
1. **检索目标**：清晰说明该路径要达成的目的
2. **战略意图**：解释这条路径为何必要，它能找到哪一类文献
3. **完整检索式**：严禁使用占位符，必须使用第二步的完整语义群和重建的关系条件完整填充，提供一个完整、可直接复制到${config.name}高级检索框使用的最终检索式字符串
   - 语义群内部用 ${config.operators.or} 连接
   - 语义群之间用 ${config.operators.and} 连接
   - 使用 ${config.fieldTitleAbsKey} 在标题、摘要、关键词中进行检索
   - 请检查生成检索式的符号及嵌套结构，以避免语法错误导致无法检索
4. **行动指南**：指导我何时以及如何使用这条路径

**行动计划的固定结构**：

| 阶段 | 组合 | 路径 |
|------|------|------|
| 阶段一 | 核心组合 | 路径1: A+B+C |
| 阶段二 | 扩展组合1 | 路径2: B+A |
| 阶段三 | 扩展组合2 | 路径3: B+C |
| 阶段四 | 扩展组合3 | 路径4: A+C |

### 第四步：质量检验

对生成的检索计划进行全面验证：
- [ ] **语义群完整性**：每一步的检索式中涉及的语义群必须是第二步中构建的完整语义群
- [ ] **语法检查**：验证括号配对、布尔运算符正确性、${config.fieldTitleAbsKey}语法准确性
- [ ] **可用性检查**：确认检索式可直接在${config.name}中执行，无需额外修改

---

## 四、输出格式要求

请按照上述流程，为我的研究主题生成一个完整的矩阵式文献检索行动计划。

### 【第一步：解构与角色分配】

**核心实体识别**
- 实体1：xxx
- 实体2：xxx
- 实体3：xxx

**角色分配**
| 角色 | 实体 | 分配理由 |
|------|------|----------|
| 角色B (核心主体) | xxx | xxx |
| 角色A (背景/环境) | xxx | xxx |
| 角色C (具体现象) | xxx | xxx |

### 【第二步：语义群构建】

**角色B (核心主体) 语义群**
- 核心词：xxx
- 同义词：xxx, xxx, xxx
- 缩写：xxx
- 子类型：xxx

**角色A (背景/环境) 语义群**
- 核心词：xxx
- 同义词：xxx, xxx
- 缩写：xxx

**角色C (具体现象) 语义群**
- 核心词：xxx
- 同义词：xxx, xxx
- 现象描述词：xxx, xxx

### 【第三步：矩阵式行动计划】

---

**阶段一：核心组合 (路径1: A+B+C)**

📌 **检索目标**：xxx

🎯 **战略意图**：xxx

📝 **完整检索式**：
\`\`\`
${config.fieldTitleAbsKey}((A的完整语义群)) ${config.operators.and} ${config.fieldTitleAbsKey}((B的完整语义群)) ${config.operators.and} ${config.fieldTitleAbsKey}((C的完整语义群))
\`\`\`

💡 **行动指南**：xxx

---

**阶段二：扩展组合1 (路径2: B+A)**

📌 **检索目标**：xxx

🎯 **战略意图**：xxx

📝 **完整检索式**：
\`\`\`
（完整检索式，使用第二步的完整语义群）
\`\`\`

💡 **行动指南**：xxx

---

**阶段三：扩展组合2 (路径3: B+C)**

📌 **检索目标**：xxx

🎯 **战略意图**：xxx

📝 **完整检索式**：
\`\`\`
（完整检索式，使用第二步的完整语义群）
\`\`\`

💡 **行动指南**：xxx

---

**阶段四：扩展组合3 (路径4: A+C)**

📌 **检索目标**：xxx

🎯 **战略意图**：xxx

📝 **完整检索式**：
\`\`\`
（完整检索式，使用第二步的完整语义群）
\`\`\`

💡 **行动指南**：xxx

---

### 【第四步：质量检验】

- [x] 语义群完整性：已验证所有检索式使用完整的语义群
- [x] 语法检查：括号配对正确，布尔运算符正确
- [x] 可用性检查：检索式可直接复制使用

**检验结论**：xxx`;
}

// 迭代优化提示词
function generateOptimizationPrompt(
  originalQuery: string,
  falsePositiveTitles: string,
  database: string
): string {
  const config = DATABASE_CONFIG[database] || DATABASE_CONFIG.scopus;

  return `我正在使用以下检索式在${config.name}中进行文献检索，但发现了一些不相关的文献被误检出来。

【原始检索式】
\`\`\`
${originalQuery}
\`\`\`

【误检文献标题】
${falsePositiveTitles.split('\n').filter(t => t.trim()).map((title, i) => `${i + 1}. ${title.trim()}`).join('\n')}

请分析这些误检文献的共性特征，并生成优化后的检索策略。

---

## 分析任务

### 1. 误检文献共性分析
请分析上述误检文献标题中的共同特征：
- 是否存在共同的关键词/主题？
- 是否属于某个特定但不相关的子领域？
- 是否有共同的文献类型（如综述、会议摘要等）？
- 是否有时间或地域特征？

### 2. 检索策略优化建议
基于分析结果，提出以下优化方案：
- 需要增加的排除词
- 需要修改的检索逻辑
- 是否需要调整字段限定

### 3. 优化后检索式
生成改进后的检索式，提供多个版本供选择

---

## 输出格式

【误检文献共性分析】

**共同关键词**
| 关键词 | 出现次数 | 判断 |
|--------|----------|------|
| xxx | x/x | 相关/不相关 |
| xxx | x/x | 相关/不相关 |

**不相关主题**
- 识别出的不相关主题：xxx
- 原因分析：xxx

**文献类型**
- 误检文献类型：xxx

---

【优化建议】

**新增排除词**
| 排除词 | 排除原因 | 预期效果 |
|--------|----------|----------|
| xxx | xxx | 减少约xx篇误检 |
| xxx | xxx | 减少约xx篇误检 |

**检索逻辑调整**
- 建议修改：xxx

---

【优化后检索式】

**版本1：保守优化**（仅排除最明显的干扰）
\`\`\`
${originalQuery} ${config.operators.not} ${config.fieldTitle}("排除词")
\`\`\`
- 适用场景：xxx
- 预期效果：xxx

**版本2：激进优化**（排除所有识别出的干扰）
\`\`\`
${originalQuery} ${config.operators.not} ${config.fieldTitle}("排除词1" ${config.operators.or} "排除词2" ${config.operators.or} "排除词3")
\`\`\`
- 适用场景：xxx
- 预期效果：xxx

**版本3：平衡优化**（推荐）
\`\`\`
（平衡查全率与查准率的最优检索式）
\`\`\`
- 适用场景：xxx
- 预期效果：xxx

---

【预期效果对比】
| 指标 | 优化前 | 保守优化 | 激进优化 | 平衡优化 |
|------|--------|----------|----------|----------|
| 预估误检率 | xx% | xx% | xx% | xx% |
| 预估文献量 | xxx篇 | xxx篇 | xxx篇 | xxx篇 |

---

【下一步建议】
- 如效果仍不理想，可继续迭代优化
- 建议记录每次优化的效果变化
- 注意平衡查全率与查准率`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyword, database, model, type, originalQuery, falsePositiveTitles, promptVersion } = body;

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
      
      // 根据版本选择提示词
      const version = promptVersion || 'stable';
      if (version === 'extended') {
        prompt = generateExtendedMatrixPrompt(keyword, database);
      } else {
        prompt = generateStableMatrixPrompt(keyword, database);
      }
      
      systemPrompt = `你是一位资深的文献检索专家，擅长构建系统性的矩阵式检索策略。

你的核心能力：
1. 精准识别研究主题中的核心实体概念
2. 构建全面、准确的语义群（同义词、缩写、子类型）
3. 设计多层次的组合检索策略
4. 生成可直接使用的完整检索式

【关键要求】
1. **严禁使用占位符**：所有检索式必须是完整的、可直接复制使用的
2. **语义群完整性**：每个检索式必须使用完整构建的语义群
3. **语法正确性**：确保括号配对、布尔运算符正确
4. **具体性原则**：使用具体的过程性词汇，避免抽象词如"影响"、"机制"

【检索式格式规范】
- 语义群内部用 OR 连接
- 语义群之间用 AND 连接
- 使用 TITLE-ABS-KEY 字段进行检索
- 对于多词术语使用邻近运算符 W/N
- 合理使用截词符 * 扩展词根

请确保生成的检索式可以直接复制到数据库高级检索框中执行。`;
    } else if (type === 'iterative-optimization') {
      // 迭代优化
      if (!originalQuery || !falsePositiveTitles) {
        return NextResponse.json({ error: '请提供原始检索式和误检文献标题' }, { status: 400 });
      }
      prompt = generateOptimizationPrompt(originalQuery, falsePositiveTitles, database);
      systemPrompt = `你是一位资深的文献检索专家，擅长分析和优化检索策略。

你的核心能力：
1. 精准分析误检文献的共性特征
2. 识别不相关的主题和关键词
3. 提供多种优化版本的检索式
4. 预估优化效果并给出专业建议

【分析要点】
1. **共性识别**：从误检文献标题中找出共同的关键词、主题、文献类型
2. **排除策略**：合理设置排除词，避免过度排除导致漏检
3. **版本对比**：提供保守、激进、平衡三种优化版本
4. **效果预估**：预估每种方案的误检率和文献量变化

【优化原则】
- 保持查全率的同时提高查准率
- 避免过度排除导致遗漏相关文献
- 提供可操作的优化建议

请确保优化后的检索式符合数据库语法规范，可直接使用。`;
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
      temperature: 0.2, // 降低温度以提高输出稳定性
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
