import React from 'react'
import Image, { StaticImageData } from 'next/image'
import { BsStars } from 'react-icons/bs'
import { PiSignature } from 'react-icons/pi'
import one from 'public/imgs/one.webp'
import two from 'public/imgs/two.webp'
import three from 'public/imgs/three.webp'

const TextBlock: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="my-4 text-neutral-300">
    <p>{children}</p>
  </div>
)

interface ImageComponentProps {
  alt: string
  src: string | StaticImageData
  className?: string
}

const ImageComponent: React.FC<ImageComponentProps> = React.memo(
  ({ alt, src, className = '' }) => (
    <div
      className={`relative h-30 md:h-40 overflow-hidden rounded-lg md:rounded-xl grayscale ${className}`}
    >
      <Image
        fill
        alt={alt}
        src={src}
        className="object-cover opacity-75"
        sizes="(max-width: 768px) 213px, 33vw"
        priority
      />
    </div>
  ),
)

ImageComponent.displayName = 'ImageComponent'

const KeyWord: React.FC<{ text: string }> = ({ text }) => (
  <span className="glow">{text}</span>
)

const Home: React.FC = () => {
  const images = [
    { alt: 'Moon', src: one.src, className: 'row-span-2 h-40' },
    { alt: 'Moon', src: two.src },
    { alt: 'Moon', src: three.src },
  ]

  return (
    <section>
      <div className="animate-in mb-20">
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <KeyWord text="hey, Zira here!" />
          <BsStars className="inline animate-pulse glow" />
        </h1>

        <TextBlock>
          &mdash;and it kinda feels like I&rsquo;m trying to save some
          paper with what you&rsquo;re seeing right now;{' '}
          <KeyWord text="nothing&rsquo;s colored here" />
          &mdash; keep it simple, stupid!
        </TextBlock>

        <div className="relative px-12 py-8">
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <PiSignature className="text-white text-8xl glow" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
            {images.map(({ alt, src, className }) => (
              <ImageComponent
                key={alt}
                alt={alt}
                src={src}
                className={className}
              />
            ))}
          </div>
        </div>

        <TextBlock>
          Do you really dig <KeyWord text="bright stuff" /> at night?
          That&rsquo;s gotta be <KeyWord text="the silliest question" />{' '}
          I&rsquo;ve ever heard&mdash; <KeyWord text="Way more annoying" />{' '}
          than those clouds that always block everything and force me to
          crash early.
        </TextBlock>

        <TextBlock>
          <KeyWord text="Hundreds" /> of notes might be overkill to show
          just how quiet I can be; here I am!{' '}
          <KeyWord text="Beauty&mdash; lies in restraint." />
        </TextBlock>

        <div className="mt-8 font-medium">
          <TextBlock>
            Yes! <KeyWord text="Embrace the laid&ndash;back vibe" />.
          </TextBlock>
        </div>
      </div>
    </section>
  )
}

export default Home
