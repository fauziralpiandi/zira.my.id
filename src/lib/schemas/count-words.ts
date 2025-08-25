import { pluralize } from '@/lib/utils';
import { readingStats } from './reading-stats';

export function countWords(content: unknown): string {
  try {
    if (typeof content !== 'string' || content.trim() === '') {
      if (
        content !== undefined &&
        content !== null &&
        typeof content !== 'string'
      ) {
        throw new Error(`Invalid content type: ${typeof content}`);
      }

      return pluralize(0, 'word');
    }

    return pluralize(readingStats(content).words, 'word');
  } catch {
    throw new Error('Failed to count words');
  }
}
