import Link from 'next/link'
import { formatDate } from 'app/utils/meta'
import { getBlogPosts } from 'app/utils/helper'

export interface BlogPostType {
  slug: string
  metadata: {
    publishedAt: string
    title: string
    isFeatured?: boolean
  }
}

export interface BlogPostsProps {
  recent?: number
  featured?: boolean
}

export async function BlogPosts({
  recent,
  featured = false,
}: BlogPostsProps) {
  let allBlogs: BlogPostType[] = []
  try {
    allBlogs = (await getBlogPosts()).filter(Boolean) as BlogPostType[]
  } catch (error) {
    console.error('Failed to fetch blog posts\u2014', error)
    return (
      <div className="text-red-500">
        Error&mdash; Unable to load blog posts. Please try again later.
      </div>
    )
  }

  if (!allBlogs.length) {
    return (
      <div className="text-yellow-500">
        Warning&mdash; No blog posts found. Check back soon for updates!
      </div>
    )
  }

  const filteredBlogs = allBlogs
    .filter((post) => !featured || post.metadata.isFeatured)
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() -
        new Date(a.metadata.publishedAt).getTime(),
    )
    .slice(0, recent)

  return (
    <div>
      {filteredBlogs.map((post) => (
        <Link
          key={post.slug}
          className="flex flex-col my-4 space-y-2"
          href={`/blog/${post.slug}`}
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
