import { pluralize } from '@/lib/utils';
import { readingStats } from './reading-stats';

const LOG_PREFIX = '[ReadTimeEstimator]';

export function estimateReadTime(content: string): string {
  try {
    if (content === undefined || content === null) {
      console.error(
        `${LOG_PREFIX} Error: Content is ${content === undefined ? 'undefined' : 'null'}`,
      );
      return '< 1 min';
    }

    if (typeof content !== 'string') {
      console.error(`${LOG_PREFIX} Error: Content is not a string (type: ${typeof content})`);
      return '< 1 min';
    }

    if (content.trim() === '') {
      return '< 1 min';
    }

    const stats = readingStats(content);

    if (stats.minutes <= 0) {
      return '< 1 min';
    }

    return pluralize(stats.minutes, 'min');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`${LOG_PREFIX} Error: Failed to estimate reading time: ${errorMessage}`);

    return '~1 min';
  }
}
