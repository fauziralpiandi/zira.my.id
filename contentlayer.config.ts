import { defineDocumentType, makeSource } from 'contentlayer2/source-files';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import { getSlug, wordCount } from '@/lib/schemas';

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
      resolve: (doc) => wordCount(doc.body.raw),
    },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [notes],
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
