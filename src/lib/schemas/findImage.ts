import fs from 'fs/promises';
import path from 'path';
import { type Document as Doc } from 'contentlayer2/core';

import { getSlug } from '~/lib/schemas';

export const findImage = async (doc: Doc) => {
  const slug = getSlug(doc);
  const possibleExtensions = ['webp', 'png', 'jpg', 'jpeg', 'svg', 'gif'];
  const baseDir = path.join(process.cwd(), 'public', 'imgs');

  const toPublicPath = (filePath: string) => {
    const relativePath = path.relative(baseDir, filePath).replace(/\\/g, '/');
    return `/${relativePath}`;
  };

  const findFile = async (name: string) => {
    try {
      return await Promise.any(
        possibleExtensions.map(async (ext) => {
          const filePath = path.join(baseDir, `${name}.${ext}`);
          await fs.access(filePath);
          return `/imgs${toPublicPath(filePath)}`;
        })
      );
    } catch {
      throw new Error(`No valid image found for ${name}`);
    }
  };

  try {
    return await findFile(slug);
  } catch {
    try {
      return await findFile('placeholder');
    } catch {
      console.warn('No valid image or placeholder found, returning null.');
      return null;
    }
  }
};
