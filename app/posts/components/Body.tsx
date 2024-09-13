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
        <figure className="relative my-8 w-screen md:max-w-3xl left-[50%] right-[50%] translate-x-[-50%]">
          <Image
            src={image}
            alt={title}
            width={720}
            height={360}
            className="w-full h-auto md:rounded-xl grayscale"
            priority
          />
          <figcaption className="my-3 italic text-center text-xs text-neutral-400">
            Image by <span className="font-medium">{credit}</span>
          </figcaption>
        </figure>
      )}
      <article className="max-w-2xl prose prose-neutral">
        <Contents source={content} />
      </article>
    </div>
  )
}

export default PostBody
