'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { Fragment } from 'react'
import { usePathname } from 'next/navigation'
import { Popover, Transition } from '@headlessui/react'
import { RiMenu3Fill } from 'react-icons/ri'

import NavLink from 'app/components/ui/NavLink'
import Logo from 'app/components/ui/Logo'

import { FaRss } from 'react-icons/fa'

const links = [
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
  { label: 'Legal', href: '/legal' },
]

export default function Navigation() {
  const pathname = `/${usePathname().split('/')[1]}` // active paths on dynamic sub-pages

  return (
    <header className="mb-16 md:mt-6">
      <nav className="flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <NavLink href={link.href}>{link.label}</NavLink>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex h-8 w-8 items-center justify-center md:ml-0">
          <Link href="/rss">
            <FaRss size={20} />
          </Link>
        </div>

        <Popover className="relative md:hidden">
          <Popover.Button className="flex items-center justify-center">
            <RiMenu3Fill size={24} className="text-xl cursor-pointer" />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute right-0 z-10 my-2 w-40 origin-top-right overflow-auto rounded-xl bg-transparent backdrop-blur-xl p-4 shadow-lg focus:outline-none">
              <div className="grid text-center">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={clsx(
                      'rounded-md px-4 py-2',
                      pathname === link.href
                        ? 'font-medium bg-neutral-800'
                        : '',
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
      </nav>
    </header>
  )
}
