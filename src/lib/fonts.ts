import localFont from 'next/font/local';

const fontBody = localFont({
  variable: '--font-body',
  src: '../../public/fonts/Geist.woff2',
  weight: '100 900',
  display: 'swap',
});

const fontDisplay = localFont({
  variable: '--font-display',
  src: '../../public/fonts/Recursive.woff2',
  weight: '300 900',
  display: 'swap',
});

const fontCode = localFont({
  variable: '--font-code',
  src: '../../public/fonts/JetBrains-Mono.woff2',
  weight: '100 800',
  display: 'swap',
});

export { fontBody, fontDisplay, fontCode };
