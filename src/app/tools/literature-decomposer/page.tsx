'use client';

import { useState, useEffect, useRef } from 'react';
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
};

// AI模型类型
interface AIModel {
  id: string;
  name: string;
  provider: string;
  recommended?: boolean;
}

export default function LiteratureDecomposerPage() {
  // 步骤状态
  const [currentStep, setCurrentStep] = useState<'literature-split' | 'batch-analysis' | 'clustering-outline'>('literature-split');
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
  
  // 第二步：分批分析
  const [analysisPrompt, setAnalysisPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<string[]>([]);
  const [combinedAnalysis, setCombinedAnalysis] = useState('');
  
  // 第三步：聚类大纲
  const [isClustering, setIsClustering] = useState(false);
  const [clusterOutline, setClusterOutline] = useState('');
  const [paragraphFiles, setParagraphFiles] = useState<Array<{
    section: string;
    title: string;
    paperCount: number;
  }>>([]);

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
      }

      setCompletedSteps(prev => [...prev, 'clustering-outline']);
    } catch (error) {
      console.error('Error:', error);
      alert('聚类大纲生成失败');
    } finally {
      setIsClustering(false);
    }
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
            文献分解器帮助您将大型文献素材库系统化分解，实现精准的段落级写作支撑。
          </p>
          <div className="grid grid-cols-3 gap-3">
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
          <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
            <p className="text-xs text-orange-800 dark:text-orange-300">
              <strong>⚠️ 注意：</strong>建议每批次不超过50篇，超过75篇可能导致分析质量下降
            </p>
          </div>
        </div>
      ),
    },
    {
      title: '分批分析策略',
      icon: <Bot className="w-6 h-6 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            逐批处理，避免认知过载，确保分析质量：
          </p>
          <div className="space-y-2">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <p className="font-medium text-purple-800 dark:text-purple-300 text-sm">标准化输出</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                每批生成统一的文献-论点关联表格
              </p>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
              <p className="font-medium text-indigo-800 dark:text-indigo-300 text-sm">逐一审查</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                确保每篇文献都被充分分析，降低幻觉风险
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <p className="font-medium text-blue-800 dark:text-blue-300 text-sm">结果整合</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                自动合并多批次分析结果
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '聚类与大纲生成',
      icon: <GitBranch className="w-6 h-6 text-indigo-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            基于机制相似性的科学聚类，生成段落级写作大纲：
          </p>
          <div className="space-y-2">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
              <p className="font-medium text-indigo-800 dark:text-indigo-300 text-sm">论点聚类</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                按照机制相似性将论点科学分组
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <p className="font-medium text-green-800 dark:text-green-300 text-sm">逻辑大纲</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                生成具备明确逻辑关系的段落写作大纲
              </p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
              <p className="font-medium text-orange-800 dark:text-orange-300 text-sm">文献匹配</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                每个段落都有对应的文献支撑文件
              </p>
            </div>
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
              三步完成文献素材库的系统化分解
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
              三步流程
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
                          <div className="max-h-[300px] overflow-y-auto space-y-2">
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
                            可基于此大纲开始段落级写作
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

                {/* 使用说明 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      后续写作建议
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                        <p className="font-medium text-blue-800 dark:text-blue-300 text-sm mb-1">
                          1. 段落写作
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          按大纲逐段落写作，引用对应文献
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                        <p className="font-medium text-purple-800 dark:text-purple-300 text-sm mb-1">
                          2. 文献检索
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          使用searchtxt工具匹配段落文献
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                        <p className="font-medium text-green-800 dark:text-green-300 text-sm mb-1">
                          3. 质量检查
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          确保每个论点都有文献支撑
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
