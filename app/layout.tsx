import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: {
    default: 'Divination Studio of Zhou Xiaotong | Traditional Chinese Divination',
    template: '%s | Divination Studio of Zhou Xiaotong',
  },
  description:
    'Traditional Chinese divination platform offering Meihua Yishu (Plum Blossom Divination) and Xiao Liu Ren divination. Ancient wisdom for modern decisions.',
  keywords: ['\u6885\u82b1\u6613\u6570', '\u5c0f\u516d\u58ec', '\u5360\u535c', '\u6613\u7ecf', 'traditional chinese divination', 'plum blossom divination'],
  authors: [{ name: 'Divination Studio of Zhou Xiaotong' }],
  openGraph: {
    title: 'Divination Studio of Zhou Xiaotong',
    description: 'Ancient Wisdom for Modern Decisions - Traditional Chinese Divination',
    type: 'website',
    locale: 'zh_CN',
    siteName: 'Divination Studio of Zhou Xiaotong',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='zh-CN'>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Noto+Serif+SC:wght@400;500;600;700&display=swap' rel='stylesheet' />
        <script type='application/ld+json' dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Divination Studio of Zhou Xiaotong',
            description: 'Traditional Chinese divination platform offering Meihua Yishu and Xiao Liu Ren divination services.',
            url: process.env.NEXT_PUBLIC_SITE_URL || 'https://divination-studio.vercel.app',
          }),
        }} />
      </head>
      <body className='min-h-screen flex flex-col'>
        <Header />
        <main className='flex-1 pt-16'>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
