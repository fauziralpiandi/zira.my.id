import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  darkMode: 'selector',
  content: ['./app/**/*.{md,mdx,ts,tsx}', './components/**/*.{md,mdx,ts,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      mono: {
        50: '#eeeeee',
        100: '#e6e6e6',
        200: '#cccccc',
        300: '#b3b3b3',
        400: '#999999',
        500: '#808080',
        600: '#666666',
        700: '#4d4d4d',
        800: '#333333',
        900: '#1c1c1c',
        950: '#111111',
      },
      hyper: {
        50: '#ffffe0',
        100: '#ffffb3',
        200: '#ffff80',
        300: '#ffff4d',
        400: '#ffff1a',
        500: '#ffd700',
        600: '#ccac00',
        700: '#b38f00',
        800: '#996b00',
        900: '#664400',
        950: '#333300',
      },
    },
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
      'in': 'in 150ms both',
      'in-reverse': 'in-reverse 150ms both',
    },
  },
  plugins: [typography],
} satisfies Config
