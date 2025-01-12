import { Link } from 'next-view-transitions';
import { type Notes } from 'collections';
import { formattedDate } from '~/lib/utils';

export const NoteItem = ({ post }: { post: Notes }) => {
  const { slug, title, summary, published } = post;

  return (
    <div className="group h-full overflow-hidden">
      <Link href={`notes/${slug}`} className="flex h-full flex-col">
        <div className="flex flex-1 flex-col justify-between">
          <h1 className="line-clamp-1 font-display text-lg font-semibold leading-relaxed tracking-tight">
            {title}
          </h1>
          <div className="flex items-center justify-between font-display text-xs text-amber-100">
            <time
              className="whitespace-nowrap"
              dateTime={formattedDate(published, 'absolute')}
            >
              {formattedDate(published, 'absolute')}
            </time>
            <hr className="ml-3 flex-grow border-amber-100/10" />
          </div>
          <p className="mt-1.5 text-sm text-stone-400">{summary}</p>
        </div>
      </Link>
    </div>
  );
};
