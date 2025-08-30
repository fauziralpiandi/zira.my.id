import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { stories } from '@/lib/contents';
import { LikeButton } from '@/components/ui';
import { Mdx } from '@/components';

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const params = await props.params;
  const post = stories().find(post => post.slug === params.slug);

  if (!post) {
    return notFound();
  }

  return {
    alternates: {
      canonical: `https://zira.my.id/stories/${post.slug}`,
    },
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `https://zira.my.id/stories/${post.slug}`,
      siteName: 'Fauzira Alpiandi',
      type: 'article',
      images: [
        {
          url: 'https://zira.my.id/api/og',
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
        },
      ],
    },
  };
};

export default async function Story(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = stories().find(post => post.slug === params.slug);

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
      <section>
        <div className="mb-10 flex flex-col items-start">
          {post.image && (
            <Image
              className="mb-8 size-full rounded-3xl object-cover"
              src={post.image}
              alt={post.title}
              width={768}
              height={450}
              priority
            />
          )}
          <h1 className="text-3xl font-bold text-amber-50">{post.title}</h1>
          <div className="mt-2 flex items-center gap-2 text-xs text-neutral-400">
            <time dateTime={post.published}>
              {formatDate(post.published).format('dddd, MMM Do, YYYY')}
            </time>
            <span>&middot;</span>
            <span>{post.readTime}</span>
          </div>
        </div>
        <div className="prose prose-neutral prose-quoteless prose-invert prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-a:font-medium prose-a:text-amber-50 prose-a:underline-offset-4 prose-a:decoration-amber-50/50 hover:prose-a:decoration-amber-50 prose-strong:font-medium prose-strong:text-amber-50 prose-code:rounded prose-code:bg-neutral-800 prose-code:px-1 prose-code:py-0.5 prose-code:font-medium prose-code:text-amber-50 prose-pre:border prose-pre:border-neutral-800 mx-auto max-w-none">
          <Mdx code={post.body.code} />
        </div>
        <LikeButton slug={post.slug} />
      </section>
    </>
  );
}
