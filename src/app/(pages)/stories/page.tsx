import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from 'next-view-transitions';
import { type Stories, allStories, totalOf } from '@/lib/contents';
import { formatDate } from '@/lib/utils';

const totalReadTime = totalOf(allStories(), 'readTime');

export const metadata: Metadata = {
  title: 'Stories',
  description: `${totalReadTime} min(s) of crafted experiences, learnings, and explorations\u2014longer reads on topics, ideas, and more, a story in every post...`,
  openGraph: {
    title: 'Stories',
    description: `${totalReadTime} min(s) of crafted experiences, learnings, and explorations\u2014longer reads on topics, ideas, and more, a story in every post...`,
    url: 'https://zira.my.id/stories',
    siteName: 'Fauzira Alpiandi',
    type: 'website',
    images: [
      {
        url: 'https://zira.my.id/api/og',
        alt: 'Stories',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'Stories',
    description: `${totalReadTime} min(s) of crafted experiences, learnings, and explorations\u2014longer reads on topics, ideas, and more, a story in every post...`,
    card: 'summary_large_image',
    images: [
      {
        url: 'https://zira.my.id/api/og',
        alt: 'Stories',
        width: 1200,
        height: 630,
      },
    ],
  },
};

function StoryCard({ post }: { post: Stories }) {
  return (
    <div className="group h-full overflow-hidden">
      <Link
        href={post._raw.flattenedPath}
        title={post.title}
        className="flex h-full flex-col rounded"
      >
        <figure className="relative aspect-16/9 overflow-hidden rounded border border-neutral-900 bg-neutral-900">
          <Image
            src={post.image}
            alt={post.title}
            fill
            quality={100}
            sizes="(max-width: 640px) 100vw, 50vw"
            className="animate object-cover group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end bg-neutral-950/75 p-4 backdrop-blur backdrop-grayscale">
            <div className="font-display text-accent flex items-center space-x-1.5 text-xs font-medium">
              <time dateTime={post.date}>
                {formatDate(post.date).format('MMMM Do, YYYY')}
              </time>
              <span className="font-bold">&middot;</span>
              <span>{post.readTime} min(s)</span>
            </div>
            <h2 className="mt-1.5 line-clamp-2 text-lg leading-tight font-semibold">
              {post.title}
            </h2>
            <span className="sr-only">{post.summary}</span>
          </div>
        </figure>
      </Link>
    </div>
  );
}

export default function Stories() {
  return (
    <main>
      <h1 className="font-medium text-amber-50">
        <span className="text-accent">
          {totalReadTime} min(s) of crafted experiences, learnings, and
          explorations
        </span>
        &mdash;longer reads on topics, ideas, and more, a story in every post...
      </h1>
      <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {allStories().map((post) => (
          <li key={post.slug}>
            <StoryCard post={post} />
          </li>
        ))}
      </ul>
    </main>
  );
}
