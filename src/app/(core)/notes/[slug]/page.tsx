import { notFound } from 'next/navigation';

import { allNotes } from 'collections';
import { constant } from '~/lib/constant';
import { formattedDate } from '~/lib/utils';

import { BreadCrumb } from '~/components/ui';
import { MdxContent } from '~/components/mdx';

export const dynamicParams = true;
export const revalidate = 3600;

export const generateStaticParams = async () => {
  return allNotes.map((post) => ({
    slug: post.slug,
  }));
};

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const params = await props.params;
  const post = allNotes.find((post) => post.slug === params.slug);

  if (!post) {
    return notFound();
  }

  const { baseUrl } = constant;
  const { slug, title } = post;

  return {
    alternates: {
      canonical: `${baseUrl}/notes/${slug}`,
    },
    title: title,
    openGraph: {
      title: title,
      url: `${baseUrl}/notes/${slug}`,
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

const Notes = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const post = allNotes.find((post) => post.slug === params.slug);

  if (!post) {
    return notFound();
  }

  const { title, published, body } = post;

  return (
    <section>
      <BreadCrumb />
      <div className="mt-6" />
      <MdxContent code={body.code} />
      <div className="mt-12 flex flex-col items-start border-l-2 border-stone-500">
        <mark className="ml-3 font-display text-sm font-medium tracking-tight">
          {title} &#126;
        </mark>
        <time
          className="relative ml-3 mt-0.5 font-display text-xs text-amber-100 before:content-[attr(data-absolute)] hover:before:content-[attr(data-relative)]"
          dateTime={formattedDate(published, 'absolute')}
          data-absolute={formattedDate(published, 'absolute')}
          data-relative={formattedDate(published, 'relative')}
        />
      </div>
    </section>
  );
};

export default Notes;
