'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'
import { useCookieManager } from './Consent'

const CookieManager = () => {
  const {
    showBanner,
    bannerVisible,
    showMessage,
    messageVisible,
    messageData,
    handleCookies,
  } = useCookieManager()

  return (
    <div>
      {showBanner && (
        <div
          role="dialog"
          aria-label="Cookie Consent Banner"
          className={clsx(
            'banner fixed bottom-4 left-1/2 transform -translate-x-1/2 p-6 w-11/12 max-w-xl text-neutral-50 border border-gray-500 rounded-lg shadow-lg backdrop-filter backdrop-blur-md transition-all duration-500',
            {
              'translate-y-0 opacity-100': bannerVisible,
              'translate-y-full opacity-0 banner-hide': !bannerVisible,
            },
          )}
          style={{ animation: 'fadeIn 0.5s ease-in-out' }}
        >
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium text-center">
              I use cookies to enhance your browsing experience. By
              continuing to explore this site, you consent to our use of
              cookies.
            </p>
            <p className="mt-2 text-sm cursor-pointer text-neutral-300 transition-colors duration-200">
              <Link
                href="/privacy"
                title="Learn more about my privacy policy"
              >
                Learn More About Privacy Policy
              </Link>
            </p>
            <div className="mt-4 flex w-full justify-around">
              <button
                onClick={() => handleCookies(true)}
                className="flex items-center px-4 py-2 bg-neutral-50 border border-neutral-500 text-neutral-900 rounded-full hover:bg-neutral-400 transition-colors duration-200"
                tabIndex={0}
              >
                <AiOutlineCheck className="mr-2" /> Accept
              </button>
              <button
                onClick={() => handleCookies(false)}
                className="flex items-center px-4 py-2 border border-neutral-500 text-white rounded-full hover:bg-neutral-700 transition-colors duration-200"
                tabIndex={0}
              >
                <AiOutlineClose className="mr-2" /> Revoke
              </button>
            </div>
          </div>
        </div>
      )}

      {showMessage && (
        <div
          role="alert"
          className={clsx(
            'banner fixed bottom-4 left-1/2 transform -translate-x-1/2 p-6 w-11/12 max-w-xl text-neutral-50 border border-gray-500 rounded-lg shadow-lg backdrop-filter backdrop-blur-md transition-all duration-500',
            {
              'translate-y-0 opacity-100': messageVisible,
              'translate-y-full opacity-0': !messageVisible,
            },
          )}
          style={{ animation: 'fadeIn 0.5s ease-in-out' }}
        >
          <div className="flex flex-col items-center">
            <div className="text-2xl mb-2">{messageData.icon}</div>
            <h3 className="flex items-center text-lg font-semibold text-center mb-1">
              {messageData.title}
            </h3>
            <p className="text-sm text-neutral-300 font-medium text-center">
              {messageData.message}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CookieManager
