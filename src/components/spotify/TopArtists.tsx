'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { saveCache } from '@/lib/services';

const LOG_PREFIX = '[SpotifyTopArtists]';

type Artist = {
  name: string;
  image: string;
  url: string;
};

export const SpotifyTopArtists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchArtists = async () => {
      try {
        const data = await saveCache<Artist[]>(
          'top_artists',
          7 * 24 * 60 * 60 * 1000,
          async () => {
            const res = await fetch('/api/spotify/top-artists', {
              signal: controller.signal,
              cache: 'no-store',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (!res.ok) {
              const data = await res.json().catch(() => ({}));
              throw new Error(
                data.error || `Failed to fetch top artists (${res.status})`,
              );
            }

            try {
              return await res.json();
            } catch (parseError) {
              console.error(
                `${LOG_PREFIX} Error: Failed to parse API response`,
                parseError,
              );
              throw new Error('Invalid response format');
            }
          },
        );

        if (!data || !Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }

        setArtists(data);
        setError(null);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        console.error(
          `${LOG_PREFIX} Error: Failed to fetch top artists: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        );

        setError(
          error instanceof Error
            ? error.message.includes('Failed to fetch')
              ? 'Failed to connect to Spotify'
              : error.name === 'TypeError'
                ? 'Network connection error'
                : error.message.includes('Invalid') ||
                    error.message.includes('Unexpected token')
                  ? 'Invalid response format'
                  : error.message
            : 'Unknown error occurred',
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
          Loading top artists...
        </span>
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="group relative aspect-square overflow-hidden rounded-sm"
            aria-hidden="true"
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
            className="group relative aspect-square overflow-hidden rounded-sm"
            aria-hidden="true"
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
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                <figure
                  role="img"
                  className="group relative mx-auto aspect-square w-full rounded-sm"
                  aria-label={name}
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
};
