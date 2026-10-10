import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/ThemeProvider'
import { LanguageProvider } from '@/components/LanguageProvider'

const inter = Inter({ subsets: ['latin'] })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartcc.my'

export const metadata: Metadata = {
  title: 'smartcc — Pengoptimum Float Kad Kredit',
  description: 'Ketahui masa terbaik untuk guna kad kredit anda dan dapatkan sehingga 50 hari float percuma.',
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: '/icons/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/icons/icon-32.png',
  },
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
    <html lang="ms" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            <Toaster richColors position="top-right" />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
