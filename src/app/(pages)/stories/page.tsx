import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from 'next-view-transitions';
import { formatDate } from '@/lib/utils';
import { type Stories, calculateTotal, stories } from '@/lib/contents';

const total = calculateTotal(stories(), 'readTime');

export const metadata: Metadata = {
  title: 'Stories',
  description: `${total} min(s) of crafted experiences, learnings, and explorations\u2014longer reads on topics, ideas, and more, a story in every post.`,
  openGraph: {
    title: 'Stories',
    description: `${total} min(s) of crafted experiences, learnings, and explorations\u2014longer reads on topics, ideas, and more, a story in every post.`,
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
    description: `${total} min(s) of crafted experiences, learnings, and explorations\u2014longer reads on topics, ideas, and more, a story in every post.`,
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
        {total} min(s) of crafted experiences, learnings, and
        explorations&mdash;longer reads on topics, ideas, and more, a story in
        every post.
      </p>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {stories().map((post) => (
          <li key={post.slug}>
            <StoryCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
}
