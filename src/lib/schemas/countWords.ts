import { pluralize } from '~/lib/utils';
import { readingStats } from './readingStats';

export const countWords = (content: string): string => {
  try {
    const stats = readingStats(content);
    return pluralize(stats.words, 'word');
  } catch {
    return 'Error counting words';
  }
};
