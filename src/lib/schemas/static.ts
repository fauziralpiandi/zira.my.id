import { defineDocumentType } from 'contentlayer2/source-files';

import { getSlug } from '@/lib/schemas';

export const Static = defineDocumentType(() => ({
  name: 'Static',
  filePathPattern: `static/**/*.{md,mdx}`,
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
    date: {
      type: 'date',
      required: true,
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: getSlug,
    },
  },
}));
