import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { ViewTransitions } from 'next-view-transitions';
import { fontBody, fontCode, fontDisplay } from '@/lib/fonts';
import { Footer, Header } from '@/components';
import { cx } from '@/lib/utils';
import './globals.css';

export const viewport: Viewport = {
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://zira.my.id'),
  title: {
    default: 'Fauzira Alpiandi',
    template: '%s \u007E Fauzira Alpiandi',
  },
  description: 'A software engineer and writer building better experiences',
  openGraph: {
    title: 'Fauzira Alpiandi',
    description: 'A software engineer and writer building better experiences',
    url: 'https://zira.my.id',
    siteName: 'Fauzira Alpiandi',
    type: 'website',
    images: [
      {
        url: 'https://zira.my.id/api/og',
        alt: 'Fauzira Alpiandi',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'Fauzira Alpiandi',
    description: 'A software engineer and writer building better experiences',
    card: 'summary_large_image',
    images: [
      {
        url: 'https://zira.my.id/api/og',
        alt: 'Fauzira Alpiandi',
        width: 1200,
        height: 630,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'xuMdCxKom7IZ2YwCTzVJli3Sp_bvt-nofj8Q1iBjPf0',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US" suppressHydrationWarning>
      <ViewTransitions>
        <body
          className={cx(
            fontBody.variable,
            fontDisplay.variable,
            fontCode.variable,
            'font-body bg-neutral-950 text-neutral-50 antialiased',
          )}
        >
          <svg className="pointer-events-none fixed isolate z-50 h-full w-full mix-blend-soft-light">
            <filter id="noise">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="1"
                numOctaves="5"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
          <div className="flex min-h-screen flex-col p-8">
            <Header />
            <main className="mx-auto my-24 flex w-full max-w-xl grow flex-col text-pretty break-words md:my-36">
              {children}
            </main>
            <Footer />
            <Analytics mode="production" />
          </div>
        </body>
      </ViewTransitions>
    </html>
  );
}
