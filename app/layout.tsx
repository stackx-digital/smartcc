import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CardFloat Pro — Credit Card Float Optimizer',
  description: 'Maximize your credit card float and know the best time to make purchases.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster richColors position="top-right" />
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 md:ml-[220px] pb-16 md:pb-0">
            {children}
          </main>
        </div>
        <BottomNav />
      </body>
    </html>
  )
}
