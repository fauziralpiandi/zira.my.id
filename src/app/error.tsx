'use client';

import { useEffect } from 'react';

export default function Error({ error }: { error: Error }) {
  useEffect(() => {
    throw error;
  }, [error]);

  return (
    <main className="grid min-h-72 place-items-center text-center">
      <div className="flex flex-col items-center gap-1">
        <h1 className="font-display text-4xl font-bold tracking-tight">
          Oops!
        </h1>
        <p className="text-accent text-sm font-medium tracking-tight">
          Something went wrong&mdash;
        </p>
        <p className="font-display mt-3 max-w-md text-xs tracking-tight text-red-500">
          {error?.message ?? 'An unexpected error occurred'}
        </p>
      </div>
    </main>
  );
}
