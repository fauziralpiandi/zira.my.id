import Image from 'next/image';
import { notFound } from 'next/navigation';

import { allStories } from 'collections';
import { constant } from '~/lib/constant';
import { formattedDate } from '~/lib/utils';

import { BreadCrumb, LikeButton } from '~/components/ui';
import { MdxContent } from '~/components/mdx';

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const params = await props.params;
  const post = allStories.find((post) => post.slug === params.slug);

  if (!post) {
    return notFound();
  }

  const { baseUrl } = constant;
  const { slug, title, summary } = post;

  return {
    alternates: {
      canonical: `${baseUrl}/stories/${slug}`,
    },
    title: title,
    description: summary,
    openGraph: {
      title: title,
      description: summary,
      url: `${baseUrl}/stories/${slug}`,
      siteName: constant.title,
      type: 'article',
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(title)}`,
          type: 'image/png',
          width: 1200,
          height: 630,
          alt: `OpenGraph`,
        },
      ],
    },
    twitter: {
      title: title,
      description: summary,
      card: 'summary_large_image',
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(title)}`,
          type: 'image/png',
          width: 1200,
          height: 630,
          alt: `OpenGraph`,
        },
      ],
    },
  };
};

const Stories = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const post = allStories.find((post) => post.slug === params.slug);

  if (!post) {
    return notFound();
  }

  const { slug, title, summary, published, image, body } = post;

  return (
    <section>
      <BreadCrumb />
      <LikeButton slug={slug} />
      <h1 className="my-3 font-display text-3xl font-extrabold leading-tight tracking-tight">
        {title}
      </h1>
      <p className="mb-6 text-sm text-stone-400">{summary}</p>
      <div className="flex items-center justify-between font-display">
        <time
          className="relative text-sm text-amber-100 before:content-[attr(data-absolute)] hover:before:content-[attr(data-relative)]"
          dateTime={formattedDate(published, 'absolute')}
          data-absolute={formattedDate(published, 'absolute')}
          data-relative={formattedDate(published, 'relative')}
        />
        <hr className="mx-3 flex-grow border-amber-100/10" />
      </div>
      <figure className="relative left-[50%] right-[50%] my-8 aspect-[1200/600] w-screen translate-x-[-50%] bg-stone-900 md:max-w-2xl md:rounded-lg">
        <Image
          src={image}
          alt={title}
          fill
          priority
          placeholder="blur"
          blurDataURL="data:image/webp;base64,UklGRjQDAABXRUJQVlA4WAoAAAAgAAAASAEAzQAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggRgEAANAWAJ0BKkkBzgA+kUihTSWkIyIgKACwEglpbuEgPBGWBqZu/gAnsA99snIe+7ezShocflIq9GyZ8AsJkjpyj5w+0y71Y8Q6aKXrvVMvDrJtsBVdUvRhWO3jRSm6G7zKpLA8sZ1kY45h3tJRH9d05FYQ+BdGGAz/zLuiNUnFd5mkeJgkV4Sk+CLip+8zyp93aip+pqpUnUqtlTZqGQVZNtgI+mJPy2TAt1Tva97hUS3En5Xau/XbBA4uWd9xADEAAP7qj3eLIo/nowiuXBVae46+LIjytZ1B072VJMBbkYdxmQEWHdP3XfRjmIg9WDo4xFEuw/UNV2YBL/taCDZ59pOBMEIjNoy6qHedlcP8tzb2fQL5krr3rcFqpwheGYRJ1eiev2sOp/NWNjAmJqLmnsufNUg85jx0WFbg68VGvaK+Q3kwAAAA"
          className="w-full object-cover md:rounded-lg"
        />
      </figure>
      <MdxContent code={body.code} />
    </section>
  );
};

export default Stories;
