'use client'

import { Link } from 'next-view-transitions'
import { useState, useEffect, useCallback } from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'

import { my } from '@/constant'

interface LinkItem {
  name: string
  url: string
  icon: React.ReactNode
}

export function Footer() {
  const links: LinkItem[] = []
  return (
    <footer
      className="flex-shrink-0 flex justify-between items-center mt-16"
      aria-label="Footer"
    >
      <span
        className="font-medium text-sm text-yellow-800 dark:text-yellow-500 tracking-tight"
        aria-label="Attribution"
      >
        &copy; {new Date().getFullYear()} {my.fullName} &mdash;{' '}
        <Link href="/legal">Legal</Link>
      </span>

      <div className="flex items-center space-x-3">
        {Array.isArray(links) &&
          links.length > 0 &&
          links.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              className="flex items-center text-lg"
            >
              {link.icon}
            </a>
          ))}
        <ThemeSwitcher />
      </div>
    </footer>
  )
}

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    const initialTheme = savedTheme || 'dark'

    document.documentElement.classList.add(initialTheme)
    setTheme(initialTheme)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  return (
    <button
      onClick={toggleTheme}
      aria-label="Theme Switcher"
      aria-pressed={theme === 'dark'}
      className="flex items-center justify-center"
    >
      {theme === 'light' ? (
        <FiMoon className="text-lg text-yellow-700" />
      ) : (
        <FiSun className="text-lg text-yellow-500" />
      )}
    </button>
  )
}
