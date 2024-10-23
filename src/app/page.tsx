import { Link } from 'next-view-transitions'

import { FlipName } from '~/Signature'

export default function Home() {
  return (
    <div className="animate-in">
      <FlipName />
      <section>
        <h2 className="sr-only">Insight</h2>
        <p>
          I&rsquo;m a <Link href="/z/frontendless">frontendless</Link>, diving
          into the awesome world of building cool stuff in React. It&rsquo;s the
          most thrilling challenge I&rsquo;ve ever faced&mdash;
        </p>

        <p>Flow &mdash; finesse &amp; fun ^-</p>

        <p>
          Trying out fresh ideas &amp; techniques, hunting for fresh&nbsp;
          <Link href="/z/stack">libraries &amp; tools</Link> pushing myself to
          get the hang of best practices while crafting killer user
          experience&mdash;
        </p>

        <p>
          Every line of code weaves my <Link href="/z/story">story</Link> ^-
        </p>
      </section>
    </div>
  )
}
