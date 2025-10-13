import {
  type Notes,
  type Stories,
  allNotes as notes,
  allStories as stories,
} from 'contentlayer/generated';

function totalOf<T>(items: T[], property: keyof T): string {
  return items
    .reduce((sum, item) => sum + Number(item[property]), 0)
    .toLocaleString('en-US');
}

function sortByDate<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

function allNotes(): Notes[] {
  return sortByDate(notes);
}

function allStories(): Stories[] {
  return sortByDate(stories);
}

export type { Notes, Stories };
export { allNotes, allStories, totalOf };
