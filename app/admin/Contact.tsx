'use client'

import React, { useState } from 'react'
import { FaSpinner } from 'react-icons/fa'

const Popup = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean
  onClose: () => void
}) => {
  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 p-8 items-center justify-center transition-all duration-500 animate-in"
      onClick={onClose}
    >
      <div className="border border-neutral-500 bg-neutral-800 rounded-lg shadow-lg p-4">
        <p className="text-center text-neutral-50">
          Thanks a ton! I’ve got your feedback locked in. I really
          appreciate your text and will hit you up soon.
        </p>
      </div>
    </div>
  )
}

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [showPopup, setShowPopup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowPopup(true)
        setFormData({
          name: '',
          email: '',
          message: '',
        })
        setTimeout(() => setShowPopup(false), 5000)
      } else {
        const errorData = await response.json()
        setErrorMessage(
          `Submission failed: ${errorData.message || 'Unknown error occurred. Please try again later.'}`,
        )
        setTimeout(() => setErrorMessage(''), 5000)
      }
    } catch (error) {
      setErrorMessage(
        'Submission failed: Unknown error occurred. Please try again later.',
      )
      setTimeout(() => setErrorMessage(''), 5000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-8 bg-neutral-900 border border-dashed border-neutral-500 shadow-lg rounded-xl">
      <h2 className="mb-4 text-2xl font-bold text-center text-neutral-100 leading-tight tracking-tight">
        Feel Free
      </h2>
      <p className="mb-6 font-medium text-center text-sm text-neutral-400 leading-snug">
        Hi there! what&rsquo;s good? I&rsquo;m all ears for your feedback!
        Slide in with your thoughts and suggestions&mdash; let&rsquo;s make
        this epic!
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
          className="p-2 text-center bg-transparent border border-neutral-500 rounded focus:outline-none focus:ring-2 focus:ring-white transition"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          required
          className="p-2 text-center bg-transparent border border-neutral-500 rounded focus:outline-none focus:ring-2 focus:ring-white transition"
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Feedback"
          required
          className="p-2 text-center bg-transparent border border-neutral-500 rounded focus:outline-none focus:ring-2 focus:ring-white transition"
        />
        <button
          type="submit"
          className={`p-4 font-medium text-neutral-200 bg-black border border-neutral-500 rounded transform transition duration-200 hover:bg-neutral-800 hover:scale-105 ${
            loading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <FaSpinner className="mr-2 h-5 w-5 animate-spin" />
              <span>Submitting...</span>
            </div>
          ) : (
            'Submit Feedback'
          )}
        </button>
      </form>

      {errorMessage && (
        <p className="mt-3 text-center text-red-500">{errorMessage}</p>
      )}

      <Popup isVisible={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  )
}

export default Contact
