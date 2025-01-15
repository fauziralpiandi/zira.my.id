import Image from 'next/image';
import { Link } from 'next-view-transitions';

import { type Stories } from 'collections';
import { formattedDate } from '~/lib/utils';

export const StoryItem = ({ post }: { post: Stories }) => {
  const { slug, image, title, summary, published, readTime } = post;

  return (
    <div className="group h-full overflow-hidden">
      <Link href={`stories/${slug}`} className="flex h-full flex-col">
        <figure className="relative mb-2 aspect-[18/9] overflow-hidden rounded bg-stone-900">
          <Image
            src={image}
            alt={title}
            fill
            loading="lazy"
            className="object-cover"
          />
        </figure>
        <div className="flex flex-1 flex-col justify-between p-1">
          <h1 className="mb-1.5 line-clamp-2 font-display text-lg font-bold leading-tight tracking-tight">
            {title}
          </h1>
          <p className="mb-3 line-clamp-2 text-sm leading-snug text-stone-400">
            {summary}
          </p>
          <div className="flex items-center justify-start font-display text-xs text-amber-100">
            <time
              className="whitespace-nowrap"
              dateTime={formattedDate(published, 'absolute')}
            >
              {formattedDate(published, 'absolute')}
            </time>
            <span className="mx-1.5">&middot;</span>
            <div className="whitespace-nowrap">{readTime}</div>
            <hr className="ml-3 flex-grow border-amber-100/10" />
          </div>
        </div>
      </Link>
    </div>
  );
};
