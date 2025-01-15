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

const desc = `Off-desk, I write and tell stories, spinning fresh metaphors and thought-provoking ideas, weaving together the intangible and the real. I dive into the depths of curiosity, unraveling complexities and finding simplicity in chaos. I\u2019ve written ${NotesWordCount} in ${allNotes.length} notes\u2014each one a brainwave, hopefully not a brain freeze.`;

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
      <h1 className="font-display text-2xl font-bold tracking-tight">
        Notes &#126;
      </h1>
      <p className="mb-12 mt-4 text-sm text-amber-100">
        Off-desk, I write and tell stories, spinning fresh metaphors and
        thought-provoking ideas, weaving together the intangible and the real. I
        dive into the depths of curiosity, unraveling complexities and finding
        simplicity in chaos. I&rsquo;ve written {NotesWordCount} in
        {allNotes.length} notes&mdash;each one a brainwave, hopefully not a
        brain freeze.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {sorted.map((post) => (
          <div key={post.slug}>
            <NoteItem post={post} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Notes;
