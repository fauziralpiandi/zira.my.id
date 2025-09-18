'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { saveCache } from './cache';

type Artist = {
  name: string;
  image: string;
  url: string;
};

export function TopArtists() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchArtists = async () => {
      try {
        const data = await saveCache<Artist[]>(
          'top_artists',
          7 * 24 * 60 * 60 * 1e3,

          async () => {
            const res = await fetch('/api/spotify/top-artists', {
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

        setArtists(data);
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

    fetchArtists();

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="grid animate-pulse grid-cols-3 gap-3">
        <span className="sr-only" aria-live="polite" role="status">
          Loading...
        </span>
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="group relative aspect-square overflow-hidden rounded-sm"
          >
            <div className="h-full w-full bg-neutral-900" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-3 gap-3">
        <span className="sr-only" role="alert">
          Error: {error}
        </span>
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="group relative aspect-square overflow-hidden rounded-sm"
          >
            <div className="h-full w-full bg-neutral-900/50" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {Array.from({ length: 9 }).map((_, index) => {
        if (index < artists.length) {
          const { name, image, url } = artists[index];

          return (
            <div key={index}>
              <a
                href={url}
                title={`Follow ${name} on Spotify`}
                aria-label={`Follow ${name} on Spotify`}
                rel="noopener noreferrer nofollow"
                target="_blank"
              >
                <figure
                  role="img"
                  aria-label={`${name}’s profile picture`}
                  className="group relative mx-auto aspect-square w-full rounded-sm"
                >
                  <span className="sr-only">{name}</span>
                  <Image
                    src={image}
                    alt={`${name}’s profile picture`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 256px"
                    className="animate relative z-10 rounded-sm bg-neutral-900 object-cover grayscale group-hover:grayscale-0"
                  />
                </figure>
              </a>
            </div>
          );
        } else {
          return (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-sm"
            >
              <div className="h-full w-full bg-neutral-900" />
            </div>
          );
        }
      })}
    </div>
  );
}
