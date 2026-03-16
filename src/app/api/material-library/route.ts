import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

// 写作素材库生成提示词
function generateMaterialLibraryPrompt(
  outline: string,
  literatureList: string
): string {
  return `## 核心任务

请根据我提供的"论文大纲"和"论文清单"，为清单中的每一篇论文进行分类，生成一个结构化的写作素材库。

---

## 论文大纲

${outline}

---

## 论文清单

${literatureList}

---

## 输出要求

请生成一个表格，严格按照以下5列顺序和要求：

| 编号 | Zotero快速定位标识 | 最直接相关章节 | 间接相关章节 | 核心贡献与应用点 |
|------|-------------------|---------------|-------------|-----------------|
| 1 | xxx | x.x 子章节名称 | x.x 子章节名称（或"无"） | 一句话精准概括 |
| 2 | xxx | x.x 子章节名称 | x.x 子章节名称（或"无"） | 一句话精准概括 |
| ... | ... | ... | ... | ... |

### 列说明

1. **编号**：使用论文清单中的原始编号

2. **Zotero快速定位标识**：格式为"标题前2个词语 + 第一作者姓氏 + 发表年份"
   - 示例：如果标题是"Effect of Anion on Zinc Battery Performance"，作者是Zhang San，年份是2024
   - 则标识为："Effect Anion Zhang 2024"

3. **最直接相关章节**：从大纲中匹配最相关的一个子章节（精确到x.x级）
   - 格式：x.x 子章节名称
   - 必须是大纲中实际存在的章节

4. **间接相关章节**：从大纲中匹配一个可以提供参考的次要子章节
   - 格式：x.x 子章节名称
   - 如无则填"无"

5. **核心贡献与应用点**：用一句话精准概括该论文如何能用于"最直接相关章节"的写作
   - 需要具体说明该论文能提供什么论据、数据或观点支持

---

## 核心要求

1. **顺序一致性**：表格的行顺序必须与我提供的论文清单顺序完全一致

2. **分类依据**：主要依据论文摘要进行判断

3. **章节精确**：章节匹配应精确到x.x级子章节

4. **D级论文处理**：对于相关度等级为D的论文，相关章节处填"无"

5. **贡献具体化**：核心贡献与应用点必须具体、可操作，不能泛泛而谈

---

## 输出格式

请按以下格式输出完整的表格：

### 写作素材库总览

| 编号 | Zotero快速定位标识 | 最直接相关章节 | 间接相关章节 | 核心贡献与应用点 |
|------|-------------------|---------------|-------------|-----------------|

（表格内容）

---

### 章节文献分布统计

请同时输出每个章节的文献分布统计：

**第一章 引言**
- 支撑文献数量：X篇
- 文献编号：1, 3, 5...

**第二章 [章节名称]**
- 2.1 [子章节名称]：支撑文献 X篇（编号：...）
- 2.2 [子章节名称]：支撑文献 X篇（编号：...）
...

---

### 写作建议

基于文献分布情况，提供以下写作建议：

1. **重点章节**：指出文献支撑最充足的章节
2. **薄弱章节**：指出文献支撑不足、需要补充的章节
3. **跨章节文献**：指出可用于多个章节的关键文献`;
}

// 系统提示词
function getSystemPrompt(): string {
  return `你是一位资深的科研写作专家，擅长将文献与论文大纲进行精确匹配。

你的核心能力：
1. **精准匹配**：能够根据论文摘要准确判断其最适合的章节位置
2. **贡献提炼**：善于从文献中提炼出可具体应用的写作价值
3. **结构化输出**：输出格式规范、信息完整、易于使用

【匹配原则】
1. **相关性优先**：首先考虑论文与章节的主题相关性
2. **贡献明确**：明确指出论文能为该章节提供什么具体支持
3. **章节精确**：匹配到x.x级子章节，而非仅到大章节
4. **实用性导向**：输出的信息应能直接指导写作

【Zotero标识规则】
- 格式：标题前2个词语 + 第一作者姓氏 + 发表年份
- 用于在Zotero文献库中快速定位
- 示例："Anion Effect Zhang 2024"

【D级论文处理】
- 相关度等级为D的论文，与写作主题无关
- 最直接相关章节和间接相关章节均填"无"
- 但仍需保留在表格中，便于核对

请确保输出的表格格式规范、信息准确、可直接用于写作指导。`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { outline, literatureList, model } = body;

    if (!outline || !literatureList) {
      return NextResponse.json({ error: '请提供论文大纲和文献清单' }, { status: 400 });
    }

    if (!model) {
      return NextResponse.json({ error: '请选择AI模型' }, { status: 400 });
    }

    // 初始化LLM客户端
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    const prompt = generateMaterialLibraryPrompt(outline, literatureList);
    const systemPrompt = getSystemPrompt();

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: prompt },
    ];

    const selectedModel = model || 'deepseek-r1-250528';

    // 使用流式输出
    const stream = client.stream(messages, {
      model: selectedModel,
      temperature: 0.2,
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
    console.error('Error in material library generator:', error);
    return NextResponse.json(
      { error: '处理请求时出错，请稍后重试' },
      { status: 500 }
    );
  }
}
