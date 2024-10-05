'use client'

import { useState } from 'react'
import { FaSpinner } from 'react-icons/fa'

import { handleSubscription } from 'app/lib/forms'

const SubscriptionForm = (): React.ReactElement => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')

  const showPopup = (message: string) => {
    setPopupMessage(message)
    setTimeout(() => setPopupMessage(''), 5000)
  }

  const resetEmail = () => setEmail('')

  return (
    <div className="relative mx-auto max-w-2xl my-4 px-8">
      <h1 className="mb-3 text-2xl font-bold text-center text-neutral-100 leading-tight tracking-tight">
        Subscribe
      </h1>
      <span className="mb-6 flex items-center font-medium text-center text-sm text-neutral-400 leading-snug">
        Don&rsquo;t miss out! Sign up using the form below to be the first to
        know!
      </span>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubscription(email, setIsLoading, showPopup, resetEmail)
        }}
        className="flex flex-col space-y-3"
      >
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          required
          className="p-3 text-center bg-transparent border border-neutral-700 rounded focus:outline-none focus:ring-2 focus:ring-white transition"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="p-3 font-medium bg-black border border-neutral-700 rounded-md hover:bg-neutral-900 hover:scale-95 transition duration-200"
        >
          {isLoading ? (
            <div className="flex items-center justify-center animate-pulse">
              <FaSpinner className="mr-2 h-5 w-5 animate-spin" />
              <span>Subscribing...</span>
            </div>
          ) : (
            'Subscribe'
          )}
        </button>
      </form>

      {popupMessage && (
        <div className="relative mt-8 font-medium text-center">
          {popupMessage}
        </div>
      )}
    </div>
  )
}

export default SubscriptionForm
