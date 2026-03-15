import Link from 'next/link';
import { ArrowRight, CheckCircle, Clock, FileText, GraduationCap, Layers, MessageCircle, Phone, Shield, Star, Users } from 'lucide-react';

export default function Home() {
  const services = [
    {
      icon: FileText,
      title: '科研辅助服务',
      subtitle: 'Literature & Writing',
      description: '文献检索、大纲构建、论文写作、质量精修，全流程专业支持',
      link: '/services',
    },
    {
      icon: GraduationCap,
      title: '科研培训服务',
      subtitle: 'Training Program',
      description: '系统化AI辅助学术写作培训，掌握人机协同的高效工作方法',
      link: '/training',
    },
    {
      icon: Layers,
      title: '一体化解决方案',
      subtitle: 'Integrated Solution',
      description: '根据您的具体需求，灵活组合服务，提供从选题到发表的一站式支持',
      link: '/services',
    },
  ];

  const stats = [
    { number: '500+', label: '服务研究者', sub: '累计服务' },
    { number: '1,000+', label: '论文辅助', sub: '成功案例' },
    { number: '98%', label: '满意度', sub: '客户好评' },
    { number: '24h', label: '响应时间', sub: '快速响应' },
  ];

  const process = [
    { step: '01', title: '选题定向', desc: '精准定位研究方向' },
    { step: '02', title: '文献构建', desc: '系统化文献库建立' },
    { step: '03', title: '大纲设计', desc: '逻辑严密的框架' },
    { step: '04', title: '智能写作', desc: 'AI辅助高效产出' },
    { step: '05', title: '质量精修', desc: '事实核查与润色' },
    { step: '06', title: '格式规范', desc: '投稿准备与交付' },
  ];

  const features = [
    { icon: Shield, title: '工业化工作流', desc: '基于验证的高效流程' },
    { icon: Users, title: '专业团队', desc: '资深科研背景团队' },
    { icon: Clock, title: '高效响应', desc: '24小时内快速响应' },
    { icon: Star, title: '质量保证', desc: '不满意可修改到满意' },
  ];

  const testimonials = [
    {
      name: '张博士',
      title: '985高校副教授',
      content: '通过他们的文献检索服务，我快速构建了高质量的文献库，节省了大量时间。选题分析报告非常专业，帮助我找到了创新的研究方向。',
      rating: 5,
    },
    {
      name: '李同学',
      title: '博士研究生',
      content: '参加了训练营后，我的论文写作效率提升了很多。AI辅助写作的方法让我受益匪浅，工具箱也非常实用。',
      rating: 5,
    },
    {
      name: '王教授',
      title: '中科院研究员',
      content: '全流程服务非常省心，从选题到投稿都有专业支持。语言润色质量很高，编辑非常认真负责。',
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: '服务周期大概需要多长时间？',
      a: '根据服务类型不同，单项服务一般3-7个工作日，全流程服务2-4周。我们会根据您的具体需求和截止日期制定合理的时间计划。',
    },
    {
      q: '如何保证服务质量？',
      a: '我们拥有资深科研背景的专业团队，采用工业化工作流程。服务期间保持沟通，初稿交付后支持多轮修改，直到您满意为止。',
    },
    {
      q: '价格如何计算？',
      a: '根据服务类型、论文篇幅和紧急程度综合定价。单项服务从数百元起，组合服务享折扣。具体价格请联系我们咨询报价。',
    },
    {
      q: '是否提供加急服务？',
      a: '是的，我们提供加急服务选项。加急服务会在标准服务周期基础上缩短30%-50%的时间，具体费用请咨询客服。',
    },
  ];

  const partners = [
    '北京大学', '清华大学', '中科院', '浙江大学', '复旦大学', '上海交大',
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF7]/95 backdrop-blur-sm border-b border-[#E5E8E7]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1A3A2F] rounded-sm flex items-center justify-center">
              <span className="text-[#C9A227] font-serif font-bold text-xl">R</span>
            </div>
            <div>
              <span className="font-serif font-semibold text-[#1A3A2F] text-lg block leading-tight">科研服务站</span>
              <span className="text-[10px] text-[#6B706F] tracking-wider">RESEARCH SERVICE</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/services" className="text-sm text-[#6B706F] hover:text-[#1A3A2F] transition-colors">
              服务内容
            </Link>
            <Link href="/training" className="text-sm text-[#6B706F] hover:text-[#1A3A2F] transition-colors">
              培训课程
            </Link>
            <Link href="/workflow" className="text-sm text-[#6B706F] hover:text-[#1A3A2F] transition-colors">
              服务流程
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-[#1A3A2F]">
              <Phone className="w-4 h-4 text-[#C9A227]" />
              <span className="font-medium">400-XXX-XXXX</span>
            </div>
            <Link 
              href="/services" 
              className="px-5 py-2 bg-[#1A3A2F] text-[#FAFAF7] text-sm font-medium rounded-sm hover:bg-[#2A5244] transition-colors"
            >
              立即咨询
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-[#FAF5D6] border border-[#C9A227]/30 rounded-sm px-3 py-1.5 mb-6">
                <Shield className="w-4 h-4 text-[#C9A227]" />
                <span className="text-xs text-[#1A3A2F] font-medium">专业科研服务平台 · 值得信赖</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-serif font-semibold text-[#1A3A2F] mb-6 leading-tight">
                专业科研辅助服务
                <br />
                <span className="text-[#C9A227]">助力学术创新突破</span>
              </h1>
              
              <p className="text-lg text-[#6B706F] mb-8 leading-relaxed">
                基于人机协同的工业化工作流，提供从选题到发表的全流程专业支持。
                <span className="text-[#1A3A2F] font-medium">500+</span> 研究者的选择，<span className="text-[#1A3A2F] font-medium">98%</span> 好评率。
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1A3A2F] text-[#FAFAF7] font-medium rounded-sm hover:bg-[#2A5244] transition-all group"
                >
                  了解服务内容
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/training"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-[#1A3A2F] text-[#1A3A2F] font-medium rounded-sm hover:bg-[#1A3A2F] hover:text-[#FAFAF7] transition-all"
                >
                  参加培训课程
                </Link>
              </div>
              
              {/* Quick Stats */}
              <div className="flex items-center gap-6 text-sm text-[#6B706F]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#87A878]" />
                  <span>免费咨询</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#87A878]" />
                  <span>满意为止</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#87A878]" />
                  <span>隐私保护</span>
                </div>
              </div>
            </div>
            
            {/* Stats Card */}
            <div className="bg-white border border-[#E5E8E7] rounded-sm p-8 shadow-lg">
              <div className="text-center mb-8">
                <div className="text-sm text-[#6B706F] mb-2">累计服务研究者</div>
                <div className="font-serif text-6xl font-bold text-[#1A3A2F]">500<span className="text-[#C9A227]">+</span></div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {stats.slice(1).map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-[#FAFAF7] rounded-sm">
                    <div className="font-serif text-2xl font-bold text-[#1A3A2F]">{stat.number}</div>
                    <div className="text-xs text-[#6B706F]">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-[#E5E8E7]">
                <div className="text-center text-sm text-[#6B706F]">
                  服务院校包括
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {partners.slice(0, 4).map((partner, i) => (
                    <span key={i} className="text-xs bg-[#F2F4F3] px-2 py-1 rounded text-[#1A3A2F]">{partner}</span>
                  ))}
                  <span className="text-xs text-[#6B706F]">等</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-8 px-6 bg-[#1A3A2F]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C9A227]/20 flex items-center justify-center shrink-0">
                  <feature.icon className="w-5 h-5 text-[#C9A227]" />
                </div>
                <div>
                  <div className="text-[#FAFAF7] text-sm font-medium">{feature.title}</div>
                  <div className="text-[#9ACFB0] text-xs">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#C9A227] font-serif text-sm tracking-widest">OUR SERVICES</span>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-[#1A3A2F] mt-3">
              三大核心服务
            </h2>
            <p className="text-[#6B706F] mt-3">灵活选择，按需定制，专业团队全程支持</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Link 
                key={index}
                href={service.link}
                className="group block bg-white border border-[#E5E8E7] rounded-sm p-8 hover:border-[#C9A227] hover:shadow-lg transition-all relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C9A227] scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                
                <service.icon className="w-10 h-10 text-[#1A3A2F] mb-6" />
                
                <div className="text-xs text-[#C9A227] font-medium tracking-wider mb-2">
                  {service.subtitle}
                </div>
                
                <h3 className="text-xl font-serif font-semibold text-[#1A3A2F] mb-3">
                  {service.title}
                </h3>
                
                <p className="text-sm text-[#6B706F] leading-relaxed mb-4">
                  {service.description}
                </p>
                
                <div className="flex items-center text-sm text-[#1A3A2F] font-medium group-hover:text-[#C9A227] transition-colors">
                  了解详情
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-6 bg-white border-y border-[#E5E8E7]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#C9A227] font-serif text-sm tracking-widest">WORKFLOW</span>
            <h2 className="text-3xl font-serif font-semibold text-[#1A3A2F] mt-3">
              六步完成高质量论文
            </h2>
            <p className="text-[#6B706F] mt-3">预计周期：2-4周，每个阶段都有专业支持</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {process.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-14 h-14 mx-auto mb-3 border-2 border-[#C9A227] rounded-full flex items-center justify-center bg-white group-hover:bg-[#C9A227] transition-colors">
                  <span className="font-serif font-bold text-[#C9A227] group-hover:text-[#1A3A2F] transition-colors">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-[#1A3A2F] font-medium text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-[#6B706F]">{item.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link 
              href="/workflow"
              className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-[#C9A227] text-[#C9A227] font-medium rounded-sm hover:bg-[#C9A227] hover:text-[#1A3A2F] transition-all text-sm"
            >
              查看完整流程
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#C9A227] font-serif text-sm tracking-widest">TESTIMONIALS</span>
            <h2 className="text-3xl font-serif font-semibold text-[#1A3A2F] mt-3">
              客户真实评价
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item, index) => (
              <div key={index} className="bg-white border border-[#E5E8E7] rounded-sm p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C9A227] text-[#C9A227]" />
                  ))}
                </div>
                <p className="text-sm text-[#6B706F] leading-relaxed mb-4">"{item.content}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#E5E8E7]">
                  <div className="w-10 h-10 bg-[#1A3A2F] rounded-full flex items-center justify-center text-[#FAFAF7] font-serif text-sm">
                    {item.name[0]}
                  </div>
                  <div>
                    <div className="font-medium text-[#1A3A2F] text-sm">{item.name}</div>
                    <div className="text-xs text-[#6B706F]">{item.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-white border-y border-[#E5E8E7]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#C9A227] font-serif text-sm tracking-widest">FAQ</span>
            <h2 className="text-3xl font-serif font-semibold text-[#1A3A2F] mt-3">
              常见问题
            </h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-[#FAFAF7] border border-[#E5E8E7] rounded-sm p-6">
                <h3 className="font-medium text-[#1A3A2F] mb-2 flex items-start gap-2">
                  <span className="text-[#C9A227] font-serif">Q{index + 1}</span>
                  {faq.q}
                </h3>
                <p className="text-sm text-[#6B706F] leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1A3A2F] rounded-sm p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#FAFAF7] mb-4">
                  准备好开始您的科研之旅了吗？
                </h2>
                <p className="text-[#9ACFB0] mb-6">
                  立即联系我们，获取专属科研服务方案
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/services"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C9A227] text-[#1A3A2F] font-medium rounded-sm hover:bg-[#D4A84A] transition-colors"
                  >
                    了解服务内容
                  </Link>
                  <Link 
                    href="/training"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#C9A227] text-[#C9A227] font-medium rounded-sm hover:bg-[#C9A227] hover:text-[#1A3A2F] transition-colors"
                  >
                    参加培训课程
                  </Link>
                </div>
              </div>
              
              <div className="border-l border-[#3A6A59] pl-8">
                <div className="text-sm text-[#9ACFB0] mb-4">联系方式</div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#C9A227]" />
                    <span className="text-[#FAFAF7]">400-XXX-XXXX</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-[#C9A227]" />
                    <span className="text-[#FAFAF7]">在线咨询 24小时内响应</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#C9A227]" />
                    <span className="text-[#FAFAF7]">工作时间：周一至周五 9:00-18:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-12 px-6 border-t border-[#E5E8E7]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-[#6B706F] mb-6">已服务来自以下院校的研究者</p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {partners.map((partner, i) => (
              <span key={i} className="text-[#6B706F] text-sm font-medium">{partner}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#0D1F17]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#C9A227] rounded-sm flex items-center justify-center">
                  <span className="text-[#0D1F17] font-serif font-bold text-lg">R</span>
                </div>
                <span className="font-serif font-semibold text-[#FAFAF7]">科研服务站</span>
              </div>
              <p className="text-sm text-[#9ACFB0] leading-relaxed">
                专业科研辅助服务平台，基于人机协同的工业化工作流，
                提供从选题到发表的全流程专业支持。
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-[#FAFAF7] mb-4 text-sm">核心服务</h4>
              <div className="space-y-2">
                <Link href="/services" className="block text-sm text-[#9ACFB0] hover:text-[#C9A227] transition-colors">
                  科研辅助服务
                </Link>
                <Link href="/training" className="block text-sm text-[#9ACFB0] hover:text-[#C9A227] transition-colors">
                  科研培训服务
                </Link>
                <Link href="/workflow" className="block text-sm text-[#9ACFB0] hover:text-[#C9A227] transition-colors">
                  服务流程
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-[#FAFAF7] mb-4 text-sm">联系我们</h4>
              <div className="space-y-2 text-sm text-[#9ACFB0]">
                <p>电话：400-XXX-XXXX</p>
                <p>工作时间：周一至周五</p>
                <p>9:00 - 18:00</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-[#2A5244] pt-8 text-center">
            <p className="text-sm text-[#6B8E6B]">
              © 2024 科研服务站 · 专业科研辅助服务平台 · 助力学术创新突破
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
