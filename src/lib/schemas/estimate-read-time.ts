import { pluralize } from '@/lib/utils';
import { readingStats } from './reading-stats';

export function estimateReadTime(content: unknown): string {
  try {
    if (typeof content !== 'string' || content.trim() === '') {
      if (
        content !== undefined &&
        content !== null &&
        typeof content !== 'string'
      ) {
        throw new Error(`Invalid content type: ${typeof content}`);
      }

      return pluralize(0, 'min');
    }

    const mins = readingStats(content).minutes;

    return mins > 0 ? pluralize(mins, 'min') : '< 1 min';
  } catch {
    throw new Error('Error estimating read time');
  }
}
