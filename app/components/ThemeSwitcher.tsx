'use client'

import { useState, useEffect, useCallback } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa'

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    const userPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
    const initialTheme = savedTheme || (userPrefersDark ? 'dark' : 'dark')
    document.documentElement.classList.add(initialTheme)
    setTheme(initialTheme)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)

    const body = document.body
    body.classList.add('theme-transition')
    const timeoutId = setTimeout(
      () => body.classList.remove('theme-transition'),
      250,
    )

    return () => clearTimeout(timeoutId)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      aria-pressed={theme === 'dark'}
    >
      {theme === 'light' ? <FaMoon /> : <FaSun />}
      <style jsx global>{`
        .theme-transition {
          transition:
            background-color 0.15s ease-in-out,
            color 0.15s ease-in-out;
        }
      `}</style>
    </button>
  )
}

export default ThemeSwitcher

// But, this component was archived!
// I Love Darkness :)
// Lol
