import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
  Wrench,
  Split,
  ChevronRight,
  Shield,
  HeartHandshake,
} from 'lucide-react';
import Link from 'next/link';

const onlineTools = [
  {
    title: '文献检索式生成器',
    description: 'AI驱动，自动生成专业检索式',
    href: '/tools/literature-search',
    icon: Search,
    color: 'from-blue-600 to-cyan-500',
  },
  {
    title: '选题分析器',
    description: '上传文献库，AI分析选题方向',
    href: '/tools/topic-analysis',
    icon: Sparkles,
    color: 'from-emerald-600 to-teal-500',
  },
  {
    title: '论文大纲生成器',
    description: '文献分析+智能大纲，支持6种论文类型',
    href: '/tools/outline-generator',
    icon: FileText,
    color: 'from-purple-600 to-pink-500',
  },
  {
    title: '文献分解器',
    description: '四步流程：分割→分析→聚类→撰写',
    href: '/tools/literature-decomposer',
    icon: Split,
    color: 'from-indigo-600 to-violet-500',
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
      color: 'from-blue-600 to-cyan-500',
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
      color: 'from-purple-600 to-pink-500',
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
      color: 'from-amber-500 to-orange-500',
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
      color: 'from-emerald-600 to-teal-500',
    },
  ];

  const packages = [
    {
      name: '单项服务',
      description: '根据需要选择任一服务阶段',
      price: '按需报价',
      features: ['灵活选择服务内容', '独立交付验收', '专业团队支持'],
      highlight: false,
    },
    {
      name: '组合服务',
      description: '选择2-3个服务阶段组合',
      price: '享9折优惠',
      features: ['阶段无缝衔接', '整体流程优化', '专属服务经理'],
      highlight: true,
    },
    {
      name: '全流程服务',
      description: '从选题到投稿的一站式支持',
      price: '享85折优惠',
      features: ['完整服务周期', '全程跟踪管理', '质量保障承诺'],
      highlight: false,
    },
  ];

  const guarantees = [
    { icon: Zap, title: '高效响应', description: '24小时内响应，快速启动服务' },
    { icon: Shield, title: '质量保证', description: '不满意可修改，直到满意为止' },
    { icon: HeartHandshake, title: '专业团队', description: '资深科研背景，理解学术需求' },
  ];

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
              科研辅助服务
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">科研辅助服务</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#1a365d] via-[#2c5282] to-[#d69e2e] dark:from-[#d69e2e] dark:via-[#ecc94b] dark:to-[#d69e2e] bg-clip-text text-transparent">
                专业科研辅助服务
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              基于训练营验证的高效工作流，将四个阶段转化为灵活可选的专业服务
            </p>
            
            {/* 在线工具入口 */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-muted/50 to-muted/30 border">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d69e2e] to-[#ecc94b] flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-slate-900" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">免费在线工具</p>
                    <p className="text-sm text-muted-foreground">立即体验AI驱动的科研辅助</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {onlineTools.map((tool, i) => (
                    <Button key={i} asChild variant="outline" size="sm" className="bg-background hover:border-amber-400/50">
                      <Link href={tool.href}>
                        <tool.icon className="mr-2 h-4 w-4" />
                        {tool.title}
                        <ExternalLink className="ml-2 h-3 w-3 text-muted-foreground" />
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="space-y-6 mb-16">
            {services.map((service, index) => (
              <Card key={index} className="overflow-hidden card-hover">
                <div className="flex flex-col lg:flex-row">
                  {/* Service Header */}
                  <div className={`lg:w-72 p-6 bg-gradient-to-br ${service.color} text-white flex flex-col justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-academic-texture opacity-20" />
                    <div className="relative">
                      <service.icon className="w-12 h-12 mb-4 opacity-90" />
                      <Badge className="w-fit bg-white/20 hover:bg-white/30 text-white border-0 mb-2">
                        {service.subtitle}
                      </Badge>
                      <h2 className="text-xl font-bold">{service.title}</h2>
                    </div>
                  </div>
                  
                  {/* Service Content */}
                  <CardContent className="flex-1 p-6 lg:p-8">
                    <p className="text-muted-foreground mb-6">
                      {service.details}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      {/* Deliverables */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          服务交付内容
                        </h3>
                        <ul className="space-y-2">
                          {service.deliverables.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="text-emerald-500 mt-0.5">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Suitable For */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Target className="w-5 h-5 text-amber-500" />
                          适用场景
                        </h3>
                        <ul className="space-y-2">
                          {service.suitable.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="text-amber-500 mt-0.5">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
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
                      <Button className="btn-academic">
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
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-4">服务套餐</Badge>
              <h2 className="text-3xl font-bold">灵活选择，按需定制</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {packages.map((pkg, index) => (
                <Card 
                  key={index} 
                  className={`relative card-hover ${
                    pkg.highlight 
                      ? 'border-amber-400/50 bg-gradient-to-b from-amber-50/50 to-card dark:from-amber-950/20 dark:to-card' 
                      : ''
                  }`}
                >
                  {pkg.highlight && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="badge-premium">
                        推荐
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>
                    <div className="text-2xl font-bold stat-number mb-4">
                      {pkg.price}
                    </div>
                    <ul className="space-y-2 text-sm mb-6">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-center justify-center gap-2">
                          <CheckCircle2 className={`w-4 h-4 ${pkg.highlight ? 'text-amber-500' : 'text-emerald-500'}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${pkg.highlight ? 'btn-gold' : 'btn-academic'}`}
                    >
                      立即咨询
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Service Guarantee */}
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a365d] via-[#2c5282] to-[#1a365d]" />
            <div className="absolute inset-0 bg-academic-texture opacity-30" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl" />
            
            <div className="relative p-8 lg:p-12 text-white text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-6 text-amber-400" />
              <h2 className="text-2xl font-bold mb-8">服务承诺</h2>
              <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {guarantees.map((item, index) => (
                  <div key={index}>
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                      <item.icon className="w-6 h-6 text-amber-400" />
                    </div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-white/70">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
