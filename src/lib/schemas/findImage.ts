import fs from 'fs/promises';
import path from 'path';
import { type Document as Doc } from 'contentlayer2/core';

import { getSlug } from '~/lib/schemas';

export const findImage = async (
  doc: Doc,
  imgDir = 'public/imgs',
  prefix = '/imgs'
): Promise<string | null> => {
  const slug = getSlug(doc);
  const possibleExts = ['webp', 'png', 'jpg', 'jpeg'];
  const baseDir = path.join(process.cwd(), imgDir);
  const toPublicPath = (filePath: string) =>
    path.relative(baseDir, filePath).replace(/\\/g, '/');

  const find = async (name: string): Promise<string | null> => {
    try {
      return await Promise.any(
        possibleExts.map(async (ext) => {
          const filePath = path.join(baseDir, `${name}.${ext}`);
          await fs.access(filePath);
          return path.posix.join(prefix, toPublicPath(filePath));
        })
      );
    } catch {
      return null;
    }
  };

  let result = await find(slug);
  if (!result) {
    console.warn(`Image not found (${slug}), falling back to placeholder.`);
    result = await find('placeholder');
    if (!result) {
      console.error('Placeholder not found');
    }
  }

  return result;
};
