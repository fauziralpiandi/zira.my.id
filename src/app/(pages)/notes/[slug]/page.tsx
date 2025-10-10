import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allNotes } from '@/lib/contents';
import { formatDate } from '@/lib/utils';
import { Mdx } from '@/components';

export const dynamicParams = true;
export const revalidate = 3600;
export const generateStaticParams = async () => {
  return allNotes().map((post) => ({
    slug: post.slug,
  }));
};

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const params = await props.params;
  const post = allNotes().find((post) => post.slug === params.slug);

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
  const post = allNotes().find((post) => post.slug === params.slug);

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
        <div className="mb-12 flex flex-col items-start space-y-0.5">
          <h1 className="text-xl font-bold text-amber-50">{post.title}</h1>
          <div className="font-display text-accent flex items-center space-x-1.5 text-xs font-light">
            <time
              dateTime={post.date}
              date-absolute={formatDate(post.date).format('dddd, MMM Do, YYYY')}
              date-relative={`Written ${formatDate(post.date).from()}`}
              className="before:content-[attr(date-absolute)] hover:before:content-[attr(date-relative)]"
            />
            <span className="font-bold">&middot;</span>
            <span>{post.wordCount} word(s)</span>
          </div>
        </div>
        <Mdx code={post.body.code} />
      </main>
    </>
  );
}
