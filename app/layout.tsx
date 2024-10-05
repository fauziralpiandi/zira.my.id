import type { Metadata } from 'next'
import localFont from 'next/font/local'

import 'app/globals.css'

import { site } from 'app/lib/metadata'

import Header from 'app/components/Header'
import Footer from 'app/components/Footer'
import Cookie from 'app/components/Cookie'

const font = localFont({
  src: './fonts/GeistSans.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.baseUrl),
  alternates: {
    canonical: site.baseUrl,
  },
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang={site.locale} className={`${font.className}`}>
      <body>
        <svg
          className="w-full h-full pointer-events-none fixed isolate z-50 mix-blend-soft-light opacity-80"
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
              baseFrequency="1"
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
