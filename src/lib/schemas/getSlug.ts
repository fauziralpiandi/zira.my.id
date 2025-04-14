import { type Document } from 'contentlayer2/core';

export const getSlug = (doc: Document): string => {
  const fileName = doc._raw?.sourceFileName;
  return fileName.replace(/\.(md|mdx)$/, '');
};
