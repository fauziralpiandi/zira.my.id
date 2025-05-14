import { defineDocumentType } from 'contentlayer2/source-files';

import { countWords, getSlug } from '@/lib/schemas';

export const Notes = defineDocumentType(() => ({
  name: 'Notes',
  filePathPattern: `notes/**/*.{md,mdx}`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    summary: {
      type: 'string',
      required: true,
    },
    published: {
      type: 'date',
      required: true,
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: getSlug,
    },
    wordCount: {
      type: 'string',
      resolve: doc => countWords(doc.body.raw),
    },
  },
}));
