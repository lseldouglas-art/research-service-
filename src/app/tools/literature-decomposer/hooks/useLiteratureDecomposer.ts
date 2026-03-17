import { useState, useCallback, useRef } from 'react';

// AI模型类型
interface AIModel {
  id: string;
  name: string;
  provider: string;
  recommended?: boolean;
}

// 文献项类型
interface Paper {
  id: string;
  title: string;
  author: string;
  year: string;
  relevance: string;
}

// 批次类型
interface Batch {
  index: number;
  paperCount: number;
  papers: Paper[];
}

// 分割结果类型
interface SplitResult {
  totalPapers: number;
  totalBatches: number;
  batches: Batch[];
  statistics: {
    gradeDistribution: { A: number; B: number; C: number; D: number };
    yearRange: { min: number; max: number };
  };
}

// 段落主题类型
interface ParagraphTopic {
  section: string;
  title: string;
  coreClaim: string;
  supportingMaterials: string[];
  logic: string;
}

// 专属建议类型
interface SplitRecommendations {
  quality: 'excellent' | 'good' | 'moderate' | 'needs-work';
  score: number;
  insights: string[];
  actions: string[];
  nextStepGuidance: string;
}

interface AnalysisRecommendations {
  positioning: string;
  commonIssues: string[];
  optimizationGuide: string[];
  materialPreparation: string[];
}

interface ClusterRecommendations {
  optimizationLevels: Array<{ level: string; focus: string; method: string }>;
  materialManagement: string[];
  iterationGuide: string[];
  whenToReadFullText: string[];
}

interface WritingRecommendations {
  corePrinciples: Array<{ principle: string; description: string }>;
  writingTechniques: string[];
  qualityChecklist: string[];
  iterationStrategy: string[];
}

// 流式读取辅助函数
async function readStream(
  response: Response,
  onChunk: (content: string) => void,
  onComplete?: (fullContent: string) => void
): Promise<string> {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  
  if (!reader) {
    throw new Error('无法读取响应流');
  }

  let fullResult = '';
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.content) {
            fullResult += data.content;
            onChunk(fullResult);
          }
        } catch {
          // 忽略解析错误
        }
      }
    }
  }

  onComplete?.(fullResult);
  return fullResult;
}

