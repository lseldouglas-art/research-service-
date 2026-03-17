'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft,
  Bot,
  Copy,
  Check,
  Loader2,
  CheckCircle2,
  StepForward,
  Eye,
  AlertCircle,
  FolderOpen,
  ChevronDown,
  BookOpen,
} from 'lucide-react';
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
import type { SplitResult, AnalysisRecommendations, AIModel } from '../hooks/useLiteratureDecomposer';

interface BatchAnalysisStepProps {
  splitResult: SplitResult | null;
  analysisResults: string[];
  combinedAnalysis: string;
  analysisRecommendations: AnalysisRecommendations | null;
  isAnalyzing: boolean;
  currentBatchIndex: number;
  analysisPrompt: string;
  selectedModel: string;
  models: AIModel[];
  onPromptChange: (prompt: string) => void;
  onModelChange: (model: string) => void;
  onAnalyzeBatch: (index: number) => Promise<string | void>;
  onAnalyzeAll: () => Promise<string | void>;
  onBack: () => void;
  onNext: () => void;
  onCopy: (text: string) => Promise<void>;
  copied: boolean;
}

export function BatchAnalysisStep({
  splitResult,
  analysisResults,
  combinedAnalysis,
  analysisRecommendations,
  isAnalyzing,
  currentBatchIndex,
  analysisPrompt,
  selectedModel,
  models,
  onPromptChange,
  onModelChange,
  onAnalyzeBatch,
  onAnalyzeAll,
  onBack,
  onNext,
  onCopy,
  copied,
}: BatchAnalysisStepProps) {
  // 按提供商分组模型
  const groupedModels = models.reduce((acc, m) => {
    if (!acc[m.provider]) acc[m.provider] = [];
    acc[m.provider].push(m);
    return acc;
  }, {} as Record<string, AIModel[]>);

  const completedCount = analysisResults.filter(Boolean).length;
  const totalBatches = splitResult?.totalBatches || 0;
  const allCompleted = completedCount === totalBatches && totalBatches > 0;

  return (
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
                <Badge variant="outline">{totalBatches}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">已完成</span>
                <Badge className="bg-green-500">{completedCount}</Badge>
              </div>
            </div>

            {/* AI模型选择 */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-green-500" />
                AI模型
              </Label>
              <Select value={selectedModel} onValueChange={onModelChange}>
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
                分析提示词
              </Label>
              <Textarea
                value={analysisPrompt}
                onChange={(e) => onPromptChange(e.target.value)}
                placeholder="输入分析提示词，指导AI如何分析每批文献..."
                className="min-h-[120px]"
              />
            </div>

            {/* 操作按钮 */}
            <div className="space-y-2">
              <Button
                onClick={onAnalyzeAll}
                disabled={isAnalyzing || !analysisPrompt.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    分析中 ({currentBatchIndex + 1}/{totalBatches})
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
                onClick={onBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回文献分割
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-4">
        {/* 专属建议卡片 */}
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
                  onClick={() => !isAnalyzing && onAnalyzeBatch(index)}
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
              分析结果
            </CardTitle>
            {combinedAnalysis && (
              <Button variant="outline" size="sm" onClick={() => onCopy(combinedAnalysis)}>
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
        {allCompleted && (
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
                  onClick={onNext}
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
  );
}
