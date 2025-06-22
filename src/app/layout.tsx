import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "小画家AI - 儿童语音文字生图",
  description: "为3-8岁儿童打造的安全AI画画工具，用声音和文字创造美丽图片",
  keywords: "儿童AI, 语音生图, 文字生图, 儿童创作, 安全AI",
  authors: [{ name: "小画家AI团队" }],
  robots: "index, follow",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <head>
        <meta name="theme-color" content="#3b82f6" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎨</text></svg>" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'white',
              color: '#374151',
              border: '2px solid #fbbf24',
              borderRadius: '1rem',
              fontSize: '16px',
              fontWeight: '500',
            },
          }}
        />
      </body>
    </html>
  );
}
