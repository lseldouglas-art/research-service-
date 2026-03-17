'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen,
  Target,
  Split,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface UserGuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const guideSteps = [
  {
    title: '功能概述',
    icon: <Target className="w-6 h-6 text-blue-500" />,
    content: (
      <div className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          文献分解器帮助您将大型文献素材库系统化分解，实现段落级精准写作支撑。
        </p>
        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
            💡 核心理念
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-400">
            AI生成的是「60分初稿」，优化需要：明确要求（提示词）+ 提供材料（文献内容）。
            本工具已为您准备好所有材料，随时可调用。
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex flex-col items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <Split className="w-8 h-8 text-green-500" />
            <div className="text-center">
              <p className="font-medium text-sm">文献分割</p>
              <p className="text-xs text-slate-500">智能分批</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <Target className="w-8 h-8 text-purple-500" />
            <div className="text-center">
              <p className="font-medium text-sm">分批分析</p>
              <p className="text-xs text-slate-500">AI深度解析</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <TrendingUp className="w-8 h-8 text-indigo-500" />
            <div className="text-center">
              <p className="font-medium text-sm">聚类大纲</p>
              <p className="text-xs text-slate-500">论点整合</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <RefreshCw className="w-8 h-8 text-pink-500" />
            <div className="text-center">
              <p className="font-medium text-sm">段落撰写</p>
              <p className="text-xs text-slate-500">精细写作</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: '文献分割策略',
    icon: <Split className="w-6 h-6 text-green-500" />,
    content: (
      <div className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          采用三级优先级策略对文献进行智能排序和分割：
        </p>
        <div className="space-y-2">
          <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
            <p className="font-medium text-green-800 dark:text-green-300 text-sm">1. 相关度等级</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              A级优先 → B级次之 → C级补充 → D级可选
            </p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <p className="font-medium text-blue-800 dark:text-blue-300 text-sm">2. 发表年份</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              同等级内，优先选择最新研究成果
            </p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
            <p className="font-medium text-purple-800 dark:text-purple-300 text-sm">3. 期刊质量</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              顶级期刊优先，确保论据权威性
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: '从60分到90分',
    icon: <TrendingUp className="w-6 h-6 text-purple-500" />,
    content: (
      <div className="space-y-4">
        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
          <p className="font-medium text-amber-800 dark:text-amber-300 text-sm">AI初稿定位</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            AI生成的是60分基础框架。优化重点取决于你的基础：
            零基础同学学习表达方式，有基础同学注入学科理解。
          </p>
        </div>
        <div className="space-y-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <p className="font-medium text-sm">60→70分：逻辑层面</p>
            <p className="text-xs text-slate-500 mt-1">
              信息关系、段落衔接、论述线索
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <p className="font-medium text-sm">70→80分：表达层面</p>
            <p className="text-xs text-slate-500 mt-1">
              句子节奏、用词精准、语法规范
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <p className="font-medium text-sm">80→90分：深度层面</p>
            <p className="text-xs text-slate-500 mt-1">
              学科理解、批判讨论、独特见解
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: '迭代优化方法',
    icon: <RefreshCw className="w-6 h-6 text-indigo-500" />,
    content: (
      <div className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          优化效果不理想，往往是因为只给了指令，没给材料。
        </p>
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg space-y-2">
          <p className="font-medium text-indigo-800 dark:text-indigo-300 text-sm">
            🔄 迭代模式
          </p>
          <div className="space-y-1 text-xs text-indigo-700 dark:text-indigo-400">
            <p>1. 发现问题 → 感到哪里不对劲</p>
            <p>2. 判断需求 → AI需要什么材料？</p>
            <p>3. 准备材料 → 从素材库调取文献</p>
            <p>4. 清晰指令 → 问题+要求+材料</p>
            <p>5. 获得方案 → AI给出修改建议</p>
            <p>6. 你来决策 → 选择或调整方案</p>
          </div>
        </div>
        <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
          <p className="text-xs text-red-700 dark:text-red-400">
            <strong>⚠️ 关键：</strong>提示词告诉AI要做什么，材料让AI知道用什么做。两者缺一不可。
          </p>
        </div>
      </div>
    ),
  },
];

export function UserGuideDialog({ open, onOpenChange }: UserGuideDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="w-6 h-6 text-blue-500" />
            文献分解器使用指南
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            四步完成文献素材库的系统化分解 + 迭代优化闭环
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {guideSteps.map((step, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {step.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-500">步骤 {index + 1}</span>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                  </div>
                </div>
              </div>
              <div className="pl-13">
                {step.content}
              </div>
              {index < guideSteps.length - 1 && (
                <div className="border-b border-slate-200 dark:border-slate-700" />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button 
            onClick={() => onOpenChange(false)}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            开始使用
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
