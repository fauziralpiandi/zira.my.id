import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,md,mdx}', './mdx-components.tsx'],
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
    },
  },
  plugins: [],
}

export default config
