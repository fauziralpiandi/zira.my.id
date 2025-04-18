import Image from 'next/image';
import { Link } from 'next-view-transitions';

import { type Stories } from 'contents';
import { formattedDate } from '@/lib/utils';

export const StoryCard = ({ post }: { post: Stories }) => {
  const { slug, image, title, summary, published, readTime } = post;

  return (
    <div className="group h-full overflow-hidden">
      <Link href={`stories/${slug}`} className="flex h-full flex-col">
        <figure className="relative aspect-3/2 overflow-hidden border border-neutral-900 bg-neutral-900">
          <Image
            src={image}
            alt={title}
            fill
            className="animate object-cover group-hover:scale-110"
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end bg-neutral-950/75 p-4 backdrop-blur backdrop-grayscale">
            <div className="flex items-center space-x-1.5">
              <time
                className="font-display text-accent text-xs font-medium"
                dateTime={formattedDate(published, 'absolute')}
              >
                {formattedDate(published, 'absolute')}
              </time>
              <span className="text-xs text-neutral-300">/</span>
              <span className="font-display text-accent text-xs font-medium">
                {readTime}
              </span>
            </div>
            <h1 className="mt-1.5 line-clamp-2 text-lg leading-tight font-semibold">
              {title}
            </h1>
            <span className="sr-only">{summary}</span>
          </div>
        </figure>
      </Link>
    </div>
  );
};
