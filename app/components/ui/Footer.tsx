import Link from 'next/link'
import React, { useMemo, Fragment } from 'react'

import { site } from 'app/lib/constant'

export default function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), [])

  const footerLinks = [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-of-use', label: 'Terms of Use' },
    { href: '/contact', label: 'Contact', isButton: true },
  ]

  return (
    <footer
      className="flex flex-col items-center mt-28 text-xs font-medium text-neutral-400 opacity-80"
      aria-label="Footer"
    >
      <p className="text-center">
        Copyright &copy; {currentYear} {site.author}
      </p>
      <nav
        className="mt-1 flex flex-col items-center"
        aria-label="Footer Navigation"
      >
        <p>
          {footerLinks.slice(0, 2).map((link, index) => (
            <Fragment key={link.href}>
              <Link
                href={link.href}
                className="text-neutral-300 hover:text-neutral-500 transition-colors duration-200"
                aria-label={link.label}
                tabIndex={0}
              >
                {link.label}
              </Link>
              {index < 1 && <span aria-hidden="true"> / </span>}
            </Fragment>
          ))}
        </p>
        <p className="mt-8">
          <Link
            href={footerLinks[2].href}
            className="px-2 py-1 text-neutral-300 hover:text-neutral-500 border-b border-neutral-300 hover:border-neutral-500 rounded-lg transition-all duration-200"
            aria-label={footerLinks[2].label}
            tabIndex={0}
          >
            {footerLinks[2].label}
          </Link>
        </p>
      </nav>
    </footer>
  )
}
