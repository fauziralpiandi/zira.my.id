'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'
import { useCookieManager } from './CookieConsent'

const bannerBaseClasses =
  'banner fixed bottom-4 left-1/2 transform -translate-x-1/2 p-6 w-11/12 max-w-xl text-neutral-50 bg-black bg-opacity-50 border border-gray-500 rounded-lg shadow-lg backdrop-filter backdrop-blur-md transition-all duration-500'
const buttonBaseClasses =
  'flex items-center px-4 py-2 font-medium text-sm rounded-full transition-colors duration-200'
const buttonAcceptClasses =
  'bg-neutral-100 border border-neutral-500 text-neutral-900 hover:bg-neutral-400'
const buttonRevokeClasses =
  'border border-neutral-500 text-white hover:bg-neutral-700'

export default function CookieManager() {
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
          className={clsx(bannerBaseClasses, {
            'translate-y-0 opacity-100': bannerVisible,
            'translate-y-full opacity-0 banner-hide': !bannerVisible,
          })}
          style={{ animation: 'fadeIn 0.5s ease-in-out' }}
        >
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium text-center text-neutral-300">
              This website uses cookies to enhance your browsing experience and
              analyze site usage. Read my{' '}
              <Link
                href="/privacy-policy"
                title="Learn more about privacy policy"
                className="text-neutral-50 hover:text-neutral-300 transition-colors duration-200"
              >
                Privacy Policy
              </Link>{' '}
              for more information.
            </p>
            <div className="mt-6 flex w-full justify-around">
              <button
                onClick={() => handleCookies(true)}
                className={clsx(buttonBaseClasses, buttonAcceptClasses)}
                tabIndex={0}
              >
                <AiOutlineCheck className="mr-2" /> Accept
              </button>
              <button
                onClick={() => handleCookies(false)}
                className={clsx(buttonBaseClasses, buttonRevokeClasses)}
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
          className={clsx(bannerBaseClasses, {
            'translate-y-0 opacity-100': messageVisible,
            'translate-y-full opacity-0': !messageVisible,
          })}
          style={{ animation: 'fadeIn 0.5s ease-in-out' }}
        >
          <div className="flex flex-col items-center">
            <div className="text-xl mb-2">{messageData.icon}</div>
            <h3 className="flex items-center font-semibold text-center text-neutral-50 mb-1">
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
