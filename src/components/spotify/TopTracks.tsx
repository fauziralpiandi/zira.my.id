'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { saveCache } from './cache';

type Track = {
  title: string;
  artist: string;
  cover: string;
  url: string;
};

export function TopTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchTracks = async () => {
      try {
        const data = await saveCache<Track[]>(
          'top_tracks',
          24 * 60 * 60 * 1e3,

          async () => {
            const res = await fetch('/api/spotify/top-tracks', {
              signal: controller.signal,
              headers: { 'Content-Type': 'application/json' },
              cache: 'no-store',
            });

            if (!res.ok) {
              throw new Error(`HTTP ${res.status}`);
            }

            return await res.json();
          },
        );

        if (!Array.isArray(data)) {
          throw new Error('Invalid data format');
        }

        setTracks(data);
        setError(null);
      } catch (error) {
        const e = error instanceof Error ? error.message : 'Unknown error';

        setError(
          e.includes('Failed to fetch')
            ? 'Failed to connect to Spotify'
            : e.includes('HTTP') || e.includes('Invalid')
              ? 'Invalid response'
              : 'Unknown error',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="grid animate-pulse grid-cols-5 gap-1.5">
        <span className="sr-only" aria-live="polite" role="status">
          Loading...
        </span>
        {Array.from({ length: 25 }).map((_, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="aspect-square h-full w-full rounded-xs bg-neutral-900"
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
            aria-hidden="true"
            className="aspect-square h-full w-full rounded-xs bg-neutral-900/50"
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
              rel="noopener noreferrer nofollow"
              target="_blank"
            >
              <figure
                role="img"
                aria-label={`${title} \u2014 ${artist}`}
                className="group relative mx-auto aspect-square w-full rounded-xs"
              >
                <span className="sr-only">
                  {title} &mdash; {artist}
                </span>
                <Image
                  src={cover}
                  alt={`Cover of ${title} by ${artist}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 48px, (max-width: 1024px) 64px, 128px"
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
}
