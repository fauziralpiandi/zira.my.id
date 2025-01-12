'use client';

import { useEffect } from 'react';

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid h-96 place-items-center md:h-80">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight">
          Oops!
        </h1>
        <mark className="text-sm font-medium tracking-tight text-amber-100">
          Something went wrong&mdash;
        </mark>
        <p className="mt-3 max-w-md font-display text-xs tracking-tight text-red-500">
          {error?.message || 'An unexpected error occurred. Please try again!'}
        </p>
        <button
          onClick={() => reset()}
          className="mt-4 rounded-lg border border-stone-800 bg-stone-900 px-2 py-1 text-sm font-medium tracking-tight text-amber-100"
        >
          Try again?
        </button>
      </div>
    </div>
  );
};

export default Error;
