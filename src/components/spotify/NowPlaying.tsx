'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AudioWave } from '@/components/ui';

type NowPlaying = {
  title: string;
  artist: string;
  url: string;
  isPlaying: boolean;
};

export function NowPlaying() {
  const [track, setTrack] = useState<NowPlaying | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const fetchData = useCallback(async () => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    try {
      setLoading(true);

      const res = await fetch('/api/spotify/now-playing', {
        signal: controllerRef.current.signal,
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      setTrack(await res.json());
      setError(null);
    } catch (error) {
      const e = error instanceof Error ? error.message : 'Unknown error';

      setError(
        e.includes('Failed to fetch')
          ? 'Failed to connect to Spotify'
          : e.includes('HTTP') || e.includes('Empty')
            ? 'Invalid response'
            : 'Unknown error',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    if (process.env.NODE_ENV === 'production') {
      const interval = setInterval(fetchData, 15e3);

      return () => {
        clearInterval(interval);

        controllerRef.current?.abort();
      };
    }

    return () => controllerRef.current?.abort();
  }, [fetchData]);

  const { title, artist, url, isPlaying } = track ?? {
    title: 'Unknown',
    artist: 'Unknown',
    url: '#',
    isPlaying: false,
  };

  if (loading) {
    return (
      <div className="flex animate-pulse items-center justify-center">
        <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-2">
          <div className="flex items-center justify-center">
            <AudioWave isPlaying={false} aria-label="Loading..." />
          </div>
          <div className="flex flex-col space-y-1.5">
            <div className="h-4 w-32 rounded-sm bg-neutral-900" />
            <div className="h-3 w-24 rounded-sm bg-neutral-900" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-2">
          <div className="flex items-center justify-center">
            <AudioWave
              isPlaying={false}
              aria-label="Can&rsquo;t connect to Spotify"
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <div className="h-4 w-32 rounded-sm bg-neutral-900/50" />
            <div className="h-3 w-24 rounded-sm bg-neutral-900/50" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center">
      <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-2">
        <AudioWave
          isPlaying={isPlaying}
          aria-label={isPlaying ? 'Now playing...' : 'Last played...'}
        />
        <div className="flex flex-col overflow-hidden">
          <p className="font-display line-clamp-1 text-sm leading-tight font-bold">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              title={`Listen ${title} — ${artist} on Spotify`}
              aria-label={`Listen ${title} — ${artist} on Spotify`}
              className="truncate"
            >
              {title}
            </a>
          </p>
          <p className="line-clamp-1 truncate text-xs text-neutral-400">
            {artist}
          </p>
        </div>
      </div>
    </div>
  );
}
