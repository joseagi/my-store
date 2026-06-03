import type { Metadata } from 'next'
import { Rye } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/ui/layout/Navbar'
import { Footer } from '@/components/ui/layout/Footer'
import { Toaster } from '@/components/ui/sonner'
import { SessionProvider } from '@/components/providers/SessionProvider'

const rye = Rye({ subsets: ['latin'],
  weight: '400',
  variable: '--font-heading'
})

export const metadata: Metadata = {
  title: {
    default: 'My Store — Quality products, fast delivery',
    template: '%s | My Store',
  },
  description: 'Shop our curated collection of quality products. Free delivery over £50, 30-day returns.',
  keywords: ['shop', 'online store', 'quality products', 'fast delivery'],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'My Store',
    title: 'My Store — Quality products, fast delivery',
    description: 'Shop our curated collection of quality products.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Store',
    description: 'Quality products, fast delivery',
  },
  robots: {
    index: true,
    follow: true,
  },
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={rye.variable}>
        <SessionProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}