import fs from 'fs/promises';
import path from 'path';
import { type Document as Doc } from 'contentlayer2/core';

import { getSlug } from '~/lib/schemas';

export const findImage = async (doc: Doc) => {
  const slug = getSlug(doc);
  const possibleExtensions = ['webp', 'png', 'jpg', 'jpeg', 'svg', 'gif'];
  const baseDir = path.join(process.cwd(), 'public', 'imgs');

  const toPublicPath = (filePath: string) =>
    filePath.replace(baseDir, '').replace(/\\/g, '/');

  for (const ext of possibleExtensions) {
    const imagePath = path.join(baseDir, `${slug}.${ext}`);
    try {
      await fs.access(imagePath);
      return `/imgs${toPublicPath(imagePath)}`;
    } catch {
      const placeholderPath = path.join(baseDir, `placeholder.${ext}`);
      try {
        await fs.access(placeholderPath);
        return `/imgs${toPublicPath(placeholderPath)}`;
      } catch {}
    }
  }

  throw new Error(
    `Unable to locate the image or placeholder for the ${slug}. Please ensure the image exists in the expected directory.`
  );
};
