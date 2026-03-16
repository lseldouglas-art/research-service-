import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

// 默认分析提示词
const DEFAULT_ANALYSIS_PROMPT = `## 核心任务

对提供的文献批次进行深度分析，提取每篇文献的核心论点和研究贡献。

## 分析要求

1. **逐一分析**：对每篇文献进行独立审查，确保不遗漏
2. **论点提取**：识别文献的核心论点、研究方法和主要发现
3. **关联性标注**：说明文献如何支撑特定研究主题
4. **质量评估**：评估论据的可信度和创新性

## 输出格式

为每篇文献生成：

### 文献 [编号]
- **标题**：[文献标题]
- **核心论点**：[一句话概括主要论点]
- **研究方法**：[研究方法类型]
- **主要发现**：[关键发现摘要]
- **可支撑的写作论点**：[列出可用于写作的论点]
- **论据质量**：[高/中/低]

---

## 待分析文献

`;

function getSystemPrompt(): string {
  return `你是一位资深的学术文献分析专家，擅长从大量文献中提取核心论点和研究贡献。

你的核心能力：
1. 精准识别文献的核心论点和创新点
2. 提取可用于学术写作的关键论据
3. 评估研究方法的可靠性和创新性
4. 建立文献与写作主题的逻辑关联

分析原则：
- 客观准确，不臆造文献内容
- 突出创新点和关键发现
- 标注论据的可信度
- 避免过度解读

请按照指定格式输出分析结果。`;
}

interface Paper {
  id: string;
  title: string;
  author: string;
  year: string;
  relevance: string;
  abstract: string;
  zoteroId: string;
  directSection: string;
  contribution: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { batchPapers, prompt, model, batchIndex, totalBatches } = body;

    if (!batchPapers || !Array.isArray(batchPapers)) {
      return NextResponse.json({ error: '请提供文献批次数据' }, { status: 400 });
    }

    if (!model) {
      return NextResponse.json({ error: '请选择AI模型' }, { status: 400 });
    }

    // 构建分析提示词
    const analysisPrompt = prompt || DEFAULT_ANALYSIS_PROMPT;
    
    // 格式化文献列表
    const paperList = batchPapers.map((paper: Paper, index: number) => {
      return `
### 文献 ${paper.id || index + 1}
- **标题**：${paper.title || '未知'}
- **作者**：${paper.author || '未知'}
- **年份**：${paper.year || '未知'}
- **相关度**：${paper.relevance || '未评级'}
- **Zotero标识**：${paper.zoteroId || '无'}
- **相关章节**：${paper.directSection || '未指定'}
- **摘要**：${paper.abstract || '无摘要'}
- **核心贡献**：${paper.contribution || '未标注'}
`;
    }).join('\n');

    const fullPrompt = `${analysisPrompt}

**当前批次**：第 ${batchIndex + 1} 批次，共 ${totalBatches} 批次
**文献数量**：${batchPapers.length} 篇

---

${paperList}`;

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
    console.error('Error in batch analysis:', error);
    return NextResponse.json(
      { error: '分析过程中出错，请稍后重试' },
      { status: 500 }
    );
  }
}
