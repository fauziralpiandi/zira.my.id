import { pluralize } from '@/lib/utils';
import { readingStats } from './readingStats';

export const estimateReadTime = (content: string): string => {
  try {
    const stats = readingStats(content);
    return pluralize(stats.minutes, 'min');
  } catch (error) {
    console.error('Error estimating time', error);
    return 'Error estimating time';
  }
};
