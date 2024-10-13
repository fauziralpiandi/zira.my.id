import type { Metadata } from 'next'
import { Radio_Canada } from 'next/font/google'
import { ViewTransitions } from 'next-view-transitions'

import '@/globals.css'
import { site } from '@/constant'
import { Footer } from '@/Interface'

export const metadata: Metadata = {
  metadataBase: new URL(`${site.baseUrl}`),
  alternates: {
    canonical: site.baseUrl,
  },
  title: {
    default: site.title,
    template: `%s \u2014 ${site.title}`,
  },
  description: site.description,
  keywords: site.keywords,
  openGraph: {
    title: site.title,
    description: site.description,
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
    <ViewTransitions>
      <html lang={site.locale} className={`${font.className} dark animate-in`}>
        <body>
          <div className="min-h-screen px-8 py-12 antialiased flex flex-col md:py-16">
            <div className="flex-grow flex flex-col max-w-xl mx-auto w-full">
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </div>
        </body>
      </html>
    </ViewTransitions>
  )
}

const font = Radio_Canada({
  subsets: ['latin'],
})
