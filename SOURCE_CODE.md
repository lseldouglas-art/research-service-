# 科研服务平台 - 完整源代码文档

## 项目概述

**项目名称**: 复合型一体化科研服务平台  
**技术栈**: Next.js 16 + React 19 + TypeScript 5 + shadcn/ui + Tailwind CSS 4  
**设计主题**: 学术殿堂 - 深邃学术蓝(#1a365d) + 温暖琥珀金(#d69e2e)

---

## 目录结构

```
src/
├── app/                          # Next.js App Router
│   ├── globals.css               # 全局样式（学术殿堂主题）
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 首页
│   ├── services/                 # 服务页
│   │   └── page.tsx
│   ├── training/                 # 培训页
│   │   └── page.tsx
│   ├── donate/                   # 捐赠页
│   │   └── page.tsx
│   ├── tools/                    # 在线工具
│   │   ├── literature-search/    # 文献检索工具
│   │   ├── outline-generator/    # 大纲生成器
│   │   ├── topic-analysis/       # 选题分析器
│   │   └── literature-decomposer/# 文献分解器
│   └── api/                      # API路由
│       └── feedback/route.ts     # 用户反馈API
├── components/
│   ├── layout/
│   │   └── Header.tsx            # 全局头部导航
│   └── auth/
│       ├── index.ts              # 导出文件
│       ├── LoginDialog.tsx       # 登录弹窗
│       ├── UserMenu.tsx          # 用户菜单
│       └── UserNoticeDialog.tsx  # 用户声明弹窗
├── providers/
│   └── AuthProvider.tsx          # 认证上下文提供者
└── hooks/
    └── useAuth.ts                # 认证Hook
```

---

## 一、全局样式 (src/app/globals.css)

```css
@import 'tailwindcss';
@import 'tw-animate-css';

@custom-variant dark (&:is(.dark *));

/* ========================================
   学术殿堂主题 - Academic Hall Theme
   ========================================
   
   设计理念：
   - 深邃的学术蓝：代表知识的深度与专业性
   - 温暖的琥珀金：象征知识的光芒与价值
   - 克制的渐变：避免过度装饰，保持学术气质
   - 精致的细节：通过微妙的光效和阴影营造高级感
*/

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);
  
  /* 学术殿堂主题配色 */
  --color-academic-primary: #1a365d;
  --color-academic-secondary: #2c5282;
  --color-academic-accent: #d69e2e;
  --color-academic-gold: #ecc94b;
  --color-academic-light: #f7fafc;
  --color-academic-dark: #1a202c;
  
  /* 字体系统 */
  --font-sans:
    'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', ui-sans-serif,
    system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
  --font-mono:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
  --font-serif:
    'Noto Serif SC', 'Songti SC', 'SimSun', ui-serif, Georgia, Cambria,
    'Times New Roman', Times, serif;
}

:root {
  --radius: 0.75rem;
  --background: #fafbfc;
  --foreground: #1a202c;
  --card: #ffffff;
  --card-foreground: #1a202c;
  --popover: #ffffff;
  --popover-foreground: #1a202c;
  --primary: #1a365d;
  --primary-foreground: #ffffff;
  --secondary: #f1f5f9;
  --secondary-foreground: #1a365d;
  --muted: #f1f5f9;
  --muted-foreground: #64748b;
  --accent: #d69e2e;
  --accent-foreground: #1a202c;
  --destructive: #dc2626;
  --border: #e2e8f0;
  --input: #e2e8f0;
  --ring: #1a365d;
  --chart-1: #1a365d;
  --chart-2: #2c5282;
  --chart-3: #d69e2e;
  --chart-4: #38a169;
  --chart-5: #805ad5;
  --sidebar: #ffffff;
  --sidebar-foreground: #1a202c;
  --sidebar-primary: #1a365d;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #f1f5f9;
  --sidebar-accent-foreground: #1a365d;
  --sidebar-border: #e2e8f0;
  --sidebar-ring: #1a365d;
}

.dark {
  --background: #0f1419;
  --foreground: #f1f5f9;
  --card: #1a202c;
  --card-foreground: #f1f5f9;
  --popover: #1a202c;
  --popover-foreground: #f1f5f9;
  --primary: #d69e2e;
  --primary-foreground: #1a202c;
  --secondary: #2d3748;
  --secondary-foreground: #f1f5f9;
  --muted: #2d3748;
  --muted-foreground: #a0aec0;
  --accent: #d69e2e;
  --accent-foreground: #1a202c;
  --destructive: #ef4444;
  --border: rgba(255, 255, 255, 0.1);
  --input: rgba(255, 255, 255, 0.15);
  --ring: #d69e2e;
  --chart-1: #d69e2e;
  --chart-2: #38a169;
  --chart-3: #63b3ed;
  --chart-4: #805ad5;
  --chart-5: #f56565;
  --sidebar: #1a202c;
  --sidebar-foreground: #f1f5f9;
  --sidebar-primary: #d69e2e;
  --sidebar-primary-foreground: #1a202c;
  --sidebar-accent: #2d3748;
  --sidebar-accent-foreground: #f1f5f9;
  --sidebar-border: rgba(255, 255, 255, 0.1);
  --sidebar-ring: #d69e2e;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: 'kern' 1, 'liga' 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

body {
  @apply font-sans;
}

/* ========================================
   学术殿堂 - 全局装饰样式
   ======================================== */

/* 背景纹理 - 微妙的纸张质感 */
.bg-academic-texture {
  background-image: 
    linear-gradient(135deg, transparent 25%, rgba(26, 54, 93, 0.02) 25%),
    linear-gradient(225deg, transparent 25%, rgba(26, 54, 93, 0.02) 25%),
    linear-gradient(45deg, transparent 25%, rgba(26, 54, 93, 0.02) 25%),
    linear-gradient(315deg, transparent 25%, rgba(26, 54, 93, 0.02) 25%);
  background-size: 20px 20px;
  background-position: 0 0, 10px 0, 10px -10px, 0px 10px;
}

/* 深色模式纹理 */
.dark .bg-academic-texture {
  background-image: 
    linear-gradient(135deg, transparent 25%, rgba(214, 158, 46, 0.03) 25%),
    linear-gradient(225deg, transparent 25%, rgba(214, 158, 46, 0.03) 25%),
    linear-gradient(45deg, transparent 25%, rgba(214, 158, 46, 0.03) 25%),
    linear-gradient(315deg, transparent 25%, rgba(214, 158, 46, 0.03) 25%);
}

/* 光晕效果 */
.glow-accent {
  box-shadow: 
    0 0 20px rgba(214, 158, 46, 0.15),
    0 0 40px rgba(214, 158, 46, 0.1);
}

.glow-primary {
  box-shadow: 
    0 0 20px rgba(26, 54, 93, 0.2),
    0 0 40px rgba(26, 54, 93, 0.1);
}

/* 卡片悬浮效果 */
.card-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 12px 24px -8px rgba(26, 54, 93, 0.15),
    0 4px 8px -2px rgba(26, 54, 93, 0.06);
}

.dark .card-hover:hover {
  box-shadow: 
    0 12px 24px -8px rgba(0, 0, 0, 0.4),
    0 4px 8px -2px rgba(0, 0, 0, 0.2);
}

/* 页面入场动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes pulse-glow {
  0%, 100% { 
    box-shadow: 0 0 20px rgba(214, 158, 46, 0.2);
  }
  50% { 
    box-shadow: 0 0 40px rgba(214, 158, 46, 0.4);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(214, 158, 46, 0.1),
    transparent
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 3s ease-in-out infinite;
}

/* 延迟动画类 */
.animation-delay-100 { animation-delay: 100ms; }
.animation-delay-200 { animation-delay: 200ms; }
.animation-delay-300 { animation-delay: 300ms; }
.animation-delay-400 { animation-delay: 400ms; }
.animation-delay-500 { animation-delay: 500ms; }

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #1a365d, #2c5282);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #2c5282, #3182ce);
}

.dark ::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #d69e2e, #ecc94b);
}

/* 文字选中效果 */
::selection {
  background: rgba(214, 158, 46, 0.3);
  color: inherit;
}

/* 徽章样式优化 */
.badge-premium {
  background: linear-gradient(135deg, #d69e2e, #ecc94b);
  color: #1a202c;
  font-weight: 600;
  border: none;
  box-shadow: 0 2px 8px rgba(214, 158, 46, 0.3);
}

/* 按钮渐变 */
.btn-academic {
  background: linear-gradient(135deg, #1a365d, #2c5282);
  color: white;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn-academic::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

.btn-academic:hover::before {
  left: 100%;
}

.btn-academic:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(26, 54, 93, 0.3);
}

/* 金色按钮 */
.btn-gold {
  background: linear-gradient(135deg, #d69e2e, #ecc94b);
  color: #1a202c;
  font-weight: 600;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn-gold::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  transition: left 0.5s ease;
}

.btn-gold:hover::before {
  left: 100%;
}

.btn-gold:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(214, 158, 46, 0.4);
}

/* 统计数字样式 */
.stat-number {
  font-family: 'Georgia', 'Noto Serif SC', serif;
  font-weight: 700;
  background: linear-gradient(135deg, #1a365d, #d69e2e);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.dark .stat-number {
  background: linear-gradient(135deg, #ecc94b, #d69e2e);
  -webkit-background-clip: text;
  background-clip: text;
}

/* Hero背景装饰 */
.hero-bg-pattern {
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(214, 158, 46, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(26, 54, 93, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(44, 82, 130, 0.06) 0%, transparent 40%);
}

.dark .hero-bg-pattern {
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(214, 158, 46, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(214, 158, 46, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(214, 158, 46, 0.08) 0%, transparent 40%);
}
```

---

## 二、根布局 (src/app/layout.tsx)

```tsx
import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import { AuthProvider } from '@/providers/AuthProvider';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'AI辅助学术写作训练营 | 扣子编程',
    template: '%s | 扣子编程',
  },
  description:
    '建立人机高效协同的工业化工作流。我们不追求让AI替代思考，而是将AI作为一名强大的科研助理，把研究者从繁琐、重复的机械性工作中解放出来。',
  keywords: [
    'AI写作',
    '学术写作',
    '文献综述',
    '科研助手',
    '论文写作',
    'AI辅助',
    '学术研究',
    '文献管理',
    'Zotero',
    '科研工具',
  ],
  authors: [{ name: 'Coze Code Team', url: 'https://code.coze.cn' }],
  generator: 'Coze Code',
  openGraph: {
    title: 'AI辅助学术写作训练营 | 建立人机高效协同的工业化工作流',
    description:
      '建立人机高效协同的工业化工作流。将AI作为强大的科研助理，专注于学术思想创新。',
    url: 'https://code.coze.cn',
    siteName: 'AI辅助学术写作训练营',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang="en">
      <body className={`antialiased`}>
        <AuthProvider>
          {isDev && <Inspector />}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

## 三、首页 (src/app/page.tsx)

```tsx
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
```

---

## 四、服务页 (src/app/services/page.tsx)

```tsx
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
    // ... 其他服务项
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
        {/* 页面内容... */}
      </main>
    </div>
  );
}
```

---

## 五、培训页 (src/app/training/page.tsx)

```tsx
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
        { title: '构建初步检索策略', content: '使用AI辅助完成专业级高级检索式' },
        { title: '获取初步文献数据', content: '执行检索，将文献信息高效导入Zotero' },
        // ... 更多课程
      ],
      color: 'from-blue-600 to-cyan-500',
    },
    // ... 更多模块
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
      {/* 页面内容 */}
    </div>
  );
}
```

---

## 六、捐赠页 (src/app/donate/page.tsx)

```tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/layout/Header';
import { 
  Heart,
  Coffee,
  Sparkles,
  Gift,
  CheckCircle2,
  Users,
  Star,
  MessageCircle,
  Mail,
  Send,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  
  // 意见信箱状态
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackContent, setFeedbackContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 提交反馈
  const handleSubmitFeedback = async () => {
    if (!feedbackContent.trim()) return;
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: feedbackName,
          content: feedbackContent,
        }),
      });
      // 处理响应...
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* 捐赠表单和二维码 */}
        {/* 用户意见信箱 */}
      </main>
    </div>
  );
}
```

---

## 七、Header组件 (src/components/layout/Header.tsx)

```tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Sparkles,
  Menu,
  X,
  Heart,
} from 'lucide-react';
import { useState } from 'react';
import { UserMenu } from '@/components/auth';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/services', label: '服务' },
    { href: '/tools', label: '工具' },
    { href: '/training', label: '培训' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d69e2e] to-[#ecc94b] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-slate-900" />
            </div>
            <span className="font-semibold text-lg hidden sm:inline">
              科研助手
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/donate"
              className="ml-2 px-4 py-2 rounded-lg flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
            >
              <Heart className="w-4 h-4" />
              支持
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <UserMenu />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
```

---

## 八、认证提供者 (src/providers/AuthProvider.tsx)

```tsx
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { UserNoticeDialog } from '@/components/auth/UserNoticeDialog';
import { LoginDialog } from '@/components/auth/LoginDialog';

interface User {
  id: string;
  nickname: string;
  avatar: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  showLogin: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [showNotice, setShowNotice] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // 检查是否同意声明
    const noticeAgreed = localStorage.getItem('userNoticeAgreed');
    if (!noticeAgreed) {
      setShowNotice(true);
    }

    // 恢复登录状态
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        setIsLoggedIn(true);
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        token,
        login,
        logout,
        showLogin: () => setShowLogin(true),
      }}
    >
      {children}
      <UserNoticeDialog
        open={showNotice}
        onOpenChange={setShowNotice}
        onAgree={() => setShowNotice(false)}
      />
      <LoginDialog
        open={showLogin}
        onOpenChange={setShowLogin}
        onLoginSuccess={(userData) => {
          login(userData, `token-${Date.now()}`);
          setShowLogin(false);
        }}
      />
    </AuthContext.Provider>
  );
}
```

---

## 九、用户反馈API (src/app/api/feedback/route.ts)

```tsx
import { NextRequest, NextResponse } from 'next/server';

