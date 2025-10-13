import type { Metadata } from 'next';
import { TopArtists, TopTracks } from '@/components/spotify';

export const metadata: Metadata = {
  title: 'Misc',
  description:
    'Chaos lives here\u2014music hits differently, beats hit harder, and yeah... mischievous tastes in the mix. Dive in for your guilty pleasures!',
  openGraph: {
    title: 'Misc',
    description:
      'Chaos lives here\u2014music hits differently, beats hit harder, and yeah... mischievous tastes in the mix. Dive in for your guilty pleasures!',
    url: 'https://zira.my.id/misc',
    siteName: 'Fauzira Alpiandi',
    type: 'website',
    images: [
      {
        url: 'https://zira.my.id/api/og',
        alt: 'Misc',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'Misc',
    description:
      'Chaos lives here\u2014music hits differently, beats hit harder, and yeah... mischievous tastes in the mix. Dive in for your guilty pleasures!',
    card: 'summary_large_image',
    images: [
      {
        url: 'https://zira.my.id/api/og',
        alt: 'Misc',
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function Misc() {
  return (
    <main>
      <h1 className="font-medium text-amber-50">
        <span className="text-accent">Chaos lives here</span>&mdash;music hits
        differently, beats hit harder, and yeah... mischievous tastes in the
        mix.{' '}
        <span className="text-accent">Dive in for your guilty pleasures!</span>
      </h1>
      <div className="mt-12 space-y-6">
        <TopTracks />
        <TopArtists />
      </div>
    </main>
  );
}
