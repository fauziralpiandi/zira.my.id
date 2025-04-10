'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { saveCache } from '~/lib/services';

type Track = {
  title: string;
  artist: string;
  cover: string;
  url: string;
};

export const SpotifyTopTracks = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchTracks = async () => {
      try {
        const data = await saveCache<Track[]>(
          'tracks',
          24 * 60 * 60 * 1000, // 24 hours
          async () => {
            const response = await fetch('/api/spotify/top-tracks', { signal });
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to fetch top tracks');
            }
            return response.json();
          }
        );
        setTracks(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.name !== 'AbortError') {
            setError(err.message);
          }
        } else {
          setError('Unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();

    return () => {
      controller.abort();
    };
  }, []);

  if (loading) {
    return (
      <div className="grid animate-pulse grid-cols-5 gap-1.5">
        <span className="sr-only" aria-live="polite" role="status">
          Loading top tracks...
        </span>
        {Array.from({ length: 25 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square h-full w-full rounded-xs bg-neutral-900"
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-5 gap-1.5">
        <span className="sr-only" role="alert">
          Error: {error}
        </span>
        {Array.from({ length: 25 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square h-full w-full rounded-xs bg-neutral-900"
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-1.5">
      {Array.from({ length: 25 }).map((_, index) => {
        if (index < tracks.length) {
          const { title, artist, cover, url } = tracks[index];
          return (
            <a
              key={index}
              href={url}
              title={`Listen to ${title} \u2014 ${artist} on Spotify`}
              aria-label={`Listen to ${title} \u2014 ${artist} on Spotify`}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              <figure
                role="img"
                className="group relative mx-auto aspect-square max-w-[128px] rounded-xs"
                aria-label={`${title} \u2014 ${artist}`}
              >
                <span className="sr-only">
                  {title} — {artist}
                </span>
                <Image
                  src={cover}
                  alt={`Cover of ${title} by ${artist}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 64px, (max-width: 1024px) 96px, 128px"
                  className="animate relative z-10 rounded-xs bg-neutral-900 object-cover grayscale group-hover:grayscale-0"
                />
              </figure>
            </a>
          );
        } else {
          return (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-xs"
            >
              <div className="h-full w-full bg-neutral-200/5" />
            </div>
          );
        }
      })}
    </div>
  );
};
