'use client';

import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';
import { NowPlaying } from '@/components/spotify';

export function Footer() {
  const [now, setNow] = useState<ReturnType<typeof formatDate> | null>(null);

  useEffect(() => {
    setNow(formatDate());

    const timer = setInterval(() => {
      setNow(formatDate());
    }, 15e3);

    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="relative">
      <hr className="absolute top-0 left-1/2 h-px w-screen -translate-x-1/2 border-neutral-900" />
      <aside className="mt-8 flex grid grid-cols-2 items-center md:grid-cols-3">
        <div className="justify-self-start" aria-label="Now Playing (Spotify)">
          <NowPlaying />
        </div>
        <div
          className="justify-self-end md:justify-self-center"
          aria-label="Current Time (GMT+7)"
        >
          <div className="font-display flex flex-col items-end text-xs md:flex-row md:items-center md:gap-1.5 md:text-sm">
            <time className="order-2 text-neutral-400 md:order-1">
              {now ? now.format('dddd') : '---'}
            </time>
            <time className="text-accent order-1 md:order-2">
              {now ? now.format('h:mm A') : '--:--'}
            </time>
          </div>
        </div>
        <div className="hidden justify-self-end md:block">
          <div className="flex items-center">
            <p className="font-display text-sm text-neutral-400">
              &copy; {new Date().getFullYear()} Fauzira Alpiandi
            </p>
            <span className="mx-1.5 text-neutral-500">/</span>
            <a
              download
              href="/fwzyrln.vercel.app_tnc.md"
              title="Terms & Conditions"
              aria-label="Terms & Conditions"
              className="font-display text-accent text-right text-sm font-medium"
            >
              TnC
              <span className="sr-only">(Terms & Conditions)</span>
            </a>
          </div>
        </div>
      </aside>
    </footer>
  );
}
