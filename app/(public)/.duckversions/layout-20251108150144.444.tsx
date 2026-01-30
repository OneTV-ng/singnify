'use client';

import { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { AppProvider } from '@/app/context/AppProvider';
import '../globals.css';

// Optional components
import Sidebar from '@/app/components/layout/Sidebar';
import Navbar from '@/app/components/layout/Navbar';

// Google + Local Fonts
const inter = Inter({ subsets: ['latin'] });

const geistSans = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: '../fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

// ✅ Root Layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect user theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(savedTheme === 'dark' || (!savedTheme && systemTheme));
  }, []);

  // Apply theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // ✅ Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const reg = await navigator.serviceWorker.register('/sw.js');
          console.log('✅ Service Worker registered:', reg.scope);
        } catch (err) {
          console.warn('❌ Service Worker registration failed:', err);
        }
      });
    }
  }, []);

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* ✅ Essential PWA Meta */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a84ff" />
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-512x512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>

      <body className={`${inter.className} bg-background text-foreground min-h-screen`}>
        <AppProvider>
          <div className="flex flex-col min-h-screen">
            {/* Optional global UI */}
            {/* <Navbar /> */}
            {/* <Sidebar /> */}
            <main className="flex-1">{children}</main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
