import { allStories } from 'collections';
import { constant } from '~/lib/constant';
import { pluralize } from '~/lib/utils';
import { StoryItem } from '~/components';

const { baseUrl, title } = constant;

const totalReadTime = allStories.reduce((total, story) => {
  const readTime = parseInt(story.readTime);
  return total + readTime;
}, 0);

const StoriesReadTime = pluralize(totalReadTime, 'minute');
const sorted = allStories.sort(
  (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()
);

const desc = `This is ${StoriesReadTime} of my brain dumps, explorations, and insights. I touch on different topics, from existential crises to the best way to make a cup of coffee, and everything in between. ${allStories.length} stories so far\u2014stay tuned for more!`;

export const metadata = {
  alternates: {
    canonical: `${baseUrl}/stories`,
  },
  title: 'Stories',
  description: desc,
  openGraph: {
    title: 'Stories',
    description: desc,
    url: `${baseUrl}/stories`,
    siteName: title,
    type: 'website',
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent('Stories')}`,
        type: 'image/png',
        width: 1200,
        height: 630,
        alt: `OpenGraph`,
      },
    ],
  },
  twitter: {
    title: 'Stories',
    description: desc,
    card: 'summary_large_image',
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent('Stories')}`,
        type: 'image/png',
        width: 1200,
        height: 630,
        alt: `OpenGraph`,
      },
    ],
  },
};

const Stories = () => {
  return (
    <section>
      <p className="mb-12 text-sm text-amber-100">
        <mark>
          This is {StoriesReadTime} of my brain dumps, explorations, and
          insights. I touch on different topics, from existential crises to the
          best way to make a cup of coffee, and everything in between.{' '}
          {allStories.length} stories so far&mdash;stay tuned for more!
        </mark>
      </p>
      <ul className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {sorted.map((post) => (
          <li key={post.slug}>
            <StoryItem post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Stories;
