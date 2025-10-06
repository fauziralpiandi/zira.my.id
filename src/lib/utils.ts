import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import waktos from 'waktos';
import relativeTime from 'waktos/plugin/relativeTime';

waktos.plugin(relativeTime);

function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function formatDate(date?: string) {
  return waktos(date ?? Date.now(), { timezone: 'Asia/Jakarta' });
}

export { cx, formatDate };
