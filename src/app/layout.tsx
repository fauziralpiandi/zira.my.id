import { type Metadata } from 'next';
import { type Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { ViewTransitions } from 'next-view-transitions';

import { constant } from '~/lib/constant';
import { cx } from '~/lib/utils';
import { fontBody, fontCode, fontDisplay } from '~/lib/fonts';
import { Header, Footer } from '~/components';

import '~/app/globals.css';

const { baseUrl, title, description, locale } = constant;

export const viewport: Viewport = {
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  // maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(`${baseUrl}`),
  alternates: {
    canonical: baseUrl,
  },
  title: {
    default: title,
    template: `%s \u2014 ${title}`,
  },
  description: description,
  openGraph: {
    title: title,
    description: description,
    url: baseUrl,
    siteName: title,
    type: 'website',
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent(title)}`,
        type: 'image/png',
        width: 1200,
        height: 630,
        alt: `OpenGraph`,
      },
    ],
  },
  twitter: {
    title: title,
    description: description,
    card: 'summary_large_image',
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent(title)}`,
        type: 'image/png',
        width: 1200,
        height: 630,
        alt: `OpenGraph`,
      },
    ],
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
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <ViewTransitions>
        <body
          className={cx(
            fontBody.variable,
            fontDisplay.variable,
            fontCode.variable,
            'font-body antialiased',
            'bg-neutral-950 text-neutral-50'
          )}
        >
          <svg
            className="pointer-events-none fixed isolate z-50 mix-blend-soft-light"
            width="100%"
            height="100%"
          >
            <filter id="noise">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="1"
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
          <div className="flex min-h-screen flex-col p-8">
            <Header />
            <div className="mx-auto flex w-full max-w-2xl grow flex-col">
              <main className="my-24 grow text-pretty break-words md:my-36">
                {children}
              </main>
            </div>
            <Footer />
            <Analytics mode="production" />
          </div>
        </body>
      </ViewTransitions>
    </html>
  );
};

export default RootLayout;
