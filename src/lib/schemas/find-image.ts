import fs from 'fs/promises';
import path from 'path';
import type { Document } from 'contentlayer2/core';
import { getSlug } from './get-slug';

export async function findImage(
  doc: Document,
  imgDir = 'public/imgs',
  prefix = '/imgs',
): Promise<string | null> {
  const slug = getSlug(doc);
  const possibleExts = ['webp', 'png', 'jpg', 'jpeg'];
  const baseDir = path.join(process.cwd(), imgDir);
  const toPublicPath = (filePath: string) =>
    path.relative(baseDir, filePath).replace(/\\/g, '/');
  const find = async (name: string) => {
    const results = await Promise.allSettled(
      possibleExts.map(async ext => {
        const filePath = path.join(baseDir, `${name}.${ext}`);

        await fs.access(filePath);

        return path.posix.join(prefix, toPublicPath(filePath));
      }),
    );
    const success = results.find(r => r.status === 'fulfilled') as
      | PromiseFulfilledResult<string>
      | undefined;

    return success?.value ?? null;
  };

  try {
    return (await find(slug)) || (await find('placeholder')) || null;
  } catch {
    return null;
  }
}
