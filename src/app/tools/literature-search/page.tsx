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
  Search,
  Sparkles,
  Copy,
  Check,
  Database,
  FileText,
  Zap,
  Globe,
  BookOpen,
  Loader2,
  RefreshCw,
  Download,
  Star,
  History,
  AlertCircle,
  ChevronDown,
  Languages,
  Bot,
  Info,
  X,
  Lightbulb,
  Target,
  Layers,
  ArrowRight,
  TrendingUp,
  FileSearch,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  CircleAlert,
  Rocket,
  BookMarked,
  Scale,
  HelpCircle,
  Compass,
  Crosshair,
  Grid3X3,
  RefreshCcw,
  Filter,
  GitBranch,
  Play,
  StepForward,
  Upload
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
import { Progress } from '@/components/ui/progress';

interface Database {
  id: string;
  name: string;
  language: string;
  example: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  features: string[];
  bestFor: string;
}

interface AIModel {
  id: string;
  name: string;
  description: string;
  provider: string;
  recommended: boolean;
}

interface HistoryItem {
  id: string;
  keyword: string;
  database: string;
  template: string;
  model: string;
  granularity: string;
  result: string;
  timestamp: string;
}

// 主题词颗粒度配置
const GRANULARITY_CONFIG = {
  coarse: {
    id: 'coarse',
    name: '粗颗粒度',
    description: '单个关键词，如"电池"',
    example: '电池、人工智能、机器学习',
    keywords: 1,
    tip: '检索范围广，综述数量可能较多，适合初步探索领域',
  },
  medium: {
    id: 'medium',
    name: '中等颗粒度',
    description: '两个关键词组合，如"锌离子电池"',
    example: '锌离子电池、医疗人工智能、教育机器学习',
    keywords: 2,
    tip: '平衡检索范围与精度，综述数量适中，适合大多数场景',
  },
  fine: {
    id: 'fine',
    name: '细颗粒度',
    description: '三个或更多关键词，如"锌离子电池电解质"',
    example: '锌离子电池电解质、医疗人工智能诊断、教育机器学习个性化',
    keywords: 3,
    tip: '检索范围窄，综述数量可能较少，适合精细化研究方向',
  },
};

// 综述数量评估策略
const REVIEW_STRATEGY = {
  'abundant': {
    range: '50篇以上',
    status: 'excellent',
    title: '综述积累充分',
    description: '该领域已有充分的综述积累，可以直接进行AI分析',
    action: '进入下一步：将综述输入AI分析',
    nextStep: 'ai-analysis',
    color: 'green',
  },
  'moderate': {
    range: '10-50篇',
    status: 'good',
    title: '综述数量适中',
    description: '理想数量范围，可选择仅用综述或加入研究型论文',
    action: '建议：可选择进入AI分析或加入研究型论文丰富材料',
    nextStep: 'flexible',
    color: 'blue',
  },
  'limited': {
    range: '约10篇',
    status: 'caution',
    title: '综述相对较少',
    description: '建议将研究型论文也加入分析，丰富信息来源',
    action: '建议：筛选综述+研究型论文一起分析',
    nextStep: 'extended-analysis',
    color: 'yellow',
  },
  'scarce': {
    range: '几篇',
    status: 'warning',
    title: '综述数量不足',
    description: '主题颗粒度可能过细，或该细分领域缺乏综述',
    action: '建议：扩大检索范围或进入新兴领域专项流程',
    nextStep: 'adjust-or-special',
    color: 'orange',
  },
};

// 聚焦检索步骤配置
const FOCUSED_STEPS = {
  'matrix-construction': {
    id: 'matrix-construction',
    name: '矩阵式检索策略构建',
    description: '系统解构研究主题，生成多阶段矩阵式检索计划',
    icon: Grid3X3,
    order: 1,
  },
  'iterative-optimization': {
    id: 'iterative-optimization',
    name: '检索策略迭代优化',
    description: '分析误检文献共性，逆向优化检索策略',
    icon: RefreshCcw,
    order: 2,
  },
};

