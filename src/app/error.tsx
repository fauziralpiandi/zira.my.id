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
    <main className="flex flex-col items-start justify-start md:items-center md:justify-center">
      <h1 className="text-6xl font-bold mb-2 md:text-center">500</h1>
      <h2 className="text-xl font-medium leading-snug tracking-tight mb-4 md:text-center">
        Oops! Something went wrong&mdash;
      </h2>
      <p className="text-red-500" aria-live="assertive">
        {error.message ||
          'An unexpected error has occurred, please try again later.'}
      </p>
      <button
        onClick={handleReset}
        disabled={isLoading}
        className="mt-8"
        aria-label="Retry the operation"
      >
        Maybe refresh?
      </button>
    </main>
  )
}
