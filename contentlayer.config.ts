import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import { makeSource } from 'contentlayer2/source-files';

import { Notes, Static, Stories } from '~/lib/schemas';

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Notes, Static, Stories],
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
