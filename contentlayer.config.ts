import { defineDocumentType, makeSource } from 'contentlayer2/source-files';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import {
  findImage,
  generateJsonLd,
  getSlug,
  readingStats,
} from '@/lib/schemas';

const notes = defineDocumentType(() => ({
  name: 'Notes',
  filePathPattern: `notes/**/*.{md,mdx}`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: false,
      default: 'Lorem ipsum dolor sit amet.',
    },
    summary: {
      type: 'string',
      required: false,
      default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    date: {
      type: 'date',
      required: false,
      default: new Date().toISOString(),
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: getSlug,
    },
    wordCount: {
      type: 'number',
      resolve: (doc) => readingStats(doc.body.raw, 'word'),
    },
    jsonLd: {
      type: 'json',
      resolve: generateJsonLd,
    },
  },
}));

const stories = defineDocumentType(() => ({
  name: 'Stories',
  filePathPattern: `stories/**/*.{md,mdx}`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: false,
      default: 'Lorem ipsum dolor sit amet.',
    },
    summary: {
      type: 'string',
      required: false,
      default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    date: {
      type: 'date',
      required: false,
      default: new Date().toISOString(),
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: getSlug,
    },
    image: {
      type: 'image',
      resolve: findImage,
    },
    readTime: {
      type: 'number',
      resolve: (doc) => readingStats(doc.body.raw, 'minute'),
    },
    jsonLd: {
      type: 'json',
      resolve: generateJsonLd,
    },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [notes, stories],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: 'github-dark',
          keepBackground: false,
        },
      ],
    ],
  },
});
