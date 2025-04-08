import { type Document } from 'contentlayer2/core';

export const getSlug = (doc: Document): string => {
  const fileName = doc._raw?.sourceFileName;
  if (!fileName) throw new Error('No source file name found in document');
  return fileName.replace(/\.(md|mdx)$/, '');
};
