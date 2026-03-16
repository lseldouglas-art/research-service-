'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft,
  FileText,
  Sparkles,
  Copy,
  Check,
  Bot,
  Loader2,
  BookOpen,
  ChevronDown,
  Target,
  FileSpreadsheet,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  X,
  Lightbulb,
  ArrowRight,
  Layers,
  Upload,
  Download,
  FileSearch,
  ListOrdered,
  HelpCircle,
  StepForward,
  RefreshCw,
  PenTool,
  GitBranch,
  FolderOpen,
  Table2,
  Save,
  Edit3,
  Split,
  FolderInput,
  GitMerge,
  FileOutput,
  AlertTriangle,
  Settings,
  Info,
  MessageSquare,
  TrendingUp,
  FileCheck,
  Zap,
  Eye,
  FileCode,
} from 'lucide-react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';

// 步骤配置
const STEPS = {
  'literature-split': {
    id: 'literature-split',
    name: '文献分割',
    description: '智能分批处理',
    icon: Split,
  },
  'batch-analysis': {
    id: 'batch-analysis',
    name: '分批分析',
    description: 'AI深度解析',
    icon: Bot,
  },
  'clustering-outline': {
    id: 'clustering-outline',
    name: '聚类大纲',
    description: '论点整合',
    icon: GitBranch,
  },
  'paragraph-writing': {
    id: 'paragraph-writing',
    name: '段落撰写',
    description: '精细写作',
    icon: PenTool,
  },
};

// AI模型类型
interface AIModel {
  id: string;
  name: string;
  provider: string;
  recommended?: boolean;
}

