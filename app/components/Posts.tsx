import Link from 'next/link'
import { formatDate } from 'app/utils/meta'
import { getPosts } from 'app/utils/helper'

export interface PostType {
  slug: string
  metadata: {
    publishedAt: string
    title: string
    isFeatured?: boolean
  }
}

export interface PostsProps {
  recent?: number
  featured?: boolean
}

export async function MyPosts({ recent, featured = false }: PostsProps) {
  let allPosts: PostType[] = []
  try {
    allPosts = (await getPosts()).filter(Boolean) as PostType[]
  } catch (error) {
    console.error('Failed to fetch posts\u2014', error)
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

  const filteredPosts = allPosts
    .filter((post) => !featured || post.metadata.isFeatured)
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() -
        new Date(a.metadata.publishedAt).getTime(),
    )
    .slice(0, recent)

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
              {formatDate(post.metadata.publishedAt, 'absolute')}
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
