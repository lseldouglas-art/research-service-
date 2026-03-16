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
  FileCode,
  Briefcase,
  Lightbulb as LightbulbIcon,
  GitBranch,
  FolderOpen,
  Table2,
  Save,
  Edit3,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as XLSX from 'xlsx';

interface PaperType {
  id: string;
  name: string;
  description: string;
  structure: string[];
  features: string[];
}

interface AIModel {
  id: string;
  name: string;
  description: string;
  provider: string;
  recommended: boolean;
}

// 步骤配置
const STEPS = {
  'literature-analysis': {
    id: 'literature-analysis',
    name: '文献批量分析与分级',
    description: '对文献库进行定性评估与信息结构化',
    icon: FileSearch,
    order: 1,
  },
  'outline-generation': {
    id: 'outline-generation',
    name: '论文大纲生成',
    description: '基于文献分析构建逻辑严密的大纲',
    icon: ListOrdered,
    order: 2,
  },
  'outline-confirmation': {
    id: 'outline-confirmation',
    name: '大纲确认与编辑',
    description: '确认或修改大纲，准备生成素材库',
    icon: Edit3,
    order: 3,
  },
  'material-library': {
    id: 'material-library',
    name: '写作素材库生成',
    description: '将文献精确匹配到大纲各章节',
    icon: FolderOpen,
    order: 4,
  },
};

// 论文类型图标映射
const PAPER_TYPE_ICONS: Record<string, React.ReactNode> = {
  review: <BookOpen className="w-5 h-5" />,
  research: <FileText className="w-5 h-5" />,
  methodology: <FileCode className="w-5 h-5" />,
  case_study: <Briefcase className="w-5 h-5" />,
  theoretical: <Lightbulb className="w-5 h-5" />,
  perspective: <PenTool className="w-5 h-5" />,
};

