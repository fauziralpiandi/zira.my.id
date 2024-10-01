import Link from 'next/link'
import { ReactNode } from 'react'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'

type NavLinkProps = {
  href: string
  children: ReactNode
}

export default function NavLink({ href, children }: NavLinkProps) {
  const pathname = `/${usePathname().split('/')[1]}`
  const active = pathname === href

  return (
    <Link
      className={clsx(
        'px-4 py-2 rounded-lg transition duration-200 ease-in-out',
        active ? 'bg-neutral-800 font-medium' : '',
      )}
      href={href}
    >
      {children}
    </Link>
  )
}
