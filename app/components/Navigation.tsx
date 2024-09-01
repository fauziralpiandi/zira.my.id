'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { site } from 'app/utils/constant'
import React from 'react'
import Logo from 'app/components/Logo'

export const Navbar = React.memo(() => {
  const pathname = usePathname()
  const isActive = pathname.startsWith('/posts')

  return (
    <aside className="pb-16">
      <div className="flex justify-between items-center space-x-2">
        <Link
          href="/"
          className="flex items-center"
          aria-label={site.title}
          prefetch={false}
        >
          <Logo />
        </Link>
        <Link
          href="/posts"
          className={`flex items-center font-medium nav-link transition-colors duration-300 ${
            isActive ? 'text-white text-glow' : 'text-neutral-400'
          }`}
          aria-current={isActive ? 'page' : undefined}
        >
          posts&mdash;
        </Link>
      </div>
    </aside>
  )
})

Navbar.displayName = 'Navbar'

export default Navbar
