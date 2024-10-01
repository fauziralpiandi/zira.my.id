import Image from 'next/image'
import { notFound } from 'next/navigation'

import { site } from 'app/lib/constant'
import { getPosts } from 'app/lib/provider'
import { PostParamsProps } from 'app/lib/types'
import literalMeta from 'app/lib/literal'
import formatDate from 'app/lib/format'

import { Contents } from './Helper'

export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  let posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

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
      url: `${site.baseUrl}/blog/${post.slug}`,
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
    <div>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'author': { '@type': 'Person', 'name': site.author },
            'headline': post.metadata.title,
            'datePublished': post.metadata.date,
            'description': post.metadata.summary,
            'image':
              post.metadata.image ||
              `${site.baseUrl}/og?title=${encodeURIComponent(post.metadata.title)}`,
            'url': `${site.baseUrl}/blog/${post.slug}`,
          }),
        }}
      />
      <div>
        <h1 className="mb-2 text-3xl font-bold leading-tight tracking-tight">
          {post.metadata.title}
        </h1>
        <p className="mb-6 text-neutral-400">{post.metadata.summary}</p>
        <div className="mb-6 flex items-center">
          <Image
            className="hidden w-12 h-12 object-cover border border-neutral-600 rounded-full grayscale"
            src="/author.webp"
            alt={post.metadata.author || 'Author'}
            width={48}
            height={48}
            priority
          />
          <div className="ml-0">
            <p className="font-medium leading-tight tracking-tight">
              {post.metadata.author}
            </p>
            <div className="text-sm text-neutral-400">
              <span className="flex items-center gap-1">
                <p>{readTime}</p>
                <p className="mx-0.5">·</p>
                <p>{formatDate(post.metadata.date, 'relative')}</p>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        {!post.metadata.image && (
          <hr className="my-8 border border-dashed border-neutral-800" />
        )}
        {post.metadata.image && (
          <figure className="relative my-8 w-screen md:max-w-3xl left-[50%] right-[50%] translate-x-[-50%]">
            <Image
              src={post.metadata.image}
              alt={post.metadata.title}
              width={1920}
              height={1080}
              className="w-full h-auto md:rounded-xl grayscale"
              priority
            />
          </figure>
        )}
        <article className="max-w-2xl prose">
          <Contents source={post.content} />
        </article>
      </div>
    </div>
  )
}
