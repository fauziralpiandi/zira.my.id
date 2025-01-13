import { pluralize } from '~/lib/utils';
import { readingStats } from './readingStats';

export const countWords = async (content: string): Promise<string> => {
  const stats = await readingStats(content);
  return pluralize(stats.words, 'word');
};
