import Image from 'next/image';
import { notFound } from 'next/navigation';

import { allStories } from 'collections';
import { constant } from '~/lib/constant';
import { formattedDate } from '~/lib/utils';
import { LikeButton } from '~/components/ui';
import { MdxContent } from '~/components/mdx';

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const params = await props.params;
  const post = allStories.find((post) => post.slug === params.slug);

  if (!post) {
    return notFound();
  }

  const { baseUrl } = constant;
  const { slug, title, summary } = post;

  return {
    alternates: {
      canonical: `${baseUrl}/stories/${slug}`,
    },
    title: title,
    description: summary,
    openGraph: {
      title: title,
      description: summary,
      url: `${baseUrl}/stories/${slug}`,
      siteName: constant.title,
      type: 'article',
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(title)}`,
          type: 'image/png',
          width: 1200,
          height: 630,
          alt: `OpenGraph`,
        },
      ],
    },
    twitter: {
      title: title,
      description: summary,
      card: 'summary_large_image',
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(title)}`,
          type: 'image/png',
          width: 1200,
          height: 630,
          alt: `OpenGraph`,
        },
      ],
    },
  };
};

const Stories = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const post = allStories.find((post) => post.slug === params.slug);

  if (!post) {
    return notFound();
  }

  const { slug, title, summary, published, image, body } = post;

  return (
    <section>
      <div className="text-left">
        <time
          className="text-xs text-accent before:content-[attr(data-absolute)] hover:before:content-[attr(data-relative)]"
          dateTime={formattedDate(published, 'absolute', true)}
          data-absolute={`On ${formattedDate(published, 'absolute', true)}`}
          data-relative={`Posted ${formattedDate(published, 'relative')}`}
        />
        <h1 className="mb-2.5 mt-3 font-display text-3xl font-extrabold tracking-tight text-amber-50 md:mx-auto">
          {title}
        </h1>
        <p className="text-sm text-neutral-400 md:mx-auto">{summary}</p>
      </div>
      <figure className="relative left-[50%] right-[50%] my-8 aspect-[2/1] w-screen translate-x-[-50%] bg-neutral-900 md:aspect-[21/9] md:max-w-2xl md:rounded-lg">
        <Image
          src={image}
          alt={title}
          fill
          priority
          className="w-full object-cover md:rounded-lg"
        />
        <div className="absolute bottom-3 right-3 z-10">
          <LikeButton slug={slug} />
        </div>
      </figure>
      <MdxContent code={body.code} />
    </section>
  );
};

export default Stories;
