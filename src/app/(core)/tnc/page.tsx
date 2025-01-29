import { notFound } from 'next/navigation';

import { allStatics } from 'collections';
import { constant } from '~/lib/constant';
import { formattedDate } from '~/lib/utils';
import { MdxContent } from '~/components/mdx';

const { baseUrl } = constant;
const page = allStatics.find((doc) => doc.slug === 'tnc');
const { title, summary, date, body } = page!;

export const metadata = {
  alternates: {
    canonical: `${baseUrl}/tnc`,
  },
  title: title,
  description: summary,
  openGraph: {
    title: title,
    description: summary,
    url: `${baseUrl}/tnc`,
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

const TnC = () => {
  if (!page) {
    return notFound();
  }

  return (
    <section>
      <div className="mb-8">
        <time
          className="font-display text-sm font-light text-accent"
          dateTime={formattedDate(date, 'absolute')}
        >
          Effective on {formattedDate(date, 'absolute')}
        </time>
      </div>
      <MdxContent code={body.code} />
    </section>
  );
};

export default TnC;
