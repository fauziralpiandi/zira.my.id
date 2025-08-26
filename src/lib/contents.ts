import { allNotes, allStories } from 'contentlayer/generated';
import { pluralize } from '@/lib/utils';

function sortByPublishedDate<T extends { published: string }>(items: T[]): T[] {
  return items.sort(
    (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime(),
  );
}

function notes() {
  return sortByPublishedDate(allNotes);
}

function stories() {
  return sortByPublishedDate(allStories);
}

function calculateTotal<T>(
  items: T[],
  property: keyof T,
  unit: string,
): string {
  const total = items.reduce(
    (sum, item) => sum + parseInt(String(item[property])),
    0,
  );
  return pluralize(total, unit);
}

function totalWordCount() {
  return calculateTotal(allNotes, 'wordCount', 'word');
}

function totalReadTime() {
  return calculateTotal(allStories, 'readTime', 'minute');
}

export type { Notes, Stories } from 'contentlayer/generated';
export { notes, stories, totalWordCount, totalReadTime };
