import Link from 'next/link'
import formatDate from 'app/lib/format'
import { getPosts } from 'app/lib/provider'
import { PostProps, FilteredPostsProps } from 'app/lib/types'
import {
  DEFAULT_RECENT,
  DEFAULT_FEATURED,
  getFeaturedPosts,
  getRecentPosts,
} from 'app/lib/utils'

export async function MyPosts({
  recent = DEFAULT_RECENT,
  featured = DEFAULT_FEATURED,
}: FilteredPostsProps) {
  let allPosts: PostProps[] = []

  try {
    allPosts = (await getPosts()).filter(Boolean) as PostProps[]
  } catch (error) {
    console.error('Failed to fetch posts—', error)
    return (
      <span className="font-medium text-sm text-red-500">
        Unable to load posts
      </span>
    )
  }

  if (!allPosts.length) {
    return (
      <span className="font-medium text-sm text-yellow-500">
        Check back soon for updates!
      </span>
    )
  }

  const featuredPosts = getFeaturedPosts(allPosts, featured)
  const recentPosts = getRecentPosts(featuredPosts, recent)

  return (
    <div>
      {recentPosts.map((post) => (
        <Link
          key={post.slug}
          className="flex flex-col my-4 space-y-2"
          href={`/posts/${post.slug}`}
          aria-label={`Read more about ${post.metadata.title}`}
        >
          <div className="w-full flex flex-col md:flex-row md:space-x-4">
            <p className="text-neutral-400 tabular-nums">
              {formatDate(post.metadata.date, 'absolute')}
            </p>
            <p className="font-medium text-neutral-200 leading-snug">
              {post.metadata.title}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
