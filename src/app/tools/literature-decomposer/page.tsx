'use client';

import { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  HelpCircle,
  Split,
} from 'lucide-react';
import Link from 'next/link';

import { useLiteratureDecomposer } from './hooks/useLiteratureDecomposer';
import {
  LiteratureSplitStep,
  BatchAnalysisStep,
  ClusterOutlineStep,
  ParagraphWritingStep,
  UserGuideDialog,
  StepIndicator,
} from './components';

export default function LiteratureDecomposerPage() {
  // 使用自定义hook管理所有状态
  const {
    currentStep,
    setCurrentStep,
    completedSteps,
    models,
    setModels,
    selectedModel,
    setSelectedModel,
    
    literatureFile,
    handleFileUpload,
    batchSize,
    setBatchSize,
    isProcessingSplit,
    splitResult,
    splitRecommendations,
    processLiteratureSplit,
    
    analysisPrompt,
    setAnalysisPrompt,
    isAnalyzing,
    currentBatchIndex,
    analysisResults,
    combinedAnalysis,
    analysisRecommendations,
    analyzeBatch,
    analyzeAllBatches,
    
    isClustering,
    clusterOutline,
    clusterRecommendations,
    generateClusterOutline,
    
    isWriting,
    currentParagraphIndex,
    paragraphResults,
    parsedOutline,
    writingRecommendations,
    writeParagraph,
    writeAllParagraphs,
  } = useLiteratureDecomposer();

  // 用户指南状态
  const [showGuide, setShowGuide] = useState(false);
  
  // 复制状态
  const [copied, setCopied] = useState(false);

  // 加载AI模型列表
  useEffect(() => {
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
  }, [setModels]);

  // 关闭指南并记录
  const closeGuide = useCallback(() => {
    setShowGuide(false);
    localStorage.setItem('hasSeenLiteratureDecomposerGuide', 'true');
  }, []);

  // 复制功能
  const copyResult = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('复制失败');
    }
  }, []);

  // 步骤导航权限检查
  const canNavigate = {
    'batch-analysis': !!splitResult,
    'clustering-outline': analysisResults.filter(Boolean).length > 0,
    'paragraph-writing': !!clusterOutline,
  };

  // 处理步骤点击
  const handleStepClick = useCallback((stepId: string) => {
    if (stepId === 'batch-analysis' && !splitResult) {
      alert('请先完成文献分割');
      return;
    }
    if (stepId === 'clustering-outline' && analysisResults.filter(Boolean).length === 0) {
      alert('请先完成分批分析');
      return;
    }
    if (stepId === 'paragraph-writing' && !clusterOutline) {
      alert('请先完成聚类大纲生成');
      return;
    }
    setCurrentStep(stepId as any);
  }, [splitResult, analysisResults, clusterOutline, setCurrentStep]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* 用户指南弹窗 */}
      <UserGuideDialog open={showGuide} onOpenChange={closeGuide} />

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
              四步流程 + 迭代优化
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              文献素材库分解器
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              将文献素材库系统化分解，实现段落级精准写作支撑
            </p>
          </div>

          {/* 步骤指示器 */}
          <StepIndicator
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
            canNavigate={canNavigate}
          />

          {/* 第一步：文献分割 */}
          {currentStep === 'literature-split' && (
            <LiteratureSplitStep
              splitResult={splitResult}
              splitRecommendations={splitRecommendations}
              isProcessingSplit={isProcessingSplit}
              batchSize={batchSize}
              literatureFile={literatureFile}
              onFileUpload={handleFileUpload}
              onBatchSizeChange={setBatchSize}
              onProcess={processLiteratureSplit}
              onNext={() => setCurrentStep('batch-analysis')}
            />
          )}

          {/* 第二步：分批分析 */}
          {currentStep === 'batch-analysis' && (
            <BatchAnalysisStep
              splitResult={splitResult}
              analysisResults={analysisResults}
              combinedAnalysis={combinedAnalysis}
              analysisRecommendations={analysisRecommendations}
              isAnalyzing={isAnalyzing}
              currentBatchIndex={currentBatchIndex}
              analysisPrompt={analysisPrompt}
              selectedModel={selectedModel}
              models={models}
              onPromptChange={setAnalysisPrompt}
              onModelChange={setSelectedModel}
              onAnalyzeBatch={analyzeBatch}
              onAnalyzeAll={analyzeAllBatches}
              onBack={() => setCurrentStep('literature-split')}
              onNext={() => setCurrentStep('clustering-outline')}
              onCopy={copyResult}
              copied={copied}
            />
          )}

          {/* 第三步：聚类大纲 */}
          {currentStep === 'clustering-outline' && (
            <ClusterOutlineStep
              clusterOutline={clusterOutline}
              clusterRecommendations={clusterRecommendations}
              isClustering={isClustering}
              selectedModel={selectedModel}
              models={models}
              analysisCompletedCount={analysisResults.filter(Boolean).length}
              totalBatches={splitResult?.totalBatches || 0}
              onModelChange={setSelectedModel}
              onGenerate={generateClusterOutline}
              onBack={() => setCurrentStep('batch-analysis')}
              onNext={() => setCurrentStep('paragraph-writing')}
              onCopy={copyResult}
              copied={copied}
            />
          )}

          {/* 第四步：段落撰写 */}
          {currentStep === 'paragraph-writing' && (
            <ParagraphWritingStep
              clusterOutline={clusterOutline}
              splitResult={splitResult}
              paragraphResults={paragraphResults}
              parsedOutline={parsedOutline}
              writingRecommendations={writingRecommendations}
              isWriting={isWriting}
              currentParagraphIndex={currentParagraphIndex}
              selectedModel={selectedModel}
              models={models}
              onModelChange={setSelectedModel}
              onWriteParagraph={writeParagraph}
              onWriteAll={writeAllParagraphs}
              onBack={() => setCurrentStep('clustering-outline')}
              onCopy={copyResult}
              copied={copied}
            />
          )}
        </div>
      </main>
    </div>
  );
}
