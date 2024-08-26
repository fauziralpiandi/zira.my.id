'use client'

// Import the essentials. I'm using the power of React and some fancy icons.
import { useState, useEffect, useCallback } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa'

const ThemeSwitcher = () => {
  // Start off with a default theme, because who needs light anyway?
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    // Check if the user has already chosen a side (light or dark).
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    // Does the user prefer the dark side? Let's find out.
    const userPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
    // If we found something, we go with it. Otherwise, dark it is.
    const initialTheme = savedTheme || (userPrefersDark ? 'dark' : 'dark')
    document.documentElement.classList.add(initialTheme)
    setTheme(initialTheme)
  }, [])

  useEffect(() => {
    // Toggle the 'dark' class based on the current theme. We're basically wizards at this point.
    document.documentElement.classList.toggle('dark', theme === 'dark')
    // Save the user's theme preference because we care.
    localStorage.setItem('theme', theme)

    // For a cooler experience.
    const body = document.body
    body.classList.add('theme-transition')
    const timeoutId = setTimeout(
      () => body.classList.remove('theme-transition'),
      250,
    )

    return () => clearTimeout(timeoutId)
  }, [theme])

  const toggleTheme = useCallback(() => {
    // Switch between light and dark like it's no big deal!
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      aria-pressed={theme === 'dark'}
    >
      {theme === 'light' ? <FaMoon /> : <FaSun />}
      <style jsx global>
        {`
          .theme-transition {
            transition:
              background-color 0.15s ease-in-out,
              color 0.15s ease-in-out;
          }
        `}
      </style>
    </button>
  )
}

export default ThemeSwitcher

// But, this component was archived!
// I Love Darkness :)
// Lol