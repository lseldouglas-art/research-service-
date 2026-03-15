import Link from 'next/link';
import { ArrowRight, FileText, GraduationCap, Layers, CheckCircle } from 'lucide-react';

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
    { number: '500+', label: '服务研究者' },
    { number: '1,000+', label: '论文辅助' },
    { number: '98%', label: '满意度' },
    { number: '24h', label: '响应时间' },
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
    '基于验证的工业化工作流',
    'AI作为科研助理提高效率',
    '资深科研背景团队支持',
    '完善的售后服务保障',
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
            <Link href="/training" className="text-sm text-[#6B706F] hover:text-[#1A3A2F] transition-colors">
              培训课程
            </Link>
            <Link href="/workflow" className="text-sm text-[#6B706F] hover:text-[#1A3A2F] transition-colors">
              服务流程
            </Link>
          </div>
          
          <Link 
            href="/services" 
            className="px-4 py-2 bg-[#1A3A2F] text-[#FAFAF7] text-sm font-medium rounded-sm hover:bg-[#2A5244] transition-colors"
          >
            开始咨询
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Decorative Element */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-px bg-[#C9A227]" />
            <span className="text-[#C9A227] font-serif text-sm tracking-widest">RESEARCH SERVICE</span>
            <div className="w-12 h-px bg-[#C9A227]" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif font-semibold text-[#1A3A2F] mb-6 leading-tight">
            专业科研辅助服务
            <br />
            <span className="text-[#C9A227]">助力学术创新突破</span>
          </h1>
          
          <p className="text-lg text-[#6B706F] max-w-2xl mx-auto mb-10 leading-relaxed">
            基于人机协同的工业化工作流，将AI作为强大的科研助理，
            提供从选题到发表的全流程专业支持
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#1A3A2F] text-[#FAFAF7] font-medium rounded-sm hover:bg-[#2A5244] transition-all group"
            >
              了解服务内容
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/workflow"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-[#1A3A2F] text-[#1A3A2F] font-medium rounded-sm hover:bg-[#1A3A2F] hover:text-[#FAFAF7] transition-all"
            >
              查看服务流程
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-[#E5E8E7] bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-serif text-4xl md:text-5xl font-bold text-[#1A3A2F] mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-[#6B706F]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#C9A227] font-serif text-sm tracking-widest">OUR SERVICES</span>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-[#1A3A2F] mt-3">
              三大核心服务
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Link 
                key={index}
                href={service.link}
                className="group block bg-white border border-[#E5E8E7] rounded-sm p-8 hover:border-[#C9A227] transition-all relative overflow-hidden"
              >
                {/* Left accent bar */}
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
      <section className="py-20 px-6 bg-[#1A3A2F]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#C9A227] font-serif text-sm tracking-widest">WORKFLOW</span>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-[#FAFAF7] mt-3">
              六步完成高质量论文
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {process.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 border-2 border-[#C9A227] rounded-full flex items-center justify-center bg-[#1A3A2F] group-hover:bg-[#C9A227] transition-colors">
                  <span className="font-serif font-bold text-[#C9A227] group-hover:text-[#1A3A2F] transition-colors">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-[#FAFAF7] font-medium mb-1">{item.title}</h3>
                <p className="text-xs text-[#9ACFB0]">{item.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/workflow"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#C9A227] text-[#C9A227] font-medium rounded-sm hover:bg-[#C9A227] hover:text-[#1A3A2F] transition-all"
            >
              查看完整流程
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#C9A227] font-serif text-sm tracking-widest">WHY CHOOSE US</span>
              <h2 className="text-3xl md:text-4xl font-serif font-semibold text-[#1A3A2F] mt-3 mb-6">
                专业 · 高效 · 可靠
              </h2>
              <p className="text-[#6B706F] leading-relaxed mb-8">
                我们基于验证过的工业化工作流，将AI作为科研助理，帮助研究者从繁琐重复的工作中解放出来，专注于真正有价值的学术创新。
              </p>
              
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#C9A227] flex-shrink-0" />
                    <span className="text-[#1E2120]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white border border-[#E5E8E7] rounded-sm p-8">
              <div className="text-center mb-6">
                <div className="text-sm text-[#6B706F] mb-2">累计服务研究者</div>
                <div className="font-serif text-6xl font-bold text-[#1A3A2F]">500+</div>
              </div>
              
              <div className="border-t border-[#E5E8E7] pt-6 grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="font-serif text-2xl font-bold text-[#1A3A2F]">98%</div>
                  <div className="text-xs text-[#6B706F]">客户满意度</div>
                </div>
                <div className="text-center">
                  <div className="font-serif text-2xl font-bold text-[#1A3A2F]">24h</div>
                  <div className="text-xs text-[#6B706F]">响应时间</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-white border-t border-[#E5E8E7]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-[#1A3A2F] mb-4">
            准备好开始您的科研之旅了吗？
          </h2>
          <p className="text-[#6B706F] mb-8">
            立即联系我们，获取专属科研服务方案
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#1A3A2F] text-[#FAFAF7] font-medium rounded-sm hover:bg-[#2A5244] transition-all"
            >
              了解服务内容
            </Link>
            <Link 
              href="/training"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-[#1A3A2F] text-[#1A3A2F] font-medium rounded-sm hover:bg-[#1A3A2F] hover:text-[#FAFAF7] transition-all"
            >
              参加培训课程
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#0D1F17]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#C9A227] rounded-sm flex items-center justify-center">
                  <span className="text-[#0D1F17] font-serif font-bold text-lg">R</span>
                </div>
                <span className="font-serif font-semibold text-[#FAFAF7]">科研服务站</span>
              </div>
              <p className="text-sm text-[#9ACFB0]">
                专业科研辅助服务平台<br />助力学术创新突破
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-[#FAFAF7] mb-4">核心服务</h4>
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
              <h4 className="font-semibold text-[#FAFAF7] mb-4">联系方式</h4>
              <div className="space-y-2 text-sm text-[#9ACFB0]">
                <p>服务咨询：24小时在线</p>
                <p>响应时间：工作日24小时内</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-[#2A5244] pt-8 text-center">
            <p className="text-sm text-[#6B8E6B]">
              专业科研辅助服务平台 · 助力学术创新突破
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
