import { pluralize } from '~/lib/utils';
import { readingStats } from './readingStats';

export const countWords = (content: string): string => {
  try {
    const stats = readingStats(content);
    return pluralize(stats.words, 'word');
  } catch (error) {
    console.error('[Error counting words]:', error);
    return 'Error counting words';
  }
};
