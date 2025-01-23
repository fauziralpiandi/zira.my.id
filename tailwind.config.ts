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
      colors: {
        accent: 'hsl(48, 96%, 87%)',
      },
      animation: {
        hover: 'hover 3000ms ease-in-out infinite',
        jam: 'jam 5000ms ease-in-out alternate infinite',
        pulse: 'pulse 1500ms cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shine: 'pulse 5000ms ease-in-out infinite',
        wave: 'wave 1500ms ease-in-out infinite',
      },
      keyframes: {
        hover: {
          '50%': {
            transform: 'translateY(-1%)',
          },
        },
        jam: {
          '30%': {
            transform: 'translateX(1%) translateY(1%)',
          },
          '60%': {
            transform: 'translateX(-1%) translateY(1%)',
          },
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
        shine: {
          '50%': {
            transform: 'scale(1.1)',
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
