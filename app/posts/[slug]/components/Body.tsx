// app/posts/[slug]/components/PostBody.tsx
import Image from 'next/image'
import { Contents } from 'app/posts/[slug]/components/Content'

type PostBodyProps = {
  image: string | null
  title: string
  content: string
}

const PostBody = ({ image, title, content }: PostBodyProps) => {
  return (
    <article className="prose">
      {image && (
        <div className="my-8">
          <Image
            src={image}
            alt={title}
            width={720}
            height={360}
            className="w-full h-auto rounded-lg grayscale"
            priority
          />
        </div>
      )}
      <Contents source={content} />
    </article>
  )
}

export default PostBody
