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
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchArtists = async () => {
      setLoading(true);

      try {
        const data = await saveCache<Artist[]>(
          'top_artists',
          7 * 24 * 60 * 60 * 1e3, // weekly
          async () => {
            const res = await fetch('/api/spotify/top-artists', {
              signal: controller.signal,
            });

            if (!res.ok) {
              throw new Error(`HTTP ${res.status}`);
            }

            return res.json();
          },
        );

        setArtists(Array.isArray(data) ? data : []);
        setError(false);
      } catch {
        setArtists([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="grid animate-pulse grid-cols-3 gap-3"
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
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
      <div role="alert" className="grid grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
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
      {Array.from({ length: 9 }).map((_, i) => {
        if (i < artists.length) {
          const { name, image, url } = artists[i];

          return (
            <div key={i}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                title={`Follow ${name} on Spotify`}
                aria-label={`Follow ${name} on Spotify`}
              >
                <figure
                  role="img"
                  aria-label={`${name}\u2019s profile picture`}
                  className="group relative mx-auto aspect-square w-full rounded-sm"
                >
                  <span className="sr-only">{name}</span>
                  <Image
                    src={image}
                    alt={`${name}\u2019s profile picture`}
                    fill
                    quality={100}
                    sizes="(max-width: 640px) 20vw"
                    className="animate relative z-10 rounded-sm bg-neutral-900 object-cover grayscale group-hover:grayscale-0"
                  />
                </figure>
              </a>
            </div>
          );
        } else {
          return (
            <div
              key={i}
              aria-hidden="true"
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
