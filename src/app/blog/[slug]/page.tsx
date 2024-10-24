import Image from 'next/image'
import { notFound } from 'next/navigation'

import { my, site } from '~/siteConfig'
import { getMyBlog } from '~/blogParser'
import { literalCount, formatDate } from '~/blogMeta'

import Blog from './Helper'

type Params = {
  slug: string
}

type BlogParams = {
  slug: string
  metadata: {
    title: string
    published: string
    category?: string
    featured?: boolean
  }
}

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const myBlog = await getMyBlog()
  return myBlog.map((blog) => ({
    slug: blog.slug,
  }))
}

export async function generateMetadata(props: { params: Promise<BlogParams> }) {
  const params = await props.params
  const myBlog = await getMyBlog()
  const blog = myBlog.find((blog) => blog.slug === params.slug)

  if (!blog) {
    return notFound()
  }

  const {
    title,
    published: publishedTime,
    summary: description,
    image,
  } = blog.metadata

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${site.baseUrl}/blog/${blog.slug}`,
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

export default async function Slug(props: { params: Promise<Params> }) {
  const params = await props.params
  const myBlog = await getMyBlog()
  const blog = myBlog.find((blog) => blog.slug === params.slug)

  if (!blog) {
    return notFound()
  }

  const { readTime } = literalCount(blog.content)

  return (
    <div>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'author': { '@type': 'Person', 'name': my.fullName },
            'headline': blog.metadata.title,
            'datePublished': blog.metadata.published,
            'description': blog.metadata.summary,
            'image':
              blog.metadata.image ||
              `${site.baseUrl}/og?title=${encodeURIComponent(blog.metadata.title)}`,
            'url': `${site.baseUrl}/blog/${blog.slug}`,
          }),
        }}
      />
      <div>
        <h1 className="text-3xl font-bold tracking-tight leading-tighter">
          {blog.metadata.title}
        </h1>
        <p className="mt-3 mb-6 text-mono-400">{blog.metadata.summary}</p>

        <div className="flex items-center">
          <Image
            className="w-12 h-12 object-cover border border-mono-800 rounded-full grayscale"
            src="/icon.svg"
            alt={my.fullName}
            width={48}
            height={48}
            priority
          />
          <div className="ml-4">
            <p className="font-medium leading-tight tracking-tight">
              {my.fullName}
            </p>
            <div className="text-sm text-mono-400">
              <span className="flex items-center gap-1">
                <span>{readTime}</span>
                <span className="mx-0.5">·</span>
                <span>{formatDate(blog.metadata.published, 'relative')}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        {!blog.metadata.image && <hr className="my-6 border-none" />}
        {blog.metadata.image && (
          <figure className="relative my-8 w-screen md:max-w-3xl left-[50%] right-[50%] translate-x-[-50%]">
            <Image
              src={blog.metadata.image}
              alt={blog.metadata.title}
              width={1920}
              height={1080}
              className="w-full h-auto md:rounded-xl grayscale"
              priority
            />
          </figure>
        )}
        <article className="w-full mx-auto max-w-2xl typography">
          <Blog source={blog.content} />
        </article>
      </div>
    </div>
  )
}
