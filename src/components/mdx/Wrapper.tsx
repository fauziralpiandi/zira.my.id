import { useMDXComponent } from 'next-contentlayer2/hooks';

import { MdxLink, MdxPreCode } from '@/components/mdx';

const MdxComponents = {
  a: MdxLink,
  pre: MdxPreCode,
};

export const MdxContent = ({ code }: { code: string }) => {
  const BodyContent = useMDXComponent(code);

  return (
    <article className="prose prose-neutral prose-invert mx-auto max-w-2xl">
      <BodyContent components={MdxComponents} />
    </article>
  );
};
