import Image from 'next/image'
import { Contents } from 'app/posts/components/Markdown'

type PostBodyProps = {
  title: string
  image: string | null
  content: string
}

const PostBody = ({ title, image, content }: PostBodyProps) => {
  return (
    <div>
      {image && (
        <div className="my-8">
          <Image
            src={image}
            alt={title}
            width={720}
            height={360}
            className="-ml-7 w-[calc(100%+56px)] max-w-none md:rounded-lg grayscale"
            priority
          />
        </div>
      )}
      <article className="prose max-w-2xl">
        <Contents source={content} />
      </article>
    </div>
  )
}

export default PostBody
