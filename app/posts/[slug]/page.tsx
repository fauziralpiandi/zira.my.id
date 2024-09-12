import { notFound } from 'next/navigation'

import { site } from 'app/lib/constant'
import { getPosts } from 'app/lib/provider'
import { PostParamsProps } from 'app/lib/types'
import literalMeta from 'app/lib/literal'

import Meta from 'app/posts/components/Meta'
import Head from 'app/posts/components/Head'
import Body from 'app/posts/components/Body'

export async function generateMetadata({
  params,
}: {
  params: PostParamsProps
}) {
  let posts = await getPosts()
  let post = posts.find((post) => post.slug === params.slug)

  if (!post) {
    return notFound()
  }

  let {
    title,
    date: publishedTime,
    summary: description,
    image,
  } = post.metadata

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${site.baseUrl}/posts/${post.slug}`,
      images: [
        {
          url: image || `${site.baseUrl}/og?title=${encodeURIComponent(title)}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [
        image || `${site.baseUrl}/og?title=${encodeURIComponent(title)}`,
      ],
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: PostParamsProps
}) {
  let posts = await getPosts()
  let post = posts.find((post) => post.slug === params.slug)

  if (!post) {
    notFound()
  }

  const { readTime } = literalMeta.getCounts(post.content)

  return (
    <section>
      <Meta
        title={post.metadata.title}
        description={post.metadata.summary}
        publishedTime={post.metadata.date}
        image={post.metadata.image}
        slug={post.slug}
      />

      <div
        className="animate-in"
        style={{ '--index': 1 } as React.CSSProperties}
      >
        <Head
          title={post.metadata.title}
          summary={post.metadata.summary}
          date={post.metadata.date}
          author={post.metadata.author}
          slug={post.slug}
          readTime={readTime}
        />
      </div>

      <div
        className="animate-in"
        style={{ '--index': 2 } as React.CSSProperties}
      >
        <Body
          title={post.metadata.title}
          image={post.metadata.image}
          credit={post.metadata.credit}
          content={post.content}
        />
      </div>
    </section>
  )
}
