type ReadingStats = {
  time: number;
  minutes: number;
  words: number;
};

const LOG_PREFIX = '[ReadingStats]';

function inverseWPM(words: number, wpm: number) {
  try {
    if (isNaN(words) || words < 0) {
      console.error(`${LOG_PREFIX} Error: Invalid word count: ${words}`);
      return { time: 0, minutes: 0 };
    }

    if (isNaN(wpm) || wpm <= 0) {
      console.error(`${LOG_PREFIX} Error: Invalid words per minute: ${wpm}`);
      return { time: 0, minutes: 1 };
    }

    const minutes = words / wpm;
    
    return {
      time: Math.round(minutes * 60_000),
      minutes: Math.max(1, Math.ceil(minutes)),
    };
  } catch (error) {
    console.error(
      `${LOG_PREFIX} Error: Failed to calculate reading time`,
      error,
    );
    return { time: 0, minutes: 1 };
  }
}

function countWords(text: string): number {
  try {
    if (!text || typeof text !== 'string') {
      return 0;
    }

    return text
      .split('\n\n')
      .filter((block) => !block.startsWith('```') && !block.endsWith('```'))
      .join(' ')
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  } catch (error) {
    console.error(`${LOG_PREFIX} Error: Failed to count words in text`, error);
    return 0;
  }
}

export function readingStats(text: string, wpm = 200): ReadingStats {
  try {
    if (text === undefined || text === null) {
      console.error(
        `${LOG_PREFIX} Error: Text is ${text === undefined ? 'undefined' : 'null'}`,
      );
      return { time: 0, minutes: 0, words: 0 };
    }

    if (typeof text !== 'string') {
      console.error(
        `${LOG_PREFIX} Error: Text is not a string (type: ${typeof text})`,
      );
      return { time: 0, minutes: 0, words: 0 };
    }

    const words = countWords(text);
    const { time, minutes } = inverseWPM(words, wpm);

    return { time, minutes, words };
  } catch (error) {
    console.error(
      `${LOG_PREFIX} Error: Failed to calculate reading stats`,
      error,
    );
    return { time: 0, minutes: 1, words: 0 };
  }
}
