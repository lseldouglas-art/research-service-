'use client';

import { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowRight,
  Check,
  Loader2,
  Upload,
  Download,
  FolderInput,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Info,
  Lightbulb,
  StepForward,
  Split,
  BarChart3,
} from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import type { SplitResult, SplitRecommendations } from '../hooks/useLiteratureDecomposer';

interface LiteratureSplitStepProps {
  splitResult: SplitResult | null;
  splitRecommendations: SplitRecommendations | null;
  isProcessingSplit: boolean;
  batchSize: number;
  literatureFile: File | null;
  onFileUpload: (file: File) => void;
  onBatchSizeChange: (size: number) => void;
  onProcess: () => Promise<void>;
  onNext: () => void;
}

export function LiteratureSplitStep({
  splitResult,
  splitRecommendations,
  isProcessingSplit,
  batchSize,
  literatureFile,
  onFileUpload,
  onBatchSizeChange,
  onProcess,
  onNext,
}: LiteratureSplitStepProps) {
  const [showBatchWarning, setShowBatchWarning] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleBatchSizeChange = (value: number[]) => {
    const size = value[0];
    onBatchSizeChange(size);
    setShowBatchWarning(size > 75);
  };

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

  return (
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
                onChange={handleFileChange}
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
              onClick={onProcess}
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
              <SplitResultView 
                splitResult={splitResult} 
                onNext={onNext}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 分割结果视图组件
function SplitResultView({ 
  splitResult, 
  onNext 
}: { 
  splitResult: SplitResult;
  onNext: () => void;
}) {
  return (
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
          {(['A', 'B', 'C', 'D'] as const).map(grade => (
            <div key={grade} className="text-center">
              <Badge className={
                grade === 'A' ? 'bg-green-500' :
                grade === 'B' ? 'bg-blue-500' :
                grade === 'C' ? 'bg-yellow-500' :
                'bg-slate-500'
              }>
                {grade}
              </Badge>
              <p className="text-lg font-bold mt-1">
                {splitResult.statistics.gradeDistribution[grade]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 批次列表 */}
      <div className="space-y-2">
        <p className="text-sm font-medium">批次详情</p>
        <div className="max-h-[200px] overflow-y-auto space-y-2">
          {splitResult.batches.map((batch) => (
            <div 
              key={batch.index}
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
          onClick={onNext}
        >
          <StepForward className="mr-2 h-4 w-4" />
          进入分批分析
        </Button>
      </div>
    </div>
  );
}
