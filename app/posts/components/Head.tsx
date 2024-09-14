import Image from 'next/image'
import { Suspense } from 'react'
import { ImSpinner } from 'react-icons/im'

import formatDate from 'app/lib/format'
import { HeadPostProps } from 'app/lib/types'

import Analytic from 'app/posts/components/Analytic'

const PostHead = ({
  title,
  summary,
  date,
  author,
  readTime,
  slug,
}: HeadPostProps) => {
  return (
    <div>
      <div className="flex items-center mb-4">
        <Suspense
          fallback={
            <span className="text-sm text-neutral-500 animate-pulse">
              <ImSpinner className="inline animate-spin" />
            </span>
          }
        >
          <Analytic slug={slug} />
        </Suspense>
      </div>
      <h1 className="mb-2 text-3xl font-bold leading-tight tracking-tight">
        {title}
      </h1>
      <p className="mb-6 text-neutral-400">{summary}</p>
      <div className="mb-6 flex items-center">
        <Image
          className="w-12 h-12 object-cover border border-neutral-600 rounded-full grayscale"
          src="/author.webp"
          alt={author || 'Author'}
          width={48}
          height={48}
          priority
        />
        <div className="ml-4">
          <p className="font-medium leading-tight tracking-tight">{author}</p>
          <div className="text-sm text-neutral-400">
            <span className="flex items-center gap-1">
              <p>{readTime}</p>
              <p className="mx-0.5">·</p>
              <p>{formatDate(date, 'relative')}</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostHead
