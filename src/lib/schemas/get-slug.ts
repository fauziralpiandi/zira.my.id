import type { Document } from 'contentlayer2/core';

export function getSlug(doc: Document): string {
  if (!doc || !doc._raw?.sourceFileName) {
    return '';
  }

  return doc._raw.sourceFileName.replace(/\.(md|mdx)$/, '');
}
