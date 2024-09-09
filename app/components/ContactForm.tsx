'use client'

import { useState } from 'react'
import { FaSpinner } from 'react-icons/fa'
import { handleContact } from 'app/lib/form'

const ContactForm = (): React.ReactElement => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')

  const showPopup = (message: string) => {
    setPopupMessage(message)
    setTimeout(() => setPopupMessage(''), 5000)
  }

  const resetForm = () => {
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <div className="relative mx-auto max-w-2xl p-8 bg-neutral-900 border border-dashed border-neutral-500 rounded-xl">
      <h2 className="mb-3 text-2xl font-bold text-center text-neutral-100 leading-tight tracking-tight">
        Contact
      </h2>
      <p className="mb-6 font-medium text-center text-sm text-neutral-400 leading-snug">
        I&rsquo;d love to hear from you. Fill out the form below to get in
        touch!
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleContact(
            name,
            email,
            message,
            setIsLoading,
            showPopup,
            resetForm,
          )
        }}
        className="flex flex-col space-y-3"
      >
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          required
          className="p-3 text-center bg-transparent border border-neutral-500 rounded focus:outline-none focus:ring-2 focus:ring-white transition"
        />
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          required
          className="p-3 text-center bg-transparent border border-neutral-500 rounded focus:outline-none focus:ring-2 focus:ring-white transition"
        />
        <textarea
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          required
          className="p-3 text-center bg-transparent border border-neutral-500 rounded focus:outline-none focus:ring-2 focus:ring-white transition resize-none"
          rows={5}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="p-3 font-medium bg-black border border-neutral-500 rounded-md hover:bg-neutral-800 hover:scale-95 transition duration-200"
        >
          {isLoading ? (
            <div className="flex items-center justify-center animate-pulse">
              <FaSpinner className="mr-2 h-5 w-5 animate-spin" />
              <span>Submitting...</span>
            </div>
          ) : (
            'Submit'
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

export default ContactForm
