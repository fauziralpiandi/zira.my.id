import { Link } from 'next-view-transitions'

import { getMyBlog } from '~/blogParser'
import { formatDate } from '~/blogMeta'

type BlogParams = {
  slug: string
  metadata: {
    title: string
    published: string
    category?: string
    featured?: boolean
  }
}

type FilteredBlog = {
  recent?: number
  featured?: boolean
  category?: string
}

function getFilteredBlog(
  myBlog: BlogParams[],
  featured: boolean | undefined,
  recent: number | undefined,
  category: string | undefined,
): BlogParams[] {
  return myBlog
    .filter((blog) => !featured || blog.metadata.featured)
    .filter((blog) => !category || blog.metadata.category === category)
    .sort(
      (a, b) =>
        new Date(b.metadata.published).getTime() -
        new Date(a.metadata.published).getTime(),
    )
    .slice(0, recent)
}

export async function MyBlog({ featured, recent, category }: FilteredBlog) {
  let allBlog: BlogParams[] = []

  try {
    allBlog = (await getMyBlog()).filter(Boolean) as BlogParams[]
  } catch (error) {
    console.error('Failed to fetch blog \u2014 ', error)
    return (
      <span className="font-medium text-sm text-red-500">
        Unable to load posts
      </span>
    )
  }

  if (!allBlog.length) {
    return (
      <span className="font-medium text-sm text-yellow-500">
        Check back soon for updates!
      </span>
    )
  }

  const filteredBlog = getFilteredBlog(allBlog, featured, recent, category)

  return (
    <div>
      {filteredBlog.map((blog) => (
        <Link
          key={blog.slug}
          className="flex flex-col my-4 space-y-2 hover:animate-pulse fade-in"
          href={`/blog/${blog.slug}`}
          aria-label={`Get inspired from ${blog.metadata.title}`}
        >
          <div className="flex flex-col md:flex-row md:justify-between w-full">
            <span className="text-mono-400 md:order-2">
              {formatDate(blog.metadata.published, 'absolute')}
            </span>
            <span className="font-medium text-mono-200 leading-snug md:order-1">
              {blog.metadata.title}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
