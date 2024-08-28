import Image from 'next/image'
import { notFound } from 'next/navigation'
import { meta, formatDate } from 'app/utils/meta'
import { getPosts } from 'app/utils/provider'
import { site } from 'app/utils/constant'
import { FaRegClock } from 'react-icons/fa'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

// Let's define the type for your post params. Because types are life.
type PostParams = {
  slug: string
}

// This function generates all the fancy metadata.
// It's basically making sure your post is Instagram-ready... but for Google.
export async function generateMetadata({
  params,
}: {
  params: PostParams
}) {
  // Step 1: Fetch all the posts. Yes, all of them.
  let posts = await getPosts()
  // Step 2: Try to find the post with the right slug. It's like playing hide and seek.
  let post = posts.find((post) => post.slug === params.slug)

  // If we can’t find the post, well, we’re lost. Show a 404 page.
  if (!post) {
    return notFound()
  }

  // Step 3: Extract the juicy details from the post.
  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata
  let ogImage = image
    ? image // Use the post's image if it exists. Up to u...
    : `${site.baseUrl}/og?title=${encodeURIComponent(title)}` // Or generate one on the fly, because we can.

  // Step 4: Return metadata, so search engines and social media can properly appreciate your masterpiece.
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${site.baseUrl}/posts/${post.slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

// This line is like giving your website a shot of espresso—
// making sure it’s dynamic and ready to serve fresh content...
export const revalidate = 3600 // every 1 hour, no matter the situation.
export const dynamicParams = true

export async function generateStaticParams() {
  let posts = await getPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// The main event. This function handles displaying the post.
export default async function PostPage({ params }: { params: PostParams }) {
  // Fetch all the posts again. (Déjà vu, anyone?)
  let posts = await getPosts()
  // Try to find the post by its slug.
  let post = posts.find((post) => post.slug === params.slug)

  // If the post isn’t found, PANIC!!! (Just kidding, show the 404 page.)
  if (!post) {
    notFound()
  }

  // Extract the reading time and word count, who doesn't love stats?
  const { readTime, words } = meta.getMeta(post.content)

  return (
    <section>
      {/* JSON-LD for rich snippets, we love making Google happy. */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'author': {
              '@type': 'Person',
              'name': post.metadata.author,
            },
            'headline': post.metadata.title,
            'datePublished': post.metadata.publishedAt,
            'description': post.metadata.summary,
            'image': post.metadata.image
              ? `${site.baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            'url': `${site.baseUrl}/posts/${post.slug}`,
          }),
        }}
      />
      <div className="mb-32 animate-in">
        <div className="flex flex-col gap-8">
          {/* Post metadata (title, description, etc.). */}
          <div className="flex flex-col max-w-2xl gap-4">
            <h1 className="font-bold text-3xl leading-tight tracking-tight">
              {post.metadata.title} {/* Make it catchy! */}
            </h1>
            <p className="leading-snug text-neutral-400">
              {post.metadata.summary} {/* A teaser, if you will. */}
            </p>
            <p className="flex items-center gap-1.5 text-neutral-300">
              <FaRegClock className="inline" />
              {readTime} &mdash; {words} words{' '}
              {/* Perfect for the curious reader. */}
            </p>
          </div>

          {/* Credits matter. */}
          <div className="flex max-w-none items-center">
            <div className="flex-col">
              <p className="font-medium">{post.metadata.author}</p>{' '}
              {/* Who wrote this brilliance? */}
              <span className="text-neutral-400">
                {formatDate(post.metadata.publishedAt)}{' '}
                {/* And when did write it? */}
              </span>
            </div>
          </div>
        </div>

        {/* We all love pretty picts. */}
        {post.metadata.image && (
          <div className="my-8">
            <Image
              src={post.metadata.image}
              alt={post.metadata.title}
              width={720}
              height={360}
              className="-ml-7 w-[calc(100%+56px)] max-w-none md:rounded-lg lg:-ml-20 lg:w-[calc(100%+160px)] grayscale"
              priority
            />
          </div>
        )}

        {/* Here's where the magic happens. */}
        <article className="prose">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {post.content}
          </ReactMarkdown>{' '}
          {/* Rendering the content with ReactMarkdown. */}
        </article>
      </div>
    </section>
  )
}
