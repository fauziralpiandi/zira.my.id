import { allNotes, allStories } from 'contentlayer/generated';

function calculateTotal<T>(items: T[], property: keyof T): string {
  return items
    .reduce((sum, item) => sum + parseInt(String(item[property])), 0)
    .toLocaleString('en-US');
}

function sortByDate<T extends { date: string }>(items: T[]): T[] {
  return items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

function notes() {
  return sortByDate(allNotes);
}

function stories() {
  return sortByDate(allStories);
}

export type { Notes, Stories } from 'contentlayer/generated';
export { calculateTotal, notes, stories };
