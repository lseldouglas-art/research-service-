import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Target, Users, Zap, Search, FileText, PenTool, FileCheck } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      id: 'literature',
      icon: Search,
      phase: 'Phase 01',
      title: '文献检索与筛选服务',
      subtitle: 'Literature Search & Screening',
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
    },
    {
      id: 'outline',
      icon: FileText,
      phase: 'Phase 02',
      title: '大纲构建与素材整理服务',
      subtitle: 'Outline & Material Organization',
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
    },
    {
      id: 'writing',
      icon: PenTool,
      phase: 'Phase 03',
      title: '论文写作与润色服务',
      subtitle: 'Writing & Polishing',
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
    },
    {
      id: 'format',
      icon: FileCheck,
      phase: 'Phase 04',
      title: '格式规范与收尾服务',
      subtitle: 'Formatting & Finalization',
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
    },
  ];

  const packages = [
    {
      name: '单项服务',
      description: '根据需要选择任一服务阶段',
      price: '按需报价',
      features: ['灵活选择服务内容', '独立交付验收', '专业团队支持'],
      recommended: false,
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
      recommended: false,
    },
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
            <Link href="/services" className="text-sm text-[#1A3A2F] font-medium">
              服务内容
            </Link>
            <Link href="/training" className="text-sm text-[#6B706F] hover:text-[#1A3A2F] transition-colors">
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
            <span className="text-[#C9A227] font-serif text-sm tracking-widest">OUR SERVICES</span>
            <div className="w-12 h-px bg-[#C9A227]" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-[#1A3A2F] mb-4">
            专业科研辅助服务
          </h1>
          <p className="text-lg text-[#6B706F] max-w-2xl mx-auto">
            四个阶段灵活可选，根据您的需求定制专属服务方案
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white border border-[#E5E8E7] rounded-sm overflow-hidden group hover:border-[#C9A227] transition-all"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Phase Header */}
                <div className="lg:w-56 bg-[#1A3A2F] p-8 text-[#FAFAF7] flex flex-col justify-center">
                  <div className="text-[#C9A227] text-xs font-medium tracking-wider mb-2">
                    {service.phase}
                  </div>
                  <service.icon className="w-12 h-12 mb-4 text-[#C9A227]" />
                  <h2 className="text-xl font-serif font-semibold mb-1">{service.title}</h2>
                  <div className="text-xs text-[#9ACFB0]">{service.subtitle}</div>
                </div>
                
                {/* Content */}
                <div className="flex-1 p-8">
                  <p className="text-[#6B706F] mb-6 leading-relaxed">{service.details}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Deliverables */}
                    <div>
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-[#1A3A2F] mb-3">
                        <CheckCircle className="w-4 h-4 text-[#C9A227]" />
                        服务交付内容
                      </h3>
                      <ul className="space-y-2">
                        {service.deliverables.map((item, i) => (
                          <li key={i} className="text-sm text-[#6B706F] flex items-start gap-2">
                            <span className="text-[#C9A227] mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Suitable For */}
                    <div>
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-[#1A3A2F] mb-3">
                        <Target className="w-4 h-4 text-[#C9A227]" />
                        适用场景
                      </h3>
                      <ul className="space-y-2">
                        {service.suitable.map((item, i) => (
                          <li key={i} className="text-sm text-[#6B706F] flex items-start gap-2">
                            <span className="text-[#87A878] mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-[#E5E8E7]">
                    <div className="flex items-center gap-2 text-sm text-[#6B706F]">
                      <Clock className="w-4 h-4" />
                      <span>预计周期：{service.timeline}</span>
                    </div>
                    <button className="inline-flex items-center gap-2 px-6 py-2 bg-[#1A3A2F] text-[#FAFAF7] text-sm font-medium rounded-sm hover:bg-[#2A5244] transition-colors">
                      咨询此服务
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 px-6 bg-white border-y border-[#E5E8E7]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#C9A227] font-serif text-sm tracking-widest">PACKAGES</span>
            <h2 className="text-3xl font-serif font-semibold text-[#1A3A2F] mt-3">服务套餐</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <div 
                key={index}
                className={`relative bg-[#FAFAF7] border rounded-sm p-8 ${
                  pkg.recommended ? 'border-[#C9A227] border-2' : 'border-[#E5E8E7]'
                }`}
              >
                {pkg.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#C9A227] text-[#1A3A2F] text-xs font-medium px-3 py-1 rounded-sm">
                      推荐
                    </span>
                  </div>
                )}
                
                <h3 className="text-xl font-serif font-semibold text-[#1A3A2F] mb-2">{pkg.name}</h3>
                <p className="text-sm text-[#6B706F] mb-4">{pkg.description}</p>
                
                <div className="font-serif text-2xl font-bold text-[#C9A227] mb-6">{pkg.price}</div>
                
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#1E2120]">
                      <CheckCircle className="w-4 h-4 text-[#87A878]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button 
                  className={`w-full py-2 text-sm font-medium rounded-sm transition-all ${
                    pkg.recommended 
                      ? 'bg-[#1A3A2F] text-[#FAFAF7] hover:bg-[#2A5244]' 
                      : 'border-2 border-[#1A3A2F] text-[#1A3A2F] hover:bg-[#1A3A2F] hover:text-[#FAFAF7]'
                  }`}
                >
                  立即咨询
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1A3A2F] rounded-sm p-8 md:p-12">
            <div className="text-center mb-10">
              <span className="text-[#C9A227] font-serif text-sm tracking-widest">OUR PROMISE</span>
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#FAFAF7] mt-3">
                服务承诺
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 border-2 border-[#C9A227] rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[#C9A227]" />
                </div>
                <h3 className="text-[#FAFAF7] font-medium mb-2">高效响应</h3>
                <p className="text-sm text-[#9ACFB0]">24小时内响应，快速启动服务</p>
              </div>
              
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 border-2 border-[#C9A227] rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-[#C9A227]" />
                </div>
                <h3 className="text-[#FAFAF7] font-medium mb-2">质量保证</h3>
                <p className="text-sm text-[#9ACFB0]">不满意可修改，直到满意为止</p>
              </div>
              
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 border-2 border-[#C9A227] rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#C9A227]" />
                </div>
                <h3 className="text-[#FAFAF7] font-medium mb-2">专业团队</h3>
                <p className="text-sm text-[#9ACFB0]">资深科研背景，理解学术需求</p>
              </div>
            </div>
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
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>
      </section>
    </div>
  );
}
