'use client'

import { useEffect, useState } from 'react'
import { IoIosWarning } from 'react-icons/io'

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
    <div className="flex flex-col md:items-center md:p-4">
      <IoIosWarning size={50} className="mb-4 text-red-500" />
      <h1 className="mb-2 font-semibold text-2xl">Something went wrong</h1>
      <p className="text-red-500 opacity-75" aria-live="assertive">
        {error.message ||
          'An unexpected error has occurred, please try refreshing the page!'}
      </p>
      <button
        onClick={handleReset}
        className="mt-4 px-4 py-2 rounded-md border border-neutral-500 text-neutral-300 bg-transparent hover:bg-neutral-800 transition-all duration-300"
        disabled={isLoading}
        aria-label="Retry the operation"
      >
        {isLoading ? (
          <span className="loading-animation">Retrying...</span>
        ) : (
          'Try Again'
        )}
      </button>
      <style jsx global>
        {`
          .loading-animation {
            animation: fadeIn 0.5s;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  )
}
