'use client';

import { Inter } from 'next/font/google';
//import { ThemeProvider } from '@/app/context/ThemeContext';
import { AppProvider } from '@/app/context/AppProvider';
import Sidebar from '@/app/components/layout/Sidebar';
import Navbar from '@/app/components/layout/Navbar';
import Player from '@/app/components/Player';
import Footer from '@/app/components/layout/Footer';
import DesktopFooter from '@/app/components/layout/DesktopFooter';

import localFont from 'next/font/local'


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

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>
            <div className="min-h-screen bg-background">
              <Sidebar />
              <Navbar />
              <main
                className={`
                  min-h-[calc(100vh-4rem-4rem)] 
                  transition-all duration-200 ease-in-out
                  pt-16 pb-32 px-4
                  md:px-8 md:pb-24
                  md:ml-36
                `}
              >
                <div className="max-w-7xl mx-auto">{children}</div>
              </main>
              <Player />
          
        {/* Footer navigation (mobile only) */}
            <div className="md:hidden">
              <Footer />
            </div>
            
            <div className='md:ml-10'>
              <DesktopFooter />
            </div> 
            
         </div>
      
        </AppProvider>
      </body>
    </html>
  );
}
