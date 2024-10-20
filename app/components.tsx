'use client'

import { Link } from 'next-view-transitions'
import { useState, useEffect, useCallback } from 'react'
import { FiMoon, FiSun, FiInstagram } from 'react-icons/fi'
import { MdFormatQuote } from 'react-icons/md'

import { my } from '~/head'

export function Name() {
  return (
    <Link
      href="/"
      className="flex items-center mb-8 font-medium text-mono-500 bg-transparent hover:no-underline fade-in"
    >
      &mdash; {my.tagLine}
      <MdFormatQuote className="hidden inline-flex ml-1 text-lg" />
    </Link>
  )
}

export function FlipName() {
  return (
    <h1 className="mb-8">
      <span className="sr-only">{my.fullName}</span>
      <span aria-hidden="true" className="block overflow-hidden group relative">
        <span className="inline-block transition-all duration-300 ease-in-out group-hover:-translate-y-full">
          {my.fullName.split('').map((letter, index) => (
            <span
              key={index}
              className="inline-block"
              style={{ transitionDelay: `${index * 15}ms` }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </span>
        <span className="inline-block absolute left-0 top-0 transition-all duration-300 ease-in-out translate-y-full group-hover:translate-y-0">
          {my.greetings.split('').map((letter, index) => (
            <span
              key={index}
              className="inline-block"
              style={{ transitionDelay: `${index * 15}ms` }}
            >
              {letter}
            </span>
          ))}
        </span>
      </span>
    </h1>
  )
}

export function Footer() {
  const links: { name: string; url: string; icon: React.ReactNode }[] = [
    {
      name: 'Instagram',
      url: 'https://instagram.com/fauziralpiandi',
      icon: <FiInstagram />,
    },
  ]

  return (
    <footer
      className="flex-shrink-0 flex justify-between items-center mt-24"
      aria-label="Footer"
    >
      <div className="font-medium text-sm text-mono-800 dark:text-mono-200 tracking-tight ease">
        &copy; 2022 &mdash; {new Date().getFullYear()} {my.fullName}
      </div>

      <div className="flex items-center space-x-3">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${link.name}`}
            className="flex items-center bg-transparent text-lg"
          >
            {link.icon}
          </a>
        ))}
        <Scheme />
      </div>
    </footer>
  )
}

export function Scheme() {
  const [scheme, setScheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const savedScheme = localStorage.getItem('scheme') as 'light' | 'dark'
    const initialScheme = savedScheme || 'dark'
    document.documentElement.classList.add(initialScheme)
    setScheme(initialScheme)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', scheme === 'dark')
    localStorage.setItem('scheme', scheme)
  }, [scheme])

  const colorScheme = useCallback(() => {
    setScheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  return (
    <button
      onClick={colorScheme}
      aria-label="Toggle Color Scheme"
      aria-pressed={scheme === 'dark'}
      className="flex items-center justify-center"
    >
      {scheme === 'light' ? (
        <FiMoon className="text-lg" />
      ) : (
        <FiSun className="text-lg" />
      )}
    </button>
  )
}
