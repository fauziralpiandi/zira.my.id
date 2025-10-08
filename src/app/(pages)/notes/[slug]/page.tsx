import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { notes } from '@/lib/contents';
import { Mdx } from '@/components';

export const dynamicParams = true;
export const revalidate = 3600;
export const generateStaticParams = async () => {
  return notes().map((post) => ({
    slug: post.slug,
  }));
};

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const params = await props.params;
  const post = notes().find((post) => post.slug === params.slug);

  if (!post) {
    return notFound();
  }

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `https://zira.my.id/notes/${post.slug}`,
      siteName: 'Fauzira Alpiandi',
      type: 'article',
      images: [
        {
          url: 'https://zira.my.id/api/og',
          alt: post.title,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title: post.title,
      description: post.summary,
      card: 'summary_large_image',
      images: [
        {
          url: 'https://zira.my.id/api/og',
          alt: post.title,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
};

export default async function Note(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = notes().find((post) => post.slug === params.slug);

  if (!post) {
    return notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(post.jsonLd),
        }}
      />
      <main>
        <div className="mb-10 flex flex-col items-start space-y-0.5">
          <h1 className="text-xl font-bold text-amber-50">{post.title}</h1>
          <time
            dateTime={post.date}
            date-absolute={formatDate(post.date).format('dddd, MMM Do, YYYY')}
            data-relative={`Written ${formatDate(post.date).from()}\u2014`}
            className="font-display text-accent text-xs font-light before:content-[attr(date-absolute)] hover:before:content-[attr(date-relative)]"
          />
        </div>
        <Mdx code={post.body.code} />
      </main>
    </>
  );
}
