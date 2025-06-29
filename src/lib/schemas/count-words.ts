import { pluralize } from '@/lib/utils';
import { readingStats } from './reading-stats';

const LOG_PREFIX = '[WordCounter]';

export function countWords(content: string): string {
  try {
    if (content === undefined || content === null) {
      console.error(
        `${LOG_PREFIX} Error: Content is ${content === undefined ? 'undefined' : 'null'}`,
      );
      return '0 words';
    }

    if (typeof content !== 'string') {
      console.error(`${LOG_PREFIX} Error: Content is not a string (type: ${typeof content})`);
      return '0 words';
    }

    if (content.trim() === '') {
      return '0 words';
    }

    const stats = readingStats(content);

    return pluralize(stats.words, 'word');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`${LOG_PREFIX} Error: Failed to count words in content: ${errorMessage}`);

    return 'Error counting words';
  }
}
