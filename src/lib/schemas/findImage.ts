import fs from 'fs/promises';
import path from 'path';
import { type Document as Doc } from 'contentlayer2/core';

import { getSlug } from '~/lib/schemas';

/**
 * Finds an image for a given content doc based on its slug.
 * Falls back to a placeholder if not found.
 *
 * Looks inside a configurable image directory and supports common formats.
 *
 * @param doc - Contentlayer document
 * @param imgDir - Folder where images are stored (default: public/imgs)
 * @param prefix - URL prefix for public access (default: /imgs)
 * @returns Image URL or null if nothing found
 */
export const findImage = async (
  doc: Doc,
  imgDir = 'public/imgs',
  prefix = '/imgs'
): Promise<string | null> => {
  const slug = getSlug(doc);
  if (!slug) throw new Error('Invalid slug');

  const possibleExtensions = ['webp', 'png', 'jpg', 'jpeg', 'svg', 'gif'];
  const baseDir = path.join(process.cwd(), imgDir);

  const toPublicPath = (filePath: string) =>
    path.relative(baseDir, filePath).replace(/\\/g, '/');

  const findFile = async (name: string) => {
    try {
      return await Promise.any(
        possibleExtensions.map(async (ext) => {
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
    return await findFile(slug);
  } catch {
    try {
      return await findFile('placeholder');
    } catch {
      throw new Error('No valid image or placeholder found');
    }
  }
};
