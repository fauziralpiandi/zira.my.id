import { constant } from '@/lib/constant';

const { locale, timeZone } = constant;
const LOG_PREFIX = '[DateFormatter]';

function getOrdinal(day: number): string {
  try {
    if (isNaN(day) || day < 1 || day > 31) {
      console.error(
        `${LOG_PREFIX} Error: Invalid day number for ordinal: ${day}`,
      );
      return `${day}th`;
    }

    const j = day % 10;
    const k = day % 100;

    if (k >= 11 && k <= 13) return `${day}th`;
    if (j === 1) return `${day}st`;
    if (j === 2) return `${day}nd`;
    if (j === 3) return `${day}rd`;
    return `${day}th`;
  } catch (error) {
    console.error(
      `${LOG_PREFIX} Error: Failed to calculate ordinal for day ${day}`,
      error,
    );
    return `${day}`;
  }
}

function getRelativeTime(minutes: number): string {
  try {
    if (isNaN(minutes) || minutes < 0) {
      console.error(
        `${LOG_PREFIX} Error: Invalid minutes value for relative time: ${minutes}`,
      );
      return 'some time ago';
    }

    const days = Math.floor(minutes / (60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (minutes < 60) return 'just now';
    if (minutes < 60 * 24) return 'a few hours ago';
    if (days === 1) return 'yesterday';
    if (days >= 2 && days <= 6) return `${days} days ago`;
    if (weeks === 1) return 'a week ago';
    if (weeks >= 2 && weeks <= 3) return `${weeks} weeks ago`;
    if (days >= 28 && days < 30) return 'a month ago';
    if (months === 1) return 'a month ago';
    if (months >= 2 && months <= 11) return `${months} months ago`;
    if (years === 1) return 'a year ago';
    return `${years} years ago`;
  } catch (error) {
    console.error(
      `${LOG_PREFIX} Error: Failed to calculate relative time for ${minutes} minutes`,
      error,
    );
    return 'some time ago';
  }
}

export function formattedDate(
  date: string,
  format: 'absolute' | 'relative',
  showWeekday: boolean = false,
): string {
  try {
    if (!date) {
      console.error(`${LOG_PREFIX} Error: Empty date string provided`);
      throw new Error('Invalid date: empty string provided');
    }

    if (format !== 'absolute' && format !== 'relative') {
      console.error(`${LOG_PREFIX} Error: Invalid format type "${format}"`);
      throw new Error(`Invalid format: must be 'absolute' or 'relative'`);
    }

    const currentDate = new Date();
    const targetDate = new Date(date);

    if (isNaN(targetDate.getTime())) {
      console.error(
        `${LOG_PREFIX} Error: Invalid date string provided "${date}"`,
      );
      throw new Error(`Invalid date: "${date}" could not be parsed`);
    }

    const timeDifference = currentDate.getTime() - targetDate.getTime();
    const minutesDiff = Math.floor(timeDifference / (1000 * 60));

    if (minutesDiff < 0) {
      console.error(`${LOG_PREFIX} Error: Date is in the future "${date}"`);
      throw new Error('Invalid date: future dates are not allowed');
    }

    if (format === 'absolute') {
      try {
        const dateOptions: Intl.DateTimeFormatOptions = {
          weekday: showWeekday ? 'long' : undefined,
          timeZone: timeZone || 'UTC',
          month: showWeekday ? 'short' : 'long',
          day: 'numeric',
          year: 'numeric',
        };

        const formattedDate = targetDate.toLocaleDateString(
          locale,
          dateOptions,
        );
        const day = targetDate.getDate();
        const formattedDay = getOrdinal(day);
        return formattedDate.replace(day.toString(), formattedDay);
      } catch (formatError) {
        console.error(
          `${LOG_PREFIX} Error: Failed to format date "${date}" in absolute format`,
          formatError,
        );
        throw new Error('Failed to format date in absolute format');
      }
    }

    if (format === 'relative') {
      return getRelativeTime(minutesDiff);
    }

    console.error(`${LOG_PREFIX} Error: Unexpected format type "${format}"`);
    throw new Error(`Unexpected format type: ${format}`);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    console.error(
      `${LOG_PREFIX} Error: Unexpected error formatting date "${date}"`,
      error,
    );
    throw new Error('Failed to format date: unexpected error');
  }
}
