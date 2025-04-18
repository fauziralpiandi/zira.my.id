import { constant } from '@/lib/constant';

const { locale, timeZone } = constant;

const getOrdinal = (day: number): string => {
  const j = day % 10;
  const k = day % 100;
  if (k >= 11 && k <= 13) return `${day}th`;
  if (j === 1) return `${day}st`;
  if (j === 2) return `${day}nd`;
  if (j === 3) return `${day}rd`;
  return `${day}th`;
};

const getRelativeTime = (minutes: number): string => {
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
};

export const formattedDate = (
  date: string,
  format: 'absolute' | 'relative',
  showWeekday: boolean = false
): string => {
  const currentDate = new Date();
  const targetDate = new Date(date);

  if (isNaN(targetDate.getTime())) {
    console.error(`Invalid date input (${date})`);
    throw new Error('Invalid date input');
  }
  const timeDifference = currentDate.getTime() - targetDate.getTime();
  const minutesDiff = Math.floor(timeDifference / (1000 * 60));
  if (minutesDiff < 0) {
    console.error(`Bruh! (${date})`);
    throw new Error('LMAO');
  }

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
    const result = formattedDate.replace(day.toString(), formattedDay);
    return result;
  }

  if (format === 'relative') {
    const result = getRelativeTime(minutesDiff);
    return result;
  }

  console.error(`Invalid format provided (${format})`);
  throw new Error('Invalid format');
};
