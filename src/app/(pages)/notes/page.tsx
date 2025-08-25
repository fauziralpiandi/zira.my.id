import type { Metadata } from 'next';
import { allNotes, type Notes } from 'contents';
import { constant } from '@/lib/constant';
import { Link } from 'next-view-transitions';
import { formatDate } from '@/lib/utils';

const sorted = allNotes.sort(
  (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime(),
);

const wordCount = allNotes.reduce(
  (acc, note) => acc + parseInt(note.wordCount),
  0,
);

const desc = `Blending the intangible with reality and finding simplicity in chaos\u2014I\u2019ve shared ${wordCount} across ${allNotes.length}.`;

export const metadata: Metadata = {
  alternates: {
    canonical: `${constant.baseUrl}/notes`,
  },
  title: 'Notes',
  description: desc,
  openGraph: {
    title: 'Notes',
    description: desc,
    url: `${constant.baseUrl}/notes`,
    siteName: constant.title,
    type: 'website',
    images: [
      {
        url: `${constant.baseUrl}/api/og`,
      },
    ],
  },
  twitter: {
    title: 'Notes',
    description: desc,
    card: 'summary_large_image',
    images: [
      {
        url: `${constant.baseUrl}/api/og`,
      },
    ],
  },
};

function NoteItem({ post }: { post: Notes }) {
  return (
    <div className="group">
      <Link href={`notes/${post.slug}`} className="flex flex-col">
        <p className="text-lg leading-snug font-medium">{post.title}</p>
        <span className="sr-only">{post.summary}</span>
        <time
          className="font-display text-accent text-xs"
          dateTime={formatDate(post.published).toDateString()}
        >
          {formatDate(post.published).toDateString()}
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
          I&rsquo;ve shared {wordCount} across {allNotes.length}&mdash;
        </span>
        each one its own little chapter.
      </p>
      <ul className="my-12 grid grid-cols-1 gap-4 md:grid-cols-2">
        {sorted.map(post => (
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
