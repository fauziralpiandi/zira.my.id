import './global.css'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { site } from 'app/utils/constant'

// Dynamically import Navbar and Footer for a smooth user experience
// Because who doesn't love a little suspense, right?
const Navbar = dynamic(() => import('./components/Navigation'), {
  suspense: true,
})
const Footer = dynamic(() => import('./components/Footer'), {
  suspense: true,
})

// Metadata configuration for the site
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

// Root layout component, where the magic happens
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
      <body className="relative width-full px-8 pt-8 md:pt-16 pb-10 md:pb-16 antialiased">
        <main className="relative max-w-2xl mx-auto">
          {/* Suspense for Navbar - holding your breath until it loads! */}
          <Suspense fallback={<div>Loading...</div>}>
            <Navbar />
          </Suspense>
          {children}
          {/* Suspense for Footer - because we all need a solid ending */}
          <Suspense fallback={<div>Loading...</div>}>
            <Footer />
          </Suspense>
        </main>
      </body>
    </html>
  )
}