// 临时存储用户反馈（生产环境应使用数据库）
let feedbacks: Array<{
  id: string;
  name: string;
  content: string;
  createdAt: string;
}> = [];

// 获取反馈列表
export async function GET() {
  return NextResponse.json({
    success: true,
    data: feedbacks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  });
}

// 提交新反馈
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, content } = body;

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { success: false, error: '请输入反馈内容' },
        { status: 400 }
      );
    }

    const feedback = {
      id: Date.now().toString(),
      name: name && name.trim() !== '' ? name.trim() : '匿名用户',
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    feedbacks.unshift(feedback);

    // 只保留最近100条反馈
    if (feedbacks.length > 100) {
      feedbacks = feedbacks.slice(0, 100);
    }

    return NextResponse.json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.error('提交反馈失败:', error);
    return NextResponse.json(
      { success: false, error: '提交失败，请稍后重试' },
      { status: 500 }
    );
  }
}
```

---

## 十、登录弹窗 (src/components/auth/LoginDialog.tsx)

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, User } from 'lucide-react';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess: (user: { id: string; nickname: string; avatar: string }) => void;
}

export function LoginDialog({ open, onOpenChange, onLoginSuccess }: LoginDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'wechat' | 'qq' | null>(null);

  const handleOAuthLogin = async (provider: 'wechat' | 'qq') => {
    setIsLoading(true);
    setLoginMethod(provider);

    try {
      // 模拟登录成功
      const mockUser = {
        id: `mock-${Date.now()}`,
        nickname: provider === 'wechat' ? '微信用户' : 'QQ用户',
        avatar: '',
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', `mock-token-${Date.now()}`);
      
      onLoginSuccess(mockUser);
      onOpenChange(false);
    } finally {
      setIsLoading(false);
      setLoginMethod(null);
    }
  };

  const handleGuestLogin = () => {
    const guestUser = {
      id: `guest-${Date.now()}`,
      nickname: '游客用户',
      avatar: '',
    };
    
    localStorage.setItem('user', JSON.stringify(guestUser));
    localStorage.setItem('token', `guest-token-${Date.now()}`);
    
    onLoginSuccess(guestUser);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">登录科研助手</DialogTitle>
          <DialogDescription className="text-center pt-1">
            登录后可保存您的研究记录
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 微信登录 */}
          <Button
            variant="outline"
            className="w-full h-12 text-base justify-start gap-3"
            onClick={() => handleOAuthLogin('wechat')}
            disabled={isLoading}
          >
            {/* 微信图标 */}
            <span className="text-green-700">
              {isLoading && loginMethod === 'wechat' ? '登录中...' : '微信登录'}
            </span>
          </Button>

          {/* QQ登录 */}
          <Button
            variant="outline"
            className="w-full h-12 text-base justify-start gap-3"
            onClick={() => handleOAuthLogin('qq')}
            disabled={isLoading}
          >
            {/* QQ图标 */}
            <span className="text-blue-700">
              {isLoading && loginMethod === 'qq' ? '登录中...' : 'QQ登录'}
            </span>
          </Button>

          {/* 游客模式 */}
          <Button
            variant="outline"
            className="w-full h-12 text-base justify-start gap-3"
            onClick={handleGuestLogin}
            disabled={isLoading}
          >
            <User className="w-5 h-5 text-slate-600" />
            <span>游客模式体验</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 十一、用户菜单 (src/components/auth/UserMenu.tsx)

```tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, LogOut, History, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LoginDialog } from '@/components/auth/LoginDialog';

