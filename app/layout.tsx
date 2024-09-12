import clsx from 'clsx'
import type { Metadata } from 'next'

import { site } from 'app/lib/constant'
import { font } from 'app/lib/fonts'

import Nav from 'app/components/ui/Nav'
import Footer from 'app/components/ui/Footer'

import Cookie from 'app/components/miscellaneous/Cookie'

import './global.css'

export const metadata: Metadata = {
  metadataBase: new URL(site.baseUrl),
  title: {
    default: site.title,
    template: `%s \u007C ${site.title}`,
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang={site.locale}
      className={clsx(
        'text-main-text bg-main-background',
        font.sans,
        font.mono,
      )}
    >
      <body className="relative width-full px-7 pt-8 md:pt-16 pb-8 md:pb-16 antialiased">
        <main className="relative max-w-[640px] mx-auto">
          <Nav />
          {children}
          <Footer />
          <Cookie />
        </main>
      </body>
    </html>
  )
}
