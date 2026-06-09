import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartcc.my'

export const metadata: Metadata = {
  title: 'smartcc — Optimizer Float Kad Kredit',
  description: 'Tahu bila masa terbaik untuk guna kad kredit dan dapatkan sehingga 50 hari float percuma.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: 'smartcc',
    locale: 'ms_MY',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ms">
      <body className={inter.className}>
        <Toaster richColors position="top-right" />
        {children}
      </body>
    </html>
  )
}
