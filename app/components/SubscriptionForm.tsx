'use client'

import { useState } from 'react'
import { FaSpinner } from 'react-icons/fa'
import { handleSubscribe } from 'app/lib/forms'

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
    <div className="relative my-24 mx-auto max-w-2xl p-8 bg-neutral-900 border border-dashed border-neutral-500 rounded-xl">
      <h2 className="mb-3 text-2xl font-bold text-center text-neutral-100 leading-tight tracking-tight">
        Subscribe
      </h2>
      <p className="mb-6 font-medium text-center text-sm text-neutral-400 leading-snug">
        Don&rsquo;t miss out! Sign up using the form below to be the first to
        know!
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubscribe(email, setIsLoading, showPopup, resetEmail)
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
          className="p-3 text-center bg-transparent border border-neutral-500 rounded focus:outline-none focus:ring-2 focus:ring-white transition"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="p-3 font-medium bg-black border border-neutral-500 rounded-md hover:bg-neutral-800 hover:scale-95 transition duration-200"
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
        <div className="relative mt-8 font-medium text-center text-neutral-200">
          {popupMessage}
        </div>
      )}
    </div>
  )
}

export default SubscriptionForm
