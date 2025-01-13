import { type Config as TwConfig } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{ts,tsx}', './content/**/*.{md,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        body: ['var(--font-body)'],
        display: ['var(--font-display)'],
        code: ['var(--font-code)'],
      },
      animation: {
        pulse: 'pulse 1500ms cubic-bezier(0.4, 0, 0.6, 1) infinite',
        wave: 'wave 1500ms infinite ease-in-out',
      },
      keyframes: {
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
        wave: {
          '0%': {
            transform: 'scaleY(1)',
            transformOrigin: '50% 50%',
          },
          '50%': {
            transform: 'scaleY(0.75)',
            transformOrigin: '50% 50%',
          },
          '100%': {
            transform: 'scaleY(1)',
            transformOrigin: '50% 50%',
          },
        },
      },
    },
  },
  plugins: [typography],
} satisfies TwConfig;
