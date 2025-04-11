'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { PiHeart, PiHeartFill, PiSpinner } from 'react-icons/pi';

import { cx } from '~/lib/utils';

type LikeResponse = {
  count: number;
  error?: string;
};

/**
 * @component
 * @param {Object} props
 * @param {string} props.slug - Unique identifier for the post.
 * @example
 * <LikeButton slug="my-post" />
 */
export const LikeButton = React.memo(({ slug }: { slug: string }) => {
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingLike, setIsAddingLike] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    /**
     * Fetch like count for the post from API.
     * Sets count or error state based on response.
     */
    const fetchLike = async () => {
      try {
        const res = await fetch(`/api/likes?slug=${slug}`, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error('Failed to fetch count');
        const data: LikeResponse = await res.json();
        setCount(data.count);
      } catch (error: unknown) {
        clearTimeout(timeoutId);
        if (error instanceof Error) {
          if (error.name === 'AbortError') return;
          console.error('Failed to fetch likes:', error.message);
          setError('Failed to load likes count. Please try again later.');
        } else {
          console.error('Unexpected error while fetching likes');
          setError('An unexpected error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Check if user has liked this post via cookie
    const likedCookie = getCookie(`liked-${slug}`);
    if (likedCookie) {
      setHasLiked(true);
    }

    fetchLike();

    return () => {
      controller.abort();
    };
  }, [slug]);

  /**
   * Get cookie value by name.
   * @param name - Cookie name (e.g., 'liked-my-post').
   * @returns Cookie value or undefined if not found.
   */
  const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
  };

  /**
   * Set cookie with name, value, and expiry.
   * @param name - Cookie name.
   * @param value - Cookie value.
   * @param days - Days until expiry.
   */
  const setCookie = (name: string, value: string, days: number) => {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
  };

  /**
   * Handle like action with optimistic UI update.
   * Posts to API and sets cookie to prevent duplicate likes.
   * Reverts UI on error.
   */
  const addLike = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

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

      clearTimeout(timeoutId);
      const data: LikeResponse = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add like');

      setCookie(`liked-${slug}`, 'true', 365);
      setCount(data.count);
      setHasLiked(true);
    } catch (error) {
      console.error('Failed to add like:', error);
      setCount((prev) => (prev !== null ? prev - 1 : 0));
      setHasLiked(false);
      setError(error instanceof Error ? error.message : 'Failed to add like');
    } finally {
      setIsAddingLike(false);
    }
  }, [hasLiked, isAddingLike, slug]);

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
