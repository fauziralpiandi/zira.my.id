import { allNotes, allStories } from 'contentlayer/generated';

function calculateTotal<T>(items: T[], property: keyof T): string {
  return String(
    items.reduce((sum, item) => sum + parseInt(String(item[property])), 0),
  );
}

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

export type { Notes, Stories } from 'contentlayer/generated';
export { calculateTotal, notes, stories };
