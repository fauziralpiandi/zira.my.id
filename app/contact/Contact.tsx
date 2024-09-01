'use client'

import React, { useState, useCallback } from 'react'
import { FaSpinner } from 'react-icons/fa'

const Popup = ({
  isVisible,
  name,
  email,
  onClose,
}: {
  isVisible: boolean
  name: string
  email: string
  onClose: () => void
}) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300">
      <div className="p-6 bg-neutral-800 text-neutral-200 rounded-lg shadow-lg animate-popup">
        <h3 className="text-lg font-semibold text-center">
          Feedback Submitted!
        </h3>
        <p className="text-center">
          Thank you, <strong className="text-glow">{name}</strong>! Your
          feedback has been successfully submitted. We appreciate your
          insights and will get back to you shortly at{' '}
          <strong className="text-glow">{email}</strong>.
        </p>
        <button
          className="mt-4 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded"
          onClick={onClose}
        >
          Close
        </button>
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

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }))
    },
    [],
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)

      try {
        const response = await fetch('/api/admin', {
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
          setTimeout(() => {
            setShowPopup(false)
          }, 5000)
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
    },
    [formData],
  )

  return (
    <div className="mx-auto max-w-xl p-8 bg-neutral-900 border border-dashed border-neutral-500 shadow-lg rounded-xl animate-in">
      <h2 className="mb-4 text-3xl font-bold text-center text-neutral-100 leading-tight tracking-tight animate-fade-in">
        Feedback
      </h2>
      <p className="mb-6 text-center text-neutral-300 leading-snug">
        We value your feedback! Please share your thoughts and suggestions.
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
        <p className="mt-3 text-center text-red-500 animate-fade-in">
          {errorMessage}
        </p>
      )}

      <Popup
        isVisible={showPopup}
        name={formData.name}
        email={formData.email}
        onClose={() => setShowPopup(false)}
      />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes popup {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default Contact
