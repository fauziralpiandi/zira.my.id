import { allNotes } from 'collections';
import { constant } from '~/lib/constant';
import { pluralize } from '~/lib/utils';
import { NoteItem } from '~/components';

const { baseUrl, title } = constant;

const totalWordCount = allNotes.reduce((total, note) => {
  const wordCount = parseInt(note.wordCount);
  return total + wordCount;
}, 0);

const NotesWordCount = pluralize(totalWordCount, 'word');
const sorted = allNotes.sort(
  (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()
);

const desc = `Blending the intangible with reality and finding simplicity in chaos\u2014I\u2019ve written ${NotesWordCount} in ${allNotes.length} notes.`;

export const metadata = {
  alternates: {
    canonical: `${baseUrl}/notes`,
  },
  title: 'Notes',
  description: desc,
  openGraph: {
    title: 'Notes',
    description: desc,
    url: `${baseUrl}/notes`,
    siteName: title,
    type: 'website',
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent('Notes')}`,
        type: 'image/png',
        width: 1200,
        height: 630,
        alt: `OpenGraph`,
      },
    ],
  },
  twitter: {
    title: 'Notes',
    description: desc,
    card: 'summary_large_image',
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent('Notes')}`,
        type: 'image/png',
        width: 1200,
        height: 630,
        alt: `OpenGraph`,
      },
    ],
  },
};

const Notes = () => {
  return (
    <section>
      <p className="mb-12 font-medium text-amber-50">
        Off-desk, <span className="text-accent">I write and tell stories</span>,
        weaving together the intangible with reality, unraveling complexities
        and finding simplicity in chaos.{' '}
        <span className="text-accent">
          I&rsquo;ve written {NotesWordCount} in {allNotes.length} notes&mdash;
        </span>
        each one a brainwave, hopefully not a brain freeze.
      </p>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {sorted.map((post) => (
          <li key={post.slug} className="flex items-start gap-2">
            <span className="text-neutral-500">&mdash;</span>
            <NoteItem post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Notes;
