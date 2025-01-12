import { constant } from '~/lib/constant';
import { SpotifyNowPlaying } from '~/components/spotify';
import { TimeDisplay } from '~/components/ui';

export const Footer = () => {
  return (
    <footer className="relative">
      <hr className="absolute left-1/2 top-0 h-px w-screen -translate-x-1/2 border-stone-900" />
      <aside className="mt-8 grid grid-cols-2 items-center md:grid-cols-3">
        <div className="justify-self-start" aria-label="Spotify Now Playing">
          <SpotifyNowPlaying />
        </div>
        <p className="hidden justify-self-center text-xs text-amber-100 md:block">
          &copy; {new Date().getFullYear()} {constant.authorName}
        </p>
        <div className="justify-self-end" aria-label="Current Time">
          <TimeDisplay />
        </div>
      </aside>
    </footer>
  );
};
