import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import { makeSource } from 'contentlayer2/source-files';

import { Notes, Stories } from '~/lib/schemas';

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
