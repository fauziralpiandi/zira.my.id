type ReadingStats = {
  time: number; // ms
  minutes: number; // rounded up
  words: number;
};

const inverseWPM = (words: number, wpm: number) => {
  const minutes = words / wpm;
  return {
    time: Math.round(minutes * 60_000), // 60 sec * 1000 ms
    minutes: Math.ceil(minutes),
  };
};

/**
 * Naive word counter — skips code blocks, trims whitespace.
 */
const countWords = (text: string): number => {
  return text
    .split('\n\n')
    .filter((block) => !block.startsWith('```') && !block.endsWith('```'))
    .join(' ')
    .trim()
    .split(/\s+/).length;
};

/**
 * Returns estimated reading time (in ms & minutes) and word count.
 *
 * @param text - Input text to measure
 * @param wpm - Words per minute (default: 200)
 */
export const readingStats = (text: string, wpm = 200): ReadingStats => {
  const words = countWords(text);
  const { time, minutes } = inverseWPM(words, wpm);
  return { time, minutes, words };
};
