import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from 'next-view-transitions';
import { formatDate } from '@/lib/utils';
import { stories, type Stories, totalReadTime } from '@/lib/contents';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://zira.my.id/stories',
  },
  title: 'Stories',
  description: `${totalReadTime()} total of brain dumps\u2014from existential crises to making people\u2019s lives simple, and everything in between.`,
  openGraph: {
    title: 'Stories',
    description: `${totalReadTime()} total of brain dumps\u2014from existential crises to making people\u2019s lives simple, and everything in between.`,
    url: 'https://zira.my.id/stories',
    siteName: 'Fauzira Alpiandi',
    type: 'website',
    images: [
      {
        url: 'https://zira.my.id/api/og',
      },
    ],
  },
  twitter: {
    title: 'Stories',
    description: `${totalReadTime()} total of brain dumps\u2014from existential crises to making people\u2019s lives simple, and everything in between.`,
    card: 'summary_large_image',
    images: [
      {
        url: 'https://zira.my.id/api/og',
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
                dateTime={post.published}
                className="font-display text-accent text-xs font-medium"
              >
                {formatDate(post.published).format('MMMM Do, YYYY')}
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
          {totalReadTime()} of my brain dumps, explorations, and insights.
        </span>{' '}
        I touch on different topics, from existential crises to making
        people&rsquo;s live simple , and everything in between&mdash;
        <span className="text-accent">stay tuned for more!</span>
      </p>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {stories().map(post => (
          <li key={post.slug}>
            <StoryCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
}
