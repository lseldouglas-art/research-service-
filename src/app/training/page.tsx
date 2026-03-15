import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle, Clock, Download, FileText, GraduationCap, MessageCircle, Sparkles, Users, Video } from 'lucide-react';

export default function TrainingPage() {
  const modules = [
    {
      module: 1,
      title: '智能定向与文献基石构建',
      episodes: '第2-5集',
      description: '从一个宽泛的想法出发，精准定位综述选题，建立高质量文献库',
      lessons: [
        { ep: '第2集', title: '构建初步检索策略', content: '使用AI辅助完成专业级高级检索式，解决"查不全"或"查不准"的痛点' },
        { ep: '第3集', title: '获取初步文献数据', content: '执行检索，将文献信息高效导入Zotero，建立专业文献管理流程' },
        { ep: '第4集', title: '智能分析与选题决策', content: 'AI辅助领域分析报告，识别研究空白，推荐具体综述选题方向' },
        { ep: '第5集', title: '精准文献重检索', content: '矩阵式检索策略，构建100-600篇高度相关的专业文献库' },
      ],
    },
    {
      module: 2,
      title: '结构化大纲构建与素材整理',
      episodes: '第6-7集',
      description: '将无序文献转化为逻辑严密、章节分明的写作蓝图',
      lessons: [
        { ep: '第6.1集', title: '数据驱动的综述大纲', content: 'AI分析文献相关性，构建经过文献数量验证的可执行写作大纲' },
        { ep: '第7集', title: '文献智能分类与管理', content: '使用工具箱自动将章节标签和论文编号批量写入Zotero（流程已升级）' },
      ],
    },
    {
      module: 3,
      title: 'AI辅助写作与质量精修',
      episodes: '第8-13集',
      description: '完成论文初稿，进行事实核查、语言润色和原创性重写',
      lessons: [
        { ep: '第8集', title: '分章节智能写作', content: '三轮AI辅助写作流程：深度分析、论点聚类、引用补全' },
        { ep: '第9.1集', title: '段落精修', content: '对标顶刊范文，明确修改方向，提升学术表达水平' },
        { ep: '第9.2集', title: '事实核查', content: '系统化核查原文引用，确保内容准确可靠' },
        { ep: '第10-14集', title: '引言/结论/摘要构建', content: '使用特化提示词完成论文开篇、收尾和门面部分' },
        { ep: '第13集', title: '降低AIGC率', content: '掌握"用自己的话重说一遍"核心心法，通过AIGC检测' },
      ],
    },
    {
      module: 4,
      title: '收尾工作与格式规范',
      episodes: '第12、15、16集',
      description: '完成配图、参考文献格式化等收尾工作，准备最终提交',
      lessons: [
        { ep: '第12集', title: '论文配图策略', content: 'AI分析顶刊配图策略，制定配图计划，处理版权授权' },
        { ep: '第15-16集', title: '参考文献管理', content: '使用自动化脚本一键完成引用替换和参考文献列表生成' },
      ],
    },
  ];

  const tools = [
    { name: '论文分割器', icon: FileText, desc: '批量处理文献，分割成AI可处理的小文件' },
    { name: 'BibTeX同步器', icon: Download, desc: '将AI分析结果自动同步到Zotero文献库' },
    { name: '章节筛选器', icon: BookOpen, desc: '快速筛选出特定章节相关的所有文献' },
    { name: '引用补全器', icon: FileText, desc: '根据段落大纲精准提取所需文献信息' },
  ];

  const benefits = [
    { icon: Video, title: '系统化课程', desc: '16集完整视频课程，覆盖全流程' },
    { icon: FileText, title: '配套工具箱', desc: '四合一整合版论文处理工具' },
    { icon: Users, title: '私域社群', desc: '加入专属学员社群，持续交流' },
    { icon: MessageCircle, title: '答疑支持', desc: '专业助教团队，解答各类问题' },
  ];

  const highlights = [
    '掌握人机协同的工业化科研工作流',
    '学会使用AI作为科研助理提高效率',
    '获得论文处理工具箱永久使用权',
    '加入高质量学术写作社群',
    '获得结业证书和持续学习资源',
  ];

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
            <Link href="/training" className="text-sm text-[#1A3A2F] font-medium">
              培训课程
            </Link>
            <Link href="/workflow" className="text-sm text-[#6B706F] hover:text-[#1A3A2F] transition-colors">
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
            <span className="text-[#C9A227] font-serif text-sm tracking-widest">TRAINING PROGRAM</span>
            <div className="w-12 h-px bg-[#C9A227]" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-[#1A3A2F] mb-4">
            AI辅助学术写作训练营
          </h1>
          <p className="text-lg text-[#6B706F] max-w-2xl mx-auto mb-8">
            系统化掌握人机协同的高效工作方法，将AI作为强大的科研助理
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#1A3A2F] text-[#FAFAF7] font-medium rounded-sm hover:bg-[#2A5244] transition-all">
              立即报名
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link 
              href="#curriculum"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-[#1A3A2F] text-[#1A3A2F] font-medium rounded-sm hover:bg-[#1A3A2F] hover:text-[#FAFAF7] transition-all"
            >
              查看课程大纲
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 px-6 border-y border-[#E5E8E7] bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 border-2 border-[#C9A227] rounded-full flex items-center justify-center">
                  <benefit.icon className="w-5 h-5 text-[#C9A227]" />
                </div>
                <h3 className="font-medium text-[#1A3A2F] text-sm mb-1">{benefit.title}</h3>
                <p className="text-xs text-[#6B706F]">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section id="curriculum" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#C9A227] font-serif text-sm tracking-widest">CURRICULUM</span>
            <h2 className="text-3xl font-serif font-semibold text-[#1A3A2F] mt-3">四大核心模块</h2>
          </div>
          
          <div className="space-y-6">
            {modules.map((mod, index) => (
              <div key={index} className="bg-white border border-[#E5E8E7] rounded-sm overflow-hidden">
                <div className="bg-[#1A3A2F] p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 border-2 border-[#C9A227] rounded-full flex items-center justify-center text-[#FAFAF7] font-serif font-bold">
                      {mod.module}
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-semibold text-[#FAFAF7]">{mod.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#C9A227]">{mod.episodes}</span>
                        <span className="text-xs text-[#9ACFB0]">• {mod.lessons.length}课时</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[#9ACFB0] mt-4 ml-16">{mod.description}</p>
                </div>
                
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {mod.lessons.map((lesson, lIndex) => (
                      <div key={lIndex} className="flex gap-3 p-4 bg-[#FAFAF7] rounded-sm">
                        <div className="text-xs text-[#C9A227] font-medium whitespace-nowrap pt-0.5">
                          {lesson.ep}
                        </div>
                        <div>
                          <div className="font-medium text-[#1A3A2F] text-sm mb-1">{lesson.title}</div>
                          <div className="text-xs text-[#6B706F]">{lesson.content}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-20 px-6 bg-white border-y border-[#E5E8E7]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#C9A227] font-serif text-sm tracking-widest">TOOLS</span>
            <h2 className="text-3xl font-serif font-semibold text-[#1A3A2F] mt-3">配套工具箱</h2>
            <p className="text-[#6B706F] mt-2">四合一整合版桌面应用，贯穿整个课程流程</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            {tools.map((tool, index) => (
              <div key={index} className="text-center p-6 bg-[#FAFAF7] border border-[#E5E8E7] rounded-sm">
                <div className="w-12 h-12 mx-auto mb-4 bg-[#1A3A2F] rounded-sm flex items-center justify-center">
                  <tool.icon className="w-6 h-6 text-[#C9A227]" />
                </div>
                <h3 className="font-medium text-[#1A3A2F] mb-2">{tool.name}</h3>
                <p className="text-xs text-[#6B706F]">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* What You Get */}
            <div className="bg-white border border-[#E5E8E7] rounded-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#1A3A2F] rounded-sm flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-[#C9A227]" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-[#1A3A2F]">你将获得</h3>
              </div>
              
              <ul className="space-y-3">
                {highlights.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#C9A227] mt-0.5 flex-shrink-0" />
                    <span className="text-[#1E2120] text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Features */}
            <div className="bg-[#1A3A2F] rounded-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#C9A227] rounded-sm flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#1A3A2F]" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-[#FAFAF7]">培训特色</h3>
              </div>
              
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-[#C9A227] mt-0.5 flex-shrink-0" />
                  <span className="text-[#9ACFB0] text-sm">实战案例教学，边学边练</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-[#C9A227] mt-0.5 flex-shrink-0" />
                  <span className="text-[#9ACFB0] text-sm">流程持续迭代，紧跟AI发展</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-[#C9A227] mt-0.5 flex-shrink-0" />
                  <span className="text-[#9ACFB0] text-sm">专业助教答疑，学习无忧</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-[#C9A227] mt-0.5 flex-shrink-0" />
                  <span className="text-[#9ACFB0] text-sm">社群资源共享，持续成长</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-[#C9A227] mt-0.5 flex-shrink-0" />
                  <span className="text-[#9ACFB0] text-sm">支持多轮复训，巩固知识</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#1A3A2F]">
        <div className="max-w-3xl mx-auto text-center">
          <GraduationCap className="w-12 h-12 mx-auto mb-4 text-[#C9A227]" />
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#FAFAF7] mb-4">
            准备好提升科研效率了吗？
          </h2>
          <p className="text-[#9ACFB0] mb-8">
            加入训练营，掌握人机协同的高效工作方法
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-[#C9A227] text-[#1A3A2F] font-medium rounded-sm hover:bg-[#D4A84A] transition-colors">
              立即报名参加
            </button>
            <button className="px-8 py-3 border-2 border-[#C9A227] text-[#C9A227] font-medium rounded-sm hover:bg-[#C9A227] hover:text-[#1A3A2F] transition-colors">
              咨询课程详情
            </button>
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
