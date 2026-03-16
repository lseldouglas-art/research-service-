import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  Search,
  FileText,
  PenTool,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  Users,
  Target,
  Zap,
  ExternalLink,
  Wrench
} from 'lucide-react';
import Link from 'next/link';

// 在线工具列表
const onlineTools = [
  {
    title: '文献检索式生成器',
    description: 'AI驱动，自动生成专业检索式',
    href: '/tools/literature-search',
    icon: Search,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: '选题分析器',
    description: '上传文献库，AI分析选题方向',
    href: '/tools/topic-analysis',
    icon: Sparkles,
    color: 'from-green-500 to-blue-500',
  },
  {
    title: '论文大纲生成器',
    description: '文献分析+智能大纲，支持6种论文类型',
    href: '/tools/outline-generator',
    icon: FileText,
    color: 'from-purple-500 to-pink-500',
  },
];

export default function ServicesPage() {
  const services = [
    {
      id: 'literature-search',
      icon: Search,
      title: '文献检索与筛选服务',
      subtitle: '服务阶段一',
      description: '从宽泛想法到精准选题，构建高质量文献库',
      details: '基于AI辅助的智能化检索策略，帮助您系统性地构建领域文献库，识别研究空白，确定创新选题方向。',
      deliverables: [
        '专业级高级检索式构建',
        '100-600篇高质量文献筛选',
        '领域分析报告与研究空白识别',
        '结构化Zotero文献库交付',
      ],
      suitable: [
        '需要系统梳理研究领域的研究者',
        '准备撰写综述论文的研究生',
        '寻找创新选题方向的科研人员',
      ],
      timeline: '3-5个工作日',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-white dark:from-blue-950/50 dark:to-slate-900',
      toolLink: '/tools/literature-search',
    },
    {
      id: 'outline-design',
      icon: FileText,
      title: '大纲构建与素材整理服务',
      subtitle: '服务阶段二',
      description: '数据驱动的论文框架设计，文献智能分类管理',
      details: '利用AI分析文献关联性，构建逻辑严密的论文大纲，并将文献智能匹配到各章节，形成结构化写作素材库。',
      deliverables: [
        '数据驱动的详细论文大纲',
        '文献相关性评估与分级',
        '章节-文献智能匹配标签系统',
        '可直接使用的写作素材库',
      ],
      suitable: [
        '已确定选题需要构建框架的研究者',
        '文献资料丰富但不知如何组织',
        '希望提高论文逻辑性的作者',
      ],
      timeline: '5-7个工作日',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-white dark:from-purple-950/50 dark:to-slate-900',
    },
    {
      id: 'writing-support',
      icon: PenTool,
      title: '论文写作与润色服务',
      subtitle: '服务阶段三',
      description: 'AI辅助写作、事实核查、语言精修全流程支持',
      details: '提供分章节智能写作辅助，配合专业的事实核查和语言润色，确保论文内容准确、表达专业、原创性高。',
      deliverables: [
        '分章节写作大纲与初稿',
        '引用文献精准匹配与标注',
        '事实核查与准确性验证',
        '学术语言润色与表达优化',
        'AIGC率优化建议',
      ],
      suitable: [
        '论文写作效率低下的研究者',
        '需要提升论文语言质量',
        '担心AI痕迹过重的作者',
      ],
      timeline: '7-14个工作日',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-white dark:from-orange-950/50 dark:to-slate-900',
    },
    {
      id: 'formatting',
      icon: FileCheck,
      title: '格式规范与收尾服务',
      subtitle: '服务阶段四',
      description: '配图设计、参考文献格式化、最终审校',
      details: '完成论文配图规划与版权处理、参考文献规范化、全文格式统一，确保论文符合目标期刊投稿要求。',
      deliverables: [
        '论文配图规划与版权授权协助',
        '参考文献格式自动转换',
        '全文格式统一与排版优化',
        '投稿前最终质量检查',
      ],
      suitable: [
        '论文初稿完成需要投稿准备',
        '参考文献格式要求复杂的期刊',
        '需要配图设计支持的研究者',
      ],
      timeline: '3-5个工作日',
      color: 'from-green-500 to-teal-500',
      bgColor: 'from-green-50 to-white dark:from-green-950/50 dark:to-slate-900',
    },
  ];

  const packages = [
    {
      name: '单项服务',
      description: '根据需要选择任一服务阶段',
      price: '按需报价',
      features: ['灵活选择服务内容', '独立交付验收', '专业团队支持'],
    },
    {
      name: '组合服务',
      description: '选择2-3个服务阶段组合',
      price: '享9折优惠',
      features: ['阶段无缝衔接', '整体流程优化', '专属服务经理'],
      recommended: true,
    },
    {
      name: '全流程服务',
      description: '从选题到投稿的一站式支持',
      price: '享85折优惠',
      features: ['完整服务周期', '全程跟踪管理', '质量保障承诺'],
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
              科研辅助服务
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">科研辅助服务</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              专业科研辅助服务
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto mb-6">
              基于训练营验证的高效工作流，将四个阶段转化为灵活可选的专业服务
            </p>
            
            {/* 在线工具入口 */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-2 mb-8">
              <CardContent className="py-4">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">在线工具</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {onlineTools.map((tool, i) => (
                      <Button key={i} asChild variant="outline" size="sm" className="bg-white dark:bg-slate-800">
                        <Link href={tool.href}>
                          <tool.icon className="mr-2 h-4 w-4" />
                          {tool.title}
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Services Grid */}
          <div className="space-y-8 mb-16">
            {services.map((service, index) => (
              <Card key={index} className={`overflow-hidden bg-gradient-to-br ${service.bgColor} border-2`}>
                <div className="flex flex-col lg:flex-row">
                  {/* Service Header */}
                  <div className={`lg:w-64 bg-gradient-to-br ${service.color} p-6 text-white flex flex-col justify-center`}>
                    <service.icon className="w-12 h-12 mb-4 opacity-80" />
                    <Badge className="w-fit bg-white/20 hover:bg-white/30 text-white border-0 mb-2">
                      {service.subtitle}
                    </Badge>
                    <h2 className="text-2xl font-bold">{service.title}</h2>
                  </div>
                  
                  {/* Service Content */}
                  <CardContent className="flex-1 p-6 lg:p-8">
                    <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">
                      {service.details}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      {/* Deliverables */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          服务交付内容
                        </h3>
                        <ul className="space-y-2">
                          {service.deliverables.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <span className="text-green-500 mt-1">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Suitable For */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Target className="w-5 h-5 text-purple-600" />
                          适用场景
                        </h3>
                        <ul className="space-y-2">
                          {service.suitable.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <span className="text-purple-500 mt-1">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">预计周期：{service.timeline}</span>
                        </div>
                        {service.toolLink && (
                          <Button asChild variant="outline" size="sm">
                            <Link href={service.toolLink}>
                              <Wrench className="mr-1 h-4 w-4" />
                              在线工具
                            </Link>
                          </Button>
                        )}
                      </div>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        咨询此服务
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

          {/* Service Packages */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <Badge variant="secondary" className="mb-4">服务套餐</Badge>
              <h2 className="text-3xl font-bold">灵活选择，按需定制</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {packages.map((pkg, index) => (
                <Card key={index} className={`relative ${pkg.recommended ? 'border-2 border-purple-500 shadow-xl' : ''}`}>
                  {pkg.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                        推荐
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {pkg.price}
                    </div>
                    <ul className="space-y-2 text-sm">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full ${pkg.recommended ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' : ''}`} variant={pkg.recommended ? 'default' : 'outline'}>
                      立即咨询
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Service Guarantee */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl font-bold mb-4">服务承诺</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div>
                <Zap className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <h3 className="font-semibold mb-1">高效响应</h3>
                <p className="text-sm text-white/80">24小时内响应，快速启动服务</p>
              </div>
              <div>
                <Target className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <h3 className="font-semibold mb-1">质量保证</h3>
                <p className="text-sm text-white/80">不满意可修改，直到满意为止</p>
              </div>
              <div>
                <Users className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <h3 className="font-semibold mb-1">专业团队</h3>
                <p className="text-sm text-white/80">资深科研背景，理解学术需求</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
