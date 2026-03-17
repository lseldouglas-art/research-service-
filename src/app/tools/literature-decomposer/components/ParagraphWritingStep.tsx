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
  PenTool,
  ListOrdered,
  FileText,
  Download,
  RefreshCw,
  TrendingUp,
  FileCheck,
  ChevronDown,
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
import type { WritingRecommendations, ParagraphTopic, AIModel, SplitResult } from '../hooks/useLiteratureDecomposer';

interface ParagraphWritingStepProps {
  clusterOutline: string;
  splitResult: SplitResult | null;
  paragraphResults: string[];
  parsedOutline: ParagraphTopic[];
  writingRecommendations: WritingRecommendations | null;
  isWriting: boolean;
  currentParagraphIndex: number;
  selectedModel: string;
  models: AIModel[];
  onModelChange: (model: string) => void;
  onWriteParagraph: (index: number) => Promise<string | void>;
  onWriteAll: () => Promise<string | void>;
  onBack: () => void;
  onCopy: (text: string) => Promise<void>;
  copied: boolean;
}

export function ParagraphWritingStep({
  clusterOutline,
  splitResult,
  paragraphResults,
  parsedOutline,
  writingRecommendations,
  isWriting,
  currentParagraphIndex,
  selectedModel,
  models,
  onModelChange,
  onWriteParagraph,
  onWriteAll,
  onBack,
  onCopy,
  copied,
}: ParagraphWritingStepProps) {
  // 按提供商分组模型
  const groupedModels = models.reduce((acc, m) => {
    if (!acc[m.provider]) acc[m.provider] = [];
    acc[m.provider].push(m);
    return acc;
  }, {} as Record<string, AIModel[]>);

  const completedCount = paragraphResults.filter(Boolean).length;
  const totalParagraphs = parsedOutline.length;
  const allCompleted = completedCount === totalParagraphs && totalParagraphs > 0;

  return (
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
                <Badge variant="outline">{totalParagraphs || '待解析'}</Badge>
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
                onClick={onWriteAll}
                disabled={isWriting || !clusterOutline}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                size="lg"
              >
                {isWriting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    撰写中 ({currentParagraphIndex + 1}/{totalParagraphs || '?'})
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
                onClick={onBack}
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
              {parsedOutline.length > 0 ? (
                parsedOutline.map((para, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg text-center cursor-pointer transition-all ${
                      paragraphResults[index]
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : currentParagraphIndex === index && isWriting
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                    onClick={() => !isWriting && onWriteParagraph(index)}
                  >
                    <p className="text-xs font-medium truncate">{para.section || `段落 ${index + 1}`}</p>
                    {paragraphResults[index] && (
                      <CheckCircle2 className="w-4 h-4 mx-auto mt-1" />
                    )}
                  </div>
                ))
              ) : (
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
            {paragraphResults.some(Boolean) && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onCopy(paragraphResults.filter(Boolean).join('\n\n---\n\n'))}
                >
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
            {!paragraphResults.some(Boolean) && !isWriting ? (
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
                        onClick={() => onCopy(result)}
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
        {allCompleted && (
          <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-green-800 dark:text-green-300">
                    所有段落撰写完成
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    已生成 {completedCount} 个段落的学术内容
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onWriteAll}
                >
                  <RefreshCw className="mr-1 h-4 w-4" />
                  重新撰写
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 后续行动建议 */}
        {paragraphResults.some(Boolean) && !isWriting && (
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
  );
}
