import type { Document } from 'contentlayer2/core';

function getSlug(doc: Document) {
  return doc._raw.sourceFileName.replace(/\.(md|mdx)$/i, '');
}

function countWord(text: string | undefined) {
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

  return clean.split(/\s+/gu).length;
}

function inverseWpm(word: number, wpm: number) {
  const minute = word / wpm;

  return {
    time: Math.round(minute * 60 * 1e3),
    minute: Math.max(1, Math.ceil(minute)),
  };
}

function readingStats(
  content: string | undefined,
  key: 'word' | 'minute',
  wpm = 225,
) {
  const word = countWord(content);
  const { minute } = inverseWpm(word, wpm);
  const value = key === 'word' ? word : minute;

  return String(value);
}

function getImage(doc: Document) {
  const slug = getSlug(doc);
  const path = `/imgs/${slug}.png`;

  return path;
}

function generateJsonLd(doc: Document) {
  const image = getImage(doc);

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

export { generateJsonLd, getImage, getSlug, readingStats };
