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

  const itemsXml = myBlog
    .sort(
      (a, b) =>
        new Date(b.metadata.date).getTime() -
        new Date(a.metadata.date).getTime(),
    )
    .map(
      (blog) => `
        <item>
          <title>${blog.metadata.title}</title>
          <link>${site.baseUrl}/blog/${blog.slug}</link>
          <description>${blog.metadata.summary || ''}</description>
          <pubDate>${new Date(blog.metadata.date)}</pubDate>
        </item>`,
    )
    .join('')

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>${site.title}</title>
      <description>Feed</description>
      ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'text/xml',
    },
  })
}
