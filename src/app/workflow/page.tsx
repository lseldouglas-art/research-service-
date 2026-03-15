import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Database,
  Lightbulb,
  BookOpen,
  FileText,
  Settings,
  PenTool,
  FileCheck,
  Image,
  ListOrdered,
  Sparkles,
  Target,
  Clock,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function WorkflowPage() {
  const writingSteps = [
    {
      step: 1,
      title: '确定研究方向与选题',
      icon: Lightbulb,
      description: '从一个宽泛的想法出发，通过AI辅助精准定位创新选题',
      subSteps: [
        {
          title: '构建检索策略',
          source: '第2集',
          action: '使用AI提示词分析关键词变体、同义词和干扰项',
          output: '专业级高级检索式',
          time: '1-2小时',
        },
        {
          title: '获取综述文献',
          source: '第3集',
          action: '执行检索，筛选综述文献，导入Zotero',
          output: '核心综述文献库',
          time: '2-3小时',
        },
        {
          title: '智能分析选题',
          source: '第4集',
          action: 'AI分析领域现状、研究空白，推荐选题方向',
          output: '明确的综述选题',
          time: '2-4小时',
        },
        {
          title: '精准重检索',
          source: '第5集',
          action: '矩阵式检索构建选题相关文献库',
          output: '100-600篇研究型文献',
          time: '1天',
        },
      ],
      tips: [
        '使用《论文处理工具箱》的论文分割器批量处理文献',
        '检索结果过多不必担心，AI后期可处理',
        '检索结果过少可使用"降维组合"策略扩充',
      ],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      step: 2,
      title: '构建论文大纲框架',
      icon: FileText,
      description: '基于文献分析，构建数据驱动的结构化写作大纲',
      subSteps: [
        {
          title: '文献相关性分析',
          source: '第6.1集',
          action: 'AI分批分析文献，评估相关性等级',
          output: '文献相关性分级表',
          time: '半天',
        },
        {
          title: '生成详细大纲',
          source: '第6.1集',
          action: 'AI根据文献分布生成章节大纲，标注支撑文献数量',
          output: '可执行写作大纲',
          time: '2-3小时',
        },
        {
          title: '文献智能分类',
          source: '第7集',
          action: '使用工具箱自动为文献添加章节标签和编号',
          output: '结构化文献库',
          time: '1-2小时',
        },
      ],
      tips: [
        '使用BibTeX标签同步器一键批量添加标签',
        '大纲需确保每个子章节有足够文献支撑',
        '可迭代优化大纲逻辑结构',
      ],
      color: 'from-purple-500 to-pink-500',
    },
    {
      step: 3,
      title: '撰写论文正文',
      icon: PenTool,
      description: '分章节进行AI辅助写作，完成高质量初稿',
      subSteps: [
        {
          title: '筛选章节文献',
          source: '第8集',
          action: '使用章节筛选器筛选待写章节相关文献',
          output: '章节相关文献清单',
          time: '30分钟',
        },
        {
          title: '文献深度分析',
          source: '第8集',
          action: 'AI第一轮分析文献核心观点',
          output: '文献分析摘要',
          time: '1-2小时',
        },
        {
          title: '聚类论点生成大纲',
          source: '第8集',
          action: 'AI第二轮聚类分析，生成段落级写作大纲',
          output: '段落写作大纲',
          time: '1小时',
        },
        {
          title: '引用补全',
          source: '第8集',
          action: '使用引用编号补全器为每个段落匹配文献',
          output: '精准引用素材',
          time: '1小时',
        },
        {
          title: '完成段落初稿',
          source: '第8集',
          action: 'AI第三轮辅助写作，完成正文各章节',
          output: '正文初稿',
          time: '2-3天',
        },
      ],
      tips: [
        '三轮AI写作确保深度和质量',
        '段落大纲如有重复可通过"合并移动"优化',
        '保持全局视角审视整体逻辑',
      ],
      color: 'from-orange-500 to-red-500',
    },
    {
      step: 4,
      title: '精修与事实核查',
      icon: FileCheck,
      description: '对标范文提升语言，核查事实确保准确',
      subSteps: [
        {
          title: '对标范文分析',
          source: '第9.1集',
          action: '分析顶刊范文写作风格和表达方式',
          output: '修改方向清单',
          time: '2-3小时',
        },
        {
          title: '事实核查',
          source: '第9.2集',
          action: '逐条核查原文引用的准确性',
          output: '核查修正报告',
          time: '1-2天',
        },
        {
          title: '语言精修',
          source: '第9.1集',
          action: '结合范文风格和AI建议进行润色',
          output: '精修正文稿',
          time: '1-2天',
        },
      ],
      tips: [
        '事实核查与语言精修可并行进行',
        '借鉴原始文献表达方式融合AI建议',
        'AI内容有问题是正常的，这是创造性修改的切入点',
      ],
      color: 'from-rose-500 to-pink-500',
    },
    {
      step: 5,
      title: '完成引言、结论与摘要',
      icon: BookOpen,
      description: '使用特化提示词完成论文的开篇、收尾和门面',
      subSteps: [
        {
          title: '撰写引言',
          source: '第10集',
          action: '范文解构→AI大纲→文献匹配→写作→精修',
          output: '完整引言',
          time: '半天',
        },
        {
          title: '撰写结论与展望',
          source: '第11集',
          action: '总结研究成果，提出未来研究方向',
          output: '结论与展望章节',
          time: '半天',
        },
        {
          title: '撰写摘要',
          source: '第14集',
          action: '提炼核心内容，打造论文门面',
          output: '高质量摘要',
          time: '2-3小时',
        },
      ],
      tips: [
        '引言要清晰阐述研究背景和目的',
        '结论要呼应引言中的研究问题',
        '摘要要精炼准确，突出创新点',
      ],
      color: 'from-indigo-500 to-purple-500',
    },
    {
      step: 6,
      title: '降低AIGC率与原创性重塑',
      icon: Sparkles,
      description: '消除AI语言痕迹，确保通过AIGC检测',
      subSteps: [
        {
          title: '识别AI痕迹',
          source: '第13集',
          action: '识别AI固有句式和逻辑流',
          output: 'AI痕迹清单',
          time: '1-2小时',
        },
        {
          title: '原创性重写',
          source: '第13集',
          action: '"用自己的话重说一遍"，英文直改或中英转换',
          output: '低AIGC率文稿',
          time: '1-2天',
        },
      ],
      tips: [
        '核心心法："用自己的话重说一遍"',
        '英文直改或中英转换路径彻底打碎AI痕迹',
        '重构句子，融入个人风格',
      ],
      color: 'from-violet-500 to-purple-500',
    },
    {
      step: 7,
      title: '配图与格式规范',
      icon: Image,
      description: '完成论文配图和参考文献格式化，准备投稿',
      subSteps: [
        {
          title: '配图规划',
          source: '第12集',
          action: 'AI分析顶刊配图策略，制定配图计划',
          output: '配图计划清单',
          time: '半天',
        },
        {
          title: '获取与授权',
          source: '第12集',
          action: '寻找或绘制图片，申请版权授权',
          output: '合规配图素材',
          time: '1-2天',
        },
        {
          title: '参考文献格式化',
          source: '第15/16集',
          action: '使用自动化脚本一键完成引用替换',
          output: '规范参考文献',
          time: '1-2小时',
        },
        {
          title: '最终审校',
          source: '全流程',
          action: '全文格式统一，最终质量检查',
          output: '可投稿终稿',
          time: '半天',
        },
      ],
      tips: [
        '配图需符合目标期刊要求',
        '使用RE2CiteKey脚本自动化处理参考文献',
        '投稿前务必进行最终全文检查',
      ],
      color: 'from-green-500 to-teal-500',
    },
  ];

  const timeEstimate = {
    total: '2-4周',
    breakdown: [
      { phase: '选题与文献构建', time: '3-5天' },
      { phase: '大纲与素材整理', time: '2-3天' },
      { phase: '正文撰写', time: '5-7天' },
      { phase: '精修与核查', time: '3-5天' },
      { phase: '收尾工作', time: '2-3天' },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回首页
              </Link>
            </Button>
            <Badge variant="outline" className="text-sm">
              服务流程
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">服务流程</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              七步完成高质量论文
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              基于训练营验证的高效工作流，每一步都有清晰的操作指南和预期产出
            </p>
          </div>

          {/* Time Estimate */}
          <Card className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-2">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">预计完成时间</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {timeEstimate.total}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {timeEstimate.breakdown.map((item, index) => (
                    <Badge key={index} variant="outline" className="text-sm py-1.5">
                      {item.phase}: <span className="font-semibold ml-1">{item.time}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Writing Steps */}
          <div className="space-y-8">
            {writingSteps.map((step, index) => (
              <Card key={index} className="overflow-hidden">
                {/* Step Header */}
                <div className={`bg-gradient-to-r ${step.color} p-6`}>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-2xl shrink-0">
                      {step.step}
                    </div>
                    <div className="text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <step.icon className="w-6 h-6" />
                        <h2 className="text-xl font-bold">{step.title}</h2>
                      </div>
                      <p className="text-white/80">{step.description}</p>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Sub Steps */}
                  <div className="space-y-4 mb-6">
                    {step.subSteps.map((subStep, subIndex) => (
                      <div 
                        key={subIndex} 
                        className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border"
                      >
                        <Badge variant="outline" className="shrink-0 w-fit">
                          {subStep.source}
                        </Badge>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{subStep.title}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{subStep.action}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{subStep.output}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-500">
                            <Clock className="w-4 h-4" />
                            <span>{subStep.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tips */}
                  <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                    <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      实用技巧
                    </h4>
                    <ul className="space-y-1">
                      {step.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
                          <span className="text-amber-500 mt-1">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-12">
            <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">开始您的论文写作之旅</h2>
                <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                  选择适合您的服务方式：参加培训学习完整方法，或直接委托我们提供专业服务
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" variant="secondary" className="bg-white text-slate-900 hover:bg-slate-100">
                    <Link href="/services">
                      查看服务详情
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <Link href="/training">
                      参加培训课程
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
