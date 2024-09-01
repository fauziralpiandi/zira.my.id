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
        <Link href="/privacy" className="hover:underline text-neutral-300">
          Privacy Policy
        </Link>
        <span>/</span>
        <Link href="/admin" className="hover:underline text-neutral-300">
          Admin
        </Link>
        <span>/</span>
        <Link href="/terms" className="hover:underline text-neutral-300">
          Terms of Use
        </Link>
      </nav>
    </footer>
  )
})

Footer.displayName = 'Footer'

export default Footer
