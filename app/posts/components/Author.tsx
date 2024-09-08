import Image from 'next/image'
import formatDate from 'app/lib/format'
import { AuthorInfoProps } from 'app/lib/types'

const AuthorInfo = ({ author, readTime, date }: AuthorInfoProps) => {
  return (
    <div className="mb-6 flex items-center">
      <Image
        className="w-12 h-12 object-cover border border-neutral-500 rounded-full grayscale"
        src="/imgs/segunda.webp"
        alt={author}
        width={48}
        height={48}
        loading="lazy"
      />
      <div className="ml-4">
        <p>{author}</p>
        <div className="text-sm text-neutral-400">
          <span className="flex items-center gap-1">
            <p>{readTime}</p>
            <p className="mx-0.5">·</p>
            <p>{formatDate(date, 'relative')}</p>
          </span>
        </div>
      </div>
    </div>
  )
}

export default AuthorInfo
