'use client';

import { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft,
  Upload,
  FileSpreadsheet,
  FileText,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Download,
  Bot,
  BarChart3,
  TrendingUp,
  Lightbulb,
  Target,
  AlertCircle,
  ChevronDown,
  BookOpen,
  FileCheck,
  Trash2,
  RefreshCw,
  StepForward,
  CheckCircle2,
  Circle,
  Play
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AnalysisStep {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface AIModel {
  id: string;
  name: string;
  description: string;
  provider: string;
  recommended: boolean;
}

interface AnalysisResult {
  step: string;
  content: string;
  timestamp: string;
}

export default function TopicAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [field, setField] = useState('');
  const [selectedStep, setSelectedStep] = useState('field-overview');
  const [model, setModel] = useState('deepseek-r1-250528');
  const [steps, setSteps] = useState<AnalysisStep[]>([]);
  const [models, setModels] = useState<AIModel[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState('');
  const [literatureCount, setLiteratureCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // 加载配置
  useEffect(() => {
    fetch('/api/topic-analysis')
      .then(res => res.json())
      .then(data => {
        setSteps(data.analysisSteps || []);
        setModels(data.models || []);
      })
      .catch(console.error);
  }, []);

  // 处理文件拖放
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    const fileName = selectedFile.name.toLowerCase();
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || 
        fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      setFile(selectedFile);
    } else {
      alert('请上传Excel (.xlsx, .xls) 或 Word (.docx, .doc) 文件');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // 执行分析
  const runAnalysis = async () => {
    if (!file) {
      alert('请上传文献文件');
      return;
    }

    if (!field.trim()) {
      alert('请输入研究领域');
      return;
    }

    setIsAnalyzing(true);
    setResult('');
    setLiteratureCount(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('field', field);
      formData.append('step', selectedStep);
      formData.append('model', model);

      const response = await fetch('/api/topic-analysis', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '分析失败');
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
                if (data.type === 'meta') {
                  setLiteratureCount(data.literatureCount);
                }
                if (data.type === 'content' && data.content) {
                  fullResult += data.content;
                  setResult(fullResult);
                }
                if (data.type === 'done') {
                  // 保存到历史
                  const newResult: AnalysisResult = {
                    step: selectedStep,
                    content: fullResult,
                    timestamp: new Date().toLocaleString('zh-CN'),
                  };
                  setAnalysisHistory(prev => [...prev, newResult]);
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
      alert(error instanceof Error ? error.message : '分析失败，请稍后重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 复制结果
  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('复制失败');
    }
  };

  // 获取步骤图标
  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'BarChart3': return <BarChart3 className="w-5 h-5" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5" />;
      case 'Lightbulb': return <Lightbulb className="w-5 h-5" />;
      case 'Target': return <Target className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  // 按提供商分组模型
  const groupedModels = models.reduce((acc, m) => {
    if (!acc[m.provider]) acc[m.provider] = [];
    acc[m.provider].push(m);
    return acc;
  }, {} as Record<string, AIModel[]>);

  const selectedStepInfo = steps.find(s => s.id === selectedStep);
  const selectedModelInfo = models.find(m => m.id === model);

  // 分析步骤列表（用于进度显示）
  const stepList = [
    { id: 'field-overview', name: '领域现状', order: 1 },
    { id: 'trend-analysis', name: '趋势分析', order: 2 },
    { id: 'gap-discovery', name: '空白发现', order: 3 },
    { id: 'specific-recommendations', name: '选题推荐', order: 4 },
  ];

  const currentStepOrder = stepList.find(s => s.id === selectedStep)?.order || 1;
  const completedSteps = analysisHistory.map(h => h.step);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
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
              <Badge variant="outline" className="text-sm">
                选题分析工具
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
              <BookOpen className="w-3 h-3 mr-1" />
              文献库选题分析
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI驱动的选题分析器
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              上传文献数据，AI自动分析研究趋势、发现空白点、推荐选题方向
            </p>
          </div>

          {/* Analysis Progress */}
          {file && (
            <Card className="mb-6">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  {stepList.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div 
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                          selectedStep === step.id 
                            ? 'bg-blue-500 text-white' 
                            : completedSteps.includes(step.id)
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                        onClick={() => setSelectedStep(step.id)}
                      >
                        {completedSteps.includes(step.id) ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium hidden md:inline">{step.name}</span>
                        <span className="text-sm font-medium md:hidden">{step.order}</span>
                      </div>
                      {index < stepList.length - 1 && (
                        <div className={`w-8 h-0.5 mx-1 ${
                          completedSteps.includes(step.id) ? 'bg-green-300' : 'bg-slate-200 dark:bg-slate-700'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Panel - Input */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    数据输入
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-blue-500" />
                      上传文献文件
                    </Label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                        dragActive 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' 
                          : file 
                            ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                            : 'border-slate-300 dark:border-slate-700 hover:border-slate-400'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls,.docx,.doc"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                      {file ? (
                        <div className="flex items-center justify-center gap-2">
                          <FileCheck className="w-8 h-8 text-green-500" />
                          <div className="text-left">
                            <p className="font-medium text-green-700 dark:text-green-300">{file.name}</p>
                            <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFile(null);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            拖放文件或点击上传
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            支持 Excel (.xlsx, .xls) 或 Word (.docx, .doc)
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      文件应包含：标题、作者、摘要、年份、期刊等字段
                    </p>
                  </div>

                  {/* Field Input */}
                  <div className="space-y-2">
                    <Label htmlFor="field">
                      研究领域
                    </Label>
                    <Input
                      id="field"
                      placeholder="例如：锌离子电池、医疗人工智能..."
                      value={field}
                      onChange={(e) => setField(e.target.value)}
                    />
                  </div>

                  {/* Analysis Step Selection */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-purple-500" />
                      分析步骤
                    </Label>
                    <div className="space-y-2">
                      {steps.map((step) => (
                        <div
                          key={step.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedStep === step.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                              : 'hover:border-slate-300'
                          }`}
                          onClick={() => setSelectedStep(step.id)}
                        >
                          <div className="flex items-center gap-2">
                            {getStepIcon(step.icon)}
                            <span className="font-medium text-sm">{step.name}</span>
                            {completedSteps.includes(step.id) && (
                              <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{step.description}</p>
                        </div>
                      ))}
                    </div>
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
                    {selectedModelInfo && (
                      <p className="text-xs text-slate-500">
                        {selectedModelInfo.description}
                      </p>
                    )}
                  </div>

                  {/* Analyze Button */}
                  <Button 
                    onClick={runAnalysis}
                    disabled={isAnalyzing || !file || !field.trim()}
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
                        <Sparkles className="mr-2 h-4 w-4" />
                        开始分析
                      </>
                    )}
                  </Button>

                  {/* Tips */}
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
                      <p>• <strong>第一步</strong>：在数据库检索后导出文献信息</p>
                      <p>• <strong>第二步</strong>：将文献整理为Excel或Word格式</p>
                      <p>• <strong>第三步</strong>：上传文件并选择分析步骤</p>
                      <p>• 建议按顺序完成四个分析步骤</p>
                      <p>• DeepSeek R1 推荐用于深度分析</p>
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
                    <BarChart3 className="w-5 h-5" />
                    分析结果
                    {literatureCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {literatureCount} 篇文献
                      </Badge>
                    )}
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
                  {!result && !isAnalyzing ? (
                    <div className="h-[300px] flex flex-col items-center justify-center text-slate-400">
                      <FileText className="w-16 h-16 mb-4 opacity-50" />
                      <p>上传文献文件，开始选题分析</p>
                      <p className="text-sm mt-2">支持 Excel 和 Word 格式</p>
                    </div>
                  ) : (
                    <div 
                      ref={resultRef}
                      className="prose prose-sm dark:prose-invert max-w-none"
                    >
                      <pre className="whitespace-pre-wrap bg-slate-50 dark:bg-slate-900 p-4 rounded-lg text-sm overflow-auto max-h-[600px]">
                        {result}
                        {isAnalyzing && (
                          <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1" />
                        )}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              {result && !isAnalyzing && (
                <Card>
                  <CardContent className="py-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Button variant="outline" size="sm" onClick={runAnalysis}>
                        <RefreshCw className="mr-1 h-4 w-4" />
                        重新分析
                      </Button>
                      {currentStepOrder < 4 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const nextStep = stepList.find(s => s.order === currentStepOrder + 1);
                            if (nextStep) {
                              setSelectedStep(nextStep.id);
                            }
                          }}
                        >
                          <StepForward className="mr-1 h-4 w-4" />
                          下一步分析
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Analysis History */}
              {analysisHistory.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      分析历史
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-[200px] overflow-auto">
                      {analysisHistory.map((item, index) => (
                        <div 
                          key={index}
                          className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          onClick={() => {
                            setSelectedStep(item.step);
                            setResult(item.content);
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">
                              {steps.find(s => s.id === item.step)?.name}
                            </span>
                            <span className="text-xs text-slate-500">{item.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-500 truncate">
                            {item.content.substring(0, 100)}...
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* File Format Guide */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5" />
                    文件格式要求
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="excel">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="excel">Excel 格式</TabsTrigger>
                      <TabsTrigger value="word">Word 格式</TabsTrigger>
                    </TabsList>
                    <TabsContent value="excel" className="mt-4">
                      <div className="space-y-3">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Excel文件请确保包含以下列名（支持中英文）：
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded">
                            <span className="font-medium">title / 标题</span>
                            <span className="text-slate-500 ml-2">必填</span>
                          </div>
                          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded">
                            <span className="font-medium">authors / 作者</span>
                          </div>
                          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded">
                            <span className="font-medium">abstract / 摘要</span>
                          </div>
                          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded">
                            <span className="font-medium">year / 年份</span>
                          </div>
                          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded">
                            <span className="font-medium">journal / 期刊</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="word" className="mt-4">
                      <div className="space-y-3">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Word文件请按以下格式组织每篇文献：
                        </p>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded text-sm font-mono">
                          <p>标题：xxx</p>
                          <p>作者：xxx</p>
                          <p>摘要：xxx</p>
                          <p>年份：xxx</p>
                          <p>期刊：xxx</p>
                          <p className="text-slate-400">---（空行分隔下一篇）---</p>
                        </div>
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
