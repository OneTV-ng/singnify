import '../../globals.css'
import React from 'react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <head />
      <body>
        <div className="min-h-screen flex flex-col bg-white text-slate-900">
     

          {/* Main content area */}
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>


        </div>
      </body>
    </html>
  )
}

/*
Notes / Next steps:
- This file is a server component (default in App Router). If you need client-only behavior (state, effects), create a separate client component and import it with "use client".
- Add providers (ThemeProvider, SessionProvider) around <body> or inside header/footer as needed.
- Customize globals.css (Tailwind recommended) to match your design system.
*/