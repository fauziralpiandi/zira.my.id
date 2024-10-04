import Image from 'next/image'
import { notFound } from 'next/navigation'

import { site } from 'app/lib/metadata'
import { getMyBlog } from 'app/lib/provider'
import literalMeta from 'app/lib/literal'
import formatDate from 'app/lib/format'

import { Contents } from './Helper'

interface BlogParamsProps {
  slug: string
  metadata: {
    date: string
    title: string
    featured?: boolean
  }
}

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  let myBlog = await getMyBlog()
  return myBlog.map((blog) => ({ slug: blog.slug }))
}

export async function generateMetadata({ params }: { params: BlogParamsProps }) {
  let myBlog = await getMyBlog()
  let blog = myBlog.find((blog) => blog.slug === params.slug)

  if (!blog) {
    return notFound()
  }

  let {
    title,
    date: publishedTime,
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

export default async function Slug({ params }: { params: BlogParamsProps }) {
  let myBlog = await getMyBlog()
  let blog = myBlog.find((blog) => blog.slug === params.slug)

  if (!blog) {
    notFound()
  }

  const { readTime } = literalMeta.getCounts(blog.content)

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
            'headline': blog.metadata.title,
            'datePublished': blog.metadata.date,
            'description': blog.metadata.summary,
            'image':
              blog.metadata.image ||
              `${site.baseUrl}/og?title=${encodeURIComponent(blog.metadata.title)}`,
            'url': `${site.baseUrl}/blog/${blog.slug}`,
          }),
        }}
      />
      <div>
        <h1 className="mb-2 text-3xl font-bold leading-tight tracking-tight">
          {blog.metadata.title}
        </h1>
        <p className="mb-6 text-neutral-400">{blog.metadata.summary}</p>
        <div className="mb-6 flex items-center">
          <Image
            className="w-12 h-12 object-cover border border-neutral-800 rounded-full grayscale"
            src="/icon.svg"
            alt={blog.metadata.author || 'Author'}
            width={48}
            height={48}
            priority
          />
          <div className="ml-4">
            <p className="font-medium leading-tight tracking-tight">
              {blog.metadata.author}
            </p>
            <div className="text-sm text-neutral-400">
              <span className="flex items-center gap-1">
                <span>{readTime}</span>
                <span className="mx-0.5">·</span>
                <span>{formatDate(blog.metadata.date, 'absolute')}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        {!blog.metadata.image && <hr className="my-4 border-none" />}
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
        <article className="max-w-2xl prose">
          <Contents source={blog.content} />
        </article>
      </div>
    </div>
  )
}
