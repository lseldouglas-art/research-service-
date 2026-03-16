import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

// 聚类大纲生成提示词
const CLUSTERING_PROMPT = `## 核心任务

基于提供的文献分析结果，进行论点聚类并生成段落级写作大纲。

## 聚类原则

1. **机制相似性**：将研究机制相似的论点归为一类
2. **逻辑连贯性**：确保聚类后的论点能够形成逻辑链条
3. **层次分明**：建立主论点和支撑论点的层次结构
4. **文献支撑**：每个论点都需要有对应的文献支撑

## 大纲生成要求

1. **结构化输出**：生成具有明确层级的大纲
2. **论点标注**：每个段落标注核心论点
3. **文献映射**：列出支撑每个段落的文献
4. **逻辑说明**：说明段落之间的逻辑关系

## 输出格式

### 一级主题：[主题名称]

#### 1.1 [子主题]
**核心论点**：[论点陈述]
**支撑文献**：[文献编号列表]
**写作要点**：
- 要点1
- 要点2
**段落逻辑**：[说明本段如何承上启下]

#### 1.2 [子主题]
...

### 二级主题：[主题名称]
...

---

## 论点聚类统计

| 聚类主题 | 论点数量 | 支撑文献数 |
|---------|---------|-----------|
| ... | ... | ... |

---

## 待整合分析结果

`;

function getSystemPrompt(): string {
  return `你是一位资深的学术写作专家，擅长整合大量文献分析结果并生成结构化的写作大纲。

你的核心能力：
1. 识别论点之间的内在联系和相似性
2. 建立逻辑严密的论证结构
3. 生成可操作的段落级写作指导
4. 确保每个论点都有充分的文献支撑

聚类原则：
- 基于研究机制而非表面相似性进行聚类
- 同一类别的论点应具有内在逻辑关联
- 不同类别之间应形成清晰的论证链条
- 避免论点重复或遗漏

大纲生成原则：
- 每个段落聚焦一个核心论点
- 段落长度适中，避免过长或过短
- 明确标注支撑文献
- 说明段落间的逻辑关系

请按照指定格式输出聚类大纲。`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { analysisResults, model } = body;

    if (!analysisResults) {
      return NextResponse.json({ error: '请提供分析结果' }, { status: 400 });
    }

    if (!model) {
      return NextResponse.json({ error: '请选择AI模型' }, { status: 400 });
    }

    // 构建完整提示词
    const fullPrompt = `${CLUSTERING_PROMPT}

${analysisResults}

---

请基于以上分析结果，进行论点聚类并生成段落级写作大纲。`;

    // 初始化LLM客户端
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    const messages = [
      { role: 'system' as const, content: getSystemPrompt() },
      { role: 'user' as const, content: fullPrompt },
    ];

    // 使用流式输出
    const stream = client.stream(messages, {
      model: model,
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
    console.error('Error in clustering outline generation:', error);
    return NextResponse.json(
      { error: '生成过程中出错，请稍后重试' },
      { status: 500 }
    );
  }
}
