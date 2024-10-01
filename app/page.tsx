import { BsStars } from 'react-icons/bs'

import { BlurFade } from 'app/components/BlurFade'

const TextBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="my-4 prose">
    <p>{children}</p>
  </div>
)

const TextGlow: React.FC<{ text: string }> = ({ text }) => (
  <span className="glow">{text}</span>
)

export default function Home() {
  return (
    <section className="animate-in">
      <BlurFade>
        <div className="flex flex-col items-start px-2 font-bold text-6xl tracking-tight">
          <div className="relative">
            <span>Fauzira</span>
            <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-1 text-7xl">
              <BsStars className="glow opacity-75" />
            </span>
          </div>
          <div className="flex items-center">
            <span>Alpiandi</span>
          </div>
        </div>

        <div className="mt-14 md:px-16">
          <TextBlock>
            Do you really dig <TextGlow text="bright stuff" /> at night?
            That&rsquo;s gotta be <TextGlow text="the silliest question" />{' '}
            I&rsquo;ve ever heard&mdash; <TextGlow text="Way more annoying" />{' '}
            than those clouds that always block everything and force me to crash
            early.
          </TextBlock>

          <div className="pl-8">
            <TextBlock>
              <TextGlow text="Hundreds" /> of notes might be overkill to show
              just how quiet I can be; here I am!{' '}
              <TextGlow text="Beauty&mdash; lies in restraint." />
            </TextBlock>
          </div>

          <div className="mt-8">
            <TextBlock>
              Yes! <TextGlow text="Embrace the laid&ndash;back vibe" />.
            </TextBlock>
          </div>
        </div>
      </BlurFade>
    </section>
  )
}
