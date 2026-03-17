'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
  HeartHandshake,
  Play,
  ChevronDown,
  Zap,
  Target,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function TrainingPage() {
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);

  const courseModules = [
    {
      module: 1,
      title: '智能定向与文献基石构建',
      description: '从一个宽泛的想法出发，精准定位综述选题，建立高质量文献库',
      lessons: [
        { title: '构建初步检索策略', content: '使用AI辅助完成专业级高级检索式，解决"查不全"或"查不准"的痛点' },
        { title: '获取初步文献数据', content: '执行检索，将文献信息高效导入Zotero，建立专业文献管理流程' },
        { title: '智能分析与选题决策', content: 'AI辅助领域分析报告，识别研究空白，推荐具体综述选题方向' },
        { title: '精准文献重检索', content: '矩阵式检索策略，构建100-600篇高度相关的专业文献库' },
      ],
      color: 'from-blue-600 to-cyan-500',
    },
    {
      module: 2,
      title: '结构化大纲构建与素材整理',
      description: '将无序文献转化为逻辑严密、章节分明的写作蓝图',
      lessons: [
        { title: '数据驱动的综述大纲', content: 'AI分析文献相关性，构建经过文献数量验证的可执行写作大纲' },
        { title: '文献智能分类与结构化管理', content: '使用工具箱自动将章节标签和论文编号批量写入Zotero（流程已升级）' },
      ],
      color: 'from-purple-600 to-pink-500',
    },
    {
      module: 3,
      title: 'AI辅助写作与质量精修',
      description: '完成论文初稿，进行事实核查、语言润色和原创性重写',
      lessons: [
        { title: '分章节智能写作', content: '三轮AI辅助写作流程：深度分析、论点聚类、引用补全，完成段落初稿' },
        { title: '段落精修（对标范文）', content: '对标顶刊范文，明确修改方向，提升学术表达水平' },
        { title: '事实核查与准确性验证', content: '系统化核查原文引用，确保内容准确可靠' },
        { title: '引言构建', content: '使用特化提示词，完成引言部分的撰写和精修' },
        { title: '结论与展望构建', content: '系统化完成论文收尾部分，确保逻辑完整' },
        { title: '降低AIGC率与原创性重塑', content: '掌握"用自己的话重说一遍"核心心法，通过AIGC检测' },
        { title: '摘要构建', content: '完成论文门面部分，打造高质量摘要' },
      ],
      color: 'from-amber-500 to-orange-500',
    },
    {
      module: 4,
      title: '收尾工作与格式规范',
      description: '完成配图、参考文献格式化等收尾工作，准备最终提交',
      lessons: [
        { title: '论文配图策略与获取', content: 'AI分析顶刊配图策略，制定配图计划，处理版权授权' },
        { title: '参考文献插入（常规）', content: '使用Zotero Word插件"边写边引"的标准流程' },
        { title: '参考文献管理（推荐）', content: '使用自动化脚本一键完成引用替换和参考文献列表生成' },
      ],
      color: 'from-emerald-600 to-teal-500',
    },
  ];

  const tools = [
    { name: '论文分割器', icon: FileText, description: '批量处理文献，将上百篇文献分割成AI可处理的小文件' },
    { name: 'BibTeX 标签同步器', icon: Download, description: '将AI分析结果自动同步到Zotero文献库中' },
    { name: '章节筛选器', icon: BookOpen, description: '快速筛选出特定章节相关的所有文献' },
    { name: '引用编号补全器', icon: FileText, description: '根据段落大纲精准提取写作所需的具体文献信息' },
  ];

  const benefits = [
    { icon: Video, title: '系统化课程', description: '完整视频课程，覆盖从选题到投稿全流程' },
    { icon: FileText, title: '配套工具箱', description: '四合一整合版论文处理工具，自动化繁琐工作' },
    { icon: Users, title: '私域社群', description: '加入专属学员社群，持续答疑和交流' },
    { icon: MessageCircle, title: '答疑支持', description: '专业助教团队，解答学习中的各类问题' },
  ];

  const highlights = [
    '掌握人机协同的工业化科研工作流',
    '学会使用AI作为科研助理提高效率',
    '获得论文处理工具箱永久使用权',
    '加入高质量学术写作社群',
    '获得结业证书和持续学习资源',
  ];

  const toggleModule = (index: number) => {
    setExpandedModules(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost" className="hover:bg-muted/50">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回首页
              </Link>
            </Button>
            <Badge variant="outline" className="text-sm border-amber-400/50 text-amber-600 dark:text-amber-400">
              科研培训服务
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">科研培训服务</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#1a365d] via-[#2c5282] to-[#d69e2e] dark:from-[#d69e2e] dark:via-[#ecc94b] dark:to-[#d69e2e] bg-clip-text text-transparent">
                AI辅助学术写作训练营
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              系统化掌握人机协同的高效工作方法，将AI作为强大的科研助理
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-academic h-12 px-8">
                立即报名
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 border-2">
                <Link href="#curriculum">
                  查看课程大纲
                </Link>
              </Button>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-4 gap-4 mb-16">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center card-hover">
                <CardContent className="pt-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${courseModules[index % 4].color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <benefit.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Course Modules */}
          <div id="curriculum" className="mb-16">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-4">课程大纲</Badge>
              <h2 className="text-3xl font-bold">四大核心模块</h2>
            </div>
            
            <div className="space-y-4">
              {courseModules.map((module, index) => (
                <Card 
                  key={index} 
                  className="overflow-hidden card-hover"
                >
                  {/* Module Header */}
                  <button
                    onClick={() => toggleModule(index)}
                    className="w-full text-left"
                  >
                    <div className={`bg-gradient-to-r ${module.color} p-5 sm:p-6 relative`}>
                      <div className="absolute inset-0 bg-academic-texture opacity-20" />
                      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-xl backdrop-blur-sm">
                            {module.module}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">{module.title}</h3>
                            <p className="text-white/80 text-sm mt-0.5">{module.lessons.length} 节课程</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="bg-white/20 text-white border-0 text-sm">
                            <Play className="w-3 h-3 mr-1" />
                            {module.lessons.length} 节
                          </Badge>
                          <ChevronDown 
                            className={`w-5 h-5 text-white/80 transition-transform ${
                              expandedModules.includes(index) ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </button>
                  
                  {/* Module Content */}
                  {expandedModules.includes(index) && (
                    <CardContent className="p-5 sm:p-6">
                      <p className="text-muted-foreground mb-5">{module.description}</p>
                      
                      <div className="space-y-3">
                        {module.lessons.map((lesson, lIndex) => (
                          <div 
                            key={lIndex}
                            className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}>
                              {lIndex + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium mb-1">{lesson.title}</h4>
                              <p className="text-sm text-muted-foreground">{lesson.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Tools Section */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-4">配套工具</Badge>
              <h2 className="text-3xl font-bold">论文处理工具箱</h2>
              <p className="text-muted-foreground mt-2">
                四合一整合版桌面应用，贯穿整个课程流程
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tools.map((tool, index) => (
                <Card key={index} className="card-hover">
                  <CardContent className="p-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1a365d] to-[#d69e2e] flex items-center justify-center mb-4 shadow-lg">
                      <tool.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-4">你将获得</Badge>
              <h2 className="text-3xl font-bold">课程收获</h2>
            </div>
            
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                  <div className="p-8 lg:p-10">
                    <ul className="space-y-4">
                      {highlights.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#d69e2e] to-[#ecc94b] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 className="w-4 h-4 text-slate-900" />
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-[#1a365d] to-[#2c5282] p-8 lg:p-10 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-academic-texture opacity-20" />
                    <div className="relative">
                      <Award className="w-12 h-12 mb-4 text-amber-400" />
                      <h3 className="text-xl font-bold mb-3">结业证书</h3>
                      <p className="text-white/80 text-sm leading-relaxed">
                        完成全部课程学习并通过考核后，将获得官方认证的结业证书，证明您已掌握AI辅助学术写作的核心技能。
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a365d] via-[#2c5282] to-[#1a365d]" />
            <div className="absolute inset-0 bg-academic-texture opacity-30" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl" />
            
            <div className="relative p-8 lg:p-12 text-center text-white">
              <GraduationCap className="w-12 h-12 mx-auto mb-6 text-amber-400" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                准备好提升您的科研效率了吗？
              </h2>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                立即报名参加训练营，开启高效学术写作之旅
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="btn-gold h-12 px-8">
                  立即报名
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-8 border-white/30 text-white hover:bg-white/10 hover:text-white">
                  <Link href="/contact">
                    咨询详情
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            专业科研辅助服务平台 | 助力学术创新突破
          </p>
        </div>
      </footer>
    </div>
  );
}
