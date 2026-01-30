// Updated app/layout.tsx
'use client'
import { Inter } from 'next/font/google';
import { AppProvider } from '@/app/context/AppProvider';
import Sidebar from '@/app/components/layout/Sidebar';
import Navbar from '@/app/components/layout/Navbar';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

import localFont from 'next/font/local';
const geistSans = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: '../fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

import '../globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(savedTheme === 'dark' || (!savedTheme && systemTheme));
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);



  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <div className="min-h-screen bg-background">
 
              {children}

       
          </div>
        </AppProvider>
      </body>
    </html>
  );
}