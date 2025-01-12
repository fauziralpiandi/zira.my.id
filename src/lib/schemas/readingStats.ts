type ReadingStats = {
  time: number;
  minutes: number;
  words: number;
};

const inverseWPM = (words: number, wpm: number) => {
  const minutes = words / wpm;
  const time = Math.round(minutes * 60 * 1000);
  return { time, minutes: Math.ceil(parseFloat(minutes.toFixed(2))) };
};

const wordBounds = new Set([9, 10, 13, 32]);

const intoWords = async (text: string): Promise<number> => {
  const encoder = new TextEncoder();
  const blocks = `${text}\n`
    .split('\n\n')
    .filter((block) => !block.startsWith('```') && !block.endsWith('```'));

  let count = 0;

  const workLoad = blocks.map(async (words) => {
    const codes = encoder.encode(words);
    codes.forEach((code) => {
      if (wordBounds.has(code)) {
        count = count + 1;
      }
    });
  });

  await Promise.all(workLoad);
  return count;
};

export const readingStats = async (text: string): Promise<ReadingStats> => {
  const words = await intoWords(text);
  const { time, minutes } = inverseWPM(words, 200);
  return { time, minutes, words };
};
