import Link from 'next/link'
import React, { useMemo, Fragment } from 'react'

import { site } from 'app/lib/constant'

export default function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), [])

  const footerLinks = [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/contact', label: 'Contact' },
    { href: '/terms-of-use', label: 'Terms of Use' },
  ]

  return (
    <footer
      className="flex flex-col items-center mt-28 text-xs font-medium text-neutral-400 opacity-75"
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
          {footerLinks.slice(0).map((link, index) => (
            <Fragment key={link.href}>
              <Link
                href={link.href}
                className="text-neutral-300 hover:text-neutral-500 transition-colors duration-200"
                aria-label={link.label}
                tabIndex={0}
              >
                {link.label}
              </Link>
              {index < 2 && <span aria-hidden="true"> / </span>}
            </Fragment>
          ))}
        </p>
      </nav>
    </footer>
  )
}
