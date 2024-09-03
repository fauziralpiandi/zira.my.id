'use client'

import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { AiOutlineCheck, AiOutlineInfoCircle } from 'react-icons/ai'

type CookieTypes = {
  acceptedCookies?: string
}

const COOKIE_NAME = 'acceptedCookies'
const REVOKED_COOKIE_NAME = 'revokedCookies'

export const useCookieManager = () => {
  const [cookies, setCookie, removeCookie] = useCookies([COOKIE_NAME])
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
      const cookieConsent = localStorage.getItem(COOKIE_NAME)
      const cookieRevoked = localStorage.getItem(REVOKED_COOKIE_NAME)

      if (!cookieConsent && !cookieRevoked && !cookies[COOKIE_NAME]) {
        setShowBanner(true)
      } else if (cookies[COOKIE_NAME]) {
        localStorage.setItem(COOKIE_NAME, 'true')
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
            'Thank you! Cookies help enhance your experience by providing personalized contents.',
          icon: <AiOutlineCheck className="mr-2" />,
          action: acceptCookies,
        }
      : {
          title: 'Cookies Revoked',
          message:
            'Your cookie preferences have been updated. Respect your choice.',
          icon: <AiOutlineInfoCircle className="mr-2" />,
          action: revokeCookies,
        }
  }

  const acceptCookies = () => {
    setCookie(COOKIE_NAME, 'true', {
      path: '/',
      maxAge: 2592000, // 30 days
      sameSite: 'lax',
    })
    if (typeof window !== 'undefined') {
      localStorage.setItem(COOKIE_NAME, 'true')
      localStorage.removeItem(REVOKED_COOKIE_NAME)
    }
  }

  const revokeCookies = () => {
    removeCookie(COOKIE_NAME, { path: '/' })
    if (typeof window !== 'undefined') {
      localStorage.setItem(REVOKED_COOKIE_NAME, 'true')
      localStorage.removeItem(COOKIE_NAME)
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

  const readCookie = (name: keyof CookieTypes) => cookies[name] || null

  const hasAcceptedCookies = () => cookies[COOKIE_NAME] === 'true'

  const hasRevokedCookies = () =>
    localStorage.getItem(REVOKED_COOKIE_NAME) === 'true'

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