export default function OutlineGeneratorPage() {
  // 基础状态
  const [currentStep, setCurrentStep] = useState<'literature-analysis' | 'outline-generation' | 'outline-confirmation' | 'material-library'>('literature-analysis');
  const [paperTypes, setPaperTypes] = useState<PaperType[]>([]);
  const [models, setModels] = useState<AIModel[]>([]);
  
  // 输入状态
  const [writingTopic, setWritingTopic] = useState('');
  const [paperType, setPaperType] = useState('review');
  const [selectedModel, setSelectedModel] = useState('deepseek-r1-250528');
  
  // 文献库状态
  const [literatureFile, setLiteratureFile] = useState<File | null>(null);
  const [literatureList, setLiteratureList] = useState('');
  const [isFileUploading, setIsFileUploading] = useState(false);
  
  // 分析结果状态
  const [analysisResult, setAnalysisResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // 大纲状态
  const [outlineResult, setOutlineResult] = useState('');
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  
  // 大纲编辑状态
  const [editedOutline, setEditedOutline] = useState('');
  const [isEditingOutline, setIsEditingOutline] = useState(false);
  
  // 素材库状态
  const [materialLibrary, setMaterialLibrary] = useState('');
  const [isGeneratingMaterial, setIsGeneratingMaterial] = useState(false);
  
  // 已完成步骤追踪
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  
  // 复制状态
  const [copied, setCopied] = useState(false);
  
  // 使用指南
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(0);

  useEffect(() => {
    // 加载配置
    fetch('/api/outline-generator')
      .then(res => res.json())
      .then(data => {
        setPaperTypes(data.paperTypes || []);
      })
      .catch(console.error);

    // 加载AI模型列表
    fetch('/api/literature-search')
      .then(res => res.json())
      .then(data => {
        setModels(data.models || []);
      })
      .catch(console.error);

    // 检查是否首次访问
    const hasSeenGuide = localStorage.getItem('hasSeenOutlineGeneratorGuide');
    if (!hasSeenGuide) {
      setShowGuide(true);
    }
  }, []);

  const closeGuide = () => {
    setShowGuide(false);
    localStorage.setItem('hasSeenOutlineGeneratorGuide', 'true');
  };

  // 文件上传处理
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsFileUploading(true);
    setLiteratureFile(file);

    try {
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      if (extension === 'xlsx' || extension === 'xls') {
        // Excel文件处理
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
        
        // 假设第一行是表头
        const headers = jsonData[0] || [];
        const rows = jsonData.slice(1);
        
        // 转换为文本格式
        const formattedList = rows.map((row, index) => {
          const num = row[0] || index + 1;
          const author = row[1] || '';
          const title = row[2] || '';
          const year = row[3] || '';
          const type = row[4] || '';
          const abstract = row[5] || '';
          
          return `${num}. ${author} - ${title} (${year}) [${type}]\n摘要：${abstract}`;
        }).join('\n\n');
        
        setLiteratureList(formattedList);
      } else {
        // txt或其他文本文件
        const content = await file.text();
        setLiteratureList(content);
      }
    } catch (error) {
      console.error('Error reading file:', error);
      alert('读取文件失败，请确保文件格式正确');
    } finally {
      setIsFileUploading(false);
    }
  };

  // 拖拽上传处理
  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    setIsFileUploading(true);
    setLiteratureFile(file);

    try {
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      if (extension === 'xlsx' || extension === 'xls') {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
        
        const headers = jsonData[0] || [];
        const rows = jsonData.slice(1);
        
        const formattedList = rows.map((row, index) => {
          const num = row[0] || index + 1;
          const author = row[1] || '';
          const title = row[2] || '';
          const year = row[3] || '';
          const type = row[4] || '';
          const abstract = row[5] || '';
          
          return `${num}. ${author} - ${title} (${year}) [${type}]\n摘要：${abstract}`;
        }).join('\n\n');
        
        setLiteratureList(formattedList);
      } else {
        const content = await file.text();
        setLiteratureList(content);
      }
    } catch (error) {
      console.error('Error reading file:', error);
      alert('读取文件失败，请确保文件格式正确');
    } finally {
      setIsFileUploading(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // 第一步：文献分析
  const analyzeLiterature = async () => {
    if (!writingTopic.trim()) {
      alert('请输入写作主题');
      return;
    }

    if (!literatureList.trim()) {
      alert('请上传文献库或直接输入文献列表');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult('');

    try {
      const response = await fetch('/api/outline-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          writingTopic,
          literatureList,
          paperType,
          model: selectedModel,
          step: 'analysis',
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
                  setAnalysisResult(fullResult);
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
      setAnalysisResult('分析失败，请稍后重试');
    } finally {
      setIsAnalyzing(false);
      setCompletedSteps(prev => [...prev, 'literature-analysis']);
    }
  };

  // 第二步：生成大纲
  const generateOutline = async () => {
    if (!writingTopic.trim()) {
      alert('请输入写作主题');
      return;
    }

    if (!analysisResult.trim()) {
      alert('请先完成文献分析');
      return;
    }

    setIsGeneratingOutline(true);
    setOutlineResult('');

    try {
      const response = await fetch('/api/outline-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          writingTopic,
          literatureAnalysis: analysisResult,
          paperType,
          model: selectedModel,
          step: 'outline',
        }),
      });

      if (!response.ok) {
        throw new Error('生成失败');
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
                  setOutlineResult(fullResult);
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
      setOutlineResult('生成失败，请稍后重试');
    } finally {
      setIsGeneratingOutline(false);
      setCompletedSteps(prev => [...prev, 'outline-generation']);
    }
  };

  // 第三步：确认大纲
  const confirmOutline = () => {
    if (!outlineResult.trim()) {
      alert('请先生成论文大纲');
      return;
    }
    setEditedOutline(outlineResult);
    setCurrentStep('outline-confirmation');
  };

  // 第四步：生成素材库
  const generateMaterialLibrary = async () => {
    const finalOutline = editedOutline || outlineResult;
    
    if (!finalOutline.trim()) {
      alert('请提供论文大纲');
      return;
    }

    if (!analysisResult.trim()) {
      alert('请先完成文献分析');
      return;
    }

    setIsGeneratingMaterial(true);
    setMaterialLibrary('');

    try {
      const response = await fetch('/api/material-library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outline: finalOutline,
          literatureList: analysisResult,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error('生成失败');
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
                  setMaterialLibrary(fullResult);
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
      setMaterialLibrary('生成失败，请稍后重试');
    } finally {
      setIsGeneratingMaterial(false);
      setCompletedSteps(prev => [...prev, 'material-library']);
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

  // 导出素材库为CSV
  const exportMaterialLibrary = () => {
    if (!materialLibrary.trim()) return;
    
    // 尝试从结果中提取表格数据
    const lines = materialLibrary.split('\n');
    const tableLines = lines.filter(line => line.includes('|') && !line.includes('---'));
    
    // 创建CSV内容
    const csvContent = tableLines.map(line => {
      const cells = line.split('|').filter(cell => cell.trim());
      return cells.map(cell => `"${cell.trim()}"`).join(',');
    }).join('\n');
    
    // 下载文件
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `写作素材库_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 按提供商分组模型
  const groupedModels = models.reduce((acc, m) => {
    if (!acc[m.provider]) acc[m.provider] = [];
    acc[m.provider].push(m);
    return acc;
  }, {} as Record<string, AIModel[]>);

  const selectedPaperType = paperTypes.find(p => p.id === paperType);

  // 用户指南步骤
  const guideSteps = [
    {
      title: '功能概述',
      icon: <Target className="w-6 h-6 text-blue-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            论文大纲生成器帮助您从文献库快速构建专业的论文大纲。
          </p>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(STEPS).map((step) => (
              <div key={step.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <step.icon className="w-5 h-5 text-blue-500" />
                <div>
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
      title: '文献库格式',
      icon: <FileSpreadsheet className="w-6 h-6 text-green-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            支持的文献库格式：
          </p>
          <div className="space-y-2">
            <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <p className="font-medium text-green-800 dark:text-green-300 text-sm">Excel格式 (.xlsx, .xls)</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                列顺序：编号、作者、标题、发表年限、文献类型、摘要
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <p className="font-medium text-blue-800 dark:text-blue-300 text-sm">文本格式 (.txt)</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                每篇文献一行，包含标题、作者、摘要等信息
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '论文类型',
      icon: <Layers className="w-6 h-6 text-purple-500" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            支持6种论文类型，每种类型有专门的大纲结构：
          </p>
          <div className="grid grid-cols-2 gap-2">
            {paperTypes.slice(0, 6).map((type) => (
              <div key={type.id} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2">
                  {PAPER_TYPE_ICONS[type.id]}
                  <span className="font-medium text-sm">{type.name}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{type.description}</p>
              </div>
            ))}
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
              论文大纲生成器使用指南
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              两步完成专业的论文大纲构建
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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost">
              <Link href="/services">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回服务
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => {
                setGuideStep(0);
                setShowGuide(true);
              }}>
                <HelpCircle className="mr-1 h-4 w-4" />
                使用指南
              </Button>
              <Badge variant="outline" className="text-sm">
                论文大纲生成器
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              <ListOrdered className="w-3 h-3 mr-1" />
              AI驱动的大纲生成
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              论文大纲生成器
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              上传文献库，AI自动分析并生成专业的论文大纲
            </p>
          </div>

          {/* 步骤指示器 */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {Object.values(STEPS).map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm ${
                    currentStep === step.id
                      ? 'bg-green-500 text-white'
                      : completedSteps.includes(step.id)
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  onClick={() => {
                    // 步骤跳转验证
                    if (step.id === 'outline-generation' && !analysisResult) {
                      alert('请先完成文献分析');
                      return;
                    }
                    if (step.id === 'outline-confirmation' && !outlineResult) {
                      alert('请先生成论文大纲');
                      return;
                    }
                    if (step.id === 'material-library' && !editedOutline && !outlineResult) {
                      alert('请先确认论文大纲');
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

          {/* 第一步：文献分析 */}
          {currentStep === 'literature-analysis' && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileSearch className="w-5 h-5 text-green-500" />
                      文献批量分析
                    </CardTitle>
                    <CardDescription>
                      对文献库进行定性评估与信息结构化
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 写作主题 */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-red-500" />
                        写作主题
                      </Label>
                      <Textarea
                        placeholder="例如：电解质阴离子设计对锌离子电池界面行为的系统性影响"
                        value={writingTopic}
                        onChange={(e) => setWritingTopic(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <p className="text-xs text-slate-500">
                        输入您论文的核心研究主题
                      </p>
                    </div>

                    {/* 论文类型选择 */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-purple-500" />
                        论文类型
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {paperTypes.slice(0, 6).map((type) => (
                          <div
                            key={type.id}
                            className={`p-2 rounded-lg border-2 cursor-pointer transition-all ${
                              paperType === type.id
                                ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                            onClick={() => setPaperType(type.id)}
                          >
                            <div className="flex items-center gap-1.5 mb-0.5">
                              {PAPER_TYPE_ICONS[type.id]}
                              <span className="font-medium text-sm">{type.name}</span>
                            </div>
                            <p className="text-xs text-slate-500 truncate">{type.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 文献库上传 */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-blue-500" />
                        文献库文件
                      </Label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                          literatureFile 
                            ? 'border-green-500 bg-green-50 dark:bg-green-950/30' 
                            : 'border-slate-300 hover:border-slate-400'
                        }`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                      >
                        {literatureFile ? (
                          <div className="space-y-2">
                            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto" />
                            <p className="text-sm font-medium text-green-700 dark:text-green-400">
                              {literatureFile.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {(literatureFile.size / 1024).toFixed(1)} KB
                            </p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                setLiteratureFile(null);
                                setLiteratureList('');
                              }}
                            >
                              <X className="mr-1 h-4 w-4" />
                              移除文件
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              拖拽文件到此处或点击上传
                            </p>
                            <p className="text-xs text-slate-500">
                              支持 .xlsx, .xls, .txt 格式
                            </p>
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                accept=".xlsx,.xls,.txt"
                                className="hidden"
                                onChange={handleFileUpload}
                                disabled={isFileUploading}
                              />
                              <Button variant="outline" size="sm" asChild>
                                <span>
                                  {isFileUploading ? (
                                    <>
                                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                      读取中...
                                    </>
                                  ) : (
                                    <>
                                      <FileText className="mr-1 h-4 w-4" />
                                      选择文件
                                    </>
                                  )}
                                </span>
                              </Button>
                            </label>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        Excel列顺序：编号、作者、标题、发表年限、文献类型、摘要
                      </p>
                    </div>

                    {/* 文献列表编辑 */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-500" />
                        文献列表内容
                        {literatureList && (
                          <Badge variant="outline" className="text-xs">
                            {literatureList.split('\n\n').filter(l => l.trim()).length} 篇
                          </Badge>
                        )}
                      </Label>
                      <Textarea
                        placeholder="或直接粘贴文献列表内容..."
                        value={literatureList}
                        onChange={(e) => setLiteratureList(e.target.value)}
                        className="min-h-[120px] text-sm"
                      />
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

                    {/* 分析按钮 */}
                    <Button
                      onClick={analyzeLiterature}
                      disabled={isAnalyzing || !writingTopic.trim() || !literatureList.trim()}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      size="lg"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          分析中...
                        </>
                      ) : (
                        <>
                          <FileSearch className="mr-2 h-4 w-4" />
                          开始分析文献
                        </>
                      )}
                    </Button>

                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full justify-between" size="sm">
                          <span className="flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            分析说明
                          </span>
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="text-xs text-slate-500 space-y-1 pt-2">
                        <p><strong>相关性分级标准：</strong></p>
                        <p>• A级（核心相关）：主要研究内容就是写作主题</p>
                        <p>• B级（间接相关）：可支撑写作主题的某个论点</p>
                        <p>• C级（关联较低）：只提到主题，未进行实质分析</p>
                        <p>• D级（彻底无关）：与主题完全无关</p>
                        <p className="mt-2"><strong>核心原则：</strong>寻找一切可能的关联，而非轻易排除</p>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <Card className="min-h-[400px]">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      文献分析结果
                    </CardTitle>
                    {analysisResult && (
                      <Button variant="outline" size="sm" onClick={() => copyResult(analysisResult)}>
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
                    )}
                  </CardHeader>
                  <CardContent>
                    {!analysisResult && !isAnalyzing ? (
                      <div className="h-[300px] flex flex-col items-center justify-center text-slate-400">
                        <FileSearch className="w-16 h-16 mb-4 opacity-50" />
                        <p>上传文献库，开始分析</p>
                        <p className="text-sm mt-2">AI将对每篇文献进行相关性评估</p>
                      </div>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap bg-slate-50 dark:bg-slate-900 p-4 rounded-lg text-sm font-mono overflow-auto max-h-[500px]">
                          {analysisResult}
                          {isAnalyzing && (
                            <span className="inline-block w-2 h-4 bg-green-500 animate-pulse ml-1" />
                          )}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {analysisResult && !isAnalyzing && (
                  <Card>
                    <CardContent className="py-4">
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Button variant="outline" size="sm" onClick={analyzeLiterature}>
                          <RefreshCw className="mr-1 h-4 w-4" />
                          重新分析
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-green-600 to-blue-600"
                          onClick={() => setCurrentStep('outline-generation')}
                        >
                          <StepForward className="mr-1 h-4 w-4" />
                          进入大纲生成
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* 第二步：大纲生成 */}
          {currentStep === 'outline-generation' && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ListOrdered className="w-5 h-5 text-blue-500" />
                      大纲生成设置
                    </CardTitle>
                    <CardDescription>
                      基于文献分析构建论文大纲
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 当前设置显示 */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">写作主题</span>
                        <Badge variant="outline" className="max-w-[200px] truncate">
                          {writingTopic.slice(0, 30)}...
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">论文类型</span>
                        <Badge className="bg-purple-500">
                          {selectedPaperType?.name || '综述论文'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">文献数量</span>
                        <Badge variant="outline">
                          {literatureList.split('\n\n').filter(l => l.trim()).length} 篇
                        </Badge>
                      </div>
                    </div>

                    {/* 论文类型结构说明 */}
                    {selectedPaperType && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          {selectedPaperType.name}结构
                        </Label>
                        <div className="flex flex-wrap gap-1">
                          {selectedPaperType.structure.map((s, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {s}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-slate-500">
                          特点：{selectedPaperType.features.join('、')}
                        </p>
                      </div>
                    )}

                    {/* 修改类型选项 */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-purple-500" />
                        修改论文类型
                      </Label>
                      <Select value={paperType} onValueChange={setPaperType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {paperTypes.slice(0, 6).map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              <div className="flex items-center gap-2">
                                {PAPER_TYPE_ICONS[type.id]}
                                <span>{type.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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

                    {/* 生成按钮 */}
                    <Button
                      onClick={generateOutline}
                      disabled={isGeneratingOutline}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      size="lg"
                    >
                      {isGeneratingOutline ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          生成中...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          生成论文大纲
                        </>
                      )}
                    </Button>

                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full justify-between" size="sm">
                          <span className="flex items-center gap-1">
                            <Lightbulb className="w-4 h-4" />
                            大纲特点
                          </span>
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="text-xs text-slate-500 space-y-1 pt-2">
                        <p><strong>大纲生成原则：</strong></p>
                        <p>• 忽略D级文献，聚焦A/B/C级</p>
                        <p>• 归纳3-5个一级核心主题</p>
                        <p>• 每个子主题标注支撑文献数量</p>
                        <p>• 自动优化文献支撑不足的章节</p>
                        <p>• 确保逻辑链条完整</p>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <Card className="min-h-[400px]">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <GitBranch className="w-5 h-5" />
                      论文大纲
                    </CardTitle>
                    {outlineResult && (
                      <Button variant="outline" size="sm" onClick={() => copyResult(outlineResult)}>
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
                    )}
                  </CardHeader>
                  <CardContent>
                    {!outlineResult && !isGeneratingOutline ? (
                      <div className="h-[300px] flex flex-col items-center justify-center text-slate-400">
                        <ListOrdered className="w-16 h-16 mb-4 opacity-50" />
                        <p>点击"生成论文大纲"开始</p>
                        <p className="text-sm mt-2">AI将基于文献分析构建专业大纲</p>
                      </div>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap bg-slate-50 dark:bg-slate-900 p-4 rounded-lg text-sm font-mono overflow-auto max-h-[600px]">
                          {outlineResult}
                          {isGeneratingOutline && (
                            <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1" />
                          )}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {outlineResult && !isGeneratingOutline && (
                  <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                    <CardContent className="py-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                        <div className="flex-1">
                          <p className="font-medium text-green-800 dark:text-green-300">
                            论文大纲已生成
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-400">
                            确认大纲后可生成写作素材库
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={generateOutline}
                          >
                            <RefreshCw className="mr-1 h-4 w-4" />
                            重新生成
                          </Button>
                          <Button 
                            size="sm"
                            className="bg-gradient-to-r from-green-600 to-blue-600"
                            onClick={() => {
                              setEditedOutline(outlineResult);
                              setCompletedSteps(prev => [...prev, 'outline-generation']);
                              setCurrentStep('outline-confirmation');
                            }}
                          >
                            <StepForward className="mr-1 h-4 w-4" />
                            确认并编辑大纲
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* 第三步：大纲确认与编辑 */}
          {currentStep === 'outline-confirmation' && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Edit3 className="w-5 h-5 text-orange-500" />
                      大纲确认与编辑
                    </CardTitle>
                    <CardDescription>
                      确认或修改大纲，准备生成素材库
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 当前状态 */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">写作主题</span>
                        <Badge variant="outline" className="max-w-[200px] truncate">
                          {writingTopic.slice(0, 25)}...
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">论文类型</span>
                        <Badge className="bg-purple-500">
                          {selectedPaperType?.name || '综述论文'}
                        </Badge>
                      </div>
                    </div>

                    {/* 编辑说明 */}
                    <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                      <p className="text-sm text-orange-800 dark:text-orange-300">
                        <strong>操作指南：</strong>
                      </p>
                      <ul className="text-xs text-orange-700 dark:text-orange-400 mt-1 space-y-1">
                        <li>• 检查大纲结构是否合理</li>
                        <li>• 可直接编辑修改章节名称</li>
                        <li>• 确认后点击"生成素材库"</li>
                      </ul>
                    </div>

                    {/* 操作按钮 */}
                    <div className="space-y-2">
                      <Button
                        onClick={() => {
                          setCompletedSteps(prev => [...prev, 'outline-confirmation']);
                          setCurrentStep('material-library');
                        }}
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                        size="lg"
                        disabled={!editedOutline.trim()}
                      >
                        <FolderOpen className="mr-2 h-4 w-4" />
                        确认大纲并生成素材库
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setCurrentStep('outline-generation')}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        返回重新生成大纲
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
                      编辑论文大纲
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => copyResult(editedOutline)}
                      >
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
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={editedOutline}
                      onChange={(e) => setEditedOutline(e.target.value)}
                      placeholder="在此编辑论文大纲..."
                      className="min-h-[500px] font-mono text-sm"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* 第四步：写作素材库生成 */}
          {currentStep === 'material-library' && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FolderOpen className="w-5 h-5 text-indigo-500" />
                      写作素材库生成
                    </CardTitle>
                    <CardDescription>
                      将文献精确匹配到大纲各章节
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 当前状态 */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">写作主题</span>
                        <Badge variant="outline" className="max-w-[180px] truncate">
                          {writingTopic.slice(0, 20)}...
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">论文类型</span>
                        <Badge className="bg-purple-500 text-xs">
                          {selectedPaperType?.name}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">文献数量</span>
                        <Badge variant="outline" className="text-xs">
                          {analysisResult.split('\n').filter(l => l.includes('|')).length} 篇
                        </Badge>
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

                    {/* 生成按钮 */}
                    <Button
                      onClick={generateMaterialLibrary}
                      disabled={isGeneratingMaterial}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      size="lg"
                    >
                      {isGeneratingMaterial ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          生成中...
                        </>
                      ) : (
                        <>
                          <Table2 className="mr-2 h-4 w-4" />
                          生成写作素材库
                        </>
                      )}
                    </Button>

                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full justify-between" size="sm">
                          <span className="flex items-center gap-1">
                            <Lightbulb className="w-4 h-4" />
                            输出说明
                          </span>
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="text-xs text-slate-500 space-y-1 pt-2">
                        <p><strong>素材库包含：</strong></p>
                        <p>• 编号：原始文献编号</p>
                        <p>• Zotero定位：快速查找标识</p>
                        <p>• 直接相关章节：最匹配的章节</p>
                        <p>• 间接相关章节：次要参考章节</p>
                        <p>• 核心贡献：一句话概括价值</p>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <Card className="min-h-[400px]">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Table2 className="w-5 h-5" />
                      写作素材库
                    </CardTitle>
                    {materialLibrary && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => copyResult(materialLibrary)}>
                          <Copy className="mr-1 h-4 w-4" />
                          复制
                        </Button>
                        <Button variant="outline" size="sm" onClick={exportMaterialLibrary}>
                          <Download className="mr-1 h-4 w-4" />
                          导出CSV
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    {!materialLibrary && !isGeneratingMaterial ? (
                      <div className="h-[300px] flex flex-col items-center justify-center text-slate-400">
                        <FolderOpen className="w-16 h-16 mb-4 opacity-50" />
                        <p>点击"生成写作素材库"开始</p>
                        <p className="text-sm mt-2">AI将文献精确匹配到大纲各章节</p>
                      </div>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap bg-slate-50 dark:bg-slate-900 p-4 rounded-lg text-sm font-mono overflow-auto max-h-[600px]">
                          {materialLibrary}
                          {isGeneratingMaterial && (
                            <span className="inline-block w-2 h-4 bg-indigo-500 animate-pulse ml-1" />
                          )}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {materialLibrary && !isGeneratingMaterial && (
                  <Card className="bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800">
                    <CardContent className="py-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                        <div className="flex-1">
                          <p className="font-medium text-indigo-800 dark:text-indigo-300">
                            写作素材库已生成
                          </p>
                          <p className="text-sm text-indigo-700 dark:text-indigo-400">
                            可导出CSV用于Zotero标签管理，或复制表格内容
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={generateMaterialLibrary}
                          >
                            <RefreshCw className="mr-1 h-4 w-4" />
                            重新生成
                          </Button>
                          <Button 
                            size="sm"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600"
                            onClick={exportMaterialLibrary}
                          >
                            <Download className="mr-1 h-4 w-4" />
                            导出CSV
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 使用说明 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      后续使用建议
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                        <p className="font-medium text-blue-800 dark:text-blue-300 text-sm mb-1">
                          1. 导入Zotero
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          使用"Zotero定位标识"快速找到文献
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                        <p className="font-medium text-purple-800 dark:text-purple-300 text-sm mb-1">
                          2. 添加标签
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          按章节为文献添加主/副标签
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                        <p className="font-medium text-green-800 dark:text-green-300 text-sm mb-1">
                          3. 开始写作
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          按章节组织素材，高效写作
                        </p>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        <strong>💡 提示：</strong>
                        <span className="ml-1">素材库中的"核心贡献与应用点"可直接用于论文写作，帮助您快速定位每篇文献的价值。</span>
                      </p>
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
