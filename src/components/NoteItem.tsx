import { Link } from 'next-view-transitions';

import { type Notes } from 'collections';
import { formattedDate } from '~/lib/utils';

export const NoteItem = ({ post }: { post: Notes }) => {
  const { slug, title, summary, published } = post;

  return (
    <div className="group">
      <Link href={`notes/${slug}`} className="flex flex-col">
        <p className="text-lg leading-snug font-medium">{title}</p>
        <span className="sr-only">{summary}</span>
        <time
          className="font-display text-accent text-xs"
          dateTime={formattedDate(published, 'absolute')}
        >
          {formattedDate(published, 'absolute')}
        </time>
      </Link>
    </div>
  );
};
