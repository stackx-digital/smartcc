import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartcc.my'

export const metadata: Metadata = {
  title: 'smartcc — Credit Card Float Optimizer',
  description: 'Know the best time to use your credit card and get up to 50 days of free float.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: 'smartcc',
    locale: 'en_MY',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster richColors position="top-right" />
        {children}
      </body>
    </html>
  )
}