export function UserMenu() {
  const { user, loading, isLoggedIn, logout, getActivities } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (showHistory && isLoggedIn) {
      setLoadingHistory(true);
      getActivities?.(50).then((data) => {
        if (data) {
          setActivities(data.activities);
        }
        setLoadingHistory(false);
      });
    }
  }, [showHistory, isLoggedIn, getActivities]);

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <Button 
          variant="default" 
          size="sm"
          onClick={() => setShowLogin(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <User className="w-4 h-4 mr-1" />
          登录
        </Button>
        <LoginDialog 
          open={showLogin} 
          onOpenChange={setShowLogin}
          onLoginSuccess={() => {
            setShowLogin(false);
            window.location.reload();
          }}
        />
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.nickname} className="w-6 h-6 rounded-full" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {user?.nickname?.charAt(0) || 'U'}
                </span>
              </div>
            )}
            <span className="hidden sm:inline">{user?.nickname || '用户'}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>{user?.nickname || '用户'}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowHistory(true)}>
            <History className="w-4 h-4 mr-2" />
            使用记录
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-red-600">
            <LogOut className="w-4 h-4 mr-2" />
            退出登录
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 历史记录弹窗 */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              使用记录
            </DialogTitle>
          </DialogHeader>
          {/* 历史记录内容 */}
        </DialogContent>
      </Dialog>
    </>
  );
}
```

---

## 配置文件

### package.json (核心依赖)

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "lucide-react": "^0.400.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

### .coze (项目配置)

```toml
[project]
requires = ["nodejs-24"]

