import type { Document } from 'contentlayer2/core';
import fs from 'fs/promises';
import path from 'path';
import { pluralize } from '@/lib/utils';

function countWord(text: string | null | undefined): number {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return 0;
  }

  const clean = text
    .replace(/<[^>]+>/gu, '') // HTML/JSX tags
    .replace(/`[^`]*`/gu, '') // inline code
    .replace(/(```|~~~)[\s\S]*?\1/gu, '') // fenced code blocks
    .replace(/!\[[^\]]*\]\([^)]*\)/gu, '') // images
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, '$1') // links (keep text)
    .replace(/(\*{1,3}|_{1,3}|~{1,2})(.*?)\1/gu, '$2') // formatting
    .replace(/^(\s{0,3}#{1,6}|\s{0,3}>\s*|\s*[-*+]\s+)/gmu, '') // headings/lists/quotes
    .replace(/[^\p{L}\p{N}\s]/gu, ' ') // non-word chars
    .trim();

  return clean ? clean.split(/\s+/).length : 0;
}

function inverseWpm(word: number, wpm: number) {
  const minute = word / wpm;

  return {
    time: Math.round(minute * 60 * 1e3),
    minute: Math.max(1, Math.ceil(minute)),
  };
}

function readingStats(
  content: string | null | undefined,
  key: 'word' | 'minute',
  unit: string,
  wpm = 200,
): string {
  const word = countWord(content);
  const { minute } = inverseWpm(word, wpm);
  const value = key === 'word' ? word : minute;

  return pluralize(value, unit);
}

function calculateWordCount(content: string | null | undefined) {
  return readingStats(content, 'word', 'word');
}

function estimateReadTime(content: string | null | undefined) {
  return readingStats(content, 'minute', 'min');
}

function getSlug(doc: Document): string {
  return doc._raw.sourceFileName.replace(/\.(md|mdx)$/i, '');
}

async function findImage(
  doc: Document,
  dir = 'public/imgs',
  prefix = '/imgs',
): Promise<string> {
  const slug = getSlug(doc);
  const baseDir = path.join(process.cwd(), dir);
  const exts = ['webp', 'png', 'jpg', 'jpeg', 'svg'];
  const tryFind = [slug, 'placeholder'].flatMap(name =>
    exts.map(ext => ({
      name,
      file: path.join(baseDir, `${name}.${ext}`),
    })),
  );

  try {
    const image = await Promise.any(
      tryFind.map(async ({ file }) => {
        await fs.access(file);

        return path.posix.join(
          prefix,
          path.relative(baseDir, file).replace(/\\/g, '/'),
        );
      }),
    );

    return image;
  } catch {
    throw new Error(`No image found for "${slug}"`);
  }
}

async function generateJsonLd(doc: Document) {
  const image = await findImage(doc).catch(() => '/api/og');

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: doc.title,
    description: doc.summary,
    datePublished: doc.published,
    dateModified: doc.published,
    image: `https://zira.my.id${image}`,
    url: `https://zira.my.id/${doc._raw.flattenedPath}`,
    author: {
      '@type': 'Person',
      name: 'Fauzira Alpiandi',
      url: 'https://zira.my.id',
    },
  };
}

export {
  calculateWordCount,
  estimateReadTime,
  findImage,
  getSlug,
  generateJsonLd,
};
