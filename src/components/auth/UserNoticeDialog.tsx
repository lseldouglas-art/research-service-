'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertCircle,
  Shield,
  Users,
  CheckCircle,
  BookOpen,
  Scale,
} from 'lucide-react';

interface UserNoticeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgree: () => void;
}

export function UserNoticeDialog({ open, onOpenChange, onAgree }: UserNoticeDialogProps) {
  const [checked, setChecked] = useState(false);

  const handleAgree = () => {
    if (checked) {
      localStorage.setItem('userNoticeAgreed', 'true');
      onAgree();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="w-6 h-6 text-blue-500" />
            重要声明与使用须知
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            使用本平台前，请仔细阅读以下内容
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 核心声明 */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                  核心声明
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">
                  本平台旨在<strong>AI辅助学术研究</strong>，核心定位是<strong>人机协同</strong>的科研辅助工具。
                  平台提供的所有AI生成内容（包括但不限于文献分析、大纲生成、段落撰写等）均作为<strong>参考素材</strong>，
                  所有研究决策、内容审核、学术判断<strong>均由研究员本人负责</strong>。
                </p>
              </div>
            </div>
          </div>

          {/* 使用原则 */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Scale className="w-5 h-5 text-green-600" />
              使用原则
            </h3>
            <div className="grid gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">人机协同，决策在人</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      AI是辅助工具，研究员是决策主体。AI生成的内容需要经过您的专业判断、审核和修改。
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">内容溯源，学术诚信</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      所有引用内容均需溯源至原始文献，确保学术诚信。AI生成的初稿需经过事实核查和引用规范检查。
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">责任归属，用户承担</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      使用本平台产生的研究成果，其学术责任由用户本人承担。平台不对内容的学术正确性负责。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 非学术造假声明 */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
            <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              重要说明：非学术造假
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
              使用AI辅助学术研究<strong>不等于学术造假</strong>。正如使用文献检索工具、统计软件、语言润色工具一样，
              AI是提升研究效率的工具。关键在于：
            </p>
            <ul className="text-sm text-amber-700 dark:text-amber-400 mt-2 space-y-1 list-disc list-inside">
              <li>所有AI生成内容需经过您的专业审核和判断</li>
              <li>引用内容需溯源至原始文献，确保准确性</li>
              <li>研究思路、方法设计、核心论点由您主导</li>
              <li>遵守所在机构的学术规范和期刊投稿要求</li>
            </ul>
          </div>

          {/* 同意选项 */}
          <div className="flex items-start gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <input
              type="checkbox"
              id="agree-checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="agree-checkbox" className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
              我已阅读并理解以上声明，明白本平台是<strong>AI辅助研究工具</strong>，
              所有研究决策均由我本人负责，我将对使用本平台产生的内容进行专业审核和判断。
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            暂不使用
          </Button>
          <Button
            onClick={handleAgree}
            disabled={!checked}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            同意并继续
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
