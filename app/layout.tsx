import './global.css'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import type { Metadata } from 'next'
import { site } from 'app/lib/constant'

import Nav from 'app/components/Nav'
import Footer from 'app/components/Footer'
import Cookie from 'app/components/Cookie'

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
        <main className="relative max-w-2xl mx-auto">
          <Nav />
          {children}
          <Footer />
          <Cookie />
        </main>
      </body>
    </html>
  )
}
