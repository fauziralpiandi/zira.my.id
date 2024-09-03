import Link from 'next/link'
import { formatDate } from 'app/utils/meta'
import { getPosts } from 'app/utils/provider'

export interface PostType {
  slug: string
  metadata: {
    date: string
    title: string
    isFeatured?: boolean // Optional VIP pass for the cool kids' club.
  }
}

export interface PostsProps {
  recent?: number
  featured?: boolean
}

export async function MyPosts({ recent, featured = false }: PostsProps) {
  let allPosts: PostType[] = []
  try {
    // The digital equivalent of fishing.
    allPosts = (await getPosts()).filter(Boolean) as PostType[]
  } catch (error) {
    console.error('Failed to fetch posts—', error)
    return (
      <div className="text-red-500">
        Unable to load posts. Please try again later.
      </div>
    )
  }

  if (!allPosts.length) {
    return (
      <div className="text-yellow-500">Check back soon for updates!</div>
    )
  }

  // Filtering, sorting, and slicing—because we love making decisions for our users.
  const filteredPosts = allPosts
    .filter((post) => !featured || post.metadata.isFeatured) // Only let the "chosen ones" through if featured is true.
    .sort(
      (a, b) =>
        new Date(b.metadata.date).getTime() -
        new Date(a.metadata.date).getTime(), // Freshness matters! New posts first, please.
    )
    .slice(0, recent) // Just the right amount of posts—because less is more, right?

  return (
    <div>
      {filteredPosts.map((post) => (
        <Link
          key={post.slug}
          className="flex flex-col my-4 space-y-2"
          href={`/posts/${post.slug}`}
        >
          <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
            <p className="text-neutral-400 tabular-nums">
              {formatDate(post.metadata.date, 'absolute')}{' '}
            </p>
            <p className="font-medium text-neutral-200 leading-snug">
              {post.metadata.title}{' '}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