export function useLiteratureDecomposer() {
  // 步骤状态
  const [currentStep, setCurrentStep] = useState<
    'literature-split' | 'batch-analysis' | 'clustering-outline' | 'paragraph-writing'
  >('literature-split');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // AI模型
  const [models, setModels] = useState<AIModel[]>([]);
  const [selectedModel, setSelectedModel] = useState('deepseek-r1-250528');

  // 第一步：文献分割
  const [literatureFile, setLiteratureFile] = useState<File | null>(null);
  const [batchSize, setBatchSize] = useState(50);
  const [isProcessingSplit, setIsProcessingSplit] = useState(false);
  const [splitResult, setSplitResult] = useState<SplitResult | null>(null);
  const [splitRecommendations, setSplitRecommendations] = useState<SplitRecommendations | null>(null);

  // 第二步：分批分析
  const [analysisPrompt, setAnalysisPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<string[]>([]);
  const [combinedAnalysis, setCombinedAnalysis] = useState('');
  const [analysisRecommendations, setAnalysisRecommendations] = useState<AnalysisRecommendations | null>(null);

  // 第三步：聚类大纲
  const [isClustering, setIsClustering] = useState(false);
  const [clusterOutline, setClusterOutline] = useState('');
  const [clusterRecommendations, setClusterRecommendations] = useState<ClusterRecommendations | null>(null);

  // 第四步：段落撰写
  const [isWriting, setIsWriting] = useState(false);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [paragraphResults, setParagraphResults] = useState<string[]>([]);
  const [parsedOutline, setParsedOutline] = useState<ParagraphTopic[]>([]);
  const [writingRecommendations, setWritingRecommendations] = useState<WritingRecommendations | null>(null);

  // 用于取消请求的引用
  const abortControllerRef = useRef<AbortController | null>(null);

  // 标记步骤完成
  const markStepComplete = useCallback((stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  }, []);

  // 文件上传处理
  const handleFileUpload = useCallback((file: File) => {
    setLiteratureFile(file);
  }, []);

  // 第一步：执行文献分割
  const processLiteratureSplit = useCallback(async () => {
    if (!literatureFile) {
      throw new Error('请先上传文献素材库文件');
    }

    setIsProcessingSplit(true);
    
    try {
      const formData = new FormData();
      formData.append('file', literatureFile);
      formData.append('batchSize', batchSize.toString());

      const response = await fetch('/api/literature-decomposer/split', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('分割失败');
      }

      const result = await response.json();
      setSplitResult(result);
      
      // 生成专属建议
      const recommendations = generateSplitRecommendations(result);
      setSplitRecommendations(recommendations);
      
      markStepComplete('literature-split');
      
      return result;
    } finally {
      setIsProcessingSplit(false);
    }
  }, [literatureFile, batchSize, markStepComplete]);

  // 第二步：执行单批次分析
  const analyzeBatch = useCallback(async (batchIndex: number) => {
    if (!splitResult || !analysisPrompt.trim()) {
      throw new Error('请先完成文献分割并输入分析提示词');
    }

    setIsAnalyzing(true);
    setCurrentBatchIndex(batchIndex);

    try {
      const batch = splitResult.batches[batchIndex];
      
      const response = await fetch('/api/literature-decomposer/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchPapers: batch.papers,
          prompt: analysisPrompt,
          model: selectedModel,
          batchIndex,
          totalBatches: splitResult.totalBatches,
        }),
      });

      if (!response.ok) {
        throw new Error('分析失败');
      }

      const fullResult = await readStream(response, (content) => {
        setAnalysisResults(prev => {
          const newResults = [...prev];
          newResults[batchIndex] = content;
          return newResults;
        });
      });

      return fullResult;
    } finally {
      setIsAnalyzing(false);
    }
  }, [splitResult, analysisPrompt, selectedModel]);

  // 执行所有批次分析
  const analyzeAllBatches = useCallback(async () => {
    if (!splitResult) return;

    for (let i = 0; i < splitResult.totalBatches; i++) {
      if (!analysisResults[i]) {
        await analyzeBatch(i);
      }
    }

    // 合并所有分析结果
    const combined = analysisResults.join('\n\n---\n\n');
    setCombinedAnalysis(combined);
    
    // 生成专属建议
    const recommendations = generateAnalysisRecommendations(
      analysisResults.filter(Boolean).length,
      splitResult.totalBatches,
      combined.length
    );
    setAnalysisRecommendations(recommendations);
    
    markStepComplete('batch-analysis');
  }, [splitResult, analysisResults, analyzeBatch, markStepComplete]);

  // 第三步：执行聚类大纲生成
  const generateClusterOutline = useCallback(async () => {
    if (!combinedAnalysis) {
      throw new Error('请先完成分批分析');
    }

    setIsClustering(true);
    setClusterOutline('');

    // 取消之前的请求
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/literature-decomposer/cluster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisResults: combinedAnalysis,
          model: selectedModel,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('聚类失败');
      }

      const fullResult = await readStream(response, (content) => {
        setClusterOutline(content);
      });

      // 生成专属建议
      const recommendations = generateClusterRecommendations(fullResult.length);
      setClusterRecommendations(recommendations);
      
      markStepComplete('clustering-outline');
      
      return fullResult;
    } finally {
      setIsClustering(false);
    }
  }, [combinedAnalysis, selectedModel, markStepComplete]);

  // 解析大纲为段落列表
  const parseOutlineToParagraphs = useCallback((outline: string): ParagraphTopic[] => {
    const paragraphs: ParagraphTopic[] = [];

    // 按段落主题分割
    const sections = outline.split(/###\s*段落\s*\d+/);
    
    sections.forEach((section, index) => {
      if (index === 0) return; // 跳过第一个空段
      
      const titleMatch = section.match(/^[:：]?\s*(.+?)(?:\n|$)/);
      const materialsMatch = section.match(/\*\*支撑材料\*\*[:：]?\s*([^\n]+)/);
      const claimMatch = section.match(/\*\*核心主张\*\*[:：]?\s*([^\n]+)/);
      const logicMatch = section.match(/\*\*段落间逻辑\*\*[:：]?\s*([^\n]+)/);
      
      paragraphs.push({
        section: `段落 ${index}`,
        title: titleMatch ? titleMatch[1].trim() : `段落 ${index}`,
        coreClaim: claimMatch ? claimMatch[1].trim() : '',
        supportingMaterials: materialsMatch 
          ? materialsMatch[1].split(/[,，]/).map(m => m.trim().replace(/[[\]]/g, ''))
          : [],
        logic: logicMatch ? logicMatch[1].trim() : '',
      });
    });

    return paragraphs;
  }, []);

  // 第四步：执行段落撰写
  const writeParagraph = useCallback(async (paragraphIndex: number) => {
    if (!clusterOutline || !splitResult) {
      throw new Error('请先完成聚类大纲生成');
    }

    // 解析大纲（首次）
    let paragraphs = parsedOutline;
    if (paragraphs.length === 0) {
      paragraphs = parseOutlineToParagraphs(clusterOutline);
      setParsedOutline(paragraphs);
    }

    if (paragraphIndex >= paragraphs.length) {
      throw new Error('段落索引超出范围');
    }

    const paragraph = paragraphs[paragraphIndex];
    setIsWriting(true);
    setCurrentParagraphIndex(paragraphIndex);

    // 获取对应的文献
    const relevantPapers = splitResult.batches.flatMap(batch => batch.papers)
      .filter(paper => paragraph.supportingMaterials.some(mat => 
        paper.id === mat || paper.title.includes(mat) || mat.includes(paper.id)
      ));

    try {
      const response = await fetch('/api/literature-decomposer/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paragraphTopic: paragraph,
          literatureList: relevantPapers.length > 0 
            ? relevantPapers 
            : splitResult.batches[0].papers.slice(0, 10),
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error('撰写失败');
      }

      const fullResult = await readStream(response, (content) => {
        setParagraphResults(prev => {
          const newResults = [...prev];
          newResults[paragraphIndex] = content;
          return newResults;
        });
      });

      return fullResult;
    } finally {
      setIsWriting(false);
    }
  }, [clusterOutline, splitResult, parsedOutline, selectedModel, parseOutlineToParagraphs]);

  // 执行所有段落撰写
  const writeAllParagraphs = useCallback(async () => {
    // 解析大纲
    let paragraphs = parsedOutline;
    if (paragraphs.length === 0) {
      paragraphs = parseOutlineToParagraphs(clusterOutline);
      setParsedOutline(paragraphs);
    }

    // 生成专属建议
    const recommendations = generateWritingRecommendations();
    setWritingRecommendations(recommendations);

    for (let i = 0; i < paragraphs.length; i++) {
      if (!paragraphResults[i]) {
        await writeParagraph(i);
      }
    }

    markStepComplete('paragraph-writing');
  }, [parsedOutline, clusterOutline, paragraphResults, parseOutlineToParagraphs, writeParagraph, markStepComplete]);

  // 重置状态
  const reset = useCallback(() => {
    setCurrentStep('literature-split');
    setCompletedSteps(new Set());
    setLiteratureFile(null);
    setSplitResult(null);
    setSplitRecommendations(null);
    setAnalysisResults([]);
    setCombinedAnalysis('');
    setAnalysisRecommendations(null);
    setClusterOutline('');
    setClusterRecommendations(null);
    setParagraphResults([]);
    setParsedOutline([]);
    setWritingRecommendations(null);
  }, []);

  return {
    // 状态
    currentStep,
    setCurrentStep,
    completedSteps,
    models,
    setModels,
    selectedModel,
    setSelectedModel,
    
    // 第一步
    literatureFile,
    handleFileUpload,
    batchSize,
    setBatchSize,
    isProcessingSplit,
    splitResult,
    splitRecommendations,
    processLiteratureSplit,
    
    // 第二步
    analysisPrompt,
    setAnalysisPrompt,
    isAnalyzing,
    currentBatchIndex,
    analysisResults,
    combinedAnalysis,
    analysisRecommendations,
    analyzeBatch,
    analyzeAllBatches,
    
    // 第三步
    isClustering,
    clusterOutline,
    clusterRecommendations,
    generateClusterOutline,
    
    // 第四步
    isWriting,
    currentParagraphIndex,
    paragraphResults,
    parsedOutline,
    writingRecommendations,
    writeParagraph,
    writeAllParagraphs,
    
    // 工具方法
    reset,
  };
}

