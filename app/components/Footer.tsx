import React, { useMemo } from 'react'
import Link from 'next/link'
import { site } from 'app/utils/constant'

const Footer: React.FC = React.memo(() => {
  const currentYear = useMemo(() => new Date().getFullYear(), [])

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
          Read My{' '}
          <Link
            href="/privacy"
            className="hover:underline text-neutral-300"
            aria-label="Privacy Policy"
          >
            Privacy Policy
          </Link>
          <span aria-hidden="true"> &amp; </span>
          <Link
            href="/terms"
            className="hover:underline text-neutral-300"
            aria-label="Terms of Use"
          >
            Terms of Use
          </Link>
        </p>
        <p className="mt-8">
          <Link
            href="/admin"
            className="px-2 py-1 text-neutral-300 hover:text-neutral-500 border-b border-neutral-300 hover:border-neutral-500 rounded-lg transition-all duration-200"
            aria-label="Contact"
          >
            Contact
          </Link>
        </p>
      </nav>
    </footer>
  )
})

Footer.displayName = 'Footer'

export default Footer
