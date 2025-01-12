import { readingStats } from './readingStats';
import { pluralize } from '~/lib/utils';

export const estimateReadTime = async (content: string): Promise<string> => {
  const stats = await readingStats(content);
  return pluralize(stats.minutes, 'min');
};
