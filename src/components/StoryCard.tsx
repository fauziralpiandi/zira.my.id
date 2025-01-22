import Image from 'next/image';
import { Link } from 'next-view-transitions';

import { type Stories } from 'collections';
import { formattedDate } from '~/lib/utils';

export const StoryCard = ({ post }: { post: Stories }) => {
  const { slug, image, title, summary, published, readTime } = post;

  return (
    <div className="group h-full overflow-hidden">
      <Link href={`stories/${slug}`} className="group flex h-full flex-col">
        <figure className="relative aspect-[3/2] overflow-hidden rounded-md border border-neutral-900 bg-neutral-900">
          <Image
            src={image}
            alt={title}
            fill
            className="animate object-cover group-hover:scale-110"
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end bg-neutral-950/50 p-4 backdrop-blur backdrop-grayscale">
            <div className="flex items-center space-x-1.5">
              <time
                className="font-display text-xs font-medium text-accent"
                dateTime={formattedDate(published, 'absolute')}
              >
                {formattedDate(published, 'absolute')}
              </time>
              <span className="text-xs text-neutral-300">/</span>
              <span className="font-display text-xs font-medium text-accent">
                {readTime}
              </span>
            </div>
            <h1 className="mt-1.5 line-clamp-2 text-lg font-semibold leading-tight">
              {title}
            </h1>
            <p className="sr-only">{summary}</p>
          </div>
        </figure>
      </Link>
    </div>
  );
};
