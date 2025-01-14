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
    const fetchTrack = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/spotify/now-playing');
        if (!response.ok) throw new Error('Failed to fetch Spotify data');
        const data: NowPlaying = await response.json();
        setTrack(data);
      } catch {
        setError('Error fetching track data');
      } finally {
        setLoading(false);
      }
    };

    fetchTrack();
    const intervalId = setInterval(fetchTrack, 30000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="flex animate-pulse items-center justify-center">
        <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-2">
          <div className="flex items-center justify-center">
            <AudioWave isPlaying={false} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <div className="h-4 w-32 rounded bg-stone-900" />
            <div className="h-3 w-24 rounded bg-stone-900" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-2">
          <div className="flex rotate-45 items-center justify-center">
            <AudioWave isPlaying={false} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <div className="h-4 w-32 rounded bg-amber-200/5" />
            <div className="h-3 w-24 rounded bg-amber-200/5" />
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
          <h1 className="line-clamp-1 font-display text-sm font-semibold leading-tight tracking-tight">
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
          <p className="line-clamp-1 text-xs text-stone-400">{artist}</p>
        </div>
      </div>
    </div>
  );
};
