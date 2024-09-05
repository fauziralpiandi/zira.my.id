'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { site } from 'app/lib/constant'
import React, { useMemo } from 'react'
import Logo from 'app/components/Logo'

const Nav = React.memo(() => {
  const pathname = usePathname()

  const isActiveHome = useMemo(() => pathname === '/', [pathname])
  const isActivePosts = useMemo(() => pathname.startsWith('/posts'), [pathname])

  return (
    <aside className="pb-16">
      <div className="flex justify-between items-center space-x-2">
        <Link
          href="/"
          className={`flex items-center ${
            isActiveHome ? 'text-white text-glow' : 'text-neutral-400'
          }`}
          aria-label={site.title}
          prefetch={false}
        >
          <Logo />
        </Link>
        <nav className="flex space-x-4">
          <Link
            href="/posts"
            className={`flex items-center font-medium nav-link transition-colors duration-300 ${
              isActivePosts ? 'text-white text-glow' : 'text-neutral-400'
            }`}
            aria-current={isActivePosts ? 'page' : undefined}
            tabIndex={0}
          >
            posts&mdash;
          </Link>
        </nav>
      </div>
    </aside>
  )
})

Nav.displayName = 'Nav'

export default Nav
