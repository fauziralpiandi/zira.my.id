import { Link } from 'next-view-transitions';

import { type Notes } from 'collections';
import { formattedDate } from '~/lib/utils';

export const NoteItem = ({ post }: { post: Notes }) => {
  const { slug, title, published } = post;

  return (
    <div className="group">
      <Link href={`notes/${slug}`} className="flex flex-col">
        <p className="text-lg font-medium leading-snug">{title}</p>
        <time
          className="font-display text-xs text-accent"
          dateTime={formattedDate(published, 'absolute')}
        >
          {formattedDate(published, 'absolute')}
        </time>
      </Link>
    </div>
  );
};
