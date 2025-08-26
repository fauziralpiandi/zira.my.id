import type { Document } from 'contentlayer2/core';
import fs from 'fs/promises';
import path from 'path';
import { pluralize } from '@/lib/utils';

function inverseWpm(word: number, wpm: number) {
  const min = word / wpm;

  return {
    time: Math.round(min * 6e4),
    minute: Math.max(1, Math.ceil(min)),
  };
}

function countWord(text: unknown): number {
  if (typeof text !== 'string' || !text.trim()) {
    return 0;
  }

  return text
    .split('\n\n')
    .filter(block => !block.startsWith('```') && !block.endsWith('```'))
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function readingStats(
  text: unknown,
  wpm = 200,
): { time: number; minute: number; word: number } {
  try {
    if (typeof text !== 'string') {
      return { time: 0, minute: 0, word: 0 };
    }

    const word = countWord(text);
    const { time, minute } = inverseWpm(word, wpm);

    return { time, minute, word };
  } catch {
    throw new Error('Error calculating reading stats');
  }
}

function wordCount(content: unknown): string {
  try {
    if (typeof content !== 'string' || content.trim() === '') {
      if (
        content !== undefined &&
        content !== null &&
        typeof content !== 'string'
      ) {
        throw new Error(`Invalid content type: ${typeof content}`);
      }

      return pluralize(0, 'word');
    }

    return pluralize(readingStats(content).word, 'word');
  } catch {
    throw new Error('Failed to count words');
  }
}

function estimateReadTime(content: unknown): string {
  try {
    if (typeof content !== 'string' || content.trim() === '') {
      if (
        content !== undefined &&
        content !== null &&
        typeof content !== 'string'
      ) {
        throw new Error(`Invalid content type: ${typeof content}`);
      }

      return pluralize(0, 'min');
    }

    return pluralize(readingStats(content).minute, 'min');
  } catch {
    throw new Error('Error estimating read time');
  }
}

function getSlug(doc: Document): string {
  if (!doc || !doc._raw?.sourceFileName) {
    return '';
  }

  return doc._raw.sourceFileName.replace(/\.(md|mdx)$/, '');
}

async function findImage(
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
    throw new Error('Error finding image');
  }
}

export { estimateReadTime, findImage, getSlug, wordCount };
