import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: ['./app/**/*.{md,mdx,ts,tsx}', './content/**/*.{md,mdx,ts,tsx}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
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
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'in-reverse': {
          '0%': {
            opacity: '1',
          },
          '100%': {
            opacity: '0',
          },
        },
      },
      animation: {
        'in': 'in 0.5s both',
        'in-reverse': 'in-reverse 0.5s both',
      },
    },
  },
  plugins: [typography],
} satisfies Config
