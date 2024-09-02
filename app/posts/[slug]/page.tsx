import { notFound } from 'next/navigation'
import { meta } from 'app/utils/meta'
import { site } from 'app/utils/constant'
import { getPosts } from 'app/utils/provider'
import MetaTags from './components/Meta'
import Body from './components/Body'
import Author from './components/Author'
import Views from './components/Views'
import { Suspense } from 'react'
import { FaSpinner } from 'react-icons/fa'

type PostParams = {
  slug: string
}

export async function generateMetadata({
  params,
}: {
  params: PostParams
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
          url:
            image ||
            `${site.baseUrl}/og?title=${encodeURIComponent(title)}`,
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
  params: PostParams
}) {
  let posts = await getPosts()
  let post = posts.find((post) => post.slug === params.slug)

  if (!post) {
    notFound()
  }

  const { readTime } = meta.getMeta(post.content)

  return (
    <section className="max-w-4xl mx-auto animate-in">
      <MetaTags
        title={post.metadata.title}
        description={post.metadata.summary || ''}
        publishedTime={post.metadata.date}
        image={post.metadata.image}
        slug={post.slug}
      />

      <div className="flex items-center mb-4 gap-2">
        <p className="font-medium text-sm text-neutral-300">
          Member-only story
        </p>
        <Suspense
          fallback={
            <span className="text-sm text-neutral-500">
              <FaSpinner className="inline animate-spin" />
            </span>
          }
        >
          <Views slug={post.slug} />
        </Suspense>
      </div>

      <h1 className="text-3xl font-extrabold leading-tight tracking-tight mb-2">
        {post.metadata.title}
      </h1>
      <p className="text-lg text-neutral-400 mb-6">
        {post.metadata.summary}
      </p>

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
