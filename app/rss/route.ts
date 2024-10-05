import RSS from 'rss'

import { site } from 'app/lib/metadata'
import { getMyBlog } from 'app/lib/provider'

export async function GET() {
  let myBlog

  try {
    myBlog = await getMyBlog()
  } catch (error) {
    console.error('Failed to fetch blog:', error)
    return new Response('Failed to fetch blog', { status: 500 })
  }

  const feed = new RSS({
    title: site.title,
    description: 'Blog Feed',
    feed_url: `${site.baseUrl}/rss`,
    site_url: site.baseUrl,
    language: site.locale,
    pubDate: new Date(),
  })

  myBlog
    ?.sort(
      (a, b) =>
        new Date(b.metadata?.date ?? 0).getTime() -
        new Date(a.metadata?.date ?? 0).getTime(),
    )
    .forEach((blog) => {
      feed.item({
        title: blog.metadata?.title ?? 'Untitled',
        description: blog.metadata?.summary ?? 'Unsummaryed',
        url: `${site.baseUrl}/blog/${blog.slug ?? 'Unslugged'}`,
        date: new Date(blog.metadata?.date ?? Date.now()),
      })
    })

  const rssFeed = feed.xml({ indent: true })

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=86400, s-maxage=86400',
    },
  })
}
