'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { AudioWave } from '@/components/ui';

const LOG_PREFIX = '[SpotifyNowPlaying]';

type NowPlaying = {
  title: string;
  artist: string;
  url: string;
  isPlaying: boolean;
};

export const SpotifyNowPlaying = () => {
  const [track, setTrack] = useState<NowPlaying | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();

    try {
      setLoading(true);
      const res = await fetch('/api/spotify/now-playing', {
        signal: controllerRef.current.signal,
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const errorMessage =
          data.error || `Failed to fetch now playing track (${res.status})`;
        console.error(
          `${LOG_PREFIX} Error: API request failed with status ${res.status}`,
        );
        throw new Error(errorMessage);
      }

      let data: NowPlaying;
      try {
        data = await res.json();
      } catch (parseError) {
        console.error(
          `${LOG_PREFIX} Error: Failed to parse API response`,
          parseError,
        );
        throw new Error('Invalid response format');
      }

      if (!data) {
        throw new Error('Empty response received');
      }

      setTrack(data);
      setError(null);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error(`${LOG_PREFIX} Error: ${errorMessage}`);

      setError(
        error instanceof Error
          ? error.message.includes('Failed to fetch')
            ? 'Failed to connect to Spotify'
            : error.name === 'TypeError'
              ? 'Network connection error'
              : error.message.includes('Unexpected token') ||
                  error.message.includes('Invalid response')
                ? 'Invalid response format'
                : error.message
          : 'Unknown error occurred',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    if (process.env.NODE_ENV === 'production') {
      const interval = setInterval(fetchData, 15000);
      return () => {
        clearInterval(interval);
        controllerRef.current?.abort();
      };
    }

    return () => controllerRef.current?.abort();
  }, [fetchData]);

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
