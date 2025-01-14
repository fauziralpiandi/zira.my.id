import { constant } from '~/lib/constant';
import { SpotifyTopArtists, SpotifyTopTracks } from '~/components/spotify';

const { baseUrl, title } = constant;

const desc =
  'A little corner of chaos\u2014where music isn\u2019t just heard, it\u2019s felt. It\u2019s all here, raw and real. Beats that make me move, and questionable decisions to match.';

export const metadata = {
  alternates: {
    canonical: `${baseUrl}/misc`,
  },
  title: 'Misc',
  description: desc,
  openGraph: {
    title: 'Misc',
    description: desc,
    url: `${baseUrl}/misc`,
    siteName: title,
    type: 'website',
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent('Misc')}`,
        type: 'image/png',
        width: 1200,
        height: 630,
        alt: `OpenGraph`,
      },
    ],
  },
  twitter: {
    title: 'Misc',
    description: desc,
    card: 'summary_large_image',
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent('Misc')}`,
        type: 'image/png',
        width: 1200,
        height: 630,
        alt: `OpenGraph`,
      },
    ],
  },
};

const Misc = () => {
  return (
    <section>
      <p className="text-sm text-amber-100">
        <mark>
          A little corner of chaos&mdash;where music isn&rsquo;t just heard,
          it&rsquo;s felt. It&rsquo;s all here, raw and real. Beats that make me
          move, and questionable decisions to match.
        </mark>
      </p>
      <div className="mt-12 space-y-6">
        <SpotifyTopTracks />
        <SpotifyTopArtists />
        <p className="text-xs text-stone-300">
          Whatever, wherever, and whenever, I escape into music with
          Spotify&mdash;Gracie Abrams and AXMO stay on repeat&mdash;big-room,
          future-bass, indie, and dream setting the vibe. If it&rsquo;s not
          worth the replay? Nah, not my jam.
        </p>
      </div>
    </section>
  );
};

export default Misc;
