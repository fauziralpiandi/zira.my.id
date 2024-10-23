import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/app/**/*.{ts,tsx,md,mdx}',
    './src/components/**/*.{ts,tsx,md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
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
      },
      keyframes: {
        'in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'in': 'in 750ms both',
        'fade': 'in-reverse 3000ms both',
      },
    },
  },
  plugins: [],
} satisfies Config
