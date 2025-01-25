import { notFound } from 'next/navigation';

import { allNotes } from 'collections';
import { constant } from '~/lib/constant';
import { formattedDate } from '~/lib/utils';
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
  const { slug, title, summary } = post;

  return {
    alternates: {
      canonical: `${baseUrl}/notes/${slug}`,
    },
    title: title,
    description: summary,
    openGraph: {
      title: title,
      description: summary,
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

const Notes = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const post = allNotes.find((post) => post.slug === params.slug);

  if (!post) {
    return notFound();
  }

  const { title, published, body } = post;

  return (
    <section>
      <div className="mb-10 flex flex-col items-start">
        <h1 className="text-xl font-semibold text-amber-50">{title}</h1>
        <time
          className="font-display text-xs font-light text-accent before:content-[attr(data-absolute)] hover:before:content-[attr(data-relative)]"
          dateTime={formattedDate(published, 'absolute', true)}
          data-absolute={formattedDate(published, 'absolute', true)}
          data-relative={`Written ${formattedDate(published, 'relative')}`}
        />
      </div>
      <MdxContent code={body.code} />
    </section>
  );
};

export default Notes;
