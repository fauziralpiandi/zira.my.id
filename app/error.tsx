'use client'

import { useEffect, useState } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    console.error('Error details:', error)
  }, [error])

  const handleReset = () => {
    setIsLoading(true)
    reset()
  }

  return (
    <main className="flex flex-col items-start justify-start md:items-center md:justify-center md:p-8">
      <h1 className="text-6xl font-bold mb-2 md:text-center">500</h1>
      <h2 className="text-xl font-medium leading-snug tracking-tight mb-6 md:text-center">
        Something went wrong&mdash;
      </h2>
      <p className="text-red-500 animate-pulse" aria-live="assertive">
        {error.message ||
          'An unexpected error has occurred, please try again later.'}
      </p>
      <button
        onClick={handleReset}
        disabled={isLoading}
        className="mt-4 px-4 py-2 rounded-md border border-neutral-500 text-neutral-300 bg-transparent hover:bg-neutral-800 transition-all duration-300"
        aria-label="Retry the operation"
      >
        Maybe refresh?
      </button>
    </main>
  )
}
