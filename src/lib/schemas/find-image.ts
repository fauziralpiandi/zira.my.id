import fs from 'fs/promises';
import path from 'path';
import { type Document } from 'contentlayer2/core';

import { getSlug } from '@/lib/schemas';

const LOG_PREFIX = '[ImageFinder]';

export async function findImage(
  doc: Document,
  imgDir = 'public/imgs',
  prefix = '/imgs',
): Promise<string | null> {
  try {
    if (!doc) {
      console.error(`${LOG_PREFIX} Error: Invalid document provided`);
      return null;
    }

    const slug = getSlug(doc);
    
    if (!slug) {
      console.error(`${LOG_PREFIX} Error: Failed to get slug from document`);
      return null;
    }

    const possibleExts = ['webp', 'png', 'jpg', 'jpeg'];
    const baseDir = path.join(process.cwd(), imgDir);

    function toPublicPath(filePath: string): string {
      try {
        return path.relative(baseDir, filePath).replace(/\\/g, '/');
      } catch (error) {
        console.error(
          `${LOG_PREFIX} Error: Failed to convert path: ${filePath}`,
          error,
        );
        return '';
      }
    }

    async function find(name: string): Promise<string | null> {
      try {
        return await Promise.any(
          possibleExts.map(async (ext) => {
            try {
              const filePath = path.join(baseDir, `${name}.${ext}`);
              await fs.access(filePath);
              return path.posix.join(prefix, toPublicPath(filePath));
            } catch (error) {
              return Promise.reject(error);
            }
          }),
        );
      } catch {
        return null;
      }
    }

    let result = await find(slug);
    
    if (!result) {
      console.warn(
        `${LOG_PREFIX} Warning: Image not found for slug "${slug}", falling back to placeholder`,
      );
      result = await find('placeholder');
      if (!result) {
        console.error(
          `${LOG_PREFIX} Error: Placeholder image not found in ${imgDir}`,
        );
      }
    }

    return result;
  } catch (error) {
    console.error(
      `${LOG_PREFIX} Error: Failed to find image for document`,
      error,
    );
    return null;
  }
}
