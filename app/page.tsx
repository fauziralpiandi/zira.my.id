import React from 'react'
import Image from 'next/image'
import { BsStars } from 'react-icons/bs'
import { BiMoon } from 'react-icons/bi'
import one from 'public/imgs/one.webp'
import two from 'public/imgs/two.webp'
import three from 'public/imgs/three.webp'
import { MyPosts } from 'app/components/Posts'

// TextBlock component for rendering styled text paragraphs
// Perfect for when you want to say a lot but don’t want to overwhelm with too many words.
const TextBlock: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="my-4 text-neutral-300">
    <p>{children}</p>
  </div>
)

// Props interface for ImageComponent
// Because every image deserves a proper introduction!
interface ImageComponentProps {
  alt: string
  src: string
  blurDataURL?: string
  className?: string
}

// ImageComponent displays an image with a caption and hover effects
// Think of it as the VIP section for your images—fancy and eye-catching!
const ImageComponent: React.FC<ImageComponentProps> = React.memo(
  ({ alt, src, blurDataURL, className = '' }) => (
    <div
      className={`relative h-30 md:h-60 overflow-hidden rounded-md grayscale blur-[2px] opacity-75 ${className}`}
    >
      <Image
        fill
        alt={alt}
        src={src}
        placeholder="blur"
        blurDataURL={blurDataURL}
        className="object-cover blur-[4px]"
        sizes="(max-width: 768px) 213px, 33vw"
        priority
      />
    </div>
  ),
)

ImageComponent.displayName = 'ImageComponent'

// Home component representing the main content of the page
// The place where magic happens and dreams become pixels!
export default function Home() {
  return (
    <section>
      <div className="animate-in">
        <h1
          className={`
          flex 
          items-center 
          gap-2 
          text-2xl 
          font-semibold 
          tracking-tight 
          mb-4
        `}
        >
          hey, Zira here! <BsStars className="inline animate-pulse" />
        </h1>

        <TextBlock>
          &mdash;and it seems like I&rsquo;m trying to save paper and ink
          with what You see right now&mdash; Monochrome style for
          simplicity and a calmer aesthetic.
        </TextBlock>

        <div className="relative my-8">
          <div
            className={`
            grid 
            grid-cols-2 
            md:grid-cols-3 
            gap-3
          `}
          >
            {[
              {
                alt: 'Coffee',
                src: one.src,
                blurDataURL: one.blurDataURL,
              },
              {
                alt: 'Time',
                src: two.src,
                blurDataURL: two.blurDataURL,
                className: 'row-span-2 h-60', // Making this image taller and the star of the show!
              },
              {
                alt: 'Shadow',
                src: three.src,
                blurDataURL: three.blurDataURL,
              },
            ].map(({ alt, src, blurDataURL, className }) => (
              <ImageComponent
                key={alt}
                alt={alt}
                src={src}
                blurDataURL={blurDataURL}
                className={className}
              />
            ))}
          </div>

          {/* Moon <3 */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <BiMoon
              className="text-white text-6xl md:text-9xl animate-pulse"
              style={{ filter: 'drop-shadow(0 0 7.5px white)' }}
            />
          </div>
        </div>

        {/* Descriptive text paragraphs */}
        {[
          `Do you really like bright objects at night? That\u2019s always the silliest question I\u2019ve ever heard. More annoying than those clouds that often block everything and force to hit me the hay early.`,
          `200 notes might be more than enough to show how quiet a person like me can be, but here I am,`,
          `Keep it flowing \u2014 Keep it simple, Stupid!`,
        ].map((text, index) => (
          <TextBlock key={index}>{text}</TextBlock>
        ))}

        <div className="flex w-full font-semibold my-4 animate-pulse">
          <MyPosts featured />
        </div>
      </div>
    </section>
  )
}
