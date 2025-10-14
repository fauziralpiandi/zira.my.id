'use client';

import { useEffect, useState } from 'react';
import { PiHeart, PiHeartFill, PiSpinner } from 'react-icons/pi';
import { cx } from '@/lib/utils';

type LikeResponse = { count: number };

export function LikeButton({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setHasLiked(document.cookie.split('; ').includes(`liked-${slug}=true`));

    const fetchCount = async () => {
      setLoading(true);

      try {
        const res = await fetch(`/api/likes?slug=${slug}`);
        const data: LikeResponse = await res.json();

        setCount(data.count);
        setError(false);
      } catch {
        setCount(null);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, [slug]);

  const addLike = async () => {
    if (hasLiked || loading) return;

    setCount((prev) => (prev !== null ? prev + 1 : 1));
    setHasLiked(true);

    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });

      const data: LikeResponse = await res.json();

      setCount(data.count);

      document.cookie = `liked-${slug}=true; path=/;`;
    } catch {
      setCount((prev) => (prev !== null ? prev - 1 : 0));
      setHasLiked(false);
    }
  };

  if (loading) {
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
      disabled={hasLiked || loading}
      className={cx(
        'border-accent/25 flex items-center rounded-lg border bg-neutral-950/50 backdrop-blur-sm backdrop-grayscale',
        hasLiked || loading ? 'cursor-not-allowed' : 'cursor-pointer',
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
