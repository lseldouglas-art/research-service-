import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle, Clock, FileCheck, FileSearch, FileText, Image, Lightbulb, PenTool, Sparkles, Target } from 'lucide-react';

export default function WorkflowPage() {
  const steps = [
    {
      step: 1,
      icon: Lightbulb,
      title: '确定研究方向与选题',
      subtitle: 'Research Direction & Topic',
      description: '从一个宽泛的想法出发，通过AI辅助精准定位创新选题',
      subSteps: [
        { title: '构建检索策略', source: '第2集', action: '使用AI提示词分析关键词变体、同义词和干扰项', output: '专业级高级检索式', time: '1-2小时' },
        { title: '获取综述文献', source: '第3集', action: '执行检索，筛选综述文献，导入Zotero', output: '核心综述文献库', time: '2-3小时' },
        { title: '智能分析选题', source: '第4集', action: 'AI分析领域现状、研究空白，推荐选题方向', output: '明确的综述选题', time: '2-4小时' },
        { title: '精准重检索', source: '第5集', action: '矩阵式检索构建选题相关文献库', output: '100-600篇研究型文献', time: '1天' },
      ],
      tips: ['使用论文分割器批量处理文献', '检索结果过多不必担心', '结果过少可使用"降维组合"策略'],
    },
    {
      step: 2,
      icon: FileText,
      title: '构建论文大纲框架',
      subtitle: 'Outline Construction',
      description: '基于文献分析，构建数据驱动的结构化写作大纲',
      subSteps: [
        { title: '文献相关性分析', source: '第6.1集', action: 'AI分批分析文献，评估相关性等级', output: '文献相关性分级表', time: '半天' },
        { title: '生成详细大纲', source: '第6.1集', action: 'AI根据文献分布生成章节大纲', output: '可执行写作大纲', time: '2-3小时' },
        { title: '文献智能分类', source: '第7集', action: '使用工具箱自动为文献添加章节标签', output: '结构化文献库', time: '1-2小时' },
      ],
      tips: ['使用BibTeX标签同步器一键批量添加标签', '确保每个子章节有足够文献支撑', '可迭代优化大纲逻辑结构'],
    },
    {
      step: 3,
      icon: PenTool,
      title: '撰写论文正文',
      subtitle: 'Writing Process',
      description: '分章节进行AI辅助写作，完成高质量初稿',
      subSteps: [
        { title: '筛选章节文献', source: '第8集', action: '使用章节筛选器筛选待写章节相关文献', output: '章节相关文献清单', time: '30分钟' },
        { title: '文献深度分析', source: '第8集', action: 'AI第一轮分析文献核心观点', output: '文献分析摘要', time: '1-2小时' },
        { title: '聚类论点生成大纲', source: '第8集', action: 'AI第二轮聚类分析，生成段落级大纲', output: '段落写作大纲', time: '1小时' },
        { title: '引用补全', source: '第8集', action: '使用引用编号补全器为段落匹配文献', output: '精准引用素材', time: '1小时' },
        { title: '完成段落初稿', source: '第8集', action: 'AI第三轮辅助写作，完成正文各章节', output: '正文初稿', time: '2-3天' },
      ],
      tips: ['三轮AI写作确保深度和质量', '段落大纲如有重复可通过"合并移动"优化', '保持全局视角审视整体逻辑'],
    },
    {
      step: 4,
      icon: FileCheck,
      title: '精修与事实核查',
      subtitle: 'Polishing & Verification',
      description: '对标范文提升语言，核查事实确保准确',
      subSteps: [
        { title: '对标范文分析', source: '第9.1集', action: '分析顶刊范文写作风格和表达方式', output: '修改方向清单', time: '2-3小时' },
        { title: '事实核查', source: '第9.2集', action: '逐条核查原文引用的准确性', output: '核查修正报告', time: '1-2天' },
        { title: '语言精修', source: '第9.1集', action: '结合范文风格和AI建议进行润色', output: '精修正文稿', time: '1-2天' },
      ],
      tips: ['事实核查与语言精修可并行进行', '借鉴原始文献表达方式融合AI建议', 'AI内容有问题是正常的，这是创造性修改的切入点'],
    },
    {
      step: 5,
      icon: BookOpen,
      title: '完成引言、结论与摘要',
      subtitle: 'Introduction & Conclusion',
      description: '使用特化提示词完成论文的开篇、收尾和门面',
      subSteps: [
        { title: '撰写引言', source: '第10集', action: '范文解构→AI大纲→文献匹配→写作→精修', output: '完整引言', time: '半天' },
        { title: '撰写结论与展望', source: '第11集', action: '总结研究成果，提出未来研究方向', output: '结论与展望章节', time: '半天' },
        { title: '撰写摘要', source: '第14集', action: '提炼核心内容，打造论文门面', output: '高质量摘要', time: '2-3小时' },
      ],
      tips: ['引言要清晰阐述研究背景和目的', '结论要呼应引言中的研究问题', '摘要要精炼准确，突出创新点'],
    },
    {
      step: 6,
      icon: Sparkles,
      title: '降低AIGC率与原创性重塑',
      subtitle: 'Originality Enhancement',
      description: '消除AI语言痕迹，确保通过AIGC检测',
      subSteps: [
        { title: '识别AI痕迹', source: '第13集', action: '识别AI固有句式和逻辑流', output: 'AI痕迹清单', time: '1-2小时' },
        { title: '原创性重写', source: '第13集', action: '"用自己的话重说一遍"，英文直改或中英转换', output: '低AIGC率文稿', time: '1-2天' },
      ],
      tips: ['核心心法："用自己的话重说一遍"', '英文直改或中英转换路径彻底打碎AI痕迹', '重构句子，融入个人风格'],
    },
    {
      step: 7,
      icon: Image,
      title: '配图与格式规范',
      subtitle: 'Figures & Formatting',
      description: '完成论文配图和参考文献格式化，准备投稿',
      subSteps: [
        { title: '配图规划', source: '第12集', action: 'AI分析顶刊配图策略，制定配图计划', output: '配图计划清单', time: '半天' },
        { title: '获取与授权', source: '第12集', action: '寻找或绘制图片，申请版权授权', output: '合规配图素材', time: '1-2天' },
        { title: '参考文献格式化', source: '第15/16集', action: '使用自动化脚本一键完成引用替换', output: '规范参考文献', time: '1-2小时' },
        { title: '最终审校', source: '全流程', action: '全文格式统一，最终质量检查', output: '可投稿终稿', time: '半天' },
      ],
      tips: ['配图需符合目标期刊要求', '使用RE2CiteKey脚本自动化处理参考文献', '投稿前务必进行最终全文检查'],
    },
  ];

  const timeline = {
    total: '2-4周',
    phases: [
      { name: '选题与文献构建', time: '3-5天' },
      { name: '大纲与素材整理', time: '2-3天' },
      { name: '正文撰写', time: '5-7天' },
      { name: '精修与核查', time: '3-5天' },
      { name: '收尾工作', time: '2-3天' },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF7]/90 backdrop-blur-sm border-b border-[#E5E8E7]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1A3A2F] rounded-sm flex items-center justify-center">
              <span className="text-[#C9A227] font-serif font-bold text-lg">R</span>
            </div>
            <span className="font-serif font-semibold text-[#1A3A2F] text-lg">科研服务站</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/services" className="text-sm text-[#6B706F] hover:text-[#1A3A2F] transition-colors">
              服务内容
            </Link>
            <Link href="/training" className="text-sm text-[#6B706F] hover:text-[#1A3A2F] transition-colors">
              培训课程
            </Link>
            <Link href="/workflow" className="text-sm text-[#1A3A2F] font-medium">
              服务流程
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-[#C9A227]" />
            <span className="text-[#C9A227] font-serif text-sm tracking-widest">WORKFLOW</span>
            <div className="w-12 h-px bg-[#C9A227]" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-[#1A3A2F] mb-4">
            七步完成高质量论文
          </h1>
          <p className="text-lg text-[#6B706F] max-w-2xl mx-auto">
            基于训练营验证的高效工作流，每一步都有清晰的操作指南和预期产出
          </p>
        </div>
      </section>

      {/* Timeline Overview */}
      <section className="pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-[#E5E8E7] rounded-sm p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#1A3A2F] rounded-sm flex items-center justify-center">
                <Clock className="w-7 h-7 text-[#C9A227]" />
              </div>
              <div>
                <div className="text-sm text-[#6B706F]">预计完成时间</div>
                <div className="font-serif text-3xl font-bold text-[#1A3A2F]">{timeline.total}</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {timeline.phases.map((phase, index) => (
                <div key={index} className="text-center px-4 py-2 bg-[#FAFAF7] rounded-sm border border-[#E5E8E7]">
                  <div className="text-xs text-[#6B706F]">{phase.name}</div>
                  <div className="font-semibold text-[#1A3A2F] text-sm">{phase.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white border border-[#E5E8E7] rounded-sm overflow-hidden group hover:border-[#C9A227] transition-colors">
              {/* Step Header */}
              <div className="bg-[#1A3A2F] p-6 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 border-2 border-[#C9A227] rounded-full flex items-center justify-center">
                    <span className="font-serif text-xl font-bold text-[#FAFAF7]">{step.step}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-semibold text-[#FAFAF7]">{step.title}</h2>
                    <div className="text-xs text-[#C9A227]">{step.subtitle}</div>
                  </div>
                </div>
                <p className="text-sm text-[#9ACFB0] md:ml-auto md:max-w-sm">{step.description}</p>
              </div>
              
              {/* Sub Steps */}
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  {step.subSteps.map((sub, subIndex) => (
                    <div key={subIndex} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-4 bg-[#FAFAF7] rounded-sm border border-[#E5E8E7]">
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-[#C9A227] font-medium bg-[#FAF5D6] px-2 py-1 rounded-sm">{sub.source}</span>
                        <span className="font-medium text-[#1A3A2F] text-sm">{sub.title}</span>
                      </div>
                      <p className="text-xs text-[#6B706F] flex-1">{sub.action}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1 text-[#87A878]">
                          <CheckCircle className="w-3 h-3" />
                          {sub.output}
                        </span>
                        <span className="flex items-center gap-1 text-[#6B706F]">
                          <Clock className="w-3 h-3" />
                          {sub.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Tips */}
                <div className="bg-[#FAF5D6] border border-[#E5E8E7] rounded-sm p-4">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-[#1A3A2F] mb-2">
                    <Target className="w-4 h-4 text-[#C9A227]" />
                    实用技巧
                  </h4>
                  <ul className="grid md:grid-cols-3 gap-2">
                    {step.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="text-xs text-[#6B706F] flex items-start gap-1">
                        <span className="text-[#C9A227] mt-0.5">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#1A3A2F]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#FAFAF7] mb-4">
            开始您的论文写作之旅
          </h2>
          <p className="text-[#9ACFB0] mb-8">
            选择适合您的服务方式：参加培训学习完整方法，或直接委托我们提供专业服务
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#C9A227] text-[#1A3A2F] font-medium rounded-sm hover:bg-[#D4A84A] transition-colors"
            >
              查看服务详情
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/training"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-[#C9A227] text-[#C9A227] font-medium rounded-sm hover:bg-[#C9A227] hover:text-[#1A3A2F] transition-colors"
            >
              参加培训课程
            </Link>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="py-8 px-6 border-t border-[#E5E8E7]">
        <div className="max-w-5xl mx-auto text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#6B706F] hover:text-[#1A3A2F] transition-colors"
          >
            ← 返回首页
          </Link>
        </div>
      </section>
    </div>
  );
}
