'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { saveCache } from '~/lib/services';

type Artist = {
  name: string;
  image: string;
  url: string;
};

export const SpotifyTopArtists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchArtists = async () => {
      try {
        const data = await saveCache<Artist[]>(
          'artists',
          7 * 24 * 60 * 60 * 1000,
          async () => {
            const response = await fetch('/api/spotify/top-artists', {
              signal,
            });
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to fetch top artists');
            }
            return response.json();
          }
        );
        setArtists(data);
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

    fetchArtists();

    return () => {
      controller.abort();
    };
  }, []);

  if (loading) {
    return (
      <div className="grid animate-pulse grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
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
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="group relative aspect-square overflow-hidden rounded-sm"
          >
            <div className="h-full w-full bg-neutral-900" />
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
                <figure className="group relative aspect-square rounded-sm">
                  <span className="sr-only">{name}</span>
                  <Image
                    src={image}
                    alt={`${name}\u2019s picture`}
                    fill
                    loading="lazy"
                    sizes="96px"
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
