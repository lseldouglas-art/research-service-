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
