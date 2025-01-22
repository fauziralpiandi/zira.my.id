import { constant } from '~/lib/constant';
import { pluralize } from '~/lib/utils';

const { locale, timeZone } = constant;

const getOrdinal = (day: number): string => {
  const suffix = ['th', 'st', 'nd', 'rd'];
  const value = day % 100;
  return day + (suffix[(value - 20) % 10] || suffix[value] || suffix[0]);
};

const getRelativeTime = (minutes: number, isFuture: boolean): string => {
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(minutes / (60 * 24));
  const weeks = Math.floor(minutes / (60 * 24 * 7));
  const months = Math.floor(minutes / (60 * 24 * 30));
  const years = Math.floor(minutes / (60 * 24 * 365));

  if (minutes < 60) return isFuture ? 'In a moment' : 'Just now';
  if (hours < 24) return isFuture ? 'In a few hours' : 'Today';
  if (days < 7)
    return isFuture
      ? `In ${pluralize(days, 'day')}`
      : pluralize(days, 'day') + ' ago';
  if (weeks < 4)
    return isFuture
      ? `In ${pluralize(weeks, 'week')}`
      : pluralize(weeks, 'week') + ' ago';
  if (months < 12)
    return isFuture
      ? `In ${pluralize(months, 'month')}`
      : pluralize(months, 'month') + ' ago';
  return isFuture
    ? `In ${pluralize(years, 'year')}`
    : pluralize(years, 'year') + ' ago';
};

export const formattedDate = (
  date: string,
  format: 'absolute' | 'relative',
  showWeekday: boolean = false
): string => {
  const currentDate = new Date();
  const targetDate = new Date(date);

  if (isNaN(targetDate.getTime())) return 'Invalid date format';

  const timeDifference = targetDate.getTime() - currentDate.getTime();
  const minutesDiff = Math.floor(Math.abs(timeDifference) / (1000 * 60));
  const isFuture = timeDifference > 0;

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
    return getRelativeTime(minutesDiff, isFuture);
  }

  return '';
};
