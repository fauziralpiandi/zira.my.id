import type { Document } from 'contentlayer2/core';

export const getSlug = (doc: Document) => {
  const fileName = doc._raw?.sourceFileName;
  return fileName ? fileName.replace(/\.(md|mdx)$/, '') : '';
};
