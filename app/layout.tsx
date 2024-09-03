import './global.css'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { site } from 'app/utils/constant'

import Cookie from 'app/cookie/Manager'

const Navbar = dynamic(() => import('./components/Navigation'), {
  suspense: true,
})
const Footer = dynamic(() => import('./components/Footer'), {
  suspense: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(site.baseUrl),
  title: {
    default: site.title,
    template: `%s | ${site.title}`,
  },
  description: site.desc,
  openGraph: {
    title: site.title,
    description: site.desc,
    url: site.baseUrl,
    siteName: site.title,
    locale: site.locale,
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      'index': true,
      'follow': true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: site.verify,
  },
}

// Helper function to combine class names like a pro
const cx = (...classes: string[]) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang={site.locale}
      className={cx(
        'text-main-text bg-main-background',
        GeistSans.variable,
        GeistMono.variable,
      )}
    >
      <body className="relative width-full px-7 pt-8 md:pt-16 pb-10 md:pb-16 antialiased">
        <main className="relative max-w-xl mx-auto">
          {/* Holding your breath until it loads! */}
          <Suspense fallback={<div>Loading...</div>}>
            <Navbar />
          </Suspense>
          {children}
          {/* Because we all need a solid ending */}
          <Suspense fallback={<div>Loading...</div>}>
            <Footer />
          </Suspense>
          <Cookie />
        </main>
      </body>
    </html>
  )
}
