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
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchTracks = async () => {
      setLoading(true);

      try {
        const data = await saveCache<Track[]>(
          'top_tracks',
          24 * 60 * 60 * 1e3, // daily
          async () => {
            const res = await fetch('/api/spotify/top-tracks', {
              signal: controller.signal,
            });

            if (!res.ok) {
              throw new Error(`HTTP ${res.status}`);
            }

            return res.json();
          },
        );

        setTracks(Array.isArray(data) ? data : []);
        setError(false);
      } catch {
        setTracks([]);
        setError(true);
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
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
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
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            aria-hidden="true"
            className="aspect-square h-full w-full rounded-xs bg-neutral-900/50"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-1.5">
      {Array.from({ length: 25 }).map((_, i) => {
        if (i < tracks.length) {
          const { title, artist, cover, url } = tracks[i];

          return (
            <a
              key={i}
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
                  quality={100}
                  fill
                  sizes="(max-width: 640px) 33vw"
                  className="animate relative z-10 rounded-xs bg-neutral-900 object-cover grayscale group-hover:grayscale-0"
                />
              </figure>
            </a>
          );
        } else {
          return (
            <div
              key={i}
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
