import Image from 'next/image'

import { BodyPostProps } from 'app/lib/types'

import { Contents } from 'app/posts/components/Content'

const PostBody = ({ title, image, credit, content }: BodyPostProps) => {
  return (
    <div>
      {!image && (
        <hr className="my-8 border border-dashed border-neutral-800" />
      )}
      {image && (
        <figure className="my-8">
          <Image
            src={image}
            alt={title}
            width={720}
            height={360}
            className="-ml-7 w-[calc(100%+56px)] max-w-none md:rounded-lg grayscale"
            priority
          />
          <figcaption className="my-3 italic text-center text-xs text-neutral-500">
            Image by <span className="font-medium">{credit}</span>
          </figcaption>
        </figure>
      )}
      <article className="prose max-w-2xl">
        <Contents source={content} />
      </article>
    </div>
  )
}

export default PostBody
