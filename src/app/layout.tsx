import type { Metadata } from 'next'
import { Radio_Canada } from 'next/font/google'
import { ViewTransitions } from 'next-view-transitions'

import '~/globals.css'
import Header from '~/Header'
import Footer from '~/Footer'
import { my, site, verify } from '~/siteConfig'

const font = Radio_Canada({
  subsets: ['latin'],
})

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
  twitter: {
    title: my.fullName,
    card: 'summary_large_image',
  },
  verification: {
    google: verify.google,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ViewTransitions>
      <html lang={site.locale}>
        <body className={`${font.className} antialiased animate-fade`}>
          <div className="min-h-screen p-6 md:py-12 flex flex-col">
            <div className="flex-grow flex flex-col w-full mx-auto max-w-2xl">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </div>
        </body>
      </html>
    </ViewTransitions>
  )
}
