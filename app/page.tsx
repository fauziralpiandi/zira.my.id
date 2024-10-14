import React from 'react'
import { Link } from 'next-view-transitions'

import { FlipName } from '~/Components'

export default function Home() {
  return (
    <>
      <FlipName />
      <section>
        <h2 className="sr-only">Insight</h2>
        <p>
          I&rsquo;m a <Link href="/">frontendless</Link>, diving into the
          awesome world of building cool stuff in&nbsp;
          <Link href="/">React</Link>. It&rsquo;s the most thrilling challenge
          I&rsquo;ve ever faced&mdash;
        </p>

        <p>Flow &mdash; finesse &amp; fun ^-</p>

        <p>
          Trying out fresh ideas &amp; techniques, hunting for fresh&nbsp;
          <Link href="/">libraries &amp; tools</Link> pushing myself to get the
          hang of best practices while crafting killer user experience&mdash;
        </p>

        <p>
          Every line of code weaves a <Link href="/">story</Link> ^-
        </p>
      </section>
    </>
  )
}
