import React from 'react'

import { FlipName } from 'components/FlipName'

export default function Home() {
  return (
    <>
      <FlipName />
      <section>
        <h2 className="sr-only">About Me</h2>
        <p>
          I&rsquo;m a frontendless developer, diving headfirst into the awesome
          world of building cool stuff in React. It&rsquo;s the most thrilling
          challenge I&rsquo;ve ever faced&mdash;
        </p>

        <p>Growth&mdash;lies in persistence.</p>

        <p>
          Trying out fresh ideas and techniques might feel like a lot for
          someone new, but I&rsquo;m all in for the journey of learning and
          growth! I&rsquo;m always hunting for fresh libraries and tools,
          pushing myself to get the hang of best practices while crafting killer
          user experiences.
        </p>

        <p>Every line of code tells its own story.</p>
      </section>
    </>
  )
}
