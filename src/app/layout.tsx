import type { Metadata } from 'next'
import { Radio_Canada } from 'next/font/google'
import { ViewTransitions } from 'next-view-transitions'
import '~/styles/globals.css'

const font = Radio_Canada({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://zira.my.id'),
  alternates: {
    canonical: 'https://zira.my.id',
  },
  title: {
    default: 'Fauzira Alpiandi',
    template: '%s \u2014 Fauzira Alpiandi',
  },
  description:
    'Hey there! I’m a frontendless exploring the exciting world of React!',
  keywords: ['fauzira', 'alpiandi', 'zira'],
  openGraph: {
    title: 'Fauzira Alpiandi',
    description:
      'Hey there! I’m a frontendless exploring the exciting world of React!',
    url: 'https://zira.my.id',
    siteName: 'Fauzira Alpiandi',
    type: 'website',
  },
  twitter: {
    title: 'Fauzira Alpiandi',
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'xuMdCxKom7IZ2YwCTzVJli3Sp_bvt-nofj8Q1iBjPf0',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ViewTransitions>
      <html lang="en" className="dark">
        <body className={`${font.className} select-none antialiased`}>
          <div className="flex min-h-screen flex-col justify-between px-8 py-12">
            <main className="mx-auto w-full max-w-[60ch] space-y-4 text-pretty">
              {children}
            </main>
          </div>
        </body>
      </html>
    </ViewTransitions>
  )
}
