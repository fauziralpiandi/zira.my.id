import localFont from 'next/font/local';

const fontBody = localFont({
  variable: '--font-body',
  src: '../../public/fonts/SofiaSansSemiCondensed[wght].woff2',
  weight: '100 900',
});

const fontDisplay = localFont({
  variable: '--font-display',
  src: '../../public/fonts/SofiaSans[wght].woff2',
  weight: '100 900',
});

const fontCode = localFont({
  variable: '--font-code',
  src: '../../public/fonts/JetBrainsMono[wght].woff2',
  weight: '100 800',
});

export { fontBody, fontDisplay, fontCode };
