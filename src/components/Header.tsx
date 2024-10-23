'use client'

import { Link } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import { BsStars } from 'react-icons/bs'

import { FavIcon } from '~/Signature'

function Nav() {
  const pathname = usePathname()
  const isActive = pathname === '/blog'

  return (
    <div className="flex items-center">
      <Link
        href="/blog"
        className={`text-mono-50 hover:no-underline ${
          isActive ? 'animate-pulse' : ''
        }`}
        aria-label="Go to Blog"
      >
        <BsStars className="text-2xl" />
      </Link>
    </div>
  )
}

export default function Header() {
  const pathname = usePathname()
  const isHomeActive = pathname === '/'

  return (
    <header className="mb-8 animate-fade">
      <nav className="flex items-center justify-between gap-4">
        <div className="flex items-center">
          <Link
            href="/"
            className={`font-semibold text-3xl text-mono-50 hover:no-underline ${
              isHomeActive ? 'animate-pulse' : ''
            }`}
            aria-label="Home"
          >
            <FavIcon />
          </Link>
        </div>
        <Nav />
      </nav>
    </header>
  )
}