// 生成第一步专属建议
function generateSplitRecommendations(result: {
  totalPapers: number;
  totalBatches: number;
  statistics: {
    gradeDistribution: { A: number; B: number; C: number; D: number };
    yearRange: { min: number; max: number };
  };
}): {
  quality: 'excellent' | 'good' | 'moderate' | 'needs-work';
  score: number;
  insights: string[];
  actions: string[];
  nextStepGuidance: string;
} {
  const { totalPapers, totalBatches, statistics } = result;
  const { gradeDistribution, yearRange } = statistics;
  
  const highQualityCount = gradeDistribution.A + gradeDistribution.B;
  const highQualityRatio = totalPapers > 0 ? highQualityCount / totalPapers : 0;
  
  let quality: 'excellent' | 'good' | 'moderate' | 'needs-work';
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
): {
  positioning: string;
  commonIssues: string[];
  optimizationGuide: string[];
  materialPreparation: string[];
} {
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
function generateClusterRecommendations(outlineLength: number): {
  optimizationLevels: Array<{ level: string; focus: string; method: string }>;
  materialManagement: string[];
  iterationGuide: string[];
  whenToReadFullText: string[];
} {
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
function generateWritingRecommendations(): {
  corePrinciples: Array<{ principle: string; description: string }>;
  writingTechniques: string[];
  qualityChecklist: string[];
  iterationStrategy: string[];
} {
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

export default function LiteratureDecomposerPage() {
  // 步骤状态
  const [currentStep, setCurrentStep] = useState<'literature-split' | 'batch-analysis' | 'clustering-outline' | 'paragraph-writing'>('literature-split');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  
  // 复制状态
  const [copied, setCopied] = useState(false);
  
  // 使用指南
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  
  // AI模型
  const [models, setModels] = useState<AIModel[]>([]);
  const [selectedModel, setSelectedModel] = useState('deepseek-r1-250528');
  
  // 第一步：文献分割
  const [literatureFile, setLiteratureFile] = useState<File | null>(null);
  const [batchSize, setBatchSize] = useState(50);
  const [showBatchWarning, setShowBatchWarning] = useState(false);
  const [isProcessingSplit, setIsProcessingSplit] = useState(false);
  const [splitResult, setSplitResult] = useState<{
    totalPapers: number;
    totalBatches: number;
    batches: Array<{
      index: number;
      paperCount: number;
      papers: Array<{
        id: string;
        title: string;
        author: string;
        year: string;
        relevance: string;
      }>;
    }>;
    statistics: {
      gradeDistribution: { A: number; B: number; C: number; D: number };
      yearRange: { min: number; max: number };
    };
  } | null>(null);
  
  // 第一步建议
  const [splitRecommendations, setSplitRecommendations] = useState<ReturnType<typeof generateSplitRecommendations> | null>(null);
  
  // 第二步：分批分析
  const [analysisPrompt, setAnalysisPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<string[]>([]);
  const [combinedAnalysis, setCombinedAnalysis] = useState('');
  
  // 第二步建议
  const [analysisRecommendations, setAnalysisRecommendations] = useState<ReturnType<typeof generateAnalysisRecommendations> | null>(null);
  
  // 第三步：聚类大纲
  const [isClustering, setIsClustering] = useState(false);
  const [clusterOutline, setClusterOutline] = useState('');
  
  // 第三步建议
  const [clusterRecommendations, setClusterRecommendations] = useState<ReturnType<typeof generateClusterRecommendations> | null>(null);
  
  // 第四步：段落撰写
  const [isWriting, setIsWriting] = useState(false);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [paragraphResults, setParagraphResults] = useState<string[]>([]);
  const [parsedOutline, setParsedOutline] = useState<Array<{
    section: string;
    title: string;
    coreClaim: string;
    supportingMaterials: string[];
    logic: string;
  }>>([]);
  
  // 第四步建议
  const [writingRecommendations, setWritingRecommendations] = useState<ReturnType<typeof generateWritingRecommendations> | null>(null);

  useEffect(() => {
    // 加载AI模型列表
    fetch('/api/literature-search')
      .then(res => res.json())
      .then(data => {
        setModels(data.models || []);
      })
      .catch(console.error);

    // 检查是否首次访问
    const hasSeenGuide = localStorage.getItem('hasSeenLiteratureDecomposerGuide');
    if (!hasSeenGuide) {
      setShowGuide(true);
    }
  }, []);

  const closeGuide = () => {
    setShowGuide(false);
    localStorage.setItem('hasSeenLiteratureDecomposerGuide', 'true');
  };

  // 批次大小变化处理
  const handleBatchSizeChange = (value: number[]) => {
    const size = value[0];
    setBatchSize(size);
    setShowBatchWarning(size > 75);
  };

  // 文件上传处理
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLiteratureFile(file);
  };

  // 第一步：执行文献分割
  const processLiteratureSplit = async () => {
    if (!literatureFile) {
      alert('请先上传文献素材库文件');
      return;
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
      
      setCompletedSteps(prev => [...prev, 'literature-split']);
    } catch (error) {
      console.error('Error:', error);
      alert('文献分割失败，请检查文件格式');
    } finally {
      setIsProcessingSplit(false);
    }
  };

  // 第二步：执行分批分析
  const analyzeBatch = async (batchIndex: number) => {
    if (!splitResult || !analysisPrompt.trim()) {
      alert('请先完成文献分割并输入分析提示词');
      return;
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
          batchIndex: batchIndex,
          totalBatches: splitResult.totalBatches,
        }),
      });

      if (!response.ok) {
        throw new Error('分析失败');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
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
                }
              } catch {
                // 忽略解析错误
              }
            }
          }
        }

        const newResults = [...analysisResults];
        newResults[batchIndex] = fullResult;
        setAnalysisResults(newResults);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('批次分析失败');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 执行所有批次分析
  const analyzeAllBatches = async () => {
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
      analysisResults.filter(r => r).length,
      splitResult.totalBatches,
      combined.length
    );
    setAnalysisRecommendations(recommendations);
    
    setCompletedSteps(prev => [...prev, 'batch-analysis']);
  };

  // 第三步：执行聚类大纲生成
  const generateClusterOutline = async () => {
    if (!combinedAnalysis) {
      alert('请先完成分批分析');
      return;
    }

    setIsClustering(true);
    setClusterOutline('');

    try {
      const response = await fetch('/api/literature-decomposer/cluster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisResults: combinedAnalysis,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error('聚类失败');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
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
                  setClusterOutline(fullResult);
                }
              } catch {
                // 忽略解析错误
              }
            }
          }
        }

        // 生成专属建议
        const recommendations = generateClusterRecommendations(fullResult.length);
        setClusterRecommendations(recommendations);
      }
      
      setCompletedSteps(prev => [...prev, 'clustering-outline']);
    } catch (error) {
      console.error('Error:', error);
      alert('聚类大纲生成失败');
    } finally {
      setIsClustering(false);
    }
  };

  // 解析大纲为段落列表
  const parseOutlineToParagraphs = (outline: string) => {
    const paragraphs: Array<{
      section: string;
      title: string;
      coreClaim: string;
      supportingMaterials: string[];
      logic: string;
    }> = [];

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
  };

  // 第四步：执行段落撰写
  const writeParagraph = async (paragraphIndex: number) => {
    if (!clusterOutline || !splitResult) {
      alert('请先完成聚类大纲生成');
      return;
    }

    // 解析大纲（首次）
    let paragraphs = parsedOutline;
    if (paragraphs.length === 0) {
      paragraphs = parseOutlineToParagraphs(clusterOutline);
      setParsedOutline(paragraphs);
    }

    if (paragraphIndex >= paragraphs.length) {
      alert('段落索引超出范围');
      return;
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
          literatureList: relevantPapers.length > 0 ? relevantPapers : splitResult.batches[0].papers.slice(0, 10),
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error('撰写失败');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
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
                  const newResults = [...paragraphResults];
                  newResults[paragraphIndex] = fullResult;
                  setParagraphResults(newResults);
                }
              } catch {
                // 忽略解析错误
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('段落撰写失败');
    } finally {
      setIsWriting(false);
    }
  };

  // 执行所有段落撰写
  const writeAllParagraphs = async () => {
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

    setCompletedSteps(prev => [...prev, 'paragraph-writing']);
  };

  // 复制功能
  const copyResult = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('复制失败');
    }
  };

  // 导出功能
  const exportResults = (format: 'txt' | 'json') => {
    if (!splitResult) return;

    const data = format === 'json' 
      ? JSON.stringify(splitResult, null, 2)
      : splitResult.batches.map((batch, i) => 
          `批次 ${i + 1} (${batch.paperCount}篇)\n` +
          batch.papers.map(p => `  - [${p.relevance}] ${p.title} (${p.author}, ${p.year})`).join('\n')
        ).join('\n\n');

    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `literature-batches.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 按提供商分组模型
  const groupedModels = models.reduce((acc, m) => {
    if (!acc[m.provider]) acc[m.provider] = [];
    acc[m.provider].push(m);
    return acc;
  }, {} as Record<string, AIModel[]>);

  // 用户指南步骤
  const guideSteps = [
    {
      title: '功能概述',
      icon: <Target className="w-6 h-6 text-blue-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            文献分解器帮助您将大型文献素材库系统化分解，实现段落级精准写作支撑。
          </p>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
              💡 核心理念
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              AI生成的是「60分初稿」，优化需要：明确要求（提示词）+ 提供材料（文献内容）。
              本工具已为您准备好所有材料，随时可调用。
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.values(STEPS).map((step) => (
              <div key={step.id} className="flex flex-col items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <step.icon className="w-8 h-8 text-blue-500" />
                <div className="text-center">
                  <p className="font-medium text-sm">{step.name}</p>
                  <p className="text-xs text-slate-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: '文献分割策略',
      icon: <Split className="w-6 h-6 text-green-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            采用三级优先级策略对文献进行智能排序和分割：
          </p>
          <div className="space-y-2">
            <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <p className="font-medium text-green-800 dark:text-green-300 text-sm">1. 相关度等级</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                A级优先 → B级次之 → C级补充 → D级可选
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <p className="font-medium text-blue-800 dark:text-blue-300 text-sm">2. 发表年份</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                同等级内，优先选择最新研究成果
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <p className="font-medium text-purple-800 dark:text-purple-300 text-sm">3. 期刊质量</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                顶级期刊优先，确保论据权威性
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '从60分到90分',
      icon: <TrendingUp className="w-6 h-6 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
            <p className="font-medium text-amber-800 dark:text-amber-300 text-sm">AI初稿定位</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              AI生成的是60分基础框架。优化重点取决于你的基础：
              零基础同学学习表达方式，有基础同学注入学科理解。
            </p>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="font-medium text-sm">60→70分：逻辑层面</p>
              <p className="text-xs text-slate-500 mt-1">
                信息关系、段落衔接、论述线索
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="font-medium text-sm">70→80分：表达层面</p>
              <p className="text-xs text-slate-500 mt-1">
                句子节奏、用词精准、语法规范
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="font-medium text-sm">80→90分：深度层面</p>
              <p className="text-xs text-slate-500 mt-1">
                学科理解、批判讨论、独特见解
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '迭代优化方法',
      icon: <RefreshCw className="w-6 h-6 text-indigo-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            优化效果不理想，往往是因为只给了指令，没给材料。
          </p>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg space-y-2">
            <p className="font-medium text-indigo-800 dark:text-indigo-300 text-sm">
              🔄 迭代模式
            </p>
            <div className="space-y-1 text-xs text-indigo-700 dark:text-indigo-400">
              <p>1. 发现问题 → 感到哪里不对劲</p>
              <p>2. 判断需求 → AI需要什么材料？</p>
              <p>3. 准备材料 → 从素材库调取文献</p>
              <p>4. 清晰指令 → 问题+要求+材料</p>
              <p>5. 获得方案 → AI给出修改建议</p>
              <p>6. 你来决策 → 选择或调整方案</p>
            </div>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
            <p className="text-xs text-red-700 dark:text-red-400">
              <strong>⚠️ 关键：</strong>提示词告诉AI要做什么，材料让AI知道用什么做。两者缺一不可。
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* 用户指南弹窗 */}
      <Dialog open={showGuide} onOpenChange={setShowGuide}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="w-6 h-6 text-blue-500" />
              文献分解器使用指南
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              四步完成文献素材库的系统化分解 + 迭代优化闭环
            </DialogDescription>
          </DialogHeader>
          
          {/* 进度指示器 */}
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
            {guideSteps.map((_, index) => (
              <div key={index} className="flex-1 flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  index <= guideStep 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}>
                  {index + 1}
                </div>
                {index < guideSteps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded transition-colors ${
                    index < guideStep ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* 内容区域 */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="flex items-center gap-3 mb-4">
              {guideSteps[guideStep].icon}
              <h3 className="text-lg font-semibold">{guideSteps[guideStep].title}</h3>
            </div>
            {guideSteps[guideStep].content}
          </div>

          {/* 底部按钮 */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button 
              variant="ghost" 
              onClick={() => setGuideStep(Math.max(0, guideStep - 1))}
              disabled={guideStep === 0}
            >
              上一步
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={closeGuide}>
                跳过指南
              </Button>
              {guideStep < guideSteps.length - 1 ? (
                <Button onClick={() => setGuideStep(guideStep + 1)}>
                  下一步
                </Button>
              ) : (
                <Button onClick={closeGuide} className="bg-gradient-to-r from-blue-600 to-purple-600">
                  开始使用
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/tools" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
                <ArrowLeft className="w-4 h-4" />
                返回工具库
              </Link>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
              <h1 className="text-lg font-semibold flex items-center gap-2">
                <Split className="w-5 h-5 text-indigo-500" />
                文献分解器
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowGuide(true)}
              >
                <HelpCircle className="w-4 h-4 mr-1" />
                使用指南
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              <Split className="w-3 h-3 mr-1" />
              四步流程 + 迭代优化
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              文献素材库分解器
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              将文献素材库系统化分解，实现段落级精准写作支撑
            </p>
          </div>

          {/* 步骤指示器 */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {Object.values(STEPS).map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm ${
                    currentStep === step.id
                      ? 'bg-indigo-500 text-white'
                      : completedSteps.includes(step.id)
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  onClick={() => {
                    if (step.id === 'batch-analysis' && !splitResult) {
                      alert('请先完成文献分割');
                      return;
                    }
                    if (step.id === 'clustering-outline' && analysisResults.length === 0) {
                      alert('请先完成分批分析');
                      return;
                    }
                    if (step.id === 'paragraph-writing' && !clusterOutline) {
                      alert('请先完成聚类大纲生成');
                      return;
                    }
                    setCurrentStep(step.id as any);
                  }}
                >
                  <step.icon className="w-4 h-4" />
                  <span className="font-medium hidden sm:inline">{step.name}</span>
                  <span className="font-medium sm:hidden">{index + 1}</span>
                  {completedSteps.includes(step.id) && currentStep !== step.id && (
                    <CheckCircle2 className="w-3 h-3" />
                  )}
                </div>
                {index < Object.values(STEPS).length - 1 && (
                  <ArrowRight className="w-4 h-4 mx-1 text-slate-400" />
                )}
              </div>
            ))}
          </div>

          {/* 第一步：文献分割 */}
          {currentStep === 'literature-split' && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Split className="w-5 h-5 text-green-500" />
                      文献智能分割
                    </CardTitle>
                    <CardDescription>
                      上传素材库并设置分批参数
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 文件上传 */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-blue-500" />
                        文献素材库
                      </Label>
                      <Input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileUpload}
                        className="cursor-pointer"
                      />
                      {literatureFile && (
                        <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {literatureFile.name}
                        </p>
                      )}
                    </div>

                    {/* 批次大小 */}
                    <div className="space-y-2">
                      <Label className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Settings className="w-4 h-4 text-purple-500" />
                          每批次文献数量
                        </span>
                        <Badge variant="outline" className="font-mono">
                          {batchSize} 篇
                        </Badge>
                      </Label>
                      <Slider
                        value={[batchSize]}
                        onValueChange={handleBatchSizeChange}
                        min={10}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>10篇</span>
                        <span className="text-green-600">建议50篇</span>
                        <span>100篇</span>
                      </div>
                    </div>

                    {/* 高篇数警告 */}
                    {showBatchWarning && (
                      <Alert className="bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        <AlertTitle className="text-orange-800 dark:text-orange-300 text-sm">
                          质量警告
                        </AlertTitle>
                        <AlertDescription className="text-xs text-orange-700 dark:text-orange-400">
                          批次大小超过75篇可能导致AI分析质量下降，建议保持在50篇以内
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* 排序策略说明 */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-2">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Info className="w-4 h-4 text-blue-500" />
                        排序优先级
                      </p>
                      <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                        <p>1️⃣ 相关度等级 (A→B→C→D)</p>
                        <p>2️⃣ 发表年份 (新→旧)</p>
                        <p>3️⃣ 期刊质量 (顶刊优先)</p>
                      </div>
                    </div>

                    {/* 执行按钮 */}
                    <Button
                      onClick={processLiteratureSplit}
                      disabled={isProcessingSplit || !literatureFile}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      size="lg"
                    >
                      {isProcessingSplit ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          处理中...
                        </>
                      ) : (
                        <>
                          <Split className="mr-2 h-4 w-4" />
                          执行文献分割
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-4">
                {/* 专属建议卡片 */}
                {splitRecommendations && (
                  <Card className={`${
                    splitRecommendations.quality === 'excellent' ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' :
                    splitRecommendations.quality === 'good' ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800' :
                    splitRecommendations.quality === 'moderate' ? 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800' :
                    'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
                  }`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        您的专属建议
                        <Badge className={`ml-auto ${
                          splitRecommendations.quality === 'excellent' ? 'bg-green-500' :
                          splitRecommendations.quality === 'good' ? 'bg-blue-500' :
                          splitRecommendations.quality === 'moderate' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}>
                          {splitRecommendations.score}分
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* 质量评估 */}
                      <div className="flex items-center gap-2">
                        <Progress value={splitRecommendations.score} className="flex-1" />
                      </div>
                      
                      {/* 洞察 */}
                      <div className="space-y-1">
                        <p className="text-sm font-medium">📊 分析洞察</p>
                        {splitRecommendations.insights.map((insight, i) => (
                          <p key={i} className="text-xs text-slate-600 dark:text-slate-400 pl-2">
                            • {insight}
                          </p>
                        ))}
                      </div>
                      
                      {/* 行动建议 */}
                      {splitRecommendations.actions.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">🎯 行动建议</p>
                          {splitRecommendations.actions.map((action, i) => (
                            <p key={i} className="text-xs text-slate-600 dark:text-slate-400 pl-2">
                              • {action}
                            </p>
                          ))}
                        </div>
                      )}
                      
                      {/* 下一步指导 */}
                      <div className="p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg mt-2">
                        <p className="text-sm font-medium">➡️ 下一步指导</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {splitRecommendations.nextStepGuidance}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="min-h-[400px]">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      分割结果
                    </CardTitle>
                    {splitResult && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => exportResults('txt')}>
                          <Download className="mr-1 h-4 w-4" />
                          导出TXT
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => exportResults('json')}>
                          <Download className="mr-1 h-4 w-4" />
                          导出JSON
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    {!splitResult && !isProcessingSplit ? (
                      <div className="h-[300px] flex flex-col items-center justify-center text-slate-400">
                        <FolderInput className="w-16 h-16 mb-4 opacity-50" />
                        <p>上传文献素材库开始分割</p>
                        <p className="text-sm mt-2">支持 Excel (.xlsx, .xls) 和 CSV 格式</p>
                      </div>
                    ) : isProcessingSplit ? (
                      <div className="h-[300px] flex flex-col items-center justify-center">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                        <p className="text-slate-600 dark:text-slate-400">正在处理文献...</p>
                      </div>
                    ) : splitResult && (
                      <div className="space-y-4">
                        {/* 统计概览 */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
                            <p className="text-2xl font-bold text-blue-600">{splitResult.totalPapers}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">总文献数</p>
                          </div>
                          <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg text-center">
                            <p className="text-2xl font-bold text-green-600">{splitResult.totalBatches}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">批次数</p>
                          </div>
                          <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg text-center">
                            <p className="text-2xl font-bold text-purple-600">
                              {splitResult.statistics.yearRange.min}-{splitResult.statistics.yearRange.max}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">年份范围</p>
                          </div>
                          <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg text-center">
                            <p className="text-2xl font-bold text-orange-600">
                              {splitResult.statistics.gradeDistribution.A + splitResult.statistics.gradeDistribution.B}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">A+B级文献</p>
                          </div>
                        </div>

                        {/* 等级分布 */}
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <p className="text-sm font-medium mb-2">相关度分布</p>
                          <div className="grid grid-cols-4 gap-2">
                            <div className="text-center">
                              <Badge className="bg-green-500">A</Badge>
                              <p className="text-lg font-bold mt-1">{splitResult.statistics.gradeDistribution.A}</p>
                            </div>
                            <div className="text-center">
                              <Badge className="bg-blue-500">B</Badge>
                              <p className="text-lg font-bold mt-1">{splitResult.statistics.gradeDistribution.B}</p>
                            </div>
                            <div className="text-center">
                              <Badge className="bg-yellow-500">C</Badge>
                              <p className="text-lg font-bold mt-1">{splitResult.statistics.gradeDistribution.C}</p>
                            </div>
                            <div className="text-center">
                              <Badge className="bg-slate-500">D</Badge>
                              <p className="text-lg font-bold mt-1">{splitResult.statistics.gradeDistribution.D}</p>
                            </div>
                          </div>
                        </div>

                        {/* 批次列表 */}
                        <div className="space-y-2">
                          <p className="text-sm font-medium">批次详情</p>
                          <div className="max-h-[200px] overflow-y-auto space-y-2">
                            {splitResult.batches.map((batch, index) => (
                              <div 
                                key={index}
                                className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between"
                              >
                                <div>
                                  <p className="font-medium text-sm">批次 {batch.index + 1}</p>
                                  <p className="text-xs text-slate-500">
                                    {batch.paperCount} 篇文献
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {batch.papers.slice(0, 5).map((paper, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {paper.relevance}
                                    </Badge>
                                  ))}
                                  {batch.papers.length > 5 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{batch.papers.length - 5}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 下一步按钮 */}
                        <div className="pt-4 flex justify-end">
                          <Button
                            className="bg-gradient-to-r from-blue-600 to-purple-600"
                            onClick={() => {
                              setCompletedSteps(prev => [...prev, 'literature-split']);
                              setCurrentStep('batch-analysis');
                            }}
                          >
                            <StepForward className="mr-2 h-4 w-4" />
                            进入分批分析
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* 第二步：分批分析 */}
          {currentStep === 'batch-analysis' && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bot className="w-5 h-5 text-purple-500" />
                      分批次AI分析
                    </CardTitle>
                    <CardDescription>
                      逐批处理，避免认知过载
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 当前状态 */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">总批次数</span>
                        <Badge variant="outline">{splitResult?.totalBatches || 0}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">已完成</span>
                        <Badge className="bg-green-500">{analysisResults.filter(r => r).length}</Badge>
                      </div>
                    </div>

                    {/* AI模型选择 */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-green-500" />
                        AI模型
                      </Label>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(groupedModels).map(([provider, modelList]) => (
                            <div key={provider}>
                              <div className="px-2 py-1.5 text-sm font-semibold text-slate-500">
                                {provider}
                              </div>
                              {modelList.map((m) => (
                                <SelectItem key={m.id} value={m.id}>
                                  <div className="flex items-center gap-2">
                                    <span>{m.name}</span>
                                    {m.recommended && (
                                      <Badge className="bg-green-500 text-white text-[10px] py-0">推荐</Badge>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 分析提示词 */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <PenTool className="w-4 h-4 text-orange-500" />
                        分析提示词
                      </Label>
                      <Textarea
                        value={analysisPrompt}
                        onChange={(e) => setAnalysisPrompt(e.target.value)}
                        placeholder="输入分析提示词，指导AI如何分析每批文献..."
                        className="min-h-[120px]"
                      />
                    </div>

                    {/* 操作按钮 */}
                    <div className="space-y-2">
                      <Button
                        onClick={analyzeAllBatches}
                        disabled={isAnalyzing || !analysisPrompt.trim()}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
                        size="lg"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            分析中 ({currentBatchIndex + 1}/{splitResult?.totalBatches})
                          </>
                        ) : (
                          <>
                            <Bot className="mr-2 h-4 w-4" />
                            分析所有批次
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setCurrentStep('literature-split')}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        返回文献分割
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-4">
                {/* 专属建议卡片 - AI初稿定位 */}
                {analysisRecommendations && (
                  <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Eye className="w-5 h-5 text-amber-600" />
                        AI初稿定位与优化指南
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* 定位说明 */}
                      <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                          💡 AI输出的定位
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {analysisRecommendations.positioning}
                        </p>
                      </div>
                      
                      {/* 常见问题 */}
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="w-full justify-between" size="sm">
                            <span className="flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              常见问题检查清单
                            </span>
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-1 pt-2">
                          {analysisRecommendations.commonIssues.map((issue, i) => (
                            <p key={i} className="text-xs text-slate-600 dark:text-slate-400 pl-2">
                              ⚠️ {issue}
                            </p>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                      
                      {/* 优化步骤 */}
                      <div className="space-y-1">
                        <p className="text-sm font-medium">🔄 迭代优化步骤</p>
                        {analysisRecommendations.optimizationGuide.map((step, i) => (
                          <p key={i} className="text-xs text-slate-600 dark:text-slate-400 pl-2">
                            {step}
                          </p>
                        ))}
                      </div>
                      
                      {/* 材料准备 */}
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
                        <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
                          📁 材料准备建议
                        </p>
                        {analysisRecommendations.materialPreparation.map((prep, i) => (
                          <p key={i} className="text-xs text-indigo-700 dark:text-indigo-400 mt-1">
                            • {prep}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 批次进度 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      分析进度
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {splitResult?.batches.map((_, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded-lg text-center cursor-pointer transition-all ${
                            analysisResults[index]
                              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                              : currentBatchIndex === index && isAnalyzing
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                          onClick={() => !isAnalyzing && analyzeBatch(index)}
                        >
                          <p className="text-sm font-medium">批次 {index + 1}</p>
                          {analysisResults[index] && (
                            <CheckCircle2 className="w-4 h-4 mx-auto mt-1" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 分析结果 */}
                <Card className="min-h-[400px]">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      分析结果
                    </CardTitle>
                    {combinedAnalysis && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => copyResult(combinedAnalysis)}>
                          {copied ? (
                            <>
                              <Check className="mr-1 h-4 w-4 text-green-500" />
                              已复制
                            </>
                          ) : (
                            <>
                              <Copy className="mr-1 h-4 w-4" />
                              复制
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    {!combinedAnalysis && !isAnalyzing ? (
                      <div className="h-[300px] flex flex-col items-center justify-center text-slate-400">
                        <Bot className="w-16 h-16 mb-4 opacity-50" />
                        <p>输入分析提示词并开始分析</p>
                        <p className="text-sm mt-2">系统将逐批处理文献</p>
                      </div>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap bg-slate-50 dark:bg-slate-900 p-4 rounded-lg text-sm font-mono overflow-auto max-h-[500px]">
                          {combinedAnalysis || analysisResults[currentBatchIndex] || '等待分析...'}
                          {isAnalyzing && (
                            <span className="inline-block w-2 h-4 bg-purple-500 animate-pulse ml-1" />
                          )}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 完成提示 */}
                {analysisResults.filter(r => r).length === splitResult?.totalBatches && (
                  <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                    <CardContent className="py-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                        <div className="flex-1">
                          <p className="font-medium text-green-800 dark:text-green-300">
                            所有批次分析完成
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-400">
                            可进入聚类大纲生成步骤
                          </p>
                        </div>
                        <Button
                          className="bg-gradient-to-r from-indigo-600 to-purple-600"
                          onClick={() => {
                            setCompletedSteps(prev => [...prev, 'batch-analysis']);
                            setCurrentStep('clustering-outline');
                          }}
                        >
                          <StepForward className="mr-2 h-4 w-4" />
                          生成聚类大纲
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* 第三步：聚类大纲生成 */}
          {currentStep === 'clustering-outline' && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-indigo-500" />
                      论点聚类与大纲生成
                    </CardTitle>
                    <CardDescription>
                      整合分析结果，生成段落大纲
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 当前状态 */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">已分析批次</span>
                        <Badge className="bg-green-500">{analysisResults.filter(r => r).length}</Badge>
                      </div>
                    </div>

                    {/* AI模型选择 */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-green-500" />
                        AI模型
                      </Label>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(groupedModels).map(([provider, modelList]) => (
                            <div key={provider}>
                              <div className="px-2 py-1.5 text-sm font-semibold text-slate-500">
                                {provider}
                              </div>
                              {modelList.map((m) => (
                                <SelectItem key={m.id} value={m.id}>
                                  <div className="flex items-center gap-2">
                                    <span>{m.name}</span>
                                    {m.recommended && (
                                      <Badge className="bg-green-500 text-white text-[10px] py-0">推荐</Badge>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 聚类原则说明 */}
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
                      <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-2">
                        聚类原则
                      </p>
                      <div className="space-y-1 text-xs text-indigo-700 dark:text-indigo-400">
                        <p>• 基于机制相似性分组</p>
                        <p>• 生成逻辑连贯的段落大纲</p>
                        <p>• 每段落标注支撑文献</p>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="space-y-2">
                      <Button
                        onClick={generateClusterOutline}
                        disabled={isClustering}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
                        size="lg"
                      >
                        {isClustering ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            生成中...
                          </>
                        ) : (
                          <>
                            <GitMerge className="mr-2 h-4 w-4" />
                            生成聚类大纲
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setCurrentStep('batch-analysis')}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        返回分批分析
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-4">
                {/* 专属建议卡片 - 深度优化 */}
                {clusterRecommendations && (
                  <Card className="bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                        从60分到90分的优化路径
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* 优化等级 */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium">📈 优化等级</p>
                        {clusterRecommendations.optimizationLevels.map((level, i) => (
                          <div key={i} className="p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                            <p className="text-sm font-medium">{level.level}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              <strong>聚焦：</strong>{level.focus} | <strong>方法：</strong>{level.method}
                            </p>
                          </div>
                        ))}
                      </div>
                      
                      {/* 材料管理 */}
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="w-full justify-between" size="sm">
                            <span className="flex items-center gap-1">
                              <FolderOpen className="w-4 h-4" />
                              材料管理建议
                            </span>
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-1 pt-2">
                          {clusterRecommendations.materialManagement.map((item, i) => (
                            <p key={i} className="text-xs text-slate-600 dark:text-slate-400 pl-2">
                              {item}
                            </p>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                      
                      {/* 迭代指南 */}
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                          🔄 迭代优化关键
                        </p>
                        {clusterRecommendations.iterationGuide.map((guide, i) => (
                          <p key={i} className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                            {guide}
                          </p>
                        ))}
                      </div>
                      
                      {/* 何时读全文 */}
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="w-full justify-between" size="sm">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              何时需要阅读文献全文？
                            </span>
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-1 pt-2">
                          {clusterRecommendations.whenToReadFullText.map((item, i) => (
                            <p key={i} className="text-xs text-slate-600 dark:text-slate-400 pl-2">
                              {item}
                            </p>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    </CardContent>
                  </Card>
                )}

                <Card className="min-h-[400px]">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <GitBranch className="w-5 h-5" />
                      段落写作大纲
                    </CardTitle>
                    {clusterOutline && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => copyResult(clusterOutline)}>
                          {copied ? (
                            <>
                              <Check className="mr-1 h-4 w-4 text-green-500" />
                              已复制
                            </>
                          ) : (
                            <>
                              <Copy className="mr-1 h-4 w-4" />
                              复制
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-1 h-4 w-4" />
                          导出
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    {!clusterOutline && !isClustering ? (
                      <div className="h-[300px] flex flex-col items-center justify-center text-slate-400">
                        <GitBranch className="w-16 h-16 mb-4 opacity-50" />
                        <p>点击"生成聚类大纲"开始</p>
                        <p className="text-sm mt-2">AI将整合分析结果生成段落大纲</p>
                      </div>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap bg-slate-50 dark:bg-slate-900 p-4 rounded-lg text-sm font-mono overflow-auto max-h-[600px]">
                          {clusterOutline}
                          {isClustering && (
                            <span className="inline-block w-2 h-4 bg-indigo-500 animate-pulse ml-1" />
                          )}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {clusterOutline && !isClustering && (
                  <Card className="bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800">
                    <CardContent className="py-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                        <div className="flex-1">
                          <p className="font-medium text-indigo-800 dark:text-indigo-300">
                            段落写作大纲已生成
                          </p>
                          <p className="text-sm text-indigo-700 dark:text-indigo-400">
                            这是一个60分的初稿，建议根据专属建议进行迭代优化
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={generateClusterOutline}
                        >
                          <RefreshCw className="mr-1 h-4 w-4" />
                          重新生成
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 最终行动闭环 */}
                {clusterOutline && !isClustering && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        进阶功能：段落精细撰写
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-lg">
                        <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-2">
                          ✨ 第四步：段落精细撰写
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                          基于精细化大纲，为每个段落生成高质量的学术内容。AI将严格遵循文献证据，编织有深度、有批判性的学术段落。
                        </p>
                        <Button
                          className="bg-gradient-to-r from-indigo-600 to-purple-600"
                          onClick={() => {
                            setCompletedSteps(prev => [...prev, 'clustering-outline']);
                            setCurrentStep('paragraph-writing');
                          }}
                        >
                          <PenTool className="mr-2 h-4 w-4" />
                          进入段落撰写
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* 第四步：段落撰写 */}
          {currentStep === 'paragraph-writing' && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <PenTool className="w-5 h-5 text-purple-500" />
                      段落精细撰写
                    </CardTitle>
                    <CardDescription>
                      基于大纲逐段落撰写学术内容
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 当前状态 */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">总段落数</span>
                        <Badge variant="outline">{parsedOutline.length || '待解析'}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">已完成</span>
                        <Badge className="bg-green-500">{paragraphResults.filter(r => r).length}</Badge>
                      </div>
                    </div>

                    {/* AI模型选择 */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-green-500" />
                        AI模型
                      </Label>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(groupedModels).map(([provider, modelList]) => (
                            <div key={provider}>
                              <div className="px-2 py-1.5 text-sm font-semibold text-slate-500">
                                {provider}
                              </div>
                              {modelList.map((m) => (
                                <SelectItem key={m.id} value={m.id}>
                                  <div className="flex items-center gap-2">
                                    <span>{m.name}</span>
                                    {m.recommended && (
                                      <Badge className="bg-green-500 text-white text-[10px] py-0">推荐</Badge>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 撰写原则说明 */}
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                      <p className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-2">
                        核心撰写原则
                      </p>
                      <div className="space-y-1 text-xs text-purple-700 dark:text-purple-400">
                        <p>• 绝对忠于原文，不臆造信息</p>
                        <p>• 拥抱复杂性，如实呈现争议</p>
                        <p>• 量化声明必须溯源</p>
                        <p>• 以论点引领开篇</p>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="space-y-2">
                      <Button
                        onClick={writeAllParagraphs}
                        disabled={isWriting || !clusterOutline}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                        size="lg"
                      >
                        {isWriting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            撰写中 ({currentParagraphIndex + 1}/{parsedOutline.length || '?'})
                          </>
                        ) : (
                          <>
                            <PenTool className="mr-2 h-4 w-4" />
                            撰写所有段落
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setCurrentStep('clustering-outline')}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        返回聚类大纲
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-4">
                {/* 专属建议卡片 */}
                {writingRecommendations && (
                  <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileCheck className="w-5 h-5 text-purple-600" />
                        学术段落撰写指南
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* 核心原则 */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium">📜 核心执行指令</p>
                        {writingRecommendations.corePrinciples.map((p, i) => (
                          <div key={i} className="p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                            <p className="text-sm font-medium text-purple-800 dark:text-purple-300">{p.principle}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">{p.description}</p>
                          </div>
                        ))}
                      </div>
                      
                      {/* 写作技巧 */}
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="w-full justify-between" size="sm">
                            <span className="flex items-center gap-1">
                              <PenTool className="w-4 h-4" />
                              写作技巧
                            </span>
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-1 pt-2">
                          {writingRecommendations.writingTechniques.map((tech, i) => (
                            <p key={i} className="text-xs text-slate-600 dark:text-slate-400 pl-2">
                              {tech}
                            </p>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                      
                      {/* 质量检查清单 */}
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                          ✅ 质量检查清单
                        </p>
                        <div className="grid grid-cols-2 gap-1 mt-2">
                          {writingRecommendations.qualityChecklist.map((item, i) => (
                            <p key={i} className="text-xs text-amber-700 dark:text-amber-400">
                              {item}
                            </p>
                          ))}
                        </div>
                      </div>
                      
                      {/* 迭代策略 */}
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="w-full justify-between" size="sm">
                            <span className="flex items-center gap-1">
                              <RefreshCw className="w-4 h-4" />
                              迭代优化策略
                            </span>
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-1 pt-2">
                          {writingRecommendations.iterationStrategy.map((step, i) => (
                            <p key={i} className="text-xs text-slate-600 dark:text-slate-400 pl-2">
                              {step}
                            </p>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    </CardContent>
                  </Card>
                )}

                {/* 段落进度 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ListOrdered className="w-5 h-5" />
                      段落撰写进度
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {parsedOutline.map((para, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded-lg text-center cursor-pointer transition-all ${
                            paragraphResults[index]
                              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                              : currentParagraphIndex === index && isWriting
                              ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                          onClick={() => !isWriting && writeParagraph(index)}
                        >
                          <p className="text-xs font-medium truncate">{para.section || `段落 ${index + 1}`}</p>
                          {paragraphResults[index] && (
                            <CheckCircle2 className="w-4 h-4 mx-auto mt-1" />
                          )}
                        </div>
                      ))}
                      {parsedOutline.length === 0 && (
                        <p className="col-span-full text-center text-sm text-slate-500">
                          点击"撰写所有段落"开始解析大纲
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* 段落撰写结果 */}
                <Card className="min-h-[400px]">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      撰写结果
                    </CardTitle>
                    {paragraphResults.some(r => r) && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => copyResult(paragraphResults.filter(r => r).join('\n\n---\n\n'))}>
                          {copied ? (
                            <>
                              <Check className="mr-1 h-4 w-4 text-green-500" />
                              已复制
                            </>
                          ) : (
                            <>
                              <Copy className="mr-1 h-4 w-4" />
                              复制全部
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-1 h-4 w-4" />
                          导出
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    {!paragraphResults.some(r => r) && !isWriting ? (
                      <div className="h-[300px] flex flex-col items-center justify-center text-slate-400">
                        <PenTool className="w-16 h-16 mb-4 opacity-50" />
                        <p>点击"撰写所有段落"开始撰写</p>
                        <p className="text-sm mt-2">AI将基于大纲逐段落生成高质量学术内容</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {paragraphResults.map((result, index) => result && (
                          <div key={index} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium text-sm">
                                {parsedOutline[index]?.section || `段落 ${index + 1}`}: {parsedOutline[index]?.title || ''}
                              </p>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => copyResult(result)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              <pre className="whitespace-pre-wrap text-sm font-mono overflow-auto">
                                {result}
                              </pre>
                            </div>
                          </div>
                        ))}
                        {isWriting && (
                          <div className="flex items-center justify-center p-4">
                            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                            <span className="ml-2 text-sm text-slate-500">
                              正在撰写段落 {currentParagraphIndex + 1}...
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 完成提示 */}
                {paragraphResults.filter(r => r).length === parsedOutline.length && parsedOutline.length > 0 && (
                  <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                    <CardContent className="py-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                        <div className="flex-1">
                          <p className="font-medium text-green-800 dark:text-green-300">
                            所有段落撰写完成
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-400">
                            已生成 {paragraphResults.filter(r => r).length} 个段落的学术内容
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => writeAllParagraphs()}
                        >
                          <RefreshCw className="mr-1 h-4 w-4" />
                          重新撰写
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 后续行动建议 */}
                {paragraphResults.some(r => r) && !isWriting && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        后续优化建议
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                          <p className="font-medium text-blue-800 dark:text-blue-300 text-sm mb-1">
                            1. 整合检查
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            确保段落间逻辑连贯，过渡自然
                          </p>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                          <p className="font-medium text-purple-800 dark:text-purple-300 text-sm mb-1">
                            2. 引用规范
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            检查[REF-XX]格式，准备正式引用列表
                          </p>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                          <p className="font-medium text-green-800 dark:text-green-300 text-sm mb-1">
                            3. 细节优化
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            表达精修、用词调整、语法检查
                          </p>
                        </div>
                        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                          <p className="font-medium text-amber-800 dark:text-amber-300 text-sm mb-1">
                            4. 事实核查
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            对照原文确认数据、术语准确性
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-lg">
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          <strong>💡 提醒：</strong>
                          <span className="ml-1">这是AI生成的初稿。如需优化，请准备好具体的修改要求和对应的文献材料，然后向AI提出迭代需求。</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
