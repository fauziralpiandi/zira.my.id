'use client';

import { useEffect, useState } from 'react';

import { AudioWave } from '~/components/ui';

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

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const fetchTrack = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/spotify/now-playing');
        if (!response.ok) throw new Error('Failed to fetch Spotify data');
        const data: NowPlaying = await response.json();
        setTrack(data);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unexpected error occurred');
        }
        setTrack(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTrack();

    if (process.env.NODE_ENV === 'production') {
      intervalId = setInterval(fetchTrack, 15000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex animate-pulse items-center justify-center">
        <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-2">
          <div className="flex items-center justify-center">
            <AudioWave isPlaying={false} />
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
            <AudioWave isPlaying={false} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <div className="h-4 w-32 rounded-sm bg-neutral-900" />
            <div className="h-3 w-24 rounded-sm bg-neutral-900" />
          </div>
        </div>
      </div>
    );
  }

  const { title, artist, url, isPlaying } = track ?? {
    title: 'unknown',
    artist: 'unknown',
    url: '#',
    isPlaying: false,
  };

  return (
    <div className="flex items-center justify-center">
      <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-2">
        <AudioWave isPlaying={isPlaying} />
        <div className="flex flex-col">
          <h1 className="font-display line-clamp-1 text-sm leading-tight font-bold">
            <a
              href={url}
              title={`Listen ${title} \u2014 ${artist} Spotify`}
              aria-label={`Listen ${title} \u2014 ${artist} on Spotify`}
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
