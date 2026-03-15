import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';
import * as XLSX from 'xlsx';
import * as mammoth from 'mammoth';

// 文献数据接口
interface Literature {
  title: string;
  authors?: string;
  abstract?: string;
  year?: string;
  journal?: string;
}

// AI模型配置
const AI_MODELS = {
  'doubao-seed-1-8-251228': {
    name: '豆包 Seed 1.8',
    description: '多模态Agent优化模型，通用能力强',
    provider: '字节跳动',
    recommended: true,
  },
  'deepseek-v3-2-251201': {
    name: 'DeepSeek V3.2',
    description: '高级推理模型，适合复杂分析',
    provider: 'DeepSeek',
    recommended: true,
  },
  'deepseek-r1-250528': {
    name: 'DeepSeek R1',
    description: '研究分析专用模型',
    provider: 'DeepSeek',
    recommended: true,
  },
  'kimi-k2-5-260127': {
    name: 'Kimi K2.5',
    description: '智能模型，适合多任务',
    provider: '月之暗面',
    recommended: false,
  },
  'glm-4-7-251222': {
    name: 'GLM-4-7',
    description: '通用大模型',
    provider: '智谱AI',
    recommended: false,
  },
  'doubao-seed-1-6-thinking-250715': {
    name: '豆包 Thinking',
    description: '深度思考模型，适合复杂推理',
    provider: '字节跳动',
    recommended: false,
  },
};

// 分析步骤配置
const ANALYSIS_STEPS = {
  'field-overview': {
    id: 'field-overview',
    name: '领域发展现状分析',
    description: '分析当前领域的发展现状、主要问题和新手需要了解的信息',
    icon: 'BarChart3',
    promptTemplate: (literatures: Literature[], field: string) => 
`我有一批关于"${field}"领域的学术文献数据，请根据这些内容分析该领域的发展现状。

文献数据如下：
${literatures.map((l, i) => `
【文献${i + 1}】
标题：${l.title}
作者：${l.authors || '未知'}
年份：${l.year || '未知'}
期刊：${l.journal || '未知'}
摘要：${l.abstract || '无'}
`).join('\n')}

请从以下角度进行分析：
1. **领域发展现状**：当前研究的主要方向和进展
2. **主要问题与挑战**：该领域面临的关键问题
3. **研究热点**：近期关注的研究主题
4. **新手入门建议**：一个新入门的科研工作者需要了解的核心信息

请用清晰的标题和段落组织你的分析，便于阅读和理解。`,
  },
  'trend-analysis': {
    id: 'trend-analysis',
    name: '研究趋势与选题策略',
    description: '从时间趋势、主题演变、成功选题特征等角度发现有价值模式',
    icon: 'TrendingUp',
    promptTemplate: (literatures: Literature[], field: string) => 
`我有"${field}"领域的学术文献数据，包含标题、年份和期刊信息。请帮我分析这个领域的研究趋势和选题策略。

文献数据如下：
${literatures.map((l, i) => `
【文献${i + 1}】
标题：${l.title}
年份：${l.year || '未知'}
期刊：${l.journal || '未知'}
`).join('\n')}

请从以下角度进行深入分析：
1. **时间趋势分析**：
   - 近年来的研究数量变化
   - 不同时期的研究重点演变
   
2. **主题演变**：
   - 主要研究主题的变迁
   - 新兴研究方向的出现

3. **成功选题特征**：
   - 高影响力论文的选题特点
   - 期刊偏好的主题类型

4. **选题策略建议**：
   - 基于趋势分析的未来方向预测
   - 值得关注的研究空白

请用数据支撑你的分析，并提供具体可行的建议。`,
  },
  'gap-discovery': {
    id: 'gap-discovery',
    name: '综述空白点发现',
    description: '从已有综述分布情况发现可填补的研究空白',
    icon: 'Lightbulb',
    promptTemplate: (literatures: Literature[], field: string) => 
`假设你是"${field}"领域的研究者，看到以下已有学术文献的分布情况，请思考可以撰写什么样的综述来填补空白或提供新的价值。

文献数据如下：
${literatures.map((l, i) => `
【文献${i + 1}】
标题：${l.title}
年份：${l.year || '未知'}
期刊：${l.journal || '未知'}
${l.abstract ? `摘要：${l.abstract}` : ''}
`).join('\n')}

请从以下角度自由思考：
1. **空白领域识别**：
   - 哪些细分方向尚未被系统综述？
   - 哪些新兴主题需要总结？
   - 哪些交叉领域缺乏整合？

2. **创新切入点**：
   - 可以从什么新角度重新审视已有研究？
   - 有什么方法可以整合分散的研究线索？
   - 什么主题可以做跨学科整合？

3. **综述价值分析**：
   - 不同选题的学术价值和影响力预估
   - 对领域发展的潜在贡献

4. **具体综述建议**：
   - 3-5个具体的综述方向建议
   - 每个方向的创新点和价值

请充分发挥你的想象力，给出具有启发性的建议。`,
  },
  'specific-recommendations': {
    id: 'specific-recommendations',
    name: '具体选题推荐',
    description: '从可行性、创新度、文献量角度推荐具体综述方向',
    icon: 'Target',
    promptTemplate: (literatures: Literature[], field: string) => 
`假设你是一名研究生，导师要求你为"${field}"领域写一篇文献综述。看到以下已有学术文献的分布情况，请推荐具体的综述方向。

文献数据如下：
${literatures.map((l, i) => `
【文献${i + 1}】
标题：${l.title}
年份：${l.year || '未知'}
期刊：${l.journal || '未知'}
${l.abstract ? `摘要：${l.abstract}` : ''}
`).join('\n')}

请从以下三个维度考虑：
1. **可行性**：3个月内能够完成文献调研和写作的方向
2. **创新度**：在现有综述基础上有一定新意，但不需要颠覆性突破
3. **文献量**：有足够文献支撑（50-100篇核心文献），但不会过于庞杂

请推荐3-5个具体的综述方向，每个方向包括：
1. **具体标题建议**：清晰、专业、有吸引力的标题
2. **选题理由**：为什么这个角度还没被充分综述
3. **文献组织思路**：大概的章节框架和内容组织
4. **工作量预估**：预估的文献数量和写作难度
5. **创新点**：该综述的独特贡献

请确保推荐的选题具有可操作性，适合研究生在较短时间内完成。`,
  },
};

