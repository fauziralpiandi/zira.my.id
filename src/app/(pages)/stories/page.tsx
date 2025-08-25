import type { Metadata } from 'next';
import { allStories, type Stories } from 'contents';
import { constant } from '@/lib/constant';
import Image from 'next/image';
import { Link } from 'next-view-transitions';
import { formatDate } from '@/lib/utils';

const sorted = allStories.sort(
  (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime(),
);

const readTime = allStories.reduce(
  (acc, story) => acc + parseInt(story.readTime),
  0,
);

const desc = `${allStories.length}, ${readTime} total of brain dumps\u2014from existential crises to making people\u2019s lives simple, and everything in between.`;

export const metadata: Metadata = {
  alternates: {
    canonical: `${constant.baseUrl}/stories`,
  },
  title: 'Stories',
  description: desc,
  openGraph: {
    title: 'Stories',
    description: desc,
    url: `${constant.baseUrl}/stories`,
    siteName: constant.title,
    type: 'website',
    images: [
      {
        url: `${constant.baseUrl}/api/og`,
      },
    ],
  },
  twitter: {
    title: 'Stories',
    description: desc,
    card: 'summary_large_image',
    images: [
      {
        url: `${constant.baseUrl}/api/og`,
      },
    ],
  },
};

function StoryCard({ post }: { post: Stories }) {
  return (
    <div className="group h-full overflow-hidden">
      <Link href={`stories/${post.slug}`} className="flex h-full flex-col">
        <figure className="relative aspect-3/2 overflow-hidden border border-neutral-900 bg-neutral-900">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="animate object-cover group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end bg-neutral-950/75 p-4 backdrop-blur backdrop-grayscale">
            <div className="flex items-center space-x-1.5">
              <time
                className="font-display text-accent text-xs font-medium"
                dateTime={formatDate(post.published).toDateString()}
              >
                {formatDate(post.published).toDateString()}
              </time>
              <span className="text-xs text-neutral-300">/</span>
              <span className="font-display text-accent text-xs font-medium">
                {post.readTime}
              </span>
            </div>
            <h1 className="mt-1.5 line-clamp-2 text-lg leading-tight font-semibold">
              {post.title}
            </h1>
            <span className="sr-only">{post.summary}</span>
          </div>
        </figure>
      </Link>
    </div>
  );
}

export default function Stories() {
  return (
    <section>
      <p className="mb-12 font-medium text-amber-50">
        This is{' '}
        <span className="text-accent">
          {readTime} of my brain dumps, explorations, and insights.
        </span>{' '}
        I touch on different topics, from existential crises to making
        people&rsquo;s live simple , and everything in between.{' '}
        <span className="text-accent">
          {allStories.length} stories so far&mdash;stay tuned for more!
        </span>
      </p>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {sorted.map(post => (
          <li key={post.slug}>
            <StoryCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
}
