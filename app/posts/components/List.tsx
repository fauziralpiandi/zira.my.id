import Link from 'next/link'
import formatDate from 'app/lib/format'
import { getPosts } from 'app/lib/provider'
import { PostProps, FilteredPostsProps } from 'app/lib/types'
import { getFilteredPosts } from 'app/lib/utils'

export async function MyPosts({ featured, recent }: FilteredPostsProps) {
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

  const filteredPosts = getFilteredPosts(allPosts, featured, recent)

  return (
    <div>
      {filteredPosts.map((post) => (
        <Link
          key={post.slug}
          className="flex flex-col my-4 space-y-2"
          href={`/posts/${post.slug}`}
          aria-label={`Read more about ${post.metadata.title || 'Untitled'}`}
        >
          <div className="flex flex-col md:flex-row md:justify-between w-full">
            <p className="text-neutral-400 tabular-nums md:order-2">
              {formatDate(
                post.metadata.date || new Date().toISOString(),
                'absolute',
              )}
            </p>
            <p className="font-medium text-neutral-200 leading-snug md:order-1">
              {post.metadata.title || 'Untitled'}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