// 解析Excel文件
async function parseExcel(buffer: ArrayBuffer): Promise<Literature[]> {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet) as Record<string, string>[];

  return data.map((row) => ({
    title: row['title'] || row['标题'] || row['Title'] || '',
    authors: row['authors'] || row['作者'] || row['Authors'] || row['author'] || '',
    abstract: row['abstract'] || row['摘要'] || row['Abstract'] || '',
    year: row['year'] || row['年份'] || row['Year'] || row['发表年'] || '',
    journal: row['journal'] || row['期刊'] || row['Journal'] || row['发表期刊'] || '',
  })).filter((l) => l.title); // 过滤掉没有标题的行
}

// 解析Word文件
async function parseWord(buffer: ArrayBuffer): Promise<Literature[]> {
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  const text = result.value;
  
  // 尝试解析Word中的文献信息
  // 假设格式：每篇文献以某种分隔符分开
  const literatures: Literature[] = [];
  
  // 尝试按常见格式解析
  // 格式1：按空行分隔
  const blocks = text.split(/\n\s*\n/).filter((b) => b.trim());
  
  for (const block of blocks) {
    const lines = block.split('\n').filter((l) => l.trim());
    if (lines.length < 2) continue;
    
    const literature: Literature = {
      title: '',
      authors: '',
      abstract: '',
      year: '',
      journal: '',
    };
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      // 尝试识别标题（通常是第一行或者以"标题："开头的行）
      if (line.match(/^(标题|Title)[：:]/i)) {
        literature.title = line.replace(/^(标题|Title)[：:]\s*/i, '').trim();
      } else if (line.match(/^(作者|Authors?)[：:]/i)) {
        literature.authors = line.replace(/^(作者|Authors?)[：:]\s*/i, '').trim();
      } else if (line.match(/^(摘要|Abstract)[：:]/i)) {
        literature.abstract = line.replace(/^(摘要|Abstract)[：:]\s*/i, '').trim();
      } else if (line.match(/^(年份|Year|发表年)[：:]/i)) {
        literature.year = line.replace(/^(年份|Year|发表年)[：:]\s*/i, '').trim();
      } else if (line.match(/^(期刊|Journal|发表期刊)[：:]/i)) {
        literature.journal = line.replace(/^(期刊|Journal|发表期刊)[：:]\s*/i, '').trim();
      } else if (!literature.title && line.length > 10) {
        // 如果没有识别到任何字段，第一行较长的作为标题
        literature.title = line.trim();
      }
    }
    
    if (literature.title) {
      literatures.push(literature);
    }
  }
  
  return literatures;
}

