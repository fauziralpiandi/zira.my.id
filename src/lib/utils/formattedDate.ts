import { constant } from '~/lib/constant';
import { pluralize } from '~/lib/utils';

const { locale, timeZone } = constant;

const getOrdinal = (day: number): string => {
  const suffix = ['th', 'st', 'nd', 'rd'];
  const value = day % 100;
  if (value >= 11 && value <= 13) return `${day}th`;
  return `${day}${suffix[day % 10] || 'th'}`;
};

const getRelativeTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(minutes / (60 * 24));
  const weeks = Math.floor(minutes / (60 * 24 * 7));
  const months = Math.floor(minutes / (60 * 24 * 30));
  const years = Math.floor(minutes / (60 * 24 * 365));

  if (minutes < 60) return 'just now';
  if (hours < 24) return 'a few hours ago';
  if (days < 7) return `${pluralize(days, 'day')} ago`;
  if (weeks < 4) return `${pluralize(weeks, 'week')} ago`;
  if (months < 12) return `${pluralize(months, 'month')} ago`;
  return `${pluralize(years, 'year')} ago`;
};

export const formattedDate = (
  date: string,
  format: 'absolute' | 'relative',
  showWeekday: boolean = false
): string => {
  const currentDate = new Date();
  const targetDate = new Date(date);

  if (isNaN(targetDate.getTime())) return 'Invalid date format';

  const timeDifference = currentDate.getTime() - targetDate.getTime();
  const minutesDiff = Math.floor(timeDifference / (1000 * 60));

  if (format === 'absolute') {
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: showWeekday ? 'long' : undefined,
      timeZone: timeZone,
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

  return '';
};
