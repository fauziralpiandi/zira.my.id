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
    // Log the error details for debugging—because ignoring problems never helps!
    console.error('Error details:', error)
  }, [error])

  const handleReset = () => {
    setIsLoading(true) // Set loading state to true when retrying—like bracing for impact!
    reset() // Trigger the reset function to try again
  }

  return (
    <div className="flex flex-col md:items-center md:p-4">
      {/* Warning icon to indicate something went awry—like when you forget your coffee! */}
      <IoIosWarning size={50} className="mb-4 text-red-500" />
      <h1 className="mb-2 font-semibold text-2xl">
        Something went wrong–{' '}
        {/* A friendly reminder that tech can be moody! */}
      </h1>
      <p
        className="text-red-500 opacity-75"
        aria-live="assertive" // Announce error message changes for screen readers
      >
        {error.message || // Display the specific error message if available
          'An unexpected error has occurred, please try refreshing the page!'}{' '}
        {/* Classic fallback message */}
      </p>
      <button
        onClick={handleReset}
        className="mt-4 px-4 py-2 rounded-md border border-neutral-500 text-neutral-300 bg-transparent hover:bg-neutral-800 transition-all duration-300"
        disabled={isLoading} // Disable button to prevent double-clicks—no one likes impatient users!
        aria-label="Retry the operation" // Better accessibility for screen readers
      >
        {isLoading ? (
          <span className="loading-animation">Retrying...</span> // Show loading state with animation
        ) : (
          'Try Again' // Button text when not loading—because who doesn't love a second chance?
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