// 生成第一步专属建议
function generateSplitRecommendations(result: SplitResult): SplitRecommendations {
  const { totalPapers, totalBatches, statistics } = result;
  const { gradeDistribution, yearRange } = statistics;
  
  const highQualityCount = gradeDistribution.A + gradeDistribution.B;
  const highQualityRatio = totalPapers > 0 ? highQualityCount / totalPapers : 0;
  
  let quality: SplitRecommendations['quality'];
  let score: number;
  const insights: string[] = [];
  const actions: string[] = [];
  
  // 评估质量等级
  if (highQualityRatio >= 0.7 && gradeDistribution.A >= 10) {
    quality = 'excellent';
    score = 90;
    insights.push('文献库质量优秀，A级和B级文献占比高，研究基础扎实');
  } else if (highQualityRatio >= 0.5 && gradeDistribution.A >= 5) {
    quality = 'good';
    score = 75;
    insights.push('文献库质量良好，核心文献充足，可支撑高质量写作');
  } else if (highQualityRatio >= 0.3) {
    quality = 'moderate';
    score = 60;
    insights.push('文献库质量中等，建议后续补充更多高相关度文献');
  } else {
    quality = 'needs-work';
    score = 40;
    insights.push('文献库相关度偏低，建议重新审视筛选标准');
  }
  
  // 数量分析
  if (totalPapers < 30) {
    insights.push(`文献总量${totalPapers}篇偏少，可能影响综述深度`);
    actions.push('建议：补充更多相关文献以增强论证力度');
  } else if (totalPapers > 150) {
    insights.push(`文献总量${totalPapers}篇较丰富，注意控制写作聚焦度`);
    actions.push('建议：优先聚焦A/B级文献，C/D级文献可作为补充');
  } else {
    insights.push(`文献总量${totalPapers}篇适中，便于系统梳理`);
  }
  
  // 批次分析
  if (totalBatches > 5) {
    actions.push(`建议：分${totalBatches}批次处理，注意跨批次结果的整合`);
  }
  
  // 年份分析
  if (yearRange.max - yearRange.min > 10) {
    insights.push(`时间跨度${yearRange.max - yearRange.min}年，可分析研究演进脉络`);
  } else {
    insights.push(`时间跨度较短，聚焦前沿研究成果`);
  }
  
  // 等级分布建议
  if (gradeDistribution.D > totalPapers * 0.3) {
    actions.push('建议：D级文献较多，考虑是否需要重新评估相关性');
  }
  
  if (gradeDistribution.A < 5) {
    actions.push('建议：A级核心文献较少，建议补充领域经典文献');
  }
  
  // 下一步指导
  const nextStepGuidance = quality === 'excellent' || quality === 'good'
    ? '文献库质量达标，可进入分批分析阶段。建议：为每批次准备特定的分析重点，充分利用高质量文献。'
    : '建议先优化文献库质量，或调整分析策略以适应现有材料。';
  
  return { quality, score, insights, actions, nextStepGuidance };
}

