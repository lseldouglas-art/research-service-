import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle2, 
  Database, 
  FileSearch, 
  Lightbulb,
  PenTool,
  FileText,
  Settings,
  ChevronRight,
  LucideIcon
} from 'lucide-react';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface Step {
  title: string;
  icon: LucideIcon;
  purpose: string;
  process: string | string[];
  output: string;
  highlight?: string;
  faq?: {
    question: string;
    answer: string;
  };
}

interface Phase {
  number: string;
  title: string;
  subtitle: string;
  totalGoal: string;
  color: string;
  bgColor: string;
  borderColor: string;
  steps: Step[];
}

export default function PhasesPage() {
  const phaseDetails: Phase[] = [
    {
      number: '01',
      title: '第一阶段：智能定向与文献基石构建',
      subtitle: '第2-5集',
      totalGoal: '从一个宽泛的想法出发，通过AI辅助，精准定位到一个具有创新性和可行性的具体综述选题，并为其建立一个高质量、高相关的核心文献库。',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-white dark:from-blue-950 dark:to-slate-900',
      borderColor: 'border-blue-200 dark:border-blue-800',
      steps: [
        {
          title: '步骤1：构建初步检索策略 (第2集)',
          icon: FileSearch,
          purpose: '解决传统文献检索"查不全"或"查不准"的痛点，为后续分析奠定一个全面的文献基础。',
          process: '使用标准化的AI提示词，让AI基于一个宽泛的关键词，自动分析其所有命名变体、同义词和干扰项，辅助完成一个专业的高级检索式。',
          output: '一个可直接用于Scopus等数据库的高级检索式字符串。',
        },
        {
          title: '步骤2：获取初步文献数据 (第3集)',
          icon: Database,
          purpose: '执行检索，并将海量文献信息高效、规范地收集到专业的管理工具中。',
          process: '在数据库中执行上一步的检索式，筛选特定时间范围内的综述（Review）文献，导出包含摘要的RIS文件，并导入Zotero。',
          output: '一个包含该领域核心综述文献的Zotero文献库。',
        },
        {
          title: '步骤3：智能分析与选题决策 (第4集)',
          icon: Lightbulb,
          purpose: '从上百篇综述中快速洞察领域的研究现状、热点、挑战与空白，从而找到一个有价值、适合自己的综述写作方向。',
          process: '从Zotero中导出综述文献的元数据为TXT文件，输入给AI，使用一系列分析提示词，让AI辅助完成领域分析报告、识别研究空白，并推荐具体的综述选题方向。',
          output: '一个明确、具体的综述论文选题。',
        },
        {
          title: '步骤4：精准文献重检索 (第5集)',
          icon: BookOpen,
          purpose: '围绕已确定的具体选题，重新构建一个高度相关的专业文献库，作为后续综述写作的"弹药库"。',
          process: '使用"矩阵式检索"提示词，让AI将选题分解为多个核心概念，并辅助完成多层次的组合检索式。通过"检索-分析-优化"的循环，不断迭代和优化检索策略。',
          output: '一个包含100-600篇与选题高度相关的研究型论文的Zotero文献库。',
          faq: {
            question: '检索结果过多或过少怎么办？AI辅助完成的检索式不稳定怎么办？',
            answer: '结果过多无需担心，AI后期能处理；结果过少则采用"降维组合"或"上位词替换"等策略扩充。对于AI检索式不稳定的问题，采用"多次辅助完成，择优录取"的策略即可解决。',
          },
        },
      ],
    },
    {
      number: '02',
      title: '第二阶段：结构化大纲构建与素材整理',
      subtitle: '第6-7集',
      totalGoal: '将无序的文献库信息，转化为一个逻辑严密、章节分明、且每个章节都有充足文献支撑的写作蓝图。',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-white dark:from-purple-950 dark:to-slate-900',
      borderColor: 'border-purple-200 dark:border-purple-800',
      steps: [
        {
          title: '步骤5：辅助完成数据驱动的综述大纲 (第6.1集)',
          icon: FileText,
          purpose: '创建一个科学、合理的论文写作框架，并确保每个子章节都有足够数量的文献支撑。',
          process: '使用《论文处理工具箱》中的功能四：论文分割器，将上一步获得的文献清单自动分割成多个小批量的TXT文件。随后分批次让AI分析所有文献，评估其相关性等级。最后，使用分析提示词，让AI辅助完成一份在每个子章节后都注明了支撑文献数量的详细大纲。',
          output: '一份结构完整、逻辑清晰、且经过文献数量验证的可执行写作大纲。',
        },
        {
          title: '步骤6：文献智能分类与结构化管理 (第7集)',
          icon: Settings,
          purpose: '将文献库中的每一篇论文，都精确地匹配到大纲的相应章节中，形成一个与写作思路完全同步的结构化素材库。',
          process: '（流程已重大升级）使用AI分析提示词，让AI为每一篇论文判断其"主章节"、"次要章节"和"核心贡献"。然后，使用《论文处理工具箱》中的功能一：BibTeX 标签同步器，将这些分类信息和REXXX编号一键批量添加到Zotero文献中。',
          output: '一个在Zotero中被完全结构化的文献库，每篇文献都带有章节和REXXX标签。',
          highlight: '流程已重大升级',
        },
      ],
    },
    {
      number: '03',
      title: '第三阶段：AI辅助写作与质量精修',
      subtitle: '第8-13集',
      totalGoal: '在AI的辅助下，完成论文初稿，并通过系统化的流程进行事实核查、语言润色和原创性重写，最终产出高质量的文稿。',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-white dark:from-orange-950 dark:to-slate-900',
      borderColor: 'border-orange-200 dark:border-orange-800',
      steps: [
        {
          title: '步骤7：分章节智能写作 (第8集)',
          icon: PenTool,
          purpose: '将结构化的文献素材高效转化为逻辑严密、论证深刻的综述段落初稿。',
          process: [
            '使用《论文处理工具箱》中的"功能二：章节筛选器"，为待写章节筛选出所有相关文献',
            '使用AI对筛选出的文献进行第一轮深度分析',
            '使用AI对分析结果进行第二轮论点聚类，辅助完成段落级写作大纲',
            '使用《论文处理工具箱》中的"功能三：引用编号补全器"，为每个段落提取精准的文献素材',
            '使用AI进行第三轮辅助写作，完成段落初稿',
          ],
          output: '综述论文正文各章节的初稿。',
          faq: {
            question: 'AI辅助完成的段落大纲内容重复、逻辑不顺、文献数量不均怎么办？',
            answer: '这是正常现象。请通过"全局审视"发现问题，并通过"合并移动"、"降维聚类"等方法，结合AI提示词系统性地优化整个大纲。',
          },
        },
        {
          title: '步骤8：段落精修与事实核查 (第9.1 & 9.2集)',
          icon: CheckCircle2,
          purpose: '确保AI辅助完成的内容在语言上专业地道，在事实上准确无误，解决学术写作的"最后一公里"。',
          process: '这是一个并行工作。首先通过9.1集的方法对标范文，明确修改方向；然后立即启动9.2集的事实核查流程，在核查原文的同时，结合范文风格和AI建议进行语言精修。',
          output: '一份经过语言精修和事实核查的、内容可靠、表达专业的正文精修稿。',
          faq: {
            question: '9.1集的语言修改和9.2集的事实核查应该谁先谁后？如何真正内化AI的表达？',
            answer: '最佳实践是并行处理，在核查事实的同时进行语言修改。当不知道如何改写时，可以借鉴原始文献的表达方式，并与AI的建议相融合，创造出自己的句子。AI辅助完成的内容有问题是正常的，这恰恰是我们进行创性修改的切入点。',
          },
        },
        {
          title: '步骤9：引言、结论与摘要的构建 (第10、11、14集)',
          icon: BookOpen,
          purpose: '系统性地完成论文的开篇（引言）、收尾（结论与展望）和门面（摘要）部分。',
          process: '采用与正文写作类似的"范文解构 -> AI构建大纲 -> AI匹配文献 -> AI辅助写作 -> 事实核查"的流程，但使用针对引言、结论、摘要的特化提示词。',
          output: '完整的引言、结论与展望、摘要的精修稿。',
        },
        {
          title: '步骤10：降低AIGC率与原创性重塑 (第13 & 13.1集)',
          icon: Lightbulb,
          purpose: '将带有AI语言痕迹的文稿，内化为真正属于自己的、能顺利通过AIGC检测的原创表达。',
          process: '掌握"用自己的话重说一遍"的核心心法，通过"英文直改"或"中英转换"路径，彻底打碎AI的固有句式和逻辑流，重构句子。',
          output: '一篇在语言风格上具有个人特色、AIGC率显著降低的最终稿。',
        },
      ],
    },
    {
      number: '04',
      title: '第四阶段：收尾工作与格式规范',
      subtitle: '第12、15、16集',
      totalGoal: '完成论文的配图、参考文献格式化等所有收尾工作，准备最终提交。',
      color: 'from-green-500 to-teal-500',
      bgColor: 'from-green-50 to-white dark:from-green-950 dark:to-slate-900',
      borderColor: 'border-green-200 dark:border-green-800',
      steps: [
        {
          title: '步骤11：论文配图策略与获取 (第12集)',
          icon: FileText,
          purpose: '为论文匹配高质量、有说服力的学术配图，并处理好版权问题。',
          process: '让AI分析顶刊范文的配图策略，然后结合我们的论文全文，辅助完成一份定制化配图计划。根据计划寻找或绘制图片，并申请引用图片的版权。',
          output: '一套完整的论文配图以及符合规范的图示和版权授权。',
        },
        {
          title: '步骤12：参考文献的插入与管理 (第15 & 16集)',
          icon: Settings,
          purpose: '将文中的所有引用占位符，高效、准确地转换为符合目标期刊格式的规范引用。',
          process: '方法一(常规)：使用Zotero的Word插件"边写边引"。方法二(训练营推荐)：在论文完全定稿后，使用我们提供的自动化脚本，载入Word文档、BibTeX文件和CSL样式文件，一键完成所有引用的替换和文末参考文献列表的辅助完成。',
          output: '一份参考文献格式完全正确、可直接提交的最终Word文档。',
        },
      ],
    },
  ];

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
              课程详细内容
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">课程大纲</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              四大核心阶段详解
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              每个步骤的目的以及是要为下个步骤准备什么材料，避免失去焦点！
            </p>
          </div>

          {/* Phases */}
          <div className="space-y-12">
            {phaseDetails.map((phase, index) => (
              <Card key={index} className={`overflow-hidden bg-gradient-to-br ${phase.bgColor} border-2 ${phase.borderColor}`}>
                {/* Phase Header */}
                <div className={`bg-gradient-to-r ${phase.color} p-6 text-white`}>
                  <div className="flex items-center gap-4">
                    <div className="text-5xl font-bold opacity-80">{phase.number}</div>
                    <div>
                      <h2 className="text-2xl font-bold">{phase.title}</h2>
                      <Badge variant="secondary" className="mt-2 bg-white/20 hover:bg-white/30 text-white border-0">
                        {phase.subtitle}
                      </Badge>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Total Goal */}
                  <div className="mb-8">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      总目标
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg">
                      {phase.totalGoal}
                    </p>
                  </div>

                  {/* Steps */}
                  <Accordion type="single" collapsible className="w-full space-y-2">
                    {phase.steps.map((step, stepIndex) => (
                      <AccordionItem 
                        key={stepIndex} 
                        value={`step-${index}-${stepIndex}`}
                        className="border border-slate-200 dark:border-slate-700 rounded-lg px-4"
                      >
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3 text-left">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                              <step.icon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-semibold">{step.title}</div>
                              {step.highlight && (
                                <Badge className="mt-1 bg-orange-500 text-white text-xs">
                                  {step.highlight}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          {/* Purpose */}
                          <div>
                            <h4 className="font-semibold text-sm text-blue-600 dark:text-blue-400 mb-1">目的</h4>
                            <p className="text-slate-600 dark:text-slate-400">{step.purpose}</p>
                          </div>

                          {/* Process */}
                          <div>
                            <h4 className="font-semibold text-sm text-purple-600 dark:text-purple-400 mb-1">核心流程</h4>
                            {Array.isArray(step.process) ? (
                              <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400">
                                {step.process.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ol>
                            ) : (
                              <p className="text-slate-600 dark:text-slate-400">{step.process}</p>
                            )}
                          </div>

                          {/* Output */}
                          <div>
                            <h4 className="font-semibold text-sm text-green-600 dark:text-green-400 mb-1">关键产出</h4>
                            <p className="text-slate-600 dark:text-slate-400">{step.output}</p>
                          </div>

                          {/* FAQ */}
                          {step.faq && (
                            <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                              <h4 className="font-semibold text-sm text-amber-700 dark:text-amber-400 mb-2">
                                常见问题
                              </h4>
                              <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">
                                {step.faq.question}
                              </p>
                              <p className="text-sm text-amber-800 dark:text-amber-300">
                                {step.faq.answer}
                              </p>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Back to Home */}
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回首页
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
