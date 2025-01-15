import { Link } from 'next-view-transitions';

import { type Notes } from 'collections';

export const NoteItem = ({ post }: { post: Notes }) => {
  const { slug, title } = post;

  return (
    <div className="group">
      <Link href={`notes/${slug}`}>
        <div className="animate inline-flex items-center rounded-md border border-amber-100/10 bg-stone-900 px-2.5 py-1.5 group-hover:border-amber-100">
          <h1 className="animate font-display font-medium tracking-tight group-hover:text-amber-100">
            {title}
          </h1>
        </div>
      </Link>
    </div>
  );
};
