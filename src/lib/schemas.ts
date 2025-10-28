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

export { getSlug, wordCount };
