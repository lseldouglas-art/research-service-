'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft,
  Bot,
  Copy,
  Check,
  Loader2,
  CheckCircle2,
  TrendingUp,
  FolderOpen,
  ChevronDown,
  BookOpen,
  RefreshCw,
  Download,
  GitBranch,
  GitMerge,
  PenTool,
  Zap,
  ArrowRight,
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
import type { ClusterRecommendations, AIModel } from '../hooks/useLiteratureDecomposer';

interface ClusterOutlineStepProps {
  clusterOutline: string;
  clusterRecommendations: ClusterRecommendations | null;
  isClustering: boolean;
  selectedModel: string;
  models: AIModel[];
  analysisCompletedCount: number;
  totalBatches: number;
  onModelChange: (model: string) => void;
  onGenerate: () => Promise<string | void>;
  onBack: () => void;
  onNext: () => void;
  onCopy: (text: string) => Promise<void>;
  copied: boolean;
}

export function ClusterOutlineStep({
  clusterOutline,
  clusterRecommendations,
  isClustering,
  selectedModel,
  models,
  analysisCompletedCount,
  totalBatches,
  onModelChange,
  onGenerate,
  onBack,
  onNext,
  onCopy,
  copied,
}: ClusterOutlineStepProps) {
  // 按提供商分组模型
  const groupedModels = models.reduce((acc, m) => {
    if (!acc[m.provider]) acc[m.provider] = [];
    acc[m.provider].push(m);
    return acc;
  }, {} as Record<string, AIModel[]>);

  return (
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
                <Badge className="bg-green-500">{analysisCompletedCount}</Badge>
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
                onClick={onGenerate}
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
                onClick={onBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回分批分析
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-4">
        {/* 专属建议卡片 */}
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
                <Button variant="outline" size="sm" onClick={() => onCopy(clusterOutline)}>
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
                  onClick={onGenerate}
                >
                  <RefreshCw className="mr-1 h-4 w-4" />
                  重新生成
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 进阶功能入口 */}
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
                  onClick={onNext}
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
  );
}
