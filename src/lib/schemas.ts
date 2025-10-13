import type { Document } from 'contentlayer2/core';

function getSlug(doc: Document): string {
  return doc._raw.sourceFileName.replace(/\.(md|mdx)$/i, '');
}

function wordCount(text?: string): number {
  if (!text?.trim()) {
    return 0;
  }

  const clean = text
    .replace(/(```|~~~)[\s\S]*?\1/gu, '') // fancy code blocks
    .replace(/`[^`]*`/gu, '') // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/gu, '') // images
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, '$1') // links (keep text)
    .replace(/(\*{1,3}|_{1,3}|~{1,2})(.+?)\1/gu, '$2') // formatting
    .replace(/^(\s{0,3}#{1,6}|\s{0,3}>\s*|\s*[-*+]\s+)/gmu, '') // headings, blockquotes, lists
    .replace(/<[^>]+>/gu, '') // HTML tags
    .normalize('NFKC') // normalize
    .trim();

  // match words (letters + numbers) with optional apostrophes or hyphens inside
  const tokens = clean.match(/[\p{L}\p{N}]+(['’-][\p{L}\p{N}]+)?/gu) ?? [];

  return tokens.length;
}

function getImage(doc: Document): string {
  const slug = getSlug(doc);
  const path = `/imgs/${slug}.png`;

  return path;
}

function generateJsonLd(doc: Document): string {
  const image = getImage(doc);
  const jsonLd = {
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

  return JSON.stringify(jsonLd);
}

export { generateJsonLd, getImage, getSlug, wordCount };
