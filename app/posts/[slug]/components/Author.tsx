import Image from 'next/image'
import formatDate from 'app/utils/meta'
type AuthorInfoProps = {
  author: string
  readTime: string
  date: string
}

const AuthorInfo = ({ author, readTime, date }: AuthorInfoProps) => {
  return (
    <div className="mb-6 flex items-center">
      <Image
        className="w-12 h-12 object-cover border border-neutral-500 rounded-full grayscale"
        src="/imgs/two.webp"
        alt={author}
        width={120}
        height={120}
      />
      <div className="ml-4">
        <p className="flex items-center gap-2">{author}</p>
        <div className="flex flex-col text-neutral-400">
          <div className="flex items-center gap-1 text-sm">
            <span>{readTime}</span>
            <span className="mx-0.5">·</span>
            <span>{formatDate(date, 'absolute')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthorInfo
