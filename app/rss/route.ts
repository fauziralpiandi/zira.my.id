import { site } from 'app/lib/constant'
import { getPosts } from 'app/lib/provider'

export async function GET() {
  let allBlogs

  try {
    allBlogs = await getPosts()
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return new Response('Failed to fetch posts', { status: 500 })
  }

  const itemsXml = allBlogs
    .sort(
      (a, b) =>
        new Date(b.metadata.date).getTime() -
        new Date(a.metadata.date).getTime(),
    )
    .map(
      (post) => `
        <item>
          <title>${post.metadata.title}</title>
          <link>${site.baseUrl}/posts/${post.slug}</link>
          <description>${post.metadata.summary || ''}</description>
          <pubDate>${new Date(post.metadata.date).toUTCString()}</pubDate>
        </item>`,
    )
    .join('')

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>${site.title}</title>
        <link>${site.baseUrl}</link>
        <description>RSS Feed</description>
        ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'text/xml',
    },
  })
}
