import { Link } from 'next-view-transitions';

import { constant } from '@/lib/constant';
import { SpotifyNowPlaying } from '@/components/spotify';
import { TimeDisplay } from '@/components/ui';

export const Footer = () => {
  return (
    <footer className="relative" data-nosnippet>
      <hr className="absolute top-0 left-1/2 h-px w-screen -translate-x-1/2 border-neutral-900" />
      <aside className="mt-8 flex grid grid-cols-2 items-center md:grid-cols-3">
        <div className="justify-self-start" aria-label="Spotify Now Playing">
          <SpotifyNowPlaying />
        </div>
        <div className="justify-self-end md:justify-self-center" aria-label="Current Time">
          <TimeDisplay />
        </div>
        <div className="hidden justify-self-end md:block">
          <div className="flex items-center">
            <p className="font-display text-sm text-neutral-400">
              &copy; {new Date().getFullYear()} {constant.authorName}
            </p>
            <span className="mx-1.5 text-neutral-500">/</span>
            <Link
              href="/tnc"
              title="Terms and Conditions"
              aria-label="Terms and Conditions"
              className="font-display text-accent text-right text-sm font-medium"
            >
              TnC
              <span className="sr-only">(Terms and Conditions)</span>
            </Link>
          </div>
        </div>
      </aside>
    </footer>
  );
};
