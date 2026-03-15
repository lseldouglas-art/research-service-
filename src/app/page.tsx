import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Brain, 
  FileText, 
  Layers, 
  Sparkles, 
  Target,
  Search,
  Database,
  PenTool,
  CheckCircle2,
  ArrowRight,
  Zap,
  Workflow
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const tools = [
    {
      icon: FileText,
      title: '论文分割器',
      description: '用于批量处理文献，将上百篇文献分割成AI可处理的小文件',
    },
    {
      icon: Layers,
      title: 'BibTeX 标签同步器',
      description: '将AI分析的章节分类结果，自动同步到Zotero文献库中',
    },
    {
      icon: Search,
      title: '章节筛选器',
      description: '在撰写特定章节时，快速筛选出所有相关文献',
    },
    {
      icon: PenTool,
      title: '引用编号补全器',
      description: '根据段落大纲，精准提取写作所需的具体文献信息',
    },
  ];

  const phases = [
    {
      number: '01',
      title: '智能定向与文献基石构建',
      subtitle: '第2-5集',
      description: '从一个宽泛的想法出发，通过AI辅助，精准定位到一个具有创新性和可行性的具体综述选题，并为其建立一个高质量、高相关的核心文献库。',
      steps: ['构建初步检索策略', '获取初步文献数据', '智能分析与选题决策', '精准文献重检索'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      number: '02',
      title: '结构化大纲构建与素材整理',
      subtitle: '第6-7集',
      description: '将无序的文献库信息，转化为一个逻辑严密、章节分明、且每个章节都有充足文献支撑的写作蓝图。',
      steps: ['数据驱动的综述大纲', '文献智能分类与结构化管理'],
      color: 'from-purple-500 to-pink-500',
    },
    {
      number: '03',
      title: 'AI辅助写作与质量精修',
      subtitle: '第8-13集',
      description: '在AI的辅助下，完成论文初稿，并通过系统化的流程进行事实核查、语言润色和原创性重写，最终产出高质量的文稿。',
      steps: ['分章节智能写作', '段落精修与事实核查', '引言、结论与摘要构建', '降低AIGC率与原创性重塑'],
      color: 'from-orange-500 to-red-500',
    },
    {
      number: '04',
      title: '收尾工作与格式规范',
      subtitle: '第12、15、16集',
      description: '完成论文的配图、参考文献格式化等所有收尾工作，准备最终提交。',
      steps: ['论文配图策略与获取', '参考文献的插入与管理'],
      color: 'from-green-500 to-teal-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="container relative mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
              <Sparkles className="w-4 h-4 mr-2" />
              AI辅助学术写作训练营
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              建立人机高效协同的
              <br />
              工业化工作流
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              我们不追求让AI替代思考，而是将AI作为一名强大的科研助理，
              把研究者从繁琐、重复的机械性工作中解放出来，
              从而能更专注于学术思想的创新、逻辑框架的构建和最终成果的把控。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href="/phases">
                  开始学习
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#tools">
                  了解工具箱
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">核心理念</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">课程设计哲学</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                这个大纲请学员完成作业时时刻对照着看，了解每个步骤的目的以及是要为下个步骤准备什么材料，避免失去焦点！
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-slate-900">
                <CardHeader>
                  <Brain className="w-12 h-12 text-blue-600 mb-4" />
                  <CardTitle>AI作为科研助理</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    不替代思考，而是作为强大的助手，处理繁琐重复的机械性工作
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-slate-900">
                <CardHeader>
                  <Target className="w-12 h-12 text-purple-600 mb-4" />
                  <CardTitle>聚焦核心价值</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    解放研究者，专注于学术思想创新、逻辑框架构建和成果把控
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-pink-200 dark:border-pink-800 bg-gradient-to-br from-pink-50 to-white dark:from-pink-950 dark:to-slate-900">
                <CardHeader>
                  <Workflow className="w-12 h-12 text-pink-600 mb-4" />
                  <CardTitle>工业化工作流</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    建立标准化、可重复、高效的科研工作流程，提升整体产出质量
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">核心工具</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">论文处理工具箱</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                四大核心功能，贯穿整个课程流程，实现高效自动化
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tools.map((tool, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <tool.icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{tool.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Phases Overview */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">课程阶段</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">四大核心阶段</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                从选题到定稿，系统化的学术写作全流程
              </p>
            </div>
            
            <div className="space-y-6">
              {phases.map((phase, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col lg:flex-row">
                    <div className={`w-full lg:w-48 bg-gradient-to-br ${phase.color} p-6 text-white flex flex-col justify-center`}>
                      <div className="text-5xl font-bold mb-2">{phase.number}</div>
                      <Badge variant="secondary" className="w-fit bg-white/20 hover:bg-white/30 text-white border-0">
                        {phase.subtitle}
                      </Badge>
                    </div>
                    <div className="flex-1 p-6">
                      <h3 className="text-xl font-bold mb-3">{phase.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">{phase.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {phase.steps.map((step, stepIndex) => (
                          <Badge key={stepIndex} variant="outline" className="border-slate-300 dark:border-slate-600">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {step}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href="/phases">
                  查看详细课程内容
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Update Notice */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-amber-600" />
                  <CardTitle>重大流程更新与勘误说明</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  关于文献打标签 (第7、8集内容升级)
                </p>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-2">
                  <p className="text-sm"><strong>旧流程：</strong>第7集演示了如何手动为Zotero中的文献添加章节标签；第8集早期版本使用在线工具为文献添加REXXX编号标签。</p>
                  <p className="text-sm"><strong>新流程：</strong>这两个手动步骤现已完全整合并自动化！现在使用《论文处理工具箱》中的"BibTeX 标签同步器"，可以一次性将章节号标签和论文唯一REXXX编号同时、自动地写入文献信息中。</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 dark:bg-slate-950 text-slate-400">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-4 text-blue-500" />
            <p className="text-lg font-semibold text-white mb-2">AI辅助学术写作训练营</p>
            <p className="text-sm">建立人机高效协同的工业化工作流</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
