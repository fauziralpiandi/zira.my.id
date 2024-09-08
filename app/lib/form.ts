export const handleContact = async (
  name: string,
  email: string,
  message: string,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  showPopup: (message: string) => void,
  resetForm: () => void,
) => {
  if (!name || !email || !message) return

  setIsLoading(true)

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    })

    if (!response.ok) {
      const errorResponse = await response.json()
      throw new Error(errorResponse.message || 'Failed to submit')
    }

    showPopup('Thanks! Submitted successfully!')
    resetForm()
  } catch (error) {
    showPopup((error as Error).message || 'Something went wrong')
  } finally {
    setIsLoading(false)
  }
}

export const handleSubscribe = async (
  email: string,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  showPopup: (message: string) => void,
  resetEmail: () => void,
) => {
  if (!email) return

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
      throw new Error(errorResponse.message || 'Failed to subscribe')
    }

    showPopup('Thanks! Subscription successful!')
    resetEmail()
  } catch (error) {
    showPopup((error as Error).message || 'Something went wrong')
  } finally {
    setIsLoading(false)
  }
}