// 生成第二步专属建议
function generateAnalysisRecommendations(
  completedBatches: number,
  totalBatches: number,
  resultsLength: number
): AnalysisRecommendations {
  const allCompleted = completedBatches === totalBatches;
  
  const positioning = `AI分析结果是一个「60分的基础框架」。在没有注入你的个人审美、学科特点、具体语境的情况下，AI只能产出60分左右的分析结果。`;
  
  const commonIssues = [
    '信息堆砌：AI生成的结果往往只是信息的罗列，缺乏深层叙事逻辑',
    '表达平淡：AI的表达往往比较中性，缺乏你所在学科领域的味道',
    '逻辑跳跃：段落之间可能存在衔接不畅的问题',
    '信息密度：某些段落可能过于拥挤或过于稀疏',
  ];
  
  const optimizationGuide = [
    '🔍 发现问题：凭直觉感到哪里不对劲时，明确问题所在',
    '📋 判断需求：AI需要什么材料才能解决这个问题？',
    '📁 准备材料：从文献素材库中调取对应的文献内容',
    '💬 清晰指令：把问题、要求和材料一起发给AI',
    '✅ 获得方案：AI基于完整信息给出修改建议',
    '🎯 你来决策：选择或调整方案',
  ];
  
  const materialPreparation = allCompleted ? [
    '所有批次分析完成，建议整理每批次的关键发现',
    '记录发现的问题点，为聚类大纲阶段做准备',
    '标注需要深度阅读全文的文献（复杂机制/方法）',
  ] : [
    '正在分析中，请耐心等待所有批次完成',
    '完成后请检查各批次结果的连贯性',
  ];
  
  return { positioning, commonIssues, optimizationGuide, materialPreparation };
}

