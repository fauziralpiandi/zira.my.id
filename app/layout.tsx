import type { Metadata } from 'next'
import localFont from 'next/font/local'

import './globals.css'

import { site } from 'app/lib/constant'

import Header from 'app/components/ui/Header'
import Footer from 'app/components/ui/Footer'

import Cookie from 'app/components/Cookie'

const font = localFont({
  src: './fonts/GeistSans.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.baseUrl),
  title: {
    default: site.title,
    template: `%s \u2014 ${site.title}`,
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
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${font.className}`}>
      <body>
        <svg
          className="w-full h-full pointer-events-none fixed isolate z-50 mix-blend-soft-light opacity-75"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
          }}
        >
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="5"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100vw" height="100vh" filter="url(#noise)" />
        </svg>
        <div className="p-8 antialiased min-h-screen flex flex-col">
          <div className="w-full mx-auto max-w-2xl flex-grow flex flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Cookie />
          </div>
        </div>
      </body>
    </html>
  )
}
