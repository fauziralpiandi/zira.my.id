'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { AudioWave } from '~/components/ui';

type NowPlaying = {
  title?: string;
  artist?: string;
  url?: string;
  isPlaying?: boolean;
};

const FETCH_INTERVAL = 15000; // 15s in ms

/**
 * Fetches track data every 15s in production, only on mount/refresh in dev.
 * Skips redundant fetches and aborts on unmount for clean DX.
 *
 * @returns JSX.Element
 */
export const SpotifyNowPlaying = () => {
  const [track, setTrack] = useState<NowPlaying | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lastUrlRef = useRef<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  /**
   * Fetches the current Spotify track, skipping if the track URL hasn't changed.
   * Handles errors gracefully and aborts on signal.
   */
  const fetchTrack = useCallback(async () => {
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    try {
      setLoading(true);
      const response = await fetch('/api/spotify/now-playing', { signal });
      if (!response.ok) throw new Error('Failed to fetch Spotify data');

      const data: NowPlaying = await response.json();

      if (data?.url && data.url === lastUrlRef.current) return;

      setTrack(data);
      lastUrlRef.current = data.url ?? null;
      setError(null);
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return;
      setError((err as Error)?.message ?? 'Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cleans up interval and aborts fetch on unmount.
  useEffect(() => {
    fetchTrack();

    if (process.env.NODE_ENV === 'production') {
      const intervalId = setInterval(fetchTrack, FETCH_INTERVAL);
      return () => {
        clearInterval(intervalId);
        controllerRef.current?.abort();
      };
    }

    return () => controllerRef.current?.abort();
  }, [fetchTrack]);

  const {
    title = 'Unknown',
    artist = 'Unknown',
    url = '#',
    isPlaying = false,
  } = track ?? {};

  if (loading && !track) {
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
              aria-label="Can't connect to Spotify"
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
    <div className="flex items-center justify-center">
      <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-2">
        <AudioWave
          isPlaying={isPlaying}
          aria-label={isPlaying ? 'Now playing...' : 'Last played...'}
        />
        <div className="flex flex-col">
          <h1 className="font-display line-clamp-1 text-sm leading-tight font-bold">
            <a
              href={url}
              title={`Listen ${title} — ${artist} on Spotify`}
              aria-label={`Listen ${title} — ${artist} on Spotify`}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              {title}
            </a>
          </h1>
          <p className="line-clamp-1 text-xs text-neutral-400">{artist}</p>
        </div>
      </div>
    </div>
  );
};
