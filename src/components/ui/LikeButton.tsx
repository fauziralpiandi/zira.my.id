'use client';

import { useCallback, useEffect, useState } from 'react';
import { PiHeart, PiHeartFill, PiSpinner } from 'react-icons/pi';
import { cx } from '@/lib/utils';

type LikeResponse = { count: number; error?: string };

export function LikeButton({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingLike, setIsAddingLike] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLike = async () => {
      setIsLoading(true);

      try {
        const res = await fetch(`/api/likes?slug=${slug}`);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data: LikeResponse = await res.json();

        if (typeof data.count !== 'number') {
          throw new Error('Invalid response data');
        }

        setCount(data.count);
        setError(null);
      } catch (error) {
        const e = error instanceof Error ? error.message : 'Unknown error';

        setError(e.includes('HTTP') ? 'Invalid response' : 'Unknown error');
        setCount(null);
      } finally {
        setIsLoading(false);
      }
    };

    const liked = document.cookie.includes(`liked-${slug}=true`);

    setHasLiked(liked);
    fetchLike();
  }, [slug]);

  const setCookie = (name: string, value: string, days: number) => {
    const date = new Date();

    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1e3);
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
  };

  const addLike = useCallback(async () => {
    if (hasLiked || isAddingLike) return;

    setCount((prev) => (prev !== null ? prev + 1 : 1));
    setHasLiked(true);
    setIsAddingLike(true);

    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const like: LikeResponse = await res.json();

      if (typeof like.count !== 'number') {
        throw new Error('Invalid response data');
      }

      setCookie(`liked-${slug}`, 'true', 365);
      setCount(like.count);
      setError(null);
    } catch (error) {
      const e = error instanceof Error ? error.message : 'Unknown error';

      setError(e.includes('HTTP') ? 'Invalid response' : 'Unknown error');
      setCount((prev) => (prev !== null ? prev - 1 : 0));
      setHasLiked(false);
    } finally {
      setIsAddingLike(false);
    }
  }, [slug, hasLiked, isAddingLike]);

  if (isLoading) {
    return (
      <div className="border-accent/25 flex items-center rounded-lg bg-neutral-950/50 backdrop-blur-sm backdrop-grayscale">
        <div className="flex animate-pulse items-center gap-1 rounded-lg px-2 py-1.5">
          <PiSpinner className="fill-accent h-5 w-5 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-red/50 flex items-center rounded-lg bg-neutral-950/50 backdrop-blur-sm backdrop-grayscale">
        <div className="flex items-center rounded-lg px-2 py-1.5">
          <span className="font-display text-sm text-red-500">Error!</span>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={addLike}
      aria-label={hasLiked ? 'Liked!' : 'Like?'}
      disabled={hasLiked || isLoading || isAddingLike}
      className={cx(
        'border-accent/25 flex items-center rounded-lg border bg-neutral-950/50 backdrop-blur-sm backdrop-grayscale',
        hasLiked || isLoading || isAddingLike ? 'cursor-not-allowed' : '',
      )}
    >
      <div className="flex items-center gap-1 rounded-lg px-2 py-1.5">
        {hasLiked ? (
          <PiHeartFill className="fill-accent h-5 w-5" />
        ) : (
          <PiHeart className="fill-accent h-5 w-5" />
        )}
        <span className="font-display text-accent translate-y-[1px]">
          {count !== null ? count : 0}
        </span>
      </div>
    </button>
  );
}
