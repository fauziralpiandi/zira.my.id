'use client'

import { useState } from 'react'
import { ImSpinner } from 'react-icons/im'

const SubscriptionForm = (): React.ReactElement => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')

  const showPopup = (message: string) => {
    setPopupMessage(message)
    setTimeout(() => setPopupMessage(''), 3000)
  }

  const handleSubscribe = async () => {
    if (!email) {
      return showPopup('Please enter your email address.')
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const errorResponse = await response.json()
        throw new Error(errorResponse.message || 'Failed to subscribe.')
      }

      showPopup('Subscribed successfully!')
      setEmail('')
    } catch (error) {
      showPopup((error as Error).message || 'Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex flex-col justify-center items-center w-full my-16">
      <div className="flex gap-1 text-sm">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Type your email for updates"
          className="p-2 bg-transparent text-neutral-300 border border-neutral-500 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-neutral-400"
        />
        <button
          onClick={handleSubscribe}
          disabled={isLoading}
          className={`px-4 py-2 font-medium border border-neutral-500 rounded-r-lg hover:scale-95 transform transition duration-200 
            ${isLoading ? 'bg-neutral-600 text-neutral-400 cursor-not-allowed' : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'}`}
        >
          {isLoading ? (
            <ImSpinner className="animate-spin text-neutral-400" />
          ) : (
            'Subscribe'
          )}
        </button>
      </div>

      {popupMessage && (
        <div className="absolute top-0 mt-20 font-medium text-center text-neutral-200 animate-in">
          {popupMessage}
        </div>
      )}
    </div>
  )
}

export default SubscriptionForm
