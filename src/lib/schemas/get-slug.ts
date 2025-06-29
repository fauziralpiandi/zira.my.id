import { type Document } from 'contentlayer2/core';

const LOG_PREFIX = '[GetSlug]';

export function getSlug(doc: Document): string {
  try {
    if (!doc || !doc._raw || !doc._raw.sourceFileName) {
      console.error(`${LOG_PREFIX} Error: Invalid document or missing source file name`);
      return '';
    }

    const fileName = doc._raw.sourceFileName;
    return fileName.replace(/\.(md|mdx)$/, '');
  } catch (error) {
    console.error(`${LOG_PREFIX} Error: Failed to extract slug from document`, error);
    return '';
  }
}
