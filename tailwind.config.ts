import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: ['./app/**/*.{ts,tsx}', './posted/**/*.{html,md,mdx}'],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        'main-text': 'var(--text-color)',
        'main-background': 'var(--background-color)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '2.625rem',
        '6xl': '3rem',
        '7xl': '3.375rem',
        '8xl': '3.75rem',
        '9xl': '4.125rem',
      },
      typography: {
        DEFAULT: {
          css: {
            'h1': {
              fontSize: '1.35rem',
            },
            'h2': {
              fontSize: '1.25rem',
            },
            'h3': {
              fontSize: '1.15rem',
            },
            'p': {
              fontSize: '1rem',
              lineHeight: '1.75',
            },
            'code': {
              color: 'inherit',
            },
            'code::before': {
              display: 'none',
            },
            'code::after': {
              display: 'none',
            },
            'p::before': {
              display: 'none',
            },
            'p::after': {
              display: 'none',
            },
          },
        },
      },
      keyframes: {
        'in': {
          '0%': { opacity: '0', transform: 'translateY(-5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'in-reverse': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-5px)' },
        },
      },
      animation: {
        'in': 'in 300ms both',
        'in-reverse': 'in-reverse 300ms both',
      },
    },
  },
  plugins: [typography],
} satisfies Config
