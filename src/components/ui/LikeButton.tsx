'use client';

import { useState, useEffect } from 'react';
import { PiHeart, PiHeartFill, PiSpinner } from 'react-icons/pi';

import { cx } from '~/lib/utils';

type LikeResponse = {
  count: number;
  error?: string;
};

export const LikeButton = ({ slug }: { slug: string }) => {
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingLike, setIsAddingLike] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchLike = async () => {
      try {
        const res = await fetch(`/api/likes?slug=${slug}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Failed to fetch count');
        const data: LikeResponse = await res.json();
        setCount(data.count);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    const likedCookie = getCookie(`liked-${slug}`);
    if (likedCookie) {
      setHasLiked(true);
    }

    fetchLike();
    return () => controller.abort();
  }, [slug]);

  const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
  };

  const setCookie = (name: string, value: string, days: number) => {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
  };

  const addLike = async () => {
    if (hasLiked || isAddingLike) return;

    setIsAddingLike(true);
    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });

      const data: LikeResponse = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add like');

      setCookie(`liked-${slug}`, 'true', 365);
      setCount(data.count);
      setHasLiked(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    } finally {
      setIsAddingLike(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center rounded-lg border-accent/25 bg-neutral-950/50 backdrop-blur backdrop-grayscale">
        <div className="flex animate-pulse items-center gap-1 rounded-lg px-2 py-1.5">
          <PiSpinner className="h-5 w-5 animate-spin fill-accent" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-red/50 flex items-center rounded-lg bg-neutral-950/50 backdrop-blur backdrop-grayscale">
        <div className="flex items-center gap-1 rounded-lg px-2 py-1.5">
          <PiHeartFill className="h-5 w-5 fill-red-500" />
          <span className="translate-y-[1px] font-display text-sm text-red-500">
            ERR
          </span>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={addLike}
      className={cx(
        'flex items-center rounded-lg border border-accent/25 bg-neutral-950/50 backdrop-blur backdrop-grayscale',
        hasLiked ? 'cursor-not-allowed' : ''
      )}
      disabled={hasLiked}
    >
      <div className="flex items-center gap-1 rounded-lg px-2 py-1.5">
        {hasLiked ? (
          <PiHeartFill className="h-5 w-5 fill-accent" />
        ) : (
          <PiHeart className="h-5 w-5 fill-accent" />
        )}
        <span className="translate-y-[1px] font-display text-accent">
          {count !== null ? count : 0}
        </span>
      </div>
    </button>
  );
};
