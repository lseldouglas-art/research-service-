import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

// 段落撰写提示词
const PARAGRAPH_WRITING_PROMPT = `## 任务：学术综述单一段落精细撰写

你将扮演一名为顶级期刊撰稿的世界顶级综述作者。你正在执行一项高度聚焦的任务：将一组特定的文献证据，围绕一个单一的核心论点，编织成一个有深度、有批判性、且逻辑流畅的学术段落。你的目标是实现信息的高密度整合，而非简单罗列。

---

## 核心执行指令：论证编织指令

在动笔之前，你必须将以下三条作为最高行为准则。任何违反这些的输出都是不可接受的。

### 1. 绝对忠于原文
你的任务是转述和整合，而非推理和创作。严禁引入任何未在所提供的文献摘要中明确提及的具体机制或专业术语。如果文献只提到"A"，你绝不能擅自补充为"A+B+C"，除非文献摘要里明确写了这句话。

### 2. 拥抱复杂性，拒绝过度简化
科学文献充满了细微差别和矛盾。当不同文献提供有差异或看似矛盾的证据时，你的首要任务是如实地呈现这种复杂性或争议，而不是为了叙事流畅而忽略其中一方。

使用诸如 "While X is a primary driver [REF-A], Y also plays a significant role [REF-B]..." 这样的句式来准确反映文献间的对话。严禁为了构建简单的因果链而无视或压制矛盾的证据。

### 3. 量化声明必须直接溯源
所有具体的数值、百分比、削减率或比较性数据必须直接来源于文献中的某一句话，并紧随其后进行引用。禁止对数据进行二次计算或创造新的量化总结。

---

## 写作要求

### 开篇：以"论点"引领
你的段落必须直接以一个完整的、具有分析性的学术句子开始。这个开篇句就是本段的核心论点。紧接着用1-2句话来简要阐明其背景或重要性。

### 中段：实现"多对多"的批判性整合
严禁按照"论文A说...论文B说..."的模式逐一介绍。你必须根据内在逻辑关系（如：方法的演进、理论的对立、结论的互补），将多篇文献有机地融合进论述中。

融合策略：
- **共性提炼**：将一组研究的共同发现作为讨论的起点
- **证据呈现**：流畅地引述核心发现与关键数据
- **意义阐释与批判性分析**：深入分析发现的科学意义，引入补充、修正或对立观点

### 将"优势-代价"论证融入叙事
对于每一个显著优势或关键发现，必须将其内在的代价、局限性或未决问题作为故事的一部分进行讲述。使用"然而/但是/尽管如此/其代价是"等转折词，将局限性作为论证的有机组成部分。

### 结尾：段落收尾与篇幅控制
- **高密度写作**：严格控制段落篇幅，每一句话都应必要
- **结尾聚焦**：精炼地重申或升华本段的核心论点，确保论证闭环

---

## 引用格式

在文内提及某项研究时，应自然地按照相关规范引出作者。在包含该文献关键信息（论点、数据、结论）的句子或从句的末尾，必须附上对应的索引标签，即 [REF-XX] 格式。

---

## 本次需要撰写的段落主题

`;

function getSystemPrompt(): string {
  return `你是一位世界顶级的学术综述作者，为Nature、Science等顶级期刊撰稿。你的写作风格专业、精炼、逻辑严密。

你的核心能力：
1. 精准转述和整合文献证据，绝不臆造
2. 如实呈现科学研究的复杂性和争议
3. 实现高密度的信息整合，而非简单罗列
4. 使用复杂的从句和连接词构建严密的论证

写作原则：
- 绝对忠于原文，不引入文献未提及的信息
- 拥抱复杂性，如实呈现矛盾证据
- 量化声明必须直接溯源
- 以论点引领开篇
- 多对多的批判性整合
- 将优势-代价论证融入叙事

请严格按照要求撰写高质量的学术段落。`;
}

interface ParagraphTopic {
  section: string;
  title: string;
  coreClaim: string;
  supportingMaterials: string[];
  logic: string;
}

interface Literature {
  id: string;
  title: string;
  author: string;
  year: string;
  abstract: string;
  contribution: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paragraphTopic, literatureList, model } = body;

    if (!paragraphTopic) {
      return NextResponse.json({ error: '请提供段落主题' }, { status: 400 });
    }

    if (!literatureList || !Array.isArray(literatureList)) {
      return NextResponse.json({ error: '请提供文献列表' }, { status: 400 });
    }

    if (!model) {
      return NextResponse.json({ error: '请选择AI模型' }, { status: 400 });
    }

    const topic = paragraphTopic as ParagraphTopic;
    const papers = literatureList as Literature[];

    // 构建文献库内容
    const literatureContent = papers.map((paper, index) => {
      return `
### [REF-${paper.id || index + 1}]
- **标题**: ${paper.title || '未知'}
- **作者**: ${paper.author || '未知'}
- **年份**: ${paper.year || '未知'}
- **摘要**: ${paper.abstract || '无摘要'}
- **核心贡献**: ${paper.contribution || '无'}
`;
    }).join('\n');

    // 构建段落主题内容
    const topicContent = `
### ${topic.section || ''} ${topic.title}

**支撑材料**: ${topic.supportingMaterials?.join(', ') || '未指定'}

**核心主张**: ${topic.coreClaim || '未指定'}

**段落间逻辑**: ${topic.logic || '未指定'}
`;

    // 构建完整提示词
    const fullPrompt = `${PARAGRAPH_WRITING_PROMPT}

${topicContent}

---

## 核心文献库

${literatureContent}

---

请基于以上【核心文献库】和【段落主题】，撰写一个高质量的学术段落。`;

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
    console.error('Error in paragraph writing:', error);
    return NextResponse.json(
      { error: '撰写过程中出错，请稍后重试' },
      { status: 500 }
    );
  }
}
