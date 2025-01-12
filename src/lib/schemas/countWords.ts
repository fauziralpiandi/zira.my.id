import { readingStats } from './readingStats';
import { pluralize } from '~/lib/utils';

export const countWords = async (content: string): Promise<string> => {
  const stats = await readingStats(content);
  return pluralize(stats.words, 'word');
};
