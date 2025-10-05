import type { Metadata } from 'next';
import { Link } from 'next-view-transitions';
import { formatDate } from '@/lib/utils';
import { type Notes, calculateTotal, notes } from '@/lib/contents';

const totalWordCount = () => calculateTotal(notes(), 'wordCount', 'word');

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://zira.my.id/notes',
  },
  title: 'Notes',
  description: `Blending the intangible with reality and finding simplicity in chaos\u2014I\u2019ve shared ${totalWordCount()} :)`,
  openGraph: {
    title: 'Notes',
    description: `Blending the intangible with reality and finding simplicity in chaos\u2014I\u2019ve shared ${totalWordCount()} :)`,
    url: 'https://zira.my.id/notes',
    siteName: 'Fauzira Alpiandi',
    type: 'website',
    images: [
      {
        url: 'https://zira.my.id/api/og',
        alt: 'Notes',
        width: 1200,
        height: 630
      },
    ],
  },
  twitter: {
    title: 'Notes',
    description: `Blending the intangible with reality and finding simplicity in chaos\u2014I\u2019ve shared ${totalWordCount()} :)`,
    card: 'summary_large_image',
    images: [
      {
        url: 'https://zira.my.id/api/og',
        alt: 'Notes',
        width: 1200,
        height: 630
      },
    ],
  },
};

function NoteItem({ post }: { post: Notes }) {
  return (
    <div className="flex flex-col">
      <Link href={`notes/${post.slug}`}>
        <p className="text-lg leading-snug font-medium">{post.title}</p>
        <span className="sr-only">{post.summary}</span>
        <time
          dateTime={post.published}
          className="font-display text-accent text-xs"
        >
          {formatDate(post.published).format('MMMM Do, YYYY')}
        </time>
      </Link>
    </div>
  );
}

export default function Notes() {
  return (
    <section>
      <p className="font-medium text-amber-50">
        Off-desk, <span className="text-accent">I write and tell stories</span>,
        weaving together the intangible with reality, unraveling complexities
        and finding simplicity in chaos.{' '}
        <span className="text-accent">
          I&rsquo;ve shared {totalWordCount()}&mdash;
        </span>
        each one its own little chapter.
      </p>
      <ul className="my-12 grid grid-cols-1 gap-4 md:grid-cols-2">
        {notes().map((post) => (
          <li key={post.slug} className="flex items-start gap-2">
            <span className="text-neutral-500">&mdash;</span>
            <NoteItem post={post} />
          </li>
        ))}
      </ul>
      <p className="text-xs text-neutral-300">
        And hundreds of other records that linger still, confined to
        paper&mdash;patiently awaiting their turn to feel important...
      </p>
    </section>
  );
}
