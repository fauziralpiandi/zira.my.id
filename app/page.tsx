import React from 'react'
import { BsStars } from 'react-icons/bs'
import { PiSignature } from 'react-icons/pi'
import uno from 'public/imgs/primera.webp'
import dos from 'public/imgs/segunda.webp'
import tres from 'public/imgs/tercera.webp'
import { TextBlock, TextGlow, GridImage } from 'app/components/Stylized'

export default function HomePage(): React.ReactElement {
  const images = [
    { alt: 'Primera', src: uno.src, className: 'row-span-2 h-40' },
    { alt: 'Segunda', src: dos.src },
    { alt: 'Tercera', src: tres.src },
  ]

  return (
    <section>
      <div className="animate-in mb-20">
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <TextGlow text="hey, Zira here!" />
          <BsStars className="inline animate-pulse glow" />
        </h1>

        <TextBlock>
          &mdash;and it kinda feels like I&rsquo;m trying to save some paper
          with what you&rsquo;re seeing right now;{' '}
          <TextGlow text="nothing&rsquo;s colored here" />
          &mdash; keep it simple, stupid!
        </TextBlock>

        <div className="relative px-12 py-8">
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <PiSignature className="text-white text-8xl glow" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
            {images.map(({ alt, src, className }) => (
              <GridImage key={alt} alt={alt} src={src} className={className} />
            ))}
          </div>
        </div>

        <TextBlock>
          Do you really dig <TextGlow text="bright stuff" /> at night?
          That&rsquo;s gotta be <TextGlow text="the silliest question" />{' '}
          I&rsquo;ve ever heard&mdash; <TextGlow text="Way more annoying" />{' '}
          than those clouds that always block everything and force me to crash
          early.
        </TextBlock>

        <TextBlock>
          <TextGlow text="Hundreds" /> of notes might be overkill to show just
          how quiet I can be; here I am!{' '}
          <TextGlow text="Beauty&mdash; lies in restraint." />
        </TextBlock>

        <div className="mt-8 font-medium">
          <TextBlock>
            Yes! <TextGlow text="Embrace the laid&ndash;back vibe" />.
          </TextBlock>
        </div>
      </div>
    </section>
  )
}
