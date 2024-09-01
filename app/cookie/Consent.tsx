'use client'

import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { AiOutlineCheck, AiOutlineInfoCircle } from 'react-icons/ai'

type CookieTypes = {
  acceptedCookies?: string
}

export const useCookieManager = () => {
  const [cookies, setCookie, removeCookie] = useCookies([
    'acceptedCookies',
  ] as const)
  const [showBanner, setShowBanner] = useState(false)
  const [bannerVisible, setBannerVisible] = useState(true)
  const [showMessage, setShowMessage] = useState(false)
  const [messageVisible, setMessageVisible] = useState(true)
  const [messageData, setMessageData] = useState({
    icon: <AiOutlineCheck className="mr-2" />,
    title: '',
    message: '',
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cookieConsent = localStorage.getItem('acceptedCookies')
      const cookieRevoked = localStorage.getItem('revokedCookies')

      if (!cookieConsent && !cookieRevoked && !cookies.acceptedCookies) {
        setShowBanner(true)
      } else if (cookies.acceptedCookies) {
        localStorage.setItem('acceptedCookies', 'true')
      } else if (cookieRevoked) {
        setShowBanner(false)
      }
    }
  }, [cookies])

  const handleCookies = (isAccepted: boolean) => {
    const { title, message, icon, action } = getMessageContent(isAccepted)

    try {
      action()
      hideBanner(title, message, icon)
    } catch (error) {
      console.error('Error handling cookies:', error)
      hideBanner(
        'Error',
        'There was an issue updating your cookie preferences. Please try again.',
        <AiOutlineInfoCircle className="mr-2" />,
      )
    }
  }

  const getMessageContent = (isAccepted: boolean) => {
    return isAccepted
      ? {
          title: 'Cookies Accepted',
          message:
            'Thank you! Cookies help enhance your experience by providing personalized content and ads.',
          icon: <AiOutlineCheck className="mr-2" />,
          action: () => acceptCookies(),
        }
      : {
          title: 'Cookies Revoked',
          message:
            'Your cookie preferences have been updated. We respect your choice.',
          icon: <AiOutlineInfoCircle className="mr-2" />,
          action: () => revokeCookies(),
        }
  }

  const acceptCookies = () => {
    setCookie('acceptedCookies', 'true', {
      path: '/',
      maxAge: 2592000,
      sameSite: 'lax',
    })
    if (typeof window !== 'undefined') {
      localStorage.setItem('acceptedCookies', 'true')
      localStorage.removeItem('revokedCookies')
    }
  }

  const revokeCookies = () => {
    removeCookie('acceptedCookies', { path: '/' })
    if (typeof window !== 'undefined') {
      localStorage.setItem('revokedCookies', 'true')
      localStorage.removeItem('acceptedCookies')
    }
  }

  const hideBanner = (
    title: string,
    message: string,
    icon: React.ReactElement,
  ) => {
    setBannerVisible(false)
    setTimeout(() => {
      setShowBanner(false)
      setMessageData({ title, message, icon })
      setShowMessage(true)
      setMessageVisible(true)
    }, 300)

    setTimeout(() => setMessageVisible(false), 4500)
    setTimeout(() => setShowMessage(false), 5000)
  }

  const readCookie = (name: keyof CookieTypes) => {
    return cookies[name] || null
  }

  const hasAcceptedCookies = () => {
    return cookies.acceptedCookies === 'true'
  }

  const hasRevokedCookies = () => {
    return localStorage.getItem('revokedCookies') === 'true'
  }

  return {
    showBanner,
    bannerVisible,
    showMessage,
    messageVisible,
    messageData,
    handleCookies,
    readCookie,
    hasAcceptedCookies,
    hasRevokedCookies,
  }
}
