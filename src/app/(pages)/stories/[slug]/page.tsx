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
  const post = stories().find((post) => post.slug === params.slug);

  if (!post) {
    return notFound();
  }

  return {
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
          url: post.image,
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
          url: post.image,
          alt: post.title,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
};

export default async function Story(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = stories().find((post) => post.slug === params.slug);

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
        <div className="text-left">
          <time
            dateTime={post.date}
            date-abs={`On ${formatDate(post.date).format('dddd, MMM Do, YYYY')}`}
            date-rel={`Posted ${formatDate(post.date).from()}`}
            className="text-accent text-xs before:content-[attr(date-abs)] hover:before:content-[attr(date-rel)]"
          />
          <h1 className="font-display mt-3 mb-2.5 text-3xl font-extrabold tracking-tight text-amber-50 md:mx-auto">
            {post.title}
          </h1>
          <p className="text-sm text-neutral-400 md:mx-auto">{post.summary}</p>
        </div>
        <figure className="relative right-1/2 left-1/2 my-8 aspect-2/1 w-screen -translate-x-1/2 bg-neutral-900 md:aspect-21/9 md:max-w-xl md:rounded-lg">
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
      </main>
    </>
  );
}
