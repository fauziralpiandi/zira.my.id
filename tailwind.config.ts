import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: ['./app/**/*.{ts,tsx}', './posted/**/*.{md,mdx}'],
  theme: {
    extend: {
      colors: {
        'main-text': 'var(--text-color)',
        'main-background': 'var(--background-color)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      typography: {
        DEFAULT: {
          css: {
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
