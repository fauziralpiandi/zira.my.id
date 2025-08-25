type ReadingStats = {
  time: number;
  minutes: number;
  words: number;
};

function inverseWPM(words: number, wpm: number) {
  if (!Number.isFinite(words) || words < 0) {
    return { time: 0, minutes: 0 };
  }

  if (!Number.isFinite(wpm) || wpm <= 0) {
    return { time: 0, minutes: 1 };
  }

  const minutes = words / wpm;

  return {
    time: Math.round(minutes * 6e4),
    minutes: Math.max(1, Math.ceil(minutes)),
  };
}

function countWords(text: unknown): number {
  if (typeof text !== 'string' || !text.trim()) {
    return 0;
  }

  return text
    .split('\n\n')
    .filter(block => !block.startsWith('```') && !block.endsWith('```'))
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function readingStats(text: unknown, wpm = 200): ReadingStats {
  try {
    if (typeof text !== 'string') {
      return { time: 0, minutes: 0, words: 0 };
    }

    const words = countWords(text);
    const { time, minutes } = inverseWPM(words, wpm);

    return { time, minutes, words };
  } catch {
    throw new Error('Error calculating reading stats');
  }
}
