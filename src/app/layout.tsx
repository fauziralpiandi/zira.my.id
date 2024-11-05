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
    'Hey there! I\u2019m a frontendless exploring the exciting world of React!',
  keywords: ['fauzira', 'alpiandi', 'zira'],
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
      <html lang="en" className={`${font.className} dark`}>
        <body className="tracking-tight antialiased">
          <div className="flex min-h-screen flex-col justify-between">
            <main className="flex-shrink-0 space-y-4 px-8 py-10">
              {children}
            </main>
          </div>
        </body>
      </html>
    </ViewTransitions>
  )
}
