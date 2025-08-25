import { defineDocumentType } from 'contentlayer2/source-files';
import {
  countWords,
  estimateReadTime,
  findImage,
  getSlug,
} from '@/lib/schemas';

const Notes = defineDocumentType(() => ({
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

const Stories = defineDocumentType(() => ({
  name: 'Stories',
  filePathPattern: `stories/**/*.{md,mdx}`,
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
    image: {
      type: 'string',
      resolve: findImage,
    },
    readTime: {
      type: 'string',
      resolve: doc => estimateReadTime(doc.body.raw),
    },
  },
}));

export { Notes, Stories };
