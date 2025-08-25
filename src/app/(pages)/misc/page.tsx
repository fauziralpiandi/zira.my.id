import type { Metadata } from 'next';
import { constant } from '@/lib/constant';
import { TopArtists, TopTracks } from '@/components/spotify';

const desc =
  'A chaotic corner\u2014music felt, raw and real. Beats that move, questionable choices.';

export const metadata: Metadata = {
  alternates: {
    canonical: `${constant.baseUrl}/misc`,
  },
  title: 'Misc',
  description: desc,
  openGraph: {
    title: 'Misc',
    description: desc,
    url: `${constant.baseUrl}/misc`,
    siteName: constant.title,
    type: 'website',
    images: [
      {
        url: `${constant.baseUrl}/api/og`,
      },
    ],
  },
  twitter: {
    title: 'Misc',
    description: desc,
    card: 'summary_large_image',
    images: [
      {
        url: `${constant.baseUrl}/api/og`,
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
          Whatever, wherever, and whenever, I escape into music w/ Spotify.
          Gracie stay on repeat&mdash;big-room, future-bass, indie, and dream
          setting the vibe. If it&rsquo;s not worth the replay? Nah, not my jam.
        </p>
      </div>
    </section>
  );
}
