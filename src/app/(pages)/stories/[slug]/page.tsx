import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import waktos from 'waktos';
import relativeTime from 'waktos/plugin/relativeTime';

import { allStories } from 'contents';
import { constant } from '@/lib/constant';
import { LikeButton } from '@/components/ui';
import { Mdx } from '@/components';

waktos.plugin(relativeTime);

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const params = await props.params;
  const post = allStories.find(post => post.slug === params.slug);

  if (!post) {
    return {
      title: '404',
      description: 'The page you are looking for does not exist.',
    };
  }

  return {
    alternates: {
      canonical: `${constant.baseUrl}/stories/${post.slug}`,
    },
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `${constant.baseUrl}/stories/${post.slug}`,
      siteName: constant.title,
      type: 'article',
      images: [
        {
          url: `${constant.baseUrl}/api/og`,
        },
      ],
    },
    twitter: {
      title: post.title,
      description: post.summary,
      card: 'summary_large_image',
      images: [
        {
          url: `${constant.baseUrl}/api/og`,
        },
      ],
    },
  };
};

export default async function Story(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = allStories.find(post => post.slug === params.slug);

  if (!post) return notFound();

  return (
    <section>
      <div className="text-left">
        <time
          className="text-accent text-xs before:content-[attr(data-absolute)] hover:before:content-[attr(data-relative)]"
          dateTime={formatDate(post.published).toDateString()}
          data-absolute={`On ${formatDate(post.published).toDateString()}`}
          data-relative={`Posted ${waktos(post.published).from()}`}
        />
        <h1 className="font-display mt-3 mb-2.5 text-3xl font-extrabold tracking-tight text-amber-50 md:mx-auto">
          {post.title}
        </h1>
        <p className="text-sm text-neutral-400 md:mx-auto">{post.summary}</p>
      </div>
      <figure className="relative right-[50%] left-[50%] my-8 aspect-2/1 w-screen translate-x-[-50%] bg-neutral-900 md:aspect-21/9 md:max-w-2xl md:rounded-lg">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          className="w-full object-cover md:rounded-lg"
        />
        <div className="absolute right-3 bottom-3 z-10">
          <LikeButton slug={post.slug} />
        </div>
      </figure>
      <Mdx code={post.body.code} />
    </section>
  );
}
