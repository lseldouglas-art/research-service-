import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles,
  GraduationCap,
  FileText,
  Workflow,
  ArrowRight,
  CheckCircle2,
  Users,
  Clock,
  Target,
  BookOpen,
  PenTool,
  Search,
  Layers
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const coreServices = [
    {
      icon: FileText,
      title: '科研辅助服务',
      subtitle: '专业文献处理与写作支持',
      description: '基于工业化工作流，提供文献检索、大纲构建、论文写作、质量精修等全流程科研辅助服务',
      features: ['文献精准检索', '智能大纲构建', '段落精修润色', '参考文献管理'],
      link: '/services',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: GraduationCap,
      title: '科研培训服务',
      subtitle: '高质量学术写作训练营',
      description: '系统化的AI辅助学术写作培训，帮助研究者掌握人机协同的高效工作方法',
      features: ['系统化课程体系', '实战案例教学', '私域社群支持', '持续答疑指导'],
      link: '/training',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Workflow,
      title: '一体化解决方案',
      subtitle: '定制化科研服务组合',
      description: '根据您的具体需求，灵活组合各项服务，提供从选题到发表的一站式科研支持',
      features: ['需求深度分析', '定制服务方案', '全流程跟踪', '质量保障体系'],
      link: '/solutions',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: '选题定向',
      description: '智能分析研究领域，精准定位创新选题',
    },
    {
      step: '02',
      title: '文献构建',
      description: '系统化文献检索，构建高质量文献库',
    },
    {
      step: '03',
      title: '大纲设计',
      description: '数据驱动大纲，逻辑严密结构清晰',
    },
    {
      step: '04',
      title: '智能写作',
      description: 'AI辅助写作，提升效率保证质量',
    },
    {
      step: '05',
      title: '质量精修',
      description: '事实核查润色，降低AIGC率',
    },
    {
      step: '06',
      title: '格式规范',
      description: '配图排版引用，准备最终提交',
    },
  ];

  const stats = [
    { number: '500+', label: '服务用户' },
    { number: '1000+', label: '论文辅助' },
    { number: '98%', label: '满意度' },
    { number: '24h', label: '响应时间' },
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
              复合型一体化科研服务平台
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              专业科研辅助服务
              <br />
              助力学术创新突破
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              基于人机协同的工业化工作流，将AI作为强大的科研助理，
              提供从选题到发表的全流程科研支持服务
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href="/services">
                  了解服务内容
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/workflow">
                  查看服务流程
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-slate-900 border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">核心服务</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">三大核心服务模块</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                基于成熟的训练营知识框架，灵活提供高质量科研支持服务
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {coreServices.map((service, index) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${service.color}`} />
                  <CardHeader className="pb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-sm font-medium">{service.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{service.description}</p>
                    <div className="space-y-2">
                      {service.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button asChild variant="outline" className="w-full mt-4 group-hover:bg-slate-100 dark:group-hover:bg-slate-800">
                      <Link href={service.link}>
                        了解详情
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">服务流程</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">六步完成高质量论文</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                基于训练营验证的高效工作流，每一步都有专业支持
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              {workflowSteps.map((item, index) => (
                <div key={index} className="relative group">
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl font-bold text-slate-200 dark:text-slate-700 mb-3">
                        {item.step}
                      </div>
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{item.description}</p>
                    </CardContent>
                  </Card>
                  {index < workflowSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-slate-300 dark:text-slate-600 z-10">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href="/workflow">
                  查看完整服务流程
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">为什么选择我们</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">专业、高效、可靠</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">精准定位</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  AI辅助智能分析，精准把握研究方向
                </p>
              </Card>
              
              <Card className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">高效交付</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  工业化工作流，大幅提升科研效率
                </p>
              </Card>
              
              <Card className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="font-semibold mb-2">专业团队</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  资深科研背景团队，理解学术需求
                </p>
              </Card>
              
              <Card className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">持续支持</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  完善的售后保障，全程跟踪服务
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              准备好开始您的科研之旅了吗？
            </h2>
            <p className="text-lg text-white/80 mb-8">
              立即联系我们，获取专属科研服务方案
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-slate-900 hover:bg-slate-100">
                <Link href="/contact">
                  联系咨询
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/training">
                  参加培训
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 dark:bg-slate-950 text-slate-400">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-blue-500" />
                  <span className="text-lg font-semibold text-white">科研服务站</span>
                </div>
                <p className="text-sm mb-4">
                  基于人机协同的工业化工作流，提供专业、高效、可靠的科研辅助服务
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-4">核心服务</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/services" className="hover:text-white transition-colors">科研辅助服务</Link></li>
                  <li><Link href="/training" className="hover:text-white transition-colors">科研培训服务</Link></li>
                  <li><Link href="/solutions" className="hover:text-white transition-colors">一体化解决方案</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-4">了解更多</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/workflow" className="hover:text-white transition-colors">服务流程</Link></li>
                  <li><Link href="/cases" className="hover:text-white transition-colors">成功案例</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">联系我们</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-slate-800 pt-8 text-center text-sm">
              <p>专业科研辅助服务平台 | 助力学术创新突破</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
