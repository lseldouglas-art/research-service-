'use client';

import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight,
  CheckCircle2,
  Split,
  Bot,
  GitBranch,
  PenTool,
} from 'lucide-react';

interface StepIndicatorProps {
  currentStep: string;
  completedSteps: Set<string>;
  onStepClick: (step: string) => void;
  canNavigate: {
    'batch-analysis': boolean;
    'clustering-outline': boolean;
    'paragraph-writing': boolean;
  };
}

const STEPS = [
  {
    id: 'literature-split',
    name: '文献分割',
    description: '智能分批处理',
    icon: Split,
  },
  {
    id: 'batch-analysis',
    name: '分批分析',
    description: 'AI深度解析',
    icon: Bot,
  },
  {
    id: 'clustering-outline',
    name: '聚类大纲',
    description: '论点整合',
    icon: GitBranch,
  },
  {
    id: 'paragraph-writing',
    name: '段落撰写',
    description: '精细写作',
    icon: PenTool,
  },
];

export function StepIndicator({ 
  currentStep, 
  completedSteps, 
  onStepClick,
  canNavigate,
}: StepIndicatorProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
      {STEPS.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = completedSteps.has(step.id);
        const canClick = step.id === 'literature-split' || canNavigate[step.id as keyof typeof canNavigate];
        
        return (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm ${
                isActive
                  ? 'bg-indigo-500 text-white'
                  : isCompleted
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                  : canClick
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              }`}
              onClick={() => canClick && onStepClick(step.id)}
            >
              <step.icon className="w-4 h-4" />
              <span className="font-medium hidden sm:inline">{step.name}</span>
              <span className="font-medium sm:hidden">{index + 1}</span>
              {isCompleted && !isActive && (
                <CheckCircle2 className="w-3 h-3" />
              )}
            </div>
            {index < STEPS.length - 1 && (
              <ArrowRight className="w-4 h-4 mx-1 text-slate-400" />
            )}
          </div>
        );
      })}
    </div>
  );
}
