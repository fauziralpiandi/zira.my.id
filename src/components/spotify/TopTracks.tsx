'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { saveCache } from '@/lib/services';

const LOG_PREFIX = '[SpotifyTopTracks]';

type Track = {
  title: string;
  artist: string;
  cover: string;
  url: string;
};

export const SpotifyTopTracks = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchTracks = async () => {
      try {
        const data = await saveCache<Track[]>(
          'top_tracks',
          24 * 60 * 60 * 1000,
          async () => {
            const res = await fetch('/api/spotify/top-tracks', {
              signal: controller.signal,
              cache: 'no-store',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (!res.ok) {
              const data = await res.json().catch(() => ({}));
              throw new Error(
                data.error || `Failed to fetch top tracks (${res.status})`,
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

        setTracks(data);
        setError(null);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        console.error(
          `${LOG_PREFIX} Error: Failed to fetch top tracks: ${
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

    fetchTracks();
    return () => controller.abort();
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
            className="aspect-square h-full w-full rounded-xs bg-neutral-900/50"
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
                className="group relative mx-auto aspect-square w-full rounded-xs"
                aria-label={`${title} \u2014 ${artist}`}
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
};
