import { defineDocumentType, makeSource } from 'contentlayer2/source-files';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import {
  calculateWordCount,
  estimateReadTime,
  findImage,
  getSlug,
  generateJsonLd,
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
      resolve: doc => calculateWordCount(doc.body.raw),
    },
    jsonLd: {
      type: 'json',
      resolve: generateJsonLd,
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
    jsonLd: {
      type: 'json',
      resolve: generateJsonLd,
    },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Notes, Stories],
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