// GET方法 - 返回配置
export async function GET() {
  return NextResponse.json({
    models: Object.entries(AI_MODELS).map(([key, value]) => ({
      id: key,
      name: value.name,
      description: value.description,
      provider: value.provider,
      recommended: value.recommended,
    })),
    analysisSteps: Object.entries(ANALYSIS_STEPS).map(([key, value]) => ({
      id: key,
      name: value.name,
      description: value.description,
      icon: value.icon,
    })),
  });
}

// POST方法 - 处理文件上传和分析
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const field = formData.get('field') as string;
    const step = formData.get('step') as string;
    const model = formData.get('model') as string || 'doubao-seed-1-8-251228';

    if (!file) {
      return NextResponse.json({ error: '请上传文件' }, { status: 400 });
    }

    if (!field) {
      return NextResponse.json({ error: '请输入研究领域' }, { status: 400 });
    }

    if (!step) {
      return NextResponse.json({ error: '请选择分析步骤' }, { status: 400 });
    }

    // 读取文件内容
    const buffer = await file.arrayBuffer();
    const fileName = file.name.toLowerCase();

    // 根据文件类型解析
    let literatures: Literature[] = [];
    
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      literatures = await parseExcel(buffer);
    } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      literatures = await parseWord(buffer);
    } else {
      return NextResponse.json({ error: '不支持的文件格式，请上传Excel或Word文件' }, { status: 400 });
    }

    if (literatures.length === 0) {
      return NextResponse.json({ error: '未能从文件中解析出文献信息，请检查文件格式' }, { status: 400 });
    }

    // 获取分析步骤配置
    const stepConfig = ANALYSIS_STEPS[step as keyof typeof ANALYSIS_STEPS];
    if (!stepConfig) {
      return NextResponse.json({ error: '无效的分析步骤' }, { status: 400 });
    }

    // 生成提示词
    const prompt = stepConfig.promptTemplate(literatures, field);

    // 初始化LLM客户端
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    // 系统提示词
    const systemPrompt = `你是一位资深的学术研究顾问和文献分析专家，擅长从学术文献中发现研究趋势、识别研究空白、提供选题建议。

你的分析应该：
1. 基于数据：你的结论应该建立在提供的文献数据之上
2. 有洞察力：发现数据背后的模式和趋势
3. 可操作：提供的建议应该具体、可行
4. 专业性：使用专业的学术语言，但保持清晰易懂

注意：
- 如果文献数据较少，请说明分析的局限性
- 关注不同文献之间的关联和差异
- 提供的分析应该帮助研究者做出更好的选题决策`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: prompt },
    ];

    // 使用流式输出
    const stream = client.stream(messages, {
      model,
      temperature: 0.5,
    });

    // 创建可读流用于SSE
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          // 先发送文献数量信息
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'meta',
            literatureCount: literatures.length,
            step: stepConfig.name,
          })}\n\n`));
          
          for await (const chunk of stream) {
            if (chunk.content) {
              const text = chunk.content.toString();
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                type: 'content',
                content: text 
              })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
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
    console.error('Error in topic analysis:', error);
    return NextResponse.json(
      { error: '分析过程中出错，请稍后重试' },
      { status: 500 }
    );
  }
}
