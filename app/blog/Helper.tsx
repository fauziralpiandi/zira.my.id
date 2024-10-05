import Link from 'next/link'
import formatDate from 'app/lib/format'
import { getMyBlog } from 'app/lib/provider'

interface BlogParamsProps {
  slug: string
  metadata: {
    date: string
    title: string
    category?: string
    featured?: boolean
  }
}

interface FilteredBlogProps {
  recent?: number
  featured?: boolean
  category?: string
}

export async function MyBlog({
  featured,
  recent,
  category,
}: FilteredBlogProps) {
  let allBlog: BlogParamsProps[] = []

  try {
    allBlog = (await getMyBlog()).filter(Boolean) as BlogParamsProps[]
  } catch (error) {
    console.error('Failed to fetch blog—', error)
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
          className="flex flex-col my-4 space-y-2"
          href={`/blog/${blog.slug}`}
          aria-label={`Get inspired from ${blog.metadata.title}`}
        >
          <div className="flex flex-col md:flex-row md:justify-between w-full">
            <span className="text-neutral-400 tabular-nums md:order-2">
              {formatDate(blog.metadata.date, 'absolute')}
            </span>
            <span className="font-medium text-neutral-200 leading-snug md:order-1">
              {blog.metadata.title}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export function getFilteredBlog(
  myBlog: BlogParamsProps[],
  featured: boolean | undefined,
  recent: number | undefined,
  category: string | undefined,
): BlogParamsProps[] {
  return myBlog
    .filter((blog) => !featured || blog.metadata.featured)
    .filter((blog) => !category || blog.metadata.category === category)
    .sort(
      (a, b) =>
        new Date(b.metadata.date).getTime() -
        new Date(a.metadata.date).getTime(),
    )
    .slice(0, recent)
}
