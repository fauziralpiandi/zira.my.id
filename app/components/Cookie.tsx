'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import {
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineInfoCircle,
} from 'react-icons/ai'
import { useCookies } from 'react-cookie'

const CookieBanner = ({
  onAccept,
  onRevoke,
  isVisible,
}: {
  onAccept: () => void
  onRevoke: () => void
  isVisible: boolean
}) => (
  <div
    role="dialog"
    aria-label="Cookie Consent Banner"
    className={clsx(
      'banner fixed bottom-4 left-1/2 transform -translate-x-1/2 p-6 w-11/12 max-w-xl text-neutral-50 border border-gray-500 rounded-lg shadow-lg backdrop-filter backdrop-blur-md transition-all duration-500',
      {
        'translate-y-0 opacity-100': isVisible,
        'translate-y-full opacity-0 banner-hide': !isVisible,
      },
    )}
    style={{ animation: 'fadeIn 0.5s ease-in-out' }}
  >
    <div className="flex flex-col items-center">
      <p className="text-sm font-medium text-center">
        I use cookies to enhance your browsing experience. By continuing to
        explore this site, you consent to our use of cookies.
      </p>
      <p className="mt-2 text-sm cursor-pointer text-neutral-300 transition-colors duration-200">
        <Link href="/privacy">Learn more</Link>
      </p>
      <div className="mt-4 flex w-full justify-around">
        <button
          onClick={onAccept}
          className="flex items-center px-4 py-2 bg-neutral-50 border border-neutral-500 text-neutral-900 rounded-full hover:bg-neutral-400 transition-colors duration-200"
          tabIndex={0}
        >
          <AiOutlineCheck className="mr-2" /> Accept
        </button>
        <button
          onClick={onRevoke}
          className="flex items-center px-4 py-2 border border-neutral-500 text-white rounded-full hover:bg-neutral-700 transition-colors duration-200"
          tabIndex={0}
        >
          <AiOutlineClose className="mr-2" /> Revoke
        </button>
      </div>
    </div>
  </div>
)

const Message = ({
  icon,
  title,
  message,
  isVisible,
}: {
  icon: React.ReactElement
  title: string
  message: string
  isVisible: boolean
}) => (
  <div
    role="alert"
    className={clsx(
      'banner fixed bottom-4 left-1/2 transform -translate-x-1/2 p-6 w-11/12 max-w-xl text-neutral-50 border border-gray-500 rounded-lg shadow-lg backdrop-filter backdrop-blur-md transition-all duration-500',
      {
        'translate-y-0 opacity-100': isVisible,
        'translate-y-full opacity-0': !isVisible,
      },
    )}
    style={{ animation: 'fadeIn 0.5s ease-in-out' }}
  >
    <div className="flex flex-col items-center">
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="flex items-center text-lg font-semibold text-center mb-1">
        {title}
      </h3>
      <p className="text-sm text-neutral-300 font-medium text-center">
        {message}
      </p>
    </div>
  </div>
)

const CookieManager = () => {
  const [cookies, setCookie, removeCookie] = useCookies([
    'acceptedCookies',
  ])
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

  return (
    <div>
      {showBanner && (
        <CookieBanner
          onAccept={() => handleCookies(true)}
          onRevoke={() => handleCookies(false)}
          isVisible={bannerVisible}
        />
      )}

      {showMessage && (
        <Message
          icon={messageData.icon}
          title={messageData.title}
          message={messageData.message}
          isVisible={messageVisible}
        />
      )}
    </div>
  )
}

export default CookieManager
