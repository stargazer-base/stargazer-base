import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// サイト検索時に検索欄にかかれる内容
export const metadata: Metadata = {
  title: {
    template: '%s | 推し天文台 - Stargazer Base -',
    default: '推し天文台 - Stargazer Base -',
  },
  description: '推し(星)を特等席で眺め続けるための前線基地',
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
