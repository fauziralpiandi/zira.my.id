'use client';

import { useEffect, useState } from 'react';
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
  const [error, setError] = useState(false);

  useEffect(() => {
    let controller = new AbortController();

    const fetchData = async () => {
      controller.abort();
      controller = new AbortController();

      setLoading(true);

      try {
        const res = await fetch('/api/spotify/now-playing', {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();

        setTrack(json.data);
        setError(false);
      } catch {
        setTrack(null);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    if (process.env.NODE_ENV === 'production') {
      const interval = setInterval(fetchData, 15e3);

      return () => {
        clearInterval(interval);

        controller.abort();
      };
    }

    return () => controller.abort();
  }, []);

  const { title, artist, url, isPlaying } = track ?? {
    title: 'Unknown',
    artist: 'Unknown',
    url: 'https://open.spotify.com',
    isPlaying: false,
  };

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex animate-pulse items-center justify-center"
      >
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
      <div role="alert" className="flex items-center justify-center">
        <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-2">
          <div className="flex items-center justify-center">
            <AudioWave
              isPlaying={false}
              aria-label="Failed to load now playing"
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
              aria-label={`Listen ${title} \u2014 ${artist} on Spotify`}
              title={`Listen ${title} \u2014 ${artist} on Spotify`}
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
