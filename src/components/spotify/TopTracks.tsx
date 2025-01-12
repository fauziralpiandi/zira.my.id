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
    const fetchTracks = async () => {
      try {
        const data = await saveCache<Track[]>(
          'topTracks',
          86400000,
          async () => {
            const response = await fetch('/api/spotify/top-tracks');
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to fetch top tracks');
            }
            return response.json();
          }
        );
        setTracks(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  if (loading) {
    return (
      <div className="grid animate-pulse grid-cols-5 gap-1.5">
        {Array.from({ length: 25 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square h-full w-full rounded-sm bg-stone-900"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-5 gap-1.5">
        {Array.from({ length: 25 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square h-full w-full rounded-sm bg-amber-200/5"
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
              <figure className="group relative aspect-square overflow-hidden rounded-sm">
                <Image
                  src={cover}
                  alt={`${title} \u2014 ${artist}`}
                  fill
                  className="animate bg-stone-900 object-cover grayscale group-hover:grayscale-0"
                  sizes="(max-width: 768px) 100px, (max-width: 1200px) 150px, 200px"
                />
              </figure>
            </a>
          );
        } else {
          return (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-sm"
            >
              <div className="h-full w-full bg-amber-200/5" />
            </div>
          );
        }
      })}
    </div>
  );
};
