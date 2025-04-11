'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AudioWave } from '~/components/ui';

type NowPlaying = {
  title?: string;
  artist?: string;
  url?: string;
  isPlaying?: boolean;
};

// Magic numbers for polling intervals.
const ERROR_THRESHOLD = 3;
const NORMAL_INTERVAL = 15000;
const BACKOFF_INTERVAL = 30000;

/**
 * Polls every 15s (30s after 3 errors) in prod.
 * Skips if track hasn't changed.
 */
export const SpotifyNowPlaying = () => {
  const [track, setTrack] = useState<NowPlaying | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCount, setErrorCount] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Ref for polling interval

  /**
   * Fetches current Spotify track.
   * Skips if track URL is unchanged. Resets errors on success.
   * @param signal - AbortSignal to cancel fetch
   */
  const fetchTrack = useCallback(
    async (signal: AbortSignal) => {
      try {
        setLoading(true);
        const response = await fetch('/api/spotify/now-playing', { signal });
        if (!response.ok) throw new Error('Failed to fetch Spotify data');

        const data: NowPlaying = await response.json();
        if (data?.url && data.url === track?.url) return;

        setTrack(data);
        setError(null);
        setErrorCount(0);
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
        setError((err as Error)?.message ?? 'Unexpected error occurred');
        setErrorCount((prev) => prev + 1);
      } finally {
        setLoading(false);
      }
    },
    [track?.url]
  ); // Depend on track.url for skip logic.

  useEffect(() => {
    const controller = new AbortController();

    fetchTrack(controller.signal);

    if (process.env.NODE_ENV === 'production') {
      const interval =
        errorCount > ERROR_THRESHOLD ? BACKOFF_INTERVAL : NORMAL_INTERVAL;
      intervalRef.current = setInterval(() => {
        fetchTrack(controller.signal);
      }, interval);
    }

    return () => {
      controller.abort();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchTrack, errorCount]);

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
            <div className="h-4 w-32 rounded-sm bg-neutral-900" />
            <div className="h-3 w-24 rounded-sm bg-neutral-900" />
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
