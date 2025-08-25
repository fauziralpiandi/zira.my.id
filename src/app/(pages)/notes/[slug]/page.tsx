import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import waktos from 'waktos';
import relativeTime from 'waktos/plugin/relativeTime';

import { allNotes } from 'contents';
import { constant } from '@/lib/constant';
import { Mdx } from '@/components';

waktos.plugin(relativeTime);

export const dynamicParams = true;
export const revalidate = 3600;

export const generateStaticParams = async () => {
  return allNotes.map(post => ({
    slug: post.slug,
  }));
};

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const params = await props.params;
  const post = allNotes.find(post => post.slug === params.slug);

  if (!post) {
    return {
      title: '404',
      description: 'The page you are looking for does not exist.',
    };
  }

  return {
    alternates: {
      canonical: `${constant.baseUrl}/notes/${post.slug}`,
    },
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `${constant.baseUrl}/notes/${post.slug}`,
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

export default async function Note(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = allNotes.find(post => post.slug === params.slug);

  if (!post) return notFound();

  return (
    <section>
      <div className="mb-10 flex flex-col items-start">
        <h1 className="text-xl font-bold text-amber-50">{post.title}</h1>
        <time
          className="font-display text-accent text-xs font-light before:content-[attr(data-absolute)] hover:before:content-[attr(data-relative)]"
          dateTime={formatDate(post.published).toDateString()}
          data-absolute={formatDate(post.published).toDateString()}
          data-relative={`Written ${waktos(post.published).from()}\u2014`}
        />
      </div>
      <Mdx code={post.body.code} />
    </section>
  );
}
