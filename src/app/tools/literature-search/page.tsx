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
  HelpCircle
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

export default function LiteratureSearchPage() {
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

  // 生成检索式
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
                  setShowEvaluation(true); // 生成后显示评估区域
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

  // 复制检索式
  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(result);
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
              输入研究领域，AI自动生成适用于各大数据库的专业检索式
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Panel - Input */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    检索配置
                  </CardTitle>
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
                    <p className="text-xs text-slate-500">
                      输入您的综述研究方向或核心关键词
                    </p>
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
                      <div className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 p-2 rounded">
                        <p className="font-medium mb-1">{selectedGranularity.description}</p>
                        <p className="text-slate-400">{selectedGranularity.tip}</p>
                      </div>
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
                    {selectedDb && (
                      <div className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 p-2 rounded">
                        <span className="font-medium">示例：</span>
                        <code className="text-blue-600 dark:text-blue-400">{selectedDb.example}</code>
                      </div>
                    )}
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
                    {selectedTemplate && (
                      <p className="text-xs text-slate-500">
                        {selectedTemplate.description} - {selectedTemplate.bestFor}
                      </p>
                    )}
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
                    {selectedModel && (
                      <p className="text-xs text-slate-500">
                        {selectedModel.description}
                      </p>
                    )}
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

                  {/* Tips */}
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between" size="sm">
                        <span className="flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          使用技巧
                        </span>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="text-xs text-slate-500 space-y-1 pt-2">
                      <p>• <strong>颗粒度</strong>：粗颗粒度范围广，细颗粒度精度高</p>
                      <p>• <strong>稳定版</strong>：结果稳定，适合常规检索</p>
                      <p>• <strong>高级版</strong>：同义词扩展更全面，适合跨学科</p>
                      <p>• <strong>全覆盖版</strong>：同时生成多数据库检索式</p>
                      <p>• 完成比完美更重要，先走完流程再优化</p>
                    </CollapsibleContent>
                  </Collapsible>
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
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyResult}
                      >
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
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {!result && !isGenerating ? (
                    <div className="h-[200px] flex flex-col items-center justify-center text-slate-400">
                      <Search className="w-16 h-16 mb-4 opacity-50" />
                      <p>输入研究领域，点击生成检索式</p>
                      <p className="text-sm mt-2">支持中英文全学科覆盖</p>
                    </div>
                  ) : (
                    <div 
                      ref={resultRef}
                      className="prose prose-sm dark:prose-invert max-w-none"
                    >
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
                        <Badge variant="outline" className="text-xs">
                          建议 ≥50%
                        </Badge>
                      </Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">低相关度</span>
                          <span className="font-medium">{relevanceScore}%</span>
                          <span className="text-slate-500">高相关度</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={relevanceScore}
                          onChange={(e) => setRelevanceScore(parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <p className="text-xs text-slate-500">
                          方法：按时间倒序取10篇文献标题，统计与选题相关的篇数
                        </p>
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
                            
                            {/* 操作按钮 */}
                            <div className="flex flex-wrap gap-2 mt-3">
                              {getReviewStrategy().nextStep === 'ai-analysis' && (
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  <Rocket className="mr-1 h-4 w-4" />
                                  进入AI分析
                                </Button>
                              )}
                              {getReviewStrategy().nextStep === 'flexible' && (
                                <>
                                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                    <Rocket className="mr-1 h-4 w-4" />
                                    仅用综述分析
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <FileSearch className="mr-1 h-4 w-4" />
                                    加入研究型论文
                                  </Button>
                                </>
                              )}
                              {getReviewStrategy().nextStep === 'extended-analysis' && (
                                <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                                  <FileSearch className="mr-1 h-4 w-4" />
                                  综述+研究论文分析
                                </Button>
                              )}
                              {getReviewStrategy().nextStep === 'adjust-or-special' && (
                                <>
                                  <Button size="sm" variant="outline" onClick={() => {
                                    const currentGranularity = granularity;
                                    if (currentGranularity === 'fine') {
                                      setGranularity('medium');
                                    } else if (currentGranularity === 'medium') {
                                      setGranularity('coarse');
                                    }
                                    alert('已调整颗粒度，请重新生成检索式');
                                  }}>
                                    <RefreshCw className="mr-1 h-4 w-4" />
                                    调整颗粒度重试
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <ArrowRight className="mr-1 h-4 w-4" />
                                    新兴领域专项流程
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 相关度警告 */}
                    {relevanceScore < 50 && reviewCount !== '' && (
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <p className="text-sm text-yellow-800 dark:text-yellow-300">
                          <AlertTriangle className="w-4 h-4 inline mr-1" />
                          相关度低于50%，建议调整检索式或检查关键词是否准确
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              {result && !isGenerating && (
                <Card>
                  <CardContent className="py-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Button variant="outline" size="sm" onClick={generateSearchQuery}>
                        <RefreshCw className="mr-1 h-4 w-4" />
                        重新生成
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-1 h-4 w-4" />
                        导出结果
                      </Button>
                      <Button variant="outline" size="sm">
                        <Star className="mr-1 h-4 w-4" />
                        收藏
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowHistory(!showHistory)}
                      >
                        <History className="mr-1 h-4 w-4" />
                        历史记录 ({history.length})
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* History Panel */}
              {showHistory && history.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <History className="w-5 h-5" />
                      历史记录
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-[300px] overflow-auto">
                      {history.map((item) => (
                        <div 
                          key={item.id}
                          className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          onClick={() => {
                            setKeyword(item.keyword);
                            setDatabase(item.database);
                            setTemplate(item.template);
                            setModel(item.model || 'doubao-seed-1-8-251228');
                            setGranularity(item.granularity || 'medium');
                            setResult(item.result);
                            setShowHistory(false);
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm truncate">{item.keyword}</span>
                            <span className="text-xs text-slate-500">{item.timestamp}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs">
                              {databases.find(d => d.id === item.database)?.name}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {templates.find(t => t.id === item.template)?.name}
                            </Badge>
                            {item.granularity && (
                              <Badge variant="outline" className="text-xs">
                                {GRANULARITY_CONFIG[item.granularity as keyof typeof GRANULARITY_CONFIG]?.name}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Supported Databases */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    支持的数据库
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="english">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="english">英文数据库</TabsTrigger>
                      <TabsTrigger value="chinese">中文数据库</TabsTrigger>
                    </TabsList>
                    <TabsContent value="english" className="mt-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {databases.filter(d => d.language === 'en').map((db) => (
                          <div 
                            key={db.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              database === db.id 
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                                : 'hover:border-slate-300'
                            }`}
                            onClick={() => setDatabase(db.id)}
                          >
                            <div className="font-medium text-sm">{db.name}</div>
                            <div className="text-xs text-slate-500 mt-1">英文文献</div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="chinese" className="mt-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {databases.filter(d => d.language === 'zh').map((db) => (
                          <div 
                            key={db.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              database === db.id 
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                                : 'hover:border-slate-300'
                            }`}
                            onClick={() => setDatabase(db.id)}
                          >
                            <div className="font-medium text-sm">{db.name}</div>
                            <div className="text-xs text-slate-500 mt-1">中文文献</div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
