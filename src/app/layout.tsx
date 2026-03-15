import type { Metadata, Viewport } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '科研服务站 | 专业学术辅助服务',
    template: '%s | 科研服务站',
  },
  description:
    '专业科研辅助服务平台，基于人机协同的工业化工作流，提供从选题到发表的全流程科研支持。文献检索、论文写作、润色精修、格式规范，一站式解决方案。',
  keywords: [
    '科研服务',
    '学术写作',
    '论文润色',
    '文献检索',
    'AI辅助写作',
    '科研培训',
    '综述写作',
    'Zotero管理',
    '学术支持',
    '论文服务',
  ],
  authors: [{ name: '科研服务站', url: 'https://code.coze.cn' }],
  generator: 'Coze Code',
  openGraph: {
    title: '科研服务站 | 专业学术辅助服务平台',
    description:
      '专业科研辅助服务平台，基于人机协同的工业化工作流，提供从选题到发表的全流程科研支持。',
    url: 'https://code.coze.cn',
    siteName: '科研服务站',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1A3A2F',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang="zh-CN" className="scroll-smooth">
      <head>
        {/* Google Fonts - Cormorant Garamond (衬线体) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Sans+3:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#FAFAF7] text-[#1E2120] font-sans">
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}
