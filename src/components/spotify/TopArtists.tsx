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
    const fetchArtists = async () => {
      try {
        const data = await saveCache<Artist[]>(
          'topArtists',
          604800000,
          async () => {
            const response = await fetch('/api/spotify/top-artists');
            if (!response.ok) throw new Error('Failed to fetch top artists');
            return response.json();
          }
        );
        setArtists(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  if (loading) {
    return (
      <div className="grid animate-pulse grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="group relative aspect-square overflow-hidden rounded"
          >
            <div className="h-full w-full bg-stone-900" />
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
            className="group relative aspect-square overflow-hidden rounded"
          >
            <div className="h-full w-full bg-amber-200/5" />
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
                <figure className="group relative aspect-square rounded">
                  <div className="animate absolute inset-0 rounded bg-amber-100 opacity-0 blur-xl group-hover:opacity-100" />
                  <Image
                    src={image}
                    alt={name}
                    fill
                    className="animate relative z-10 rounded bg-stone-900 object-cover grayscale group-hover:grayscale-0"
                  />
                </figure>
              </a>
            </div>
          );
        } else {
          return (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded"
            >
              <div className="h-full w-full bg-amber-200/5" />
            </div>
          );
        }
      })}
    </div>
  );
};
