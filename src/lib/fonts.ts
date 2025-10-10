import {
  Sofia_Sans,
  Sofia_Sans_Semi_Condensed,
  JetBrains_Mono,
} from 'next/font/google';

const fontBody = Sofia_Sans_Semi_Condensed({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontDisplay = Sofia_Sans({
  subsets: ['latin'],
  variable: '--font-display',
});

const fontCode = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-code',
});

export { fontBody, fontDisplay, fontCode };
