import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { constant } from '@/lib/constant';
import waktos from 'waktos';

function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function formatDate(date?: string) {
  return waktos(date, { locale: constant.locale, timezone: constant.tz });
}

function pluralize(
  value: number,
  singular: string,
  plural: string = `${singular}s`,
) {
  return `${value} ${value === 1 ? singular : plural}`;
}

export { cx, formatDate, pluralize };
