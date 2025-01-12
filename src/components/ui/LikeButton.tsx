'use client';

import { useState, useEffect } from 'react';
import { PiHeart, PiHeartFill } from 'react-icons/pi';

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

  useEffect(() => {
    const fetchLike = async () => {
      try {
        const res = await fetch(`/api/likes?slug=${slug}`);
        const data: LikeResponse = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch count');
        setCount(data.count);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
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
    if (hasLiked) {
      return;
    }

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
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="fixed bottom-8 right-8 z-10 flex items-center rounded-lg backdrop-blur backdrop-grayscale md:right-12">
        <div className="flex items-center gap-1 rounded-lg border border-amber-100/10 px-2 py-1.5">
          <PiHeart className="h-5 w-5 animate-pulse fill-amber-100" />
          <span className="translate-y-[0.5px] animate-pulse font-display text-sm text-amber-100">
            ~
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed bottom-8 right-8 z-10 flex items-center rounded-lg backdrop-blur backdrop-grayscale md:right-12">
        <div className="flex items-center gap-1 rounded-lg border border-red-500/50 px-2 py-1.5">
          <PiHeartFill className="h-5 w-5 fill-red-500" />
          <span className="translate-y-[0.5px] font-display text-sm text-red-500">
            Error
          </span>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={addLike}
      className={cx(
        'fixed bottom-8 right-8 z-10 flex items-center rounded-lg backdrop-blur backdrop-grayscale md:right-12',
        hasLiked ? 'cursor-not-allowed' : ''
      )}
      disabled={hasLiked}
    >
      <div className="flex items-center gap-1 rounded-lg border border-amber-100/10 px-2 py-1.5">
        {hasLiked ? (
          <PiHeartFill className="h-5 w-5 fill-amber-100" />
        ) : (
          <PiHeart className="h-5 w-5 fill-amber-100" />
        )}
        <span className="translate-y-[0.5px] font-display text-sm text-amber-100">
          {count !== null ? count : 0}
        </span>
      </div>
    </button>
  );
};
