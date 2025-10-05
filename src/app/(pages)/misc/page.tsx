import type { Metadata } from 'next';
import { TopArtists, TopTracks } from '@/components/spotify';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://zira.my.id/misc',
  },
  title: 'Misc',
  description:
    'A chaotic corner\u2014music felt, raw and real. Beats that move, questionable choices.',
  openGraph: {
    title: 'Misc',
    description:
      'A chaotic corner\u2014music felt, raw and real. Beats that move, questionable choices.',
    url: 'https://zira.my.id/misc',
    siteName: 'Fauzira Alpiandi',
    type: 'website',
    images: [
      {
        url: 'https://zira.my.id/og',
        alt: 'Misc',
        width: 1200,
        height: 630
      },
    ],
  },
  twitter: {
    title: 'Misc',
    description:
      'A chaotic corner\u2014music felt, raw and real. Beats that move, questionable choices.',
    card: 'summary_large_image',
    images: [
      {
        url: 'https://zira.my.id/og',
        alt: 'Misc',
        width: 1200,
        height: 630
      },
    ],
  },
};

export default function Misc() {
  return (
    <section>
      <p className="mb-12 font-medium text-amber-50">
        A little corner of chaos&mdash;
        <span className="text-accent">
          where music isn&rsquo;t just heard, it&rsquo;s felt.
        </span>{' '}
        It&rsquo;s all here, raw and real. Beats that make me move, and
        questionable decisions to match.{' '}
        <span className="text-accent">
          Eh&mdash;just try it out, it&rsquo;s all about sharing tastes, Lmao...
        </span>
      </p>
      <div className="space-y-6">
        <TopTracks />
        <TopArtists />
        <p className="text-xs text-neutral-300">
          Whatever, wherever, and whenever, I escape into music w/ Spotify.{' '}
          <span className="text-amber-50">The Sad Girl CEO (Gracie)</span> stay
          on repeat&mdash;big-room, future-bass, indie, and dreamy setting the
          vibe. If it&rsquo;s not worth the replay? Nah, not my jam.
        </p>
      </div>
    </section>
  );
}
