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
  Layers
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
  result: string;
  timestamp: string;
}

export default function LiteratureSearchPage() {
  const [keyword, setKeyword] = useState('');
  const [database, setDatabase] = useState('scopus');
  const [template, setTemplate] = useState('stable');
  const [model, setModel] = useState('doubao-seed-1-8-251228');
  const [databases, setDatabases] = useState<Database[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [models, setModels] = useState<AIModel[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
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
        body: JSON.stringify({ keyword, database, template, model }),
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
                    result: fullResult,
                  });
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* 模式介绍弹窗 */}
      <Dialog open={showGuide} onOpenChange={setShowGuide}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              选择适合您的检索模式
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              三种检索策略模板，满足不同需求场景
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {templates.map((t, index) => (
              <Card key={t.id} className={`overflow-hidden ${t.id === 'stable' ? 'border-2 border-blue-500' : ''}`}>
                <div className={`h-1 ${
                  t.id === 'stable' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                  t.id === 'advanced' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                  'bg-gradient-to-r from-orange-500 to-red-500'
                }`} />
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {t.id === 'stable' && <Zap className="w-5 h-5 text-blue-500" />}
                      {t.id === 'advanced' && <Layers className="w-5 h-5 text-purple-500" />}
                      {t.id === 'comprehensive' && <Target className="w-5 h-5 text-orange-500" />}
                      <h3 className="font-semibold text-lg">{t.name}</h3>
                      {t.id === 'stable' && (
                        <Badge className="bg-blue-500 text-white text-xs">推荐新手</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                    {t.description}
                  </p>
                  <div className="space-y-2 mb-3">
                    <p className="text-xs font-medium text-slate-500">核心特点：</p>
                    <div className="flex flex-wrap gap-2">
                      {t.features.map((f, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{f}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                    <p className="text-xs text-slate-500">
                      <span className="font-medium">适合场景：</span>{t.bestFor}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>💡 建议：</strong>首次使用推荐选择「稳定版」，结果稳定可靠。如需更全面的检索或跨学科研究，可尝试「高级版」。如需中英文文献全覆盖，请选择「全覆盖版」。
            </p>
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={closeGuide} className="bg-gradient-to-r from-blue-600 to-purple-600">
              开始使用
            </Button>
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
              <Button variant="ghost" size="sm" onClick={() => setShowGuide(true)}>
                <Info className="mr-1 h-4 w-4" />
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
                      <p>• <strong>稳定版</strong>：结果稳定，适合常规检索</p>
                      <p>• <strong>高级版</strong>：同义词扩展更全面，适合跨学科</p>
                      <p>• <strong>全覆盖版</strong>：同时生成多数据库检索式</p>
                      <p>• 可多次生成，选择最优结果</p>
                      <p>• 不同模型生成结果可能略有差异</p>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Result */}
            <div className="lg:col-span-2 space-y-4">
              {/* Result Card */}
              <Card className="min-h-[400px]">
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
                    <div className="h-[300px] flex flex-col items-center justify-center text-slate-400">
                      <Search className="w-16 h-16 mb-4 opacity-50" />
                      <p>输入研究领域，点击生成检索式</p>
                      <p className="text-sm mt-2">支持中英文全学科覆盖</p>
                    </div>
                  ) : (
                    <div 
                      ref={resultRef}
                      className="prose prose-sm dark:prose-invert max-w-none"
                    >
                      <pre className="whitespace-pre-wrap bg-slate-50 dark:bg-slate-900 p-4 rounded-lg text-sm font-mono overflow-auto max-h-[500px]">
                        {result}
                        {isGenerating && (
                          <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1" />
                        )}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>

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