// 生成第三步专属建议
function generateClusterRecommendations(outlineLength: number): ClusterRecommendations {
  return {
    optimizationLevels: [
      { level: '60→70分', focus: '逻辑层面', method: '审视信息关系（递进/对比/因果/并列），优化段落衔接' },
      { level: '70→80分', focus: '表达层面', method: '调整句子节奏感、精修用词、规范语法' },
      { level: '80→90分', focus: '深度层面', method: '注入学科理解、批判性讨论、独特见解' },
    ],
    materialManagement: [
      '📁 为每个段落创建独立的文献材料包（类似记事本文件）',
      '🏷️ 使用RE编号系统标记文献，便于快速定位',
      '📝 记录优化过程中发现的问题和修改思路',
      '🔄 保持文献材料与写作内容的对应关系',
    ],
    iterationGuide: [
      '1️⃣ 发现问题：把觉得不对的地方具体描述出来',
      '2️⃣ 准备材料：找到相关文献的原文内容',
      '3️⃣ 发送指令：问题 + 要求 + 材料 → AI',
      '4️⃣ 验证结果：确认改进效果，必要时进行下一轮',
      '⚠️ 关键：提示词告诉AI要做什么，材料让AI知道用什么做',
    ],
    whenToReadFullText: [
      '✅ 值得阅读全文：摘要不足以理解复杂机制/方法/结论',
      '✅ 值得阅读全文：想发现摘要中没有但对综述有价值的洞见',
      '❌ 不必阅读全文：摘要已足够且事实核查无误，验证性阅读性价比低',
    ],
  };
}

// 生成第四步专属建议
function generateWritingRecommendations(): WritingRecommendations {
  return {
    corePrinciples: [
      { 
        principle: '绝对忠于原文', 
        description: '只转述和整合，不推理和创作。严禁引入文献未提及的机制或术语' 
      },
      { 
        principle: '拥抱复杂性', 
        description: '如实呈现文献间的差异或矛盾，不为了流畅而忽略争议' 
      },
      { 
        principle: '量化声明溯源', 
        description: '所有数值、百分比必须直接来自文献，禁止二次计算' 
      },
    ],
    writingTechniques: [
      '📝 以论点引领开篇：段落首句就是完整、有分析性的学术句子',
      '🔗 多对多整合：根据逻辑关系融合多篇文献，避免逐一罗列',
      '⚖️ 优势-代价论证：将局限性作为论证的有机组成部分',
      '🎯 高密度写作：每句话都必要，要么论点、要么证据、要么分析',
    ],
    qualityChecklist: [
      '□ 开篇句是否为完整论点（而非宽泛主题句）？',
      '□ 是否避免了"论文A说...论文B说..."的罗列模式？',
      '□ 争议/矛盾是否被如实呈现？',
      '□ 所有数据是否有[REF-XX]引用？',
      '□ 局限性是否被有机融入论证？',
      '□ 结尾是否精炼重申核心论点？',
    ],
    iterationStrategy: [
      '1️⃣ 初稿评估：对照质量检查清单，识别问题',
      '2️⃣ 准备材料：从素材库调取相关文献原文',
      '3️⃣ 精准指令：问题+要求+材料 → AI',
      '4️⃣ 验证改进：确认修改效果，记录优化点',
      '5️⃣ 重复迭代：直到达到目标质量',
    ],
  };
}

export type {
  AIModel,
  Paper,
  Batch,
  SplitResult,
  ParagraphTopic,
  SplitRecommendations,
  AnalysisRecommendations,
  ClusterRecommendations,
  WritingRecommendations,
};
