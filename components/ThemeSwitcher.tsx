'use client'

import { useState, useEffect, useCallback } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa6'

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    const userPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
    const initialTheme = savedTheme || (userPrefersDark ? 'dark' : 'light')

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
      aria-label="Toggle Theme"
      aria-pressed={theme === 'dark'}
      className="flex items-center justify-center"
    >
      {theme === 'light' ? (
        <FaMoon className="text-lg text-yellow-700" />
      ) : (
        <FaSun className="text-lg text-yellow-500" />
      )}
    </button>
  )
}

export default ThemeSwitcher
