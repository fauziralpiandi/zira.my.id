'use client'

import { useCookies } from 'react-cookie'
import { useEffect, useState } from 'react'

interface CookieProps {
  acceptedCookies?: string
}

const COOKIE_NAME = 'acceptedCookies'
const REVOKED_COOKIE_NAME = 'revokedCookies'

export const useCookieManager = () => {
  const [cookies, setCookie, removeCookie] = useCookies([COOKIE_NAME])
  const [showBanner, setShowBanner] = useState(false)
  const [bannerVisible, setBannerVisible] = useState(true)

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
    try {
      isAccepted ? acceptCookies() : revokeCookies()
      hideBanner()
    } catch (error) {
      console.error('Error handling cookies:', error)
      hideBanner()
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

  const hideBanner = () => {
    setBannerVisible(false)
    setTimeout(() => {
      setShowBanner(false)
    }, 300)
  }

  const readCookie = (name: keyof CookieProps) => cookies[name] || null

  const hasAcceptedCookies = () => cookies[COOKIE_NAME] === 'true'

  const hasRevokedCookies = () =>
    localStorage.getItem(REVOKED_COOKIE_NAME) === 'true'

  return {
    showBanner,
    bannerVisible,
    handleCookies,
    readCookie,
    hasAcceptedCookies,
    hasRevokedCookies,
  }
}
