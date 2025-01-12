import { makeSource } from 'contentlayer2/source-files';
import { Notes, Stories } from '~/lib/schemas';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';

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