[dev]
build = ["pnpm", "install"]
run = ["pnpm", "run", "dev"]

[deploy]
build = ["pnpm", "run", "build"]
run = ["pnpm", "run", "start"]
```

---

## 设计规范总结

### 主题配色
| 变量 | 浅色模式 | 深色模式 | 用途 |
|------|---------|---------|------|
| --primary | #1a365d | #d69e2e | 主色调 |
| --accent | #d69e2e | #d69e2e | 强调色 |
| --background | #fafbfc | #0f1419 | 背景色 |
| --card | #ffffff | #1a202c | 卡片背景 |

### 组件规范
- **按钮**: 使用 `.btn-academic`（学术蓝）和 `.btn-gold`（琥珀金）
- **卡片**: 添加 `.card-hover` 实现悬浮效果
- **统计数字**: 使用 `.stat-number` 应用衬线字体渐变
- **徽章**: 推荐项使用 `.badge-premium`

### 动画规范
- 入场动画: `animate-fade-in-up` 配合延迟类
- 悬浮效果: `transition-all duration-300`
- 光效装饰: `.hero-bg-pattern` + `.bg-academic-texture`

---

**文档生成时间**: 2024年12月  
**技术栈版本**: Next.js 16 / React 19 / TypeScript 5 / Tailwind CSS 4
