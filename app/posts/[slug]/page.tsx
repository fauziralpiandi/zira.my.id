import { notFound } from 'next/navigation'
import literalMeta from 'app/lib/literal'
import { site } from 'app/lib/constant'
import { getPosts } from 'app/lib/provider'
import { PostParamsProps } from 'app/lib/types'

import Author from 'app/posts/components/Author'
import Metags from 'app/posts/components/Meta'
import Body from 'app/posts/components/Body'
import Views from 'app/posts/components/Views'

import { Suspense } from 'react'
import { ImSpinner } from 'react-icons/im'

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
    <section className="animate-in">
      <Metags
        title={post.metadata.title}
        description={post.metadata.summary || ''}
        publishedTime={post.metadata.date}
        image={post.metadata.image}
        slug={post.slug}
      />

      <div className="flex items-center mb-4">
        <Suspense
          fallback={
            <span className="text-sm text-neutral-500">
              <ImSpinner className="inline animate-spin" />
            </span>
          }
        >
          <Views slug={post.slug} />
        </Suspense>
      </div>

      <h1 className="mb-2 text-3xl font-bold leading-tight tracking-tight">
        {post.metadata.title}
      </h1>
      <p className="mb-6 text-neutral-400">{post.metadata.summary}</p>

      <Author
        author={post.metadata.author || ''}
        readTime={readTime}
        date={post.metadata.date}
      />

      <hr className="my-8 border border-dashed border-neutral-800" />

      <Body
        image={post.metadata.image || ''}
        title={post.metadata.title}
        content={post.content}
      />
    </section>
  )
}
