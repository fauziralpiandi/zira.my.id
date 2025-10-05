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
      resolve: (doc) => readingStats(doc.body.raw, 'word', 'word'),
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
      resolve: (doc) => readingStats(doc.body.raw, 'minute', 'minute'),
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
