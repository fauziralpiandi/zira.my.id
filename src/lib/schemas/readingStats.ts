type ReadingStats = {
  time: number;
  minutes: number;
  words: number;
};

const inverseWPM = (words: number, wpm: number) => {
  const minutes = words / wpm;
  return {
    time: Math.round(minutes * 60_000),
    minutes: Math.ceil(minutes),
  };
};

const countWords = (text: string): number => {
  return text
    .split('\n\n')
    .filter((block) => !block.startsWith('```') && !block.endsWith('```'))
    .join(' ')
    .trim()
    .split(/\s+/).length;
};

export const readingStats = (text: string, wpm = 200): ReadingStats => {
  const words = countWords(text);
  const { time, minutes } = inverseWPM(words, wpm);
  return { time, minutes, words };
};
