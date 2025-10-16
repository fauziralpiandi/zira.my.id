'use client';

import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';
import { NowPlaying } from '@/components/spotify';

export function Footer() {
  const [now, setNow] = useState<ReturnType<typeof formatDate> | null>(null);

  useEffect(() => {
    Promise.resolve().then(() => setNow(formatDate()));

    const timer = setInterval(() => {
      setNow(formatDate());
    }, 15e3); // 15 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <footer role="contentinfo" className="relative">
      <hr className="absolute top-0 left-1/2 h-px w-screen -translate-x-1/2 border-neutral-900" />
      <aside className="mt-8 grid grid-cols-2 items-center md:grid-cols-3">
        <div aria-label="Now Playing (Spotify)" className="justify-self-start">
          <NowPlaying />
        </div>
        <div
          aria-label="Current time (GMT+7)"
          className="justify-self-end md:justify-self-center"
        >
          <div className="font-display flex flex-col items-end gap-0 text-xs md:flex-row md:items-center md:gap-1.5 md:text-sm">
            <time className="order-2 text-neutral-400 md:order-1">
              {now ? now.format('dddd') : '---'}
            </time>
            <time className="text-accent order-1 md:order-2">
              {now ? now.format('h:mm A') : '--:--'}
            </time>
          </div>
        </div>
        <div className="hidden justify-self-end md:block">
          <div className="flex items-center text-sm">
            <p className="font-display text-neutral-400">
              &copy; {new Date().getFullYear()} Fauzira Alpiandi
            </p>
            <span className="mx-1.5 text-neutral-500">&#x2F;</span>
            <a
              download
              href="/zira.my.id_tnc.md"
              title="Terms & Conditions"
              className="font-display text-accent font-medium"
            >
              TnC
              <span className="sr-only">Terms &amp; Conditions</span>
            </a>
          </div>
        </div>
      </aside>
    </footer>
  );
}
