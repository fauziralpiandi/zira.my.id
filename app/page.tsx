import React from 'react'
import Image from 'next/image'
import { BsStars } from 'react-icons/bs'
import { BlogPosts } from 'app/components/Posts'

import shadow from 'public/imgs/shadow.webp'
import coffee from 'public/imgs/coffee.webp'
import time from 'public/imgs/time.webp'

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
  caption: string
  blurDataURL?: string
  className?: string
}

// ImageComponent displays an image with a caption and hover effects
// Think of it as the VIP section for your images—fancy and eye-catching!
const ImageComponent: React.FC<ImageComponentProps> = React.memo(
  ({ alt, src, blurDataURL, className = '' }) => (
    <div
      className={`relative h-30 md:h-60 overflow-hidden rounded-md grayscale ${className}`}
    >
      <Image
        fill
        alt={alt}
        src={src}
        placeholder="blur"
        blurDataURL={blurDataURL}
        className="object-cover"
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
          I&rsquo;m a multifaceted creative with expertise in frontend
          development, artwork, and writing.
        </TextBlock>

        <div
          className={`
          grid 
          grid-cols-2 
          md:grid-cols-3 
          gap-3 
          my-8
        `}
        >
          {[
            {
              alt: 'Coffee',
              src: coffee.src,
              caption: 'Coffee',
              blurDataURL: coffee.blurDataURL,
            },
            {
              alt: 'Time',
              src: time.src,
              caption: 'Time',
              blurDataURL: time.blurDataURL,
              className: 'row-span-2 h-60', // Making this image taller and the star of the show!
            },
            {
              alt: 'Shadow',
              src: shadow.src,
              caption: 'Shadow',
              blurDataURL: shadow.blurDataURL,
            },
          ].map(({ alt, src, caption, blurDataURL, className }) => (
            <ImageComponent
              key={alt}
              alt={alt}
              src={src}
              caption={caption}
              blurDataURL={blurDataURL}
              className={className}
            />
          ))}
        </div>

        {/* Descriptive text paragraphs */}
        {[
          `Over the past year on the client side of website development, I\u2019ve experienced countless fun and amazing moments. My thirst for knowledge drives my passion for complex problems and questions that spark curiosity.`,
          `Writing is my escape\u2014 a way to cool my head and seek ideas through a pencil, providing a much-needed break after endless debugging sessions that drain my logic.`,
          `I savor coffee at night while gazing at the beautiful moon over the lake, enjoying solitude. In these moments, there\u2019s no time to think about anyone else\u2014 It\u2019s just me and the shadow of the moon.`,
          `Monochrome style for simplicity and a calmer aesthetic.`,
        ].map((text, index) => (
          <TextBlock key={index}>{text}</TextBlock>
        ))}

        <div className="flex w-full font-semibold my-12 animate-pulse">
          <BlogPosts featured />
        </div>
      </div>
    </section>
  )
}
