import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Video,
  Users,
  MessageCircle,
  FileText,
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  Download,
  HeartHandshake
} from 'lucide-react';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function TrainingPage() {
  const courseModules = [
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
      color: 'from-blue-500 to-cyan-500',
    },
    {
      module: 2,
      title: '结构化大纲构建与素材整理',
      episodes: '第6-7集',
      description: '将无序文献转化为逻辑严密、章节分明的写作蓝图',
      lessons: [
        { ep: '第6.1集', title: '数据驱动的综述大纲', content: 'AI分析文献相关性，构建经过文献数量验证的可执行写作大纲' },
        { ep: '第7集', title: '文献智能分类与结构化管理', content: '使用工具箱自动将章节标签和论文编号批量写入Zotero（流程已升级）' },
      ],
      color: 'from-purple-500 to-pink-500',
    },
    {
      module: 3,
      title: 'AI辅助写作与质量精修',
      episodes: '第8-13集',
      description: '完成论文初稿，进行事实核查、语言润色和原创性重写',
      lessons: [
        { ep: '第8集', title: '分章节智能写作', content: '三轮AI辅助写作流程：深度分析、论点聚类、引用补全，完成段落初稿' },
        { ep: '第9.1集', title: '段落精修（对标范文）', content: '对标顶刊范文，明确修改方向，提升学术表达水平' },
        { ep: '第9.2集', title: '事实核查与准确性验证', content: '系统化核查原文引用，确保内容准确可靠' },
        { ep: '第10集', title: '引言构建', content: '使用特化提示词，完成引言部分的撰写和精修' },
        { ep: '第11集', title: '结论与展望构建', content: '系统化完成论文收尾部分，确保逻辑完整' },
        { ep: '第13集', title: '降低AIGC率与原创性重塑', content: '掌握"用自己的话重说一遍"核心心法，通过AIGC检测' },
        { ep: '第14集', title: '摘要构建', content: '完成论文门面部分，打造高质量摘要' },
      ],
      color: 'from-orange-500 to-red-500',
    },
    {
      module: 4,
      title: '收尾工作与格式规范',
      episodes: '第12、15、16集',
      description: '完成配图、参考文献格式化等收尾工作，准备最终提交',
      lessons: [
        { ep: '第12集', title: '论文配图策略与获取', content: 'AI分析顶刊配图策略，制定配图计划，处理版权授权' },
        { ep: '第15集', title: '参考文献插入（常规）', content: '使用Zotero Word插件"边写边引"的标准流程' },
        { ep: '第16集', title: '参考文献管理（推荐）', content: '使用自动化脚本一键完成引用替换和参考文献列表生成' },
      ],
      color: 'from-green-500 to-teal-500',
    },
  ];

  const tools = [
    {
      name: '论文分割器',
      icon: FileText,
      description: '批量处理文献，将上百篇文献分割成AI可处理的小文件',
    },
    {
      name: 'BibTeX 标签同步器',
      icon: Download,
      description: '将AI分析结果自动同步到Zotero文献库中',
    },
    {
      name: '章节筛选器',
      icon: BookOpen,
      description: '快速筛选出特定章节相关的所有文献',
    },
    {
      name: '引用编号补全器',
      icon: FileText,
      description: '根据段落大纲精准提取写作所需的具体文献信息',
    },
  ];

  const benefits = [
    {
      icon: Video,
      title: '系统化课程',
      description: '16集完整视频课程，覆盖从选题到投稿全流程',
    },
    {
      icon: FileText,
      title: '配套工具箱',
      description: '四合一整合版论文处理工具，自动化繁琐工作',
    },
    {
      icon: Users,
      title: '私域社群',
      description: '加入专属学员社群，持续答疑和交流',
    },
    {
      icon: MessageCircle,
      title: '答疑支持',
      description: '专业助教团队，解答学习中的各类问题',
    },
  ];

  const highlights = [
    '掌握人机协同的工业化科研工作流',
    '学会使用AI作为科研助理提高效率',
    '获得论文处理工具箱永久使用权',
    '加入高质量学术写作社群',
    '获得结业证书和持续学习资源',
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
              科研培训服务
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">科研培训服务</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI辅助学术写作训练营
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto mb-8">
              系统化掌握人机协同的高效工作方法，将AI作为强大的科研助理
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                立即报名
                <ArrowRight className="ml-2 w-4 w-4" />
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#curriculum">
                  查看课程大纲
                </Link>
              </Button>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-4 gap-4 mb-16">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Course Modules */}
          <div id="curriculum" className="mb-16">
            <div className="text-center mb-8">
              <Badge variant="secondary" className="mb-4">课程大纲</Badge>
              <h2 className="text-3xl font-bold">四大核心模块</h2>
            </div>
            
            <div className="space-y-6">
              {courseModules.map((module, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className={`bg-gradient-to-r ${module.color} p-4 sm:p-6`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl">
                          {module.module}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{module.title}</h3>
                          <Badge variant="secondary" className="bg-white/20 text-white border-0 mt-1">
                            {module.episodes}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-white/80 mt-3 text-sm">{module.description}</p>
                  </div>
                  
                  <CardContent className="p-4 sm:p-6">
                    <Accordion type="single" collapsible className="w-full">
                      {module.lessons.map((lesson, lIndex) => (
                        <AccordionItem key={lIndex} value={`lesson-${index}-${lIndex}`}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="shrink-0">{lesson.ep}</Badge>
                              <span className="font-medium text-left">{lesson.title}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-slate-600 dark:text-slate-400 pl-16">
                              {lesson.content}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tools Section */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <Badge variant="secondary" className="mb-4">配套工具</Badge>
              <h2 className="text-3xl font-bold">论文处理工具箱</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                四合一整合版桌面应用，贯穿整个课程流程
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4">
              {tools.map((tool, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center mx-auto mb-4">
                      <tool.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold mb-2">{tool.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{tool.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* What You Will Get */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-blue-600" />
                  你将获得
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {highlights.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HeartHandshake className="w-6 h-6 text-purple-600" />
                  培训特色
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                    <span>实战案例教学，边学边练</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                    <span>流程持续迭代，紧跟AI发展</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                    <span>专业助教答疑，学习无忧</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                    <span>社群资源共享，持续成长</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                    <span>支持多轮复训，巩固知识</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl font-bold mb-4">准备好提升科研效率了吗？</h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              加入训练营，掌握人机协同的高效工作方法，让AI成为你的科研助理
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-slate-900 hover:bg-slate-100">
                立即报名参加
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                咨询课程详情
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
