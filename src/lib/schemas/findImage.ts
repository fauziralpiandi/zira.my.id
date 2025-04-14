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
  if (!slug) throw new Error('Invalid slug');

  const possibleExts = ['webp', 'png', 'jpg', 'jpeg', 'svg', 'gif'];
  const baseDir = path.join(process.cwd(), imgDir);

  const toPublicPath = (filePath: string) =>
    path.relative(baseDir, filePath).replace(/\\/g, '/');

  const find = async (name: string) => {
    try {
      return await Promise.any(
        possibleExts.map(async (ext) => {
          const filePath = path.join(baseDir, `${name}.${ext}`);
          await fs.access(filePath);
          return path.posix.join(prefix, toPublicPath(filePath));
        })
      );
    } catch {
      throw new Error(`No valid image found for ${name}`);
    }
  };

  try {
    return await find(slug);
  } catch {
    try {
      return await find('placeholder');
    } catch {
      throw new Error('No valid image or placeholder found');
    }
  }
};