export default function LiteratureSearchPage() {
  // 探索模式状态
  const [keyword, setKeyword] = useState('');
  const [database, setDatabase] = useState('scopus');
  const [template, setTemplate] = useState('stable');
  const [model, setModel] = useState('doubao-seed-1-8-251228');
  const [granularity, setGranularity] = useState('medium');
  const [databases, setDatabases] = useState<Database[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [models, setModels] = useState<AIModel[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  
  // 检索结果评估状态
  const [reviewCount, setReviewCount] = useState<number | ''>('');
  const [relevanceScore, setRelevanceScore] = useState<number>(50);
  const [showEvaluation, setShowEvaluation] = useState(false);
  
  // 聚焦模式状态
  const [searchMode, setSearchMode] = useState<'exploration' | 'focused'>('exploration');
  const [focusedStep, setFocusedStep] = useState<'matrix-construction' | 'iterative-optimization'>('matrix-construction');
  const [focusedKeyword, setFocusedKeyword] = useState('');
  const [focusedDatabase, setFocusedDatabase] = useState('scopus');
  const [focusedModel, setFocusedModel] = useState('deepseek-r1-250528');
  const [promptVersion, setPromptVersion] = useState<'stable' | 'extended'>('stable');
  const [focusedResult, setFocusedResult] = useState('');
  const [isFocusedGenerating, setIsFocusedGenerating] = useState(false);
  
  // 迭代优化状态
  const [originalQuery, setOriginalQuery] = useState('');
  const [falsePositiveTitles, setFalsePositiveTitles] = useState('');
  const [optimizationResult, setOptimizationResult] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  // 迭代优化V2 - 新增状态
  const [searchGoal, setSearchGoal] = useState('');
  const [searchResultsFile, setSearchResultsFile] = useState<File | null>(null);
  const [searchResultsContent, setSearchResultsContent] = useState('');
  const [isFileUploading, setIsFileUploading] = useState(false);
  
  const resultRef = useRef<HTMLDivElement>(null);

  // 加载配置
  useEffect(() => {
    fetch('/api/literature-search')
      .then(res => res.json())
      .then(data => {
        setDatabases(data.databases || []);
        setTemplates(data.templates || []);
        setModels(data.models || []);
      })
      .catch(console.error);

    // 加载历史记录
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    // 检查是否首次访问
    const hasSeenGuide = localStorage.getItem('hasSeenLiteratureSearchGuide');
    if (!hasSeenGuide) {
      setShowGuide(true);
    }
  }, []);

  // 标记已看过指南
  const closeGuide = () => {
    setShowGuide(false);
    localStorage.setItem('hasSeenLiteratureSearchGuide', 'true');
  };

  // 保存历史记录
  const saveToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newHistory: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString('zh-CN'),
    };
    const updatedHistory = [newHistory, ...history].slice(0, 20);
    setHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  // 生成检索式（探索模式）
  const generateSearchQuery = async () => {
    if (!keyword.trim()) {
      alert('请输入研究领域或关键词');
      return;
    }

    setIsGenerating(true);
    setResult('');

    try {
      const response = await fetch('/api/literature-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, database, template, model, granularity }),
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
                  setResult(fullResult);
                }
                if (data.done) {
                  saveToHistory({
                    keyword,
                    database,
                    template,
                    model,
                    granularity,
                    result: fullResult,
                  });
                  setShowEvaluation(true);
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
      setResult('生成失败，请稍后重试');
    } finally {
      setIsGenerating(false);
    }
  };

  // 矩阵式检索策略构建
  const generateMatrixStrategy = async () => {
    if (!focusedKeyword.trim()) {
      alert('请输入具体研究方向');
      return;
    }

    setIsFocusedGenerating(true);
    setFocusedResult('');

    try {
      const response = await fetch('/api/literature-search/focused', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: focusedKeyword,
          database: focusedDatabase,
          model: focusedModel,
          type: 'matrix-construction',
          promptVersion: promptVersion,
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
                  setFocusedResult(fullResult);
                }
                if (data.done) {
                  // 保存原始检索式用于后续优化
                  const queryMatch = fullResult.match(/【检索式[^\】]*】\n([\s\S]*?)(?=\n【|$)/);
                  if (queryMatch) {
                    setOriginalQuery(queryMatch[1].trim());
                  }
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
      setFocusedResult('生成失败，请稍后重试');
    } finally {
      setIsFocusedGenerating(false);
    }
  };

  // 迭代优化检索策略（新版 - 基于文献内容分析）
  const optimizeSearchStrategy = async () => {
    if (!searchGoal.trim()) {
      alert('请输入检索目标');
      return;
    }

    if (!originalQuery.trim()) {
      alert('请输入检索式');
      return;
    }

    if (!searchResultsContent.trim()) {
      alert('请上传检索结果文件或直接输入检索结果内容');
      return;
    }

    setIsOptimizing(true);
    setOptimizationResult('');

    try {
      const response = await fetch('/api/literature-search/focused', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchGoal,
          originalQuery,
          searchResults: searchResultsContent,
          database: focusedDatabase,
          model: focusedModel,
          type: 'iterative-optimization',
        }),
      });

      if (!response.ok) {
        throw new Error('优化失败');
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
                  setOptimizationResult(fullResult);
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
      setOptimizationResult('优化失败，请稍后重试');
    } finally {
      setIsOptimizing(false);
    }
  };

  // 文件上传处理
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.name.endsWith('.txt')) {
      alert('请上传txt格式的文件');
      return;
    }

    setIsFileUploading(true);
    setSearchResultsFile(file);

    try {
      const content = await file.text();
      setSearchResultsContent(content);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('读取文件失败，请重试');
    } finally {
      setIsFileUploading(false);
    }
  };

  // 拖拽上传处理
  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.name.endsWith('.txt')) {
      alert('请上传txt格式的文件');
      return;
    }

    setIsFileUploading(true);
    setSearchResultsFile(file);

    try {
      const content = await file.text();
      setSearchResultsContent(content);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('读取文件失败，请重试');
    } finally {
      setIsFileUploading(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // 复制检索式
  const copyResult = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('复制失败');
    }
  };

  // 根据综述数量获取策略
  const getReviewStrategy = () => {
    const count = Number(reviewCount);
    if (count >= 50) return REVIEW_STRATEGY.abundant;
    if (count >= 10) return REVIEW_STRATEGY.moderate;
    if (count >= 5) return REVIEW_STRATEGY.limited;
    return REVIEW_STRATEGY.scarce;
  };

  // 按语言分组数据库
  const groupedDatabases = databases.reduce((acc, db) => {
    const lang = db.language === 'zh' ? '中文数据库' : '英文数据库';
    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(db);
    return acc;
  }, {} as Record<string, Database[]>);

  // 按提供商分组模型
  const groupedModels = models.reduce((acc, m) => {
    if (!acc[m.provider]) acc[m.provider] = [];
    acc[m.provider].push(m);
    return acc;
  }, {} as Record<string, AIModel[]>);

  const selectedDb = databases.find(d => d.id === database);
  const selectedTemplate = templates.find(t => t.id === template);
  const selectedModel = models.find(m => m.id === model);
  const selectedGranularity = GRANULARITY_CONFIG[granularity as keyof typeof GRANULARITY_CONFIG];

  // 用户指南步骤配置
  const guideSteps = [
    {
      title: '核心流程概览',
      icon: <Target className="w-6 h-6 text-blue-500" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[
              { step: 1, title: '输入关键词', desc: '输入想写综述的领域', icon: <FileText className="w-5 h-5" /> },
              { step: 2, title: '生成检索式', desc: 'AI自动生成专业检索式', icon: <Sparkles className="w-5 h-5" /> },
              { step: 3, title: '检索论文', desc: '在数据库中检索论文', icon: <Search className="w-5 h-5" /> },
              { step: 4, title: 'AI分析综述', desc: '筛选综述输入AI分析', icon: <BarChart3 className="w-5 h-5" /> },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mb-2">
                  {item.step}
                </div>
                <div className="text-blue-500 mb-1">{item.icon}</div>
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              <strong>💡 关键步骤：</strong>第四步是核心！从检索结果中筛选综述论文，输入AI分析，获得选题方向建议。
            </p>
          </div>
        </div>
      ),
    },
    {
      title: '主题词颗粒度',
      icon: <Layers className="w-6 h-6 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            主题词颗粒度直接影响：AI生成效果、检索文献总数、综述论文数量
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.values(GRANULARITY_CONFIG).map((g) => (
              <div key={g.id} className={`p-4 rounded-lg border-2 ${g.id === 'medium' ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30' : 'border-slate-200 dark:border-slate-700'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={g.id === 'medium' ? 'default' : 'outline'}>{g.name}</Badge>
                  {g.id === 'medium' && <Badge className="bg-purple-500">推荐</Badge>}
                </div>
                <p className="text-sm font-medium mb-1">{g.description}</p>
                <p className="text-xs text-slate-500 mb-2">示例：{g.example}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">{g.tip}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: '综述数量应对策略',
      icon: <BookMarked className="w-6 h-6 text-green-500" />,
      content: (
        <div className="space-y-3">
          {Object.values(REVIEW_STRATEGY).map((s) => (
            <div key={s.range} className={`p-3 rounded-lg border-l-4 ${
              s.color === 'green' ? 'border-green-500 bg-green-50 dark:bg-green-950/30' :
              s.color === 'blue' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' :
              s.color === 'yellow' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30' :
              'border-orange-500 bg-orange-50 dark:bg-orange-950/30'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm">{s.range}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  s.color === 'green' ? 'bg-green-200 text-green-800' :
                  s.color === 'blue' ? 'bg-blue-200 text-blue-800' :
                  s.color === 'yellow' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-orange-200 text-orange-800'
                }`}>{s.title}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{s.description}</p>
              <p className="text-xs font-medium">{s.action}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: '相关度评估方法',
      icon: <Scale className="w-6 h-6 text-orange-500" />,
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <p className="font-medium mb-2">快速判断方法：</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <li>按时间倒序选取10篇文献标题</li>
              <li>快速浏览标题与选题的相关性</li>
              <li>计算相关度 = 相关篇数 / 10</li>
            </ol>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">≥60%</p>
              <p className="text-xs text-slate-600">相关度良好，可直接进行</p>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-yellow-600">50-60%</p>
              <p className="text-xs text-slate-600">可接受范围，继续流程</p>
            </div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>💡 提示：</strong>初步检索不追求100%相关度，50-60%即可进入下一步。完成比完美更重要！
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* 完整用户指南弹窗 */}
      <Dialog open={showGuide} onOpenChange={setShowGuide}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="w-6 h-6 text-blue-500" />
              文献检索完整指南
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              掌握高效文献检索的核心方法与策略
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
                文献检索工具
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
              <Search className="w-3 h-3 mr-1" />
              智能文献检索
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI驱动的检索式生成器
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              两种检索模式，覆盖从探索到精准的全流程文献检索需求
            </p>
          </div>

          {/* Mode Tabs */}
          <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as 'exploration' | 'focused')} className="space-y-6">
            <div className="flex justify-center">
              <TabsList className="grid grid-cols-2 w-full max-w-md">
                <TabsTrigger value="exploration" className="flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  探索模式
                </TabsTrigger>
                <TabsTrigger value="focused" className="flex items-center gap-2">
                  <Crosshair className="w-4 h-4" />
                  聚焦模式
                </TabsTrigger>
              </TabsList>
            </div>

            {/* 探索模式 */}
            <TabsContent value="exploration" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Panel - Input */}
                <div className="lg:col-span-1 space-y-4">
                  <Card className="sticky top-24">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Compass className="w-5 h-5 text-blue-500" />
                        探索式检索
                      </CardTitle>
                      <CardDescription>
                        适用于初步探索领域，发现研究方向
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Keyword Input */}
                      <div className="space-y-2">
                        <Label htmlFor="keyword" className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-500" />
                          研究领域 / 关键词
                        </Label>
                        <Textarea
                          id="keyword"
                          placeholder="例如：机器学习在教育领域的应用、医疗人工智能、碳中和政策..."
                          value={keyword}
                          onChange={(e) => setKeyword(e.target.value)}
                          className="min-h-[80px]"
                        />
                      </div>

                      {/* Granularity Selection */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-purple-500" />
                          主题词颗粒度
                        </Label>
                        <Select value={granularity} onValueChange={setGranularity}>
                          <SelectTrigger>
                            <SelectValue placeholder="选择颗粒度" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(GRANULARITY_CONFIG).map((g) => (
                              <SelectItem key={g.id} value={g.id}>
                                <div className="flex items-center gap-2">
                                  <span>{g.name}</span>
                                  {g.id === 'medium' && (
                                    <Badge className="bg-purple-500 text-white text-[10px] py-0">推荐</Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedGranularity && (
                          <p className="text-xs text-slate-500">{selectedGranularity.tip}</p>
                        )}
                      </div>

                      {/* Database Selection */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Database className="w-4 h-4 text-blue-500" />
                          目标数据库
                        </Label>
                        <Select value={database} onValueChange={setDatabase}>
                          <SelectTrigger>
                            <SelectValue placeholder="选择数据库" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(groupedDatabases).map(([group, dbs]) => (
                              <div key={group}>
                                <div className="px-2 py-1.5 text-sm font-semibold text-slate-500 flex items-center gap-1">
                                  <Languages className="w-3 h-3" />
                                  {group}
                                </div>
                                {dbs.map((db) => (
                                  <SelectItem key={db.id} value={db.id}>
                                    {db.name}
                                  </SelectItem>
                                ))}
                              </div>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Template Selection */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-orange-500" />
                          检索策略模板
                        </Label>
                        <Select value={template} onValueChange={setTemplate}>
                          <SelectTrigger>
                            <SelectValue placeholder="选择模板" />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.map((t) => (
                              <SelectItem key={t.id} value={t.id}>
                                <div className="flex items-center gap-2">
                                  <span>{t.name}</span>
                                  {t.id === 'stable' && (
                                    <Badge className="bg-blue-500 text-white text-[10px] py-0">推荐</Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* AI Model Selection */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-green-500" />
                          AI模型
                        </Label>
                        <Select value={model} onValueChange={setModel}>
                          <SelectTrigger>
                            <SelectValue placeholder="选择模型" />
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

                      {/* Generate Button */}
                      <Button 
                        onClick={generateSearchQuery}
                        disabled={isGenerating || !keyword.trim()}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        size="lg"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            正在生成...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            生成检索式
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Panel - Result */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Result Card */}
                  <Card className="min-h-[300px]">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        生成结果
                      </CardTitle>
                      {result && (
                        <Button variant="outline" size="sm" onClick={() => copyResult(result)}>
                          {copied ? (
                            <>
                              <Check className="mr-1 h-4 w-4 text-green-500" />
                              已复制
                            </>
                          ) : (
                            <>
                              <Copy className="mr-1 h-4 w-4" />
                              复制全文
                            </>
                          )}
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent>
                      {!result && !isGenerating ? (
                        <div className="h-[200px] flex flex-col items-center justify-center text-slate-400">
                          <Search className="w-16 h-16 mb-4 opacity-50" />
                          <p>输入研究领域，点击生成检索式</p>
                        </div>
                      ) : (
                        <div ref={resultRef} className="prose prose-sm dark:prose-invert max-w-none">
                          <pre className="whitespace-pre-wrap bg-slate-50 dark:bg-slate-900 p-4 rounded-lg text-sm font-mono overflow-auto max-h-[400px]">
                            {result}
                            {isGenerating && (
                              <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1" />
                            )}
                          </pre>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* 检索结果评估区域 */}
                  {showEvaluation && result && !isGenerating && (
                    <Card className="border-2 border-blue-200 dark:border-blue-800">
                      <CardHeader className="bg-blue-50 dark:bg-blue-950/30">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-blue-500" />
                          检索结果评估
                        </CardTitle>
                        <CardDescription>
                          完成数据库检索后，在此记录结果以获得下一步建议
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-4">
                        {/* 综述数量输入 */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <BookMarked className="w-4 h-4 text-purple-500" />
                            检索结果中的综述论文数量
                          </Label>
                          <div className="flex items-center gap-3">
                            <Input
                              type="number"
                              placeholder="输入数量"
                              value={reviewCount}
                              onChange={(e) => setReviewCount(e.target.value ? parseInt(e.target.value) : '')}
                              className="w-32"
                            />
                            <span className="text-sm text-slate-500">篇</span>
                          </div>
                        </div>

                        {/* 相关度评估 */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Scale className="w-4 h-4 text-orange-500" />
                            相关度评估
                            <Badge variant="outline" className="text-xs">建议 ≥50%</Badge>
                          </Label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={relevanceScore}
                            onChange={(e) => setRelevanceScore(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">低</span>
                            <span className="font-medium">{relevanceScore}%</span>
                            <span className="text-slate-500">高</span>
                          </div>
                        </div>

                        {/* 策略建议 */}
                        {reviewCount !== '' && (
                          <div className={`p-4 rounded-lg border-l-4 ${
                            getReviewStrategy().color === 'green' ? 'border-green-500 bg-green-50 dark:bg-green-950/30' :
                            getReviewStrategy().color === 'blue' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' :
                            getReviewStrategy().color === 'yellow' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30' :
                            'border-orange-500 bg-orange-50 dark:bg-orange-950/30'
                          }`}>
                            <div className="flex items-start gap-3">
                              {getReviewStrategy().color === 'green' ? <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" /> :
                               getReviewStrategy().color === 'blue' ? <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" /> :
                               getReviewStrategy().color === 'yellow' ? <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" /> :
                               <CircleAlert className="w-5 h-5 text-orange-500 mt-0.5" />}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold">{getReviewStrategy().range}</span>
                                  <span className={`text-xs px-2 py-0.5 rounded ${
                                    getReviewStrategy().color === 'green' ? 'bg-green-200 text-green-800' :
                                    getReviewStrategy().color === 'blue' ? 'bg-blue-200 text-blue-800' :
                                    getReviewStrategy().color === 'yellow' ? 'bg-yellow-200 text-yellow-800' :
                                    'bg-orange-200 text-orange-800'
                                  }`}>{getReviewStrategy().title}</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                  {getReviewStrategy().description}
                                </p>
                                <p className="text-sm font-medium">{getReviewStrategy().action}</p>
                                
                                {getReviewStrategy().nextStep === 'adjust-or-special' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="mt-3"
                                    onClick={() => setSearchMode('focused')}
                                  >
                                    <ArrowRight className="mr-1 h-4 w-4" />
                                    切换到聚焦模式
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* 聚焦模式 */}
            <TabsContent value="focused" className="space-y-6">
              {/* 步骤指示器 */}
              <div className="flex items-center justify-center gap-4">
                {Object.values(FOCUSED_STEPS).map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${
                        focusedStep === step.id
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                      onClick={() => setFocusedStep(step.id as 'matrix-construction' | 'iterative-optimization')}
                    >
                      <step.icon className="w-4 h-4" />
                      <span className="font-medium text-sm">{step.name}</span>
                    </div>
                    {index < Object.values(FOCUSED_STEPS).length - 1 && (
                      <ArrowRight className="w-5 h-5 mx-2 text-slate-400" />
                    )}
                  </div>
                ))}
              </div>

              {/* 步骤1：矩阵式检索策略构建 */}
              {focusedStep === 'matrix-construction' && (
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 space-y-4">
                    <Card className="sticky top-24">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Grid3X3 className="w-5 h-5 text-green-500" />
                          矩阵式检索策略
                        </CardTitle>
                        <CardDescription>
                          系统解构研究主题，生成多阶段检索计划
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-red-500" />
                            具体研究方向
                          </Label>
                          <Textarea
                            placeholder="例如：锌离子电池电解质的界面稳定性研究"
                            value={focusedKeyword}
                            onChange={(e) => setFocusedKeyword(e.target.value)}
                            className="min-h-[100px]"
                          />
                          <p className="text-xs text-slate-500">
                            输入您已确定的具体研究方向，AI将进行系统性解构
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-blue-500" />
                            目标数据库
                          </Label>
                          <Select value={focusedDatabase} onValueChange={setFocusedDatabase}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(groupedDatabases).map(([group, dbs]) => (
                                <div key={group}>
                                  <div className="px-2 py-1.5 text-sm font-semibold text-slate-500">
                                    {group}
                                  </div>
                                  {dbs.map((db) => (
                                    <SelectItem key={db.id} value={db.id}>
                                      {db.name}
                                    </SelectItem>
                                  ))}
                                </div>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Bot className="w-4 h-4 text-green-500" />
                            AI模型
                          </Label>
                          <Select value={focusedModel} onValueChange={setFocusedModel}>
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

                        {/* 提示词版本选择 */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-purple-500" />
                            提示词模板
                          </Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div
                              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                promptVersion === 'stable'
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                              onClick={() => setPromptVersion('stable')}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Zap className="w-4 h-4 text-blue-500" />
                                <span className="font-medium text-sm">稳定版</span>
                              </div>
                              <p className="text-xs text-slate-500">概念分解 + 语义群 + 组合策略</p>
                            </div>
                            <div
                              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                promptVersion === 'extended'
                                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30'
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                              onClick={() => setPromptVersion('extended')}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Layers className="w-4 h-4 text-purple-500" />
                                <span className="font-medium text-sm">扩展版</span>
                              </div>
                              <p className="text-xs text-slate-500">角色分配 + 四阶段计划 + 质量检验</p>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500">
                            {promptVersion === 'stable' 
                              ? '稳定版：快速生成组合检索策略，适合大多数场景'
                              : '扩展版：详细的角色分配和四阶段计划，适合复杂主题'}
                          </p>
                        </div>

                        <Button
                          onClick={generateMatrixStrategy}
                          disabled={isFocusedGenerating || !focusedKeyword.trim()}
                          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                          size="lg"
                        >
                          {isFocusedGenerating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              构建中...
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              构建矩阵策略
                            </>
                          )}
                        </Button>

                        <Collapsible>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="w-full justify-between" size="sm">
                              <span className="flex items-center gap-1">
                                <Info className="w-4 h-4" />
                                什么是矩阵式检索？
                              </span>
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="text-xs text-slate-500 space-y-1 pt-2">
                            <p>矩阵式检索是一种结构化的检索策略，将研究主题分解为多个维度：</p>
                            <p>• <strong>概念维度</strong>：核心概念、相关概念、排除概念</p>
                            <p>• <strong>时间维度</strong>：历史发展、最新进展</p>
                            <p>• <strong>方法维度</strong>：研究方法、技术路线</p>
                            <p>• <strong>应用维度</strong>：应用场景、产业实践</p>
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
                          矩阵式检索计划
                        </CardTitle>
                        {focusedResult && (
                          <Button variant="outline" size="sm" onClick={() => copyResult(focusedResult)}>
                            <Copy className="mr-1 h-4 w-4" />
                            复制
                          </Button>
                        )}
                      </CardHeader>
                      <CardContent>
                        {!focusedResult && !isFocusedGenerating ? (
                          <div className="h-[300px] flex flex-col items-center justify-center text-slate-400">
                            <Grid3X3 className="w-16 h-16 mb-4 opacity-50" />
                            <p>输入具体研究方向，构建矩阵式检索策略</p>
                            <p className="text-sm mt-2">适用于确定研究方向后的精准文献检索</p>
                          </div>
                        ) : (
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <pre className="whitespace-pre-wrap bg-slate-50 dark:bg-slate-900 p-4 rounded-lg text-sm font-mono overflow-auto max-h-[500px]">
                              {focusedResult}
                              {isFocusedGenerating && (
                                <span className="inline-block w-2 h-4 bg-green-500 animate-pulse ml-1" />
                              )}
                            </pre>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {focusedResult && !isFocusedGenerating && (
                      <Card>
                        <CardContent className="py-4">
                          <div className="flex flex-wrap gap-2 justify-center">
                            <Button variant="outline" size="sm" onClick={generateMatrixStrategy}>
                              <RefreshCw className="mr-1 h-4 w-4" />
                              重新构建
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-gradient-to-r from-green-600 to-blue-600"
                              onClick={() => setFocusedStep('iterative-optimization')}
                            >
                              <StepForward className="mr-1 h-4 w-4" />
                              进入迭代优化
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )}

              {/* 步骤2：检索策略迭代优化 */}
              {focusedStep === 'iterative-optimization' && (
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 space-y-4">
                    <Card className="sticky top-24">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <RefreshCcw className="w-5 h-5 text-orange-500" />
                          迭代优化策略
                        </CardTitle>
                        <CardDescription>
                          基于检索结果分析，优化检索策略
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* 检索目标 */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-red-500" />
                            检索目标
                          </Label>
                          <Textarea
                            placeholder="例如：检索所有关于'阴离子'在'锌离子电池'背景下的研究文献"
                            value={searchGoal}
                            onChange={(e) => setSearchGoal(e.target.value)}
                            className="min-h-[80px]"
                          />
                          <p className="text-xs text-slate-500">
                            清晰描述您本次检索的具体目标
                          </p>
                        </div>

                        {/* 检索式 */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-500" />
                            检索式
                          </Label>
                          <Textarea
                            placeholder="粘贴步骤一生成的检索式..."
                            value={originalQuery}
                            onChange={(e) => setOriginalQuery(e.target.value)}
                            className="min-h-[100px] font-mono text-sm"
                          />
                          {focusedResult && !originalQuery && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-full"
                              onClick={() => {
                                // 尝试提取检索式
                                const codeBlockMatch = focusedResult.match(/```\n?([\s\S]*?)\n?```/);
                                if (codeBlockMatch) {
                                  setOriginalQuery(codeBlockMatch[1].trim());
                                } else {
                                  setOriginalQuery(focusedResult);
                                }
                              }}
                            >
                              从上一步导入检索式
                            </Button>
                          )}
                        </div>

                        {/* 检索结果文件上传 */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <FileSearch className="w-4 h-4 text-green-500" />
                            检索结果文件
                          </Label>
                          <div
                            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                              searchResultsFile 
                                ? 'border-green-500 bg-green-50 dark:bg-green-950/30' 
                                : 'border-slate-300 hover:border-slate-400'
                            }`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                          >
                            {searchResultsFile ? (
                              <div className="space-y-2">
                                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto" />
                                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                                  {searchResultsFile.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {(searchResultsFile.size / 1024).toFixed(1)} KB
                                </p>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => {
                                    setSearchResultsFile(null);
                                    setSearchResultsContent('');
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
                                  支持 .txt 格式
                                </p>
                                <label className="cursor-pointer">
                                  <input
                                    type="file"
                                    accept=".txt"
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
                            上传按日期排序的前100篇带摘要的文献信息（txt格式）
                          </p>
                        </div>

                        {/* 检索结果内容（可手动编辑） */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <FileSearch className="w-4 h-4 text-purple-500" />
                            检索结果内容
                            {searchResultsContent && (
                              <Badge variant="outline" className="text-xs">
                                {searchResultsContent.split('\n').length} 行
                              </Badge>
                            )}
                          </Label>
                          <Textarea
                            placeholder="或直接粘贴检索结果内容（标题+摘要）..."
                            value={searchResultsContent}
                            onChange={(e) => setSearchResultsContent(e.target.value)}
                            className="min-h-[120px] text-sm"
                          />
                        </div>

                        {/* 数据库选择 */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-blue-500" />
                            目标数据库
                          </Label>
                          <Select value={focusedDatabase} onValueChange={setFocusedDatabase}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(groupedDatabases).map(([group, dbs]) => (
                                <div key={group}>
                                  <div className="px-2 py-1.5 text-sm font-semibold text-slate-500">
                                    {group}
                                  </div>
                                  {dbs.map((db) => (
                                    <SelectItem key={db.id} value={db.id}>
                                      {db.name}
                                    </SelectItem>
                                  ))}
                                </div>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          onClick={optimizeSearchStrategy}
                          disabled={isOptimizing || !searchGoal.trim() || !originalQuery.trim() || !searchResultsContent.trim()}
                          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                          size="lg"
                        >
                          {isOptimizing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              分析中...
                            </>
                          ) : (
                            <>
                              <RefreshCcw className="mr-2 h-4 w-4" />
                              分析并优化策略
                            </>
                          )}
                        </Button>

                        <Collapsible>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="w-full justify-between" size="sm">
                              <span className="flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                使用说明
                              </span>
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="text-xs text-slate-500 space-y-1 pt-2">
                            <p><strong>迭代优化流程：</strong></p>
                            <p>1. 使用步骤一生成的检索式在数据库检索</p>
                            <p>2. 按日期排序，导出前100篇文献信息（含标题+摘要）</p>
                            <p>3. 将导出的txt文件上传或粘贴内容</p>
                            <p>4. AI分析每篇文献的相关度</p>
                            <p>5. 识别低相关度文献的共性特征</p>
                            <p>6. 生成三种优化版本的检索式</p>
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
                          优化分析结果
                        </CardTitle>
                        {optimizationResult && (
                          <Button variant="outline" size="sm" onClick={() => copyResult(optimizationResult)}>
                            <Copy className="mr-1 h-4 w-4" />
                            复制
                          </Button>
                        )}
                      </CardHeader>
                      <CardContent>
                        {!optimizationResult && !isOptimizing ? (
                          <div className="h-[300px] flex flex-col items-center justify-center text-slate-400">
                            <RefreshCcw className="w-16 h-16 mb-4 opacity-50" />
                            <p>上传检索结果文件，开始分析</p>
                            <p className="text-sm mt-2">AI将逐篇分析文献相关度，识别误检原因</p>
                          </div>
                        ) : (
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <pre className="whitespace-pre-wrap bg-slate-50 dark:bg-slate-900 p-4 rounded-lg text-sm font-mono overflow-auto max-h-[500px]">
                              {optimizationResult}
                              {isOptimizing && (
                                <span className="inline-block w-2 h-4 bg-orange-500 animate-pulse ml-1" />
                              )}
                            </pre>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {optimizationResult && !isOptimizing && (
                      <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                        <CardContent className="py-4">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                            <div className="flex-1">
                              <p className="font-medium text-green-800 dark:text-green-300">
                                检索策略已优化
                              </p>
                              <p className="text-sm text-green-700 dark:text-green-400">
                                请使用优化后的检索式重新检索，如仍有误检可继续迭代优化
                              </p>
                            </div>
                            <Button 
                              size="sm"
                              onClick={() => {
                                // 清空内容，准备下一轮迭代
                                setSearchResultsContent('');
                                setSearchResultsFile(null);
                                setOptimizationResult('');
                              }}
                            >
                              <RefreshCcw className="mr-1 h-4 w-4" />
                              继续迭代
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* 分析说明 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-500" />
                          分析说明
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                            <p className="font-medium text-green-800 dark:text-green-300 text-sm mb-1">高度相关</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              直接研究核心主题的文献
                            </p>
                          </div>
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                            <p className="font-medium text-blue-800 dark:text-blue-300 text-sm mb-1">中度相关</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              涉及部分方面，有参考价值
                            </p>
                          </div>
                          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                            <p className="font-medium text-yellow-800 dark:text-yellow-300 text-sm mb-1">低度相关</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              仅涉及边缘方面，参考有限
                            </p>
                          </div>
                          <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                            <p className="font-medium text-red-800 dark:text-red-300 text-sm mb-1">不相关</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              主题完全不符，需要排除
                            </p>
                          </div>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            <strong>三种优化版本：</strong>
                            <span className="ml-2">保守优化（低风险）</span>
                            <span className="mx-1">•</span>
                            <span>平衡优化（推荐）</span>
                            <span className="mx-1">•</span>
                            <span>激进优化（高风险）</span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
