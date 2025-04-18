'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { PiHeart, PiHeartFill, PiSpinner } from 'react-icons/pi';

import { cx } from '@/lib/utils';

type Response = {
  count: number;
  error?: string;
};

export const LikeButton = React.memo(({ slug }: { slug: string }) => {
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingLike, setIsAddingLike] = useState(false);

  useEffect(() => {
    const fetchLike = async () => {
      try {
        const res = await fetch(`/api/likes?slug=${slug}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to fetch likes');
        }
        const data: Response = await res.json();
        setCount(data.count);
      } catch (error) {
        console.error(`Failed to fetch likes (${slug})`, error);
        setError(
          error instanceof Error && error.message !== 'Failed to fetch likes'
            ? error.message
            : 'Unknown error'
        );
      } finally {
        setIsLoading(false);
      }
    };

    const liked = getCookie(`liked-${slug}`);
    if (liked) {
      setHasLiked(true);
    }

    fetchLike();

    return () => {};
  }, [slug]);

  const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
  };

  const setCookie = (name: string, value: string, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
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
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to add like');
      }
      const like: Response = await res.json();
      setCookie(`liked-${slug}`, 'true', 365);
      setCount(like.count);
      setHasLiked(true);
    } catch (error) {
      console.error(`Failed to add like (${slug})`, error);
      setCount((prev) => (prev !== null ? prev - 1 : 0));
      setHasLiked(false);
      setError(
        error instanceof Error && error.message !== 'Failed to add like'
          ? error.message
          : 'Unknown error'
      );
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
        <div className="flex items-center gap-1 rounded-lg px-2 py-1.5">
          <PiHeartFill className="h-5 w-5 fill-red-500" />
          <span className="font-display translate-y-[1px] text-sm text-red-500">
            Error!
          </span>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={addLike}
      className={cx(
        'border-accent/25 flex items-center rounded-lg border bg-neutral-950/50 backdrop-blur-sm backdrop-grayscale',
        hasLiked || isLoading || isAddingLike ? 'cursor-not-allowed' : ''
      )}
      aria-label={hasLiked ? 'Liked!' : 'Like?'}
      disabled={hasLiked || isLoading || isAddingLike}
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
});

LikeButton.displayName = 'LikeButton';
