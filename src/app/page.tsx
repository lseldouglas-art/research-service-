import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
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
  Search,
  Split,
  ChevronRight,
  Star,
  Quote,
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
      highlight: false,
    },
    {
      icon: GraduationCap,
      title: '科研培训服务',
      subtitle: '高质量学术写作训练营',
      description: '系统化的AI辅助学术写作培训，帮助研究者掌握人机协同的高效工作方法',
      features: ['系统化课程体系', '实战案例教学', '私域社群支持', '持续答疑指导'],
      link: '/training',
      highlight: true,
    },
    {
      icon: Workflow,
      title: '一体化解决方案',
      subtitle: '定制化科研服务组合',
      description: '根据您的具体需求，灵活组合各项服务，提供从选题到发表的一站式科研支持',
      features: ['需求深度分析', '定制服务方案', '全流程跟踪', '质量保障体系'],
      link: '/solutions',
      highlight: false,
    },
  ];

  const workflowSteps = [
    { step: '01', title: '选题定向', description: '智能分析研究领域，精准定位创新选题' },
    { step: '02', title: '文献构建', description: '系统化文献检索，构建高质量文献库' },
    { step: '03', title: '大纲设计', description: '数据驱动大纲，逻辑严密结构清晰' },
    { step: '04', title: '智能写作', description: 'AI辅助写作，提升效率保证质量' },
    { step: '05', title: '质量精修', description: '事实核查润色，降低AIGC率' },
    { step: '06', title: '格式规范', description: '配图排版引用，准备最终提交' },
  ];

  const stats = [
    { number: '500+', label: '服务用户', icon: Users },
    { number: '1000+', label: '论文辅助', icon: FileText },
    { number: '98%', label: '满意度', icon: Star },
    { number: '24h', label: '响应时间', icon: Clock },
  ];

  const tools = [
    { icon: Search, title: '文献检索', href: '/tools/literature-search', color: 'from-blue-600 to-cyan-500' },
    { icon: Sparkles, title: '选题分析', href: '/tools/topic-analysis', color: 'from-emerald-600 to-teal-500' },
    { icon: FileText, title: '大纲生成', href: '/tools/outline-generator', color: 'from-purple-600 to-pink-500' },
    { icon: Split, title: '文献分解', href: '/tools/literature-decomposer', color: 'from-indigo-600 to-violet-500' },
  ];

  const testimonials = [
    {
      quote: '从选题到投稿，全程都有专业指导，让我的第一篇综述论文顺利发表。',
      author: '张博士',
      role: '985高校博士生',
    },
    {
      quote: '培训课程系统全面，教会我如何高效使用AI工具辅助科研写作。',
      author: '李老师',
      role: '高校青年教师',
    },
    {
      quote: '工具非常好用，尤其是文献分解器，大大提升了我的工作效率。',
      author: '王同学',
      role: '硕士研究生',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 hero-bg-pattern" />
        <div className="absolute inset-0 bg-academic-texture opacity-50" />
        
        {/* 装饰元素 */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tl from-blue-600/10 to-transparent rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* 标签 */}
            <Badge 
              variant="outline" 
              className="mb-8 px-5 py-2.5 text-sm border-amber-400/30 bg-amber-400/5 backdrop-blur-sm animate-fade-in-up"
            >
              <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
              <span className="text-amber-700 dark:text-amber-400">复合型一体化科研服务平台</span>
            </Badge>
            
            {/* 主标题 */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 animate-fade-in-up animation-delay-100">
              <span className="block text-foreground mb-2">专业科研辅助服务</span>
              <span className="block bg-gradient-to-r from-[#1a365d] via-[#2c5282] to-[#d69e2e] dark:from-[#d69e2e] dark:via-[#ecc94b] dark:to-[#d69e2e] bg-clip-text text-transparent">
                助力学术创新突破
              </span>
            </h1>
            
            {/* 副标题 */}
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
              基于人机协同的工业化工作流，将AI作为强大的科研助理，
              <br className="hidden md:block" />
              提供从选题到发表的全流程科研支持服务
            </p>
            
            {/* CTA按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-300">
              <Button asChild size="lg" className="btn-academic h-12 px-8 text-base">
                <Link href="/services">
                  了解服务内容
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base border-2 hover:bg-muted/50">
                <Link href="/workflow">
                  查看服务流程
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex justify-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a365d]/10 to-[#d69e2e]/10 dark:from-[#d69e2e]/20 dark:to-[#ecc94b]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <stat.icon className="w-5 h-5 text-[#d69e2e]" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold stat-number">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Online Tools Section */}
      <section className="py-16 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-4">在线工具</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                免费使用智能科研工具
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                AI驱动，从文献检索到选题分析，一站式科研辅助
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tools.map((tool, index) => (
                <Link
                  key={index}
                  href={tool.href}
                  className="group relative p-6 rounded-2xl bg-card border border-border hover:border-amber-400/50 transition-all duration-300 card-hover"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">{tool.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    <span>立即使用</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <Badge variant="secondary" className="mb-4">核心服务</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">三大核心服务模块</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                基于成熟的训练营知识框架，灵活提供高质量科研支持服务
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {coreServices.map((service, index) => (
                <Card 
                  key={index} 
                  className={`group relative overflow-hidden card-hover ${
                    service.highlight 
                      ? 'border-amber-400/50 bg-gradient-to-b from-amber-50/50 to-card dark:from-amber-950/20 dark:to-card' 
                      : ''
                  }`}
                >
                  {service.highlight && (
                    <div className="absolute top-0 right-0">
                      <Badge className="rounded-none rounded-bl-lg badge-premium">
                        推荐
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-2xl mb-5 flex items-center justify-center ${
                      service.highlight
                        ? 'bg-gradient-to-br from-[#d69e2e] to-[#ecc94b]'
                        : 'bg-gradient-to-br from-[#1a365d] to-[#2c5282]'
                    } shadow-lg group-hover:scale-105 transition-transform`}>
                      <service.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground font-medium mb-4">{service.subtitle}</p>
                    <p className="text-sm text-muted-foreground mb-5 line-clamp-2">{service.description}</p>
                    
                    <ul className="space-y-2.5 mb-6">
                      {service.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-2.5 text-sm">
                          <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${
                            service.highlight ? 'text-amber-500' : 'text-emerald-500'
                          }`} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      asChild 
                      variant="outline" 
                      className={`w-full group-hover:bg-muted/50 ${
                        service.highlight ? 'border-amber-400/50 hover:bg-amber-50 dark:hover:bg-amber-950/30' : ''
                      }`}
                    >
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
      <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <Badge variant="secondary" className="mb-4">服务流程</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">六步完成高质量论文</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                基于训练营验证的高效工作流，每一步都有专业支持
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workflowSteps.map((item, index) => (
                <div 
                  key={index} 
                  className="group relative p-6 rounded-2xl bg-card border border-border hover:border-amber-400/50 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1a365d] to-[#2c5282] flex items-center justify-center text-white font-bold text-lg flex-shrink-0 group-hover:scale-105 transition-transform">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Button asChild size="lg" className="btn-academic">
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <Badge variant="secondary" className="mb-4">为什么选择我们</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">专业、高效、可靠</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Target, title: '精准定位', description: 'AI辅助智能分析，精准把握研究方向', color: 'from-blue-500 to-cyan-500' },
                { icon: Clock, title: '高效交付', description: '工业化工作流，大幅提升科研效率', color: 'from-emerald-500 to-teal-500' },
                { icon: Users, title: '专业团队', description: '资深科研背景团队，理解学术需求', color: 'from-purple-500 to-pink-500' },
                { icon: BookOpen, title: '持续支持', description: '完善的售后保障，全程跟踪服务', color: 'from-amber-500 to-orange-500' },
              ].map((item, index) => (
                <Card key={index} className="text-center card-hover">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <Badge variant="secondary" className="mb-4">用户评价</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">他们这样说</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((item, index) => (
                <Card key={index} className="relative card-hover">
                  <CardContent className="p-6">
                    <Quote className="w-8 h-8 text-amber-400/30 absolute top-4 right-4" />
                    <p className="text-sm text-muted-foreground mb-4 relative z-10">
                      "{item.quote}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a365d] to-[#d69e2e] flex items-center justify-center text-white font-semibold text-sm">
                        {item.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{item.author}</p>
                        <p className="text-xs text-muted-foreground">{item.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        {/* 背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a365d] via-[#2c5282] to-[#1a365d]" />
        <div className="absolute inset-0 bg-academic-texture opacity-30" />
        
        {/* 装饰 */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center text-white">
            <Sparkles className="w-12 h-12 mx-auto mb-6 text-amber-400" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              准备好开始您的科研之旅了吗？
            </h2>
            <p className="text-lg text-white/80 mb-8">
              立即联系我们，获取专属科研服务方案
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-gold h-12 px-8">
                <Link href="/contact">
                  联系咨询
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 border-white/30 text-white hover:bg-white/10 hover:text-white">
                <Link href="/training">
                  参加培训
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-slate-900 text-slate-400">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-10 mb-10">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d69e2e] to-[#ecc94b] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-slate-900" />
                  </div>
                  <span className="text-lg font-semibold text-white">科研服务站</span>
                </div>
                <p className="text-sm leading-relaxed mb-6 max-w-md">
                  基于人机协同的工业化工作流，提供专业、高效、可靠的科研辅助服务，助力学术创新突破。
                </p>
                <div className="flex gap-4">
                  <Link href="/donate" className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
                    支持我们
                  </Link>
                  <span className="text-slate-600">|</span>
                  <Link href="/contact" className="text-sm hover:text-white transition-colors">
                    联系我们
                  </Link>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-4">核心服务</h4>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/services" className="hover:text-white transition-colors">科研辅助服务</Link></li>
                  <li><Link href="/training" className="hover:text-white transition-colors">科研培训服务</Link></li>
                  <li><Link href="/tools" className="hover:text-white transition-colors">在线工具</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-4">了解更多</h4>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/workflow" className="hover:text-white transition-colors">服务流程</Link></li>
                  <li><Link href="/cases" className="hover:text-white transition-colors">成功案例</Link></li>
                  <li><Link href="/donate" className="hover:text-white transition-colors">捐赠支持</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm">专业科研辅助服务平台 | 助力学术创新突破</p>
              <p className="text-sm text-slate-500">© 2024 科研服务站. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
