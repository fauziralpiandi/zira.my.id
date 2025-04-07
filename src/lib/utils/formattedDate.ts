import { constant } from '~/lib/constant';

const { locale, timeZone } = constant;

// Adds ordinal suffix to day numbers
const getOrdinal = (day: number): string => {
  const j = day % 10;
  const k = day % 100;
  if (k >= 11 && k <= 13) return `${day}th`;
  if (j === 1) return `${day}st`;
  if (j === 2) return `${day}nd`;
  if (j === 3) return `${day}rd`;
  return `${day}th`;
};

// Turns minutes into a rough "time ago" string
const getRelativeTime = (minutes: number): string => {
  const days = Math.floor(minutes / (60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 60) return 'just now';
  if (minutes < 60 * 24) return 'a few hours ago';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (weeks === 1) return 'a week ago';
  if (weeks < 4) return `${weeks} weeks ago`;
  if (months === 1) return 'a month ago';
  if (months < 12) return `${months} months ago`;
  if (years === 1) return 'a year ago';
  return `${years} years ago`;
};

/**
 * Formats a given ISO date string as either a relative time ("a few hours ago", "yesterday", etc.),
 * or an absolute date with optional weekday ("April 26th, 2005", "Tuesday, April 26th, 2005").
 *
 * Throws an error for invalid dates or future timestamps.
 *
 * @param date - A valid ISO date string (e.g. "2005-04-26T10:00:00Z")
 * @param format - 'absolute' or 'relative'
 * @param showWeekday - If true, includes weekday in absolute date.
 */
export const formattedDate = (
  date: string,
  format: 'absolute' | 'relative',
  showWeekday: boolean = false
): string => {
  const currentDate = new Date();
  const targetDate = new Date(date);

  if (isNaN(targetDate.getTime())) throw new Error('Invalid date format');
  const timeDifference = currentDate.getTime() - targetDate.getTime();
  const minutesDiff = Math.floor(timeDifference / (1000 * 60));
  if (minutesDiff < 0)
    throw new Error('Invalid date: future dates not allowed');

  if (format === 'absolute') {
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: showWeekday ? 'long' : undefined,
      timeZone: timeZone || 'UTC',
      month: showWeekday ? 'short' : 'long',
      day: 'numeric',
      year: 'numeric',
    };

    const formattedDate = targetDate.toLocaleDateString(locale, dateOptions);
    const day = targetDate.getDate();
    const formattedDay = getOrdinal(day);
    return formattedDate.replace(day.toString(), formattedDay);
  }

  if (format === 'relative') {
    return getRelativeTime(minutesDiff);
  }

  throw new Error('Invalid format: must be "absolute" or "relative"');
};
