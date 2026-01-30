import '../../globals.css'
import React from 'react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SMILE — Scalable Multimedia in Local Education',
  description: '1Community Network — SMILE project',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <head />
      <body>
        <div className="min-h-screen flex flex-col bg-white text-slate-900">
          {/* Header */}
          <header className="bg-slate-900 text-white">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="text-lg font-semibold">1Community Network</div>
              <nav>
                <ul className="flex gap-4 text-sm">
                  <li>Home</li>
                  <li>About</li>
                  <li>Projects</li>
                  <li>Contact</li>
                </ul>
              </nav>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-slate-100 text-slate-700">
            <div className="container mx-auto px-4 py-6 text-center text-sm">
              © {new Date().getFullYear()} 1Community Network — SMILE
            </div>
          </footer>
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