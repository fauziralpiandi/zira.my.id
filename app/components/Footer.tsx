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
      <nav className="mt-1 flex space-x-1" aria-label="Footer Navigation">
        <Link
          href="/privacy"
          className="hover:underline text-neutral-300"
          aria-label="Link to the Privacy Policy page"
        >
          <span className="sr-only">Link to the </span>Privacy Policy
        </Link>
        <span>/</span>
        <Link
          href="/admin"
          className="hover:underline text-neutral-300"
          aria-label="Link to the Admin Dashboard"
        >
          <span className="sr-only">Link to the </span>Admin
        </Link>
        <span>/</span>
        <Link
          href="/terms"
          className="hover:underline text-neutral-300"
          aria-label="Link to the Terms of Use page"
        >
          <span className="sr-only">Link to the </span>Terms of Use
        </Link>
      </nav>
    </footer>
  )
})

Footer.displayName = 'Footer'

export default Footer
