import { allStories } from 'contents';
import { constant } from '@/lib/constant';
import { pluralize } from '@/lib/utils';
import { StoryCard } from '@/components';

const { baseUrl, title } = constant;

const totalReadTime = allStories.reduce((total, story) => {
  const readTime = parseInt(story.readTime);
  return total + readTime;
}, 0);

const StoriesReadTime = pluralize(totalReadTime, 'minute');
const sorted = allStories.sort(
  (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime(),
);

const desc = `${allStories.length} stories, ${StoriesReadTime} total of brain dumps\u2014from existential crises to making people\u2019s lives simple, and everything in between.`;

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
        url: `${baseUrl}/api/og`,
      },
    ],
  },
  twitter: {
    title: 'Stories',
    description: desc,
    card: 'summary_large_image',
    images: [
      {
        url: `${baseUrl}/api/og`,
      },
    ],
  },
};

const Stories = () => {
  return (
    <section>
      <p className="mb-12 font-medium text-amber-50">
        This is{' '}
        <span className="text-accent">
          {StoriesReadTime} of my brain dumps, explorations, and insights.
        </span>{' '}
        I touch on different topics, from existential crises to making
        people&rsquo;s live simple , and everything in between.{' '}
        <span className="text-accent">
          {allStories.length} stories so far&mdash;stay tuned for more!
        </span>
      </p>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {sorted.map((post) => (
          <li key={post.slug}>
            <StoryCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Stories;
