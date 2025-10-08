import type { Metadata } from 'next';
import { Link } from 'next-view-transitions';
import { formatDate } from '@/lib/utils';
import { type Notes, calculateTotal, notes } from '@/lib/contents';

const total = calculateTotal(notes(), 'wordCount');

export const metadata: Metadata = {
  title: 'Notes',
  description: `Off-desk, I jot ${total} word(s) of my thoughts\u2014on life, reflections, and everything in between\u2014each one its own chapter.`,
  openGraph: {
    title: 'Notes',
    description: `Off-desk, I jot x word(s) of my thoughts\u2014on life, reflections, and everything in between\u2014each one its own chapter.`,
    url: 'https://zira.my.id/notes',
    siteName: 'Fauzira Alpiandi',
    type: 'website',
    images: [
      {
        url: 'https://zira.my.id/api/og',
        alt: 'Notes',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'Notes',
    description: `Off-desk, I jot x word(s) of my thoughts\u2014on life, reflections, and everything in between\u2014each one its own chapter.`,
    card: 'summary_large_image',
    images: [
      {
        url: 'https://zira.my.id/api/og',
        alt: 'Notes',
        width: 1200,
        height: 630,
      },
    ],
  },
};

function NoteItem({ post }: { post: Notes }) {
  return (
    <div className="flex flex-col">
      <Link href={`notes/${post.slug}`}>
        <h2 className="text-lg leading-5 font-medium">{post.title}</h2>
        <span className="sr-only">{post.summary}</span>
        <time dateTime={post.date} className="font-display text-accent text-xs">
          {formatDate(post.date).format('MMMM Do, YYYY')}
        </time>
      </Link>
    </div>
  );
}

export default function Notes() {
  return (
    <main>
      <h1 className="font-medium text-amber-50">
        Off-desk,{' '}
        <span className="text-accent">
          I jot {total} word(s) of my thoughts
        </span>
        —on life, reflections, and everything in between—
        <span className="text-accent">each one its own chapter...</span>
      </h1>
      <ul className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
        {notes().map((post) => (
          <li key={post.slug} className="flex items-start gap-2">
            <span className="text-neutral-500">&mdash;</span>
            <NoteItem post={post} />
          </li>
        ))}
      </ul>
    </main>
  );
}
