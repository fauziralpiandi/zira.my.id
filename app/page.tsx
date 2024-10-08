import React from 'react'

import { site } from 'app/site'

function FlipName() {
  return (
    <h1 className="mb-8">
      <span className="sr-only">{site.author}</span>
      <span aria-hidden="true" className="block overflow-hidden group relative">
        <span className="inline-block transition-all duration-300 ease-in-out group-hover:-translate-y-full">
          {site.author.split('').map((letter, index) => (
            <span
              key={index}
              className="inline-block"
              style={{ transitionDelay: `${index * 25}ms` }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </span>
        <span className="inline-block absolute left-0 top-0 transition-all duration-300 ease-in-out translate-y-full group-hover:translate-y-0">
          {site.alias.split('').map((letter, index) => (
            <span
              key={index}
              className="inline-block"
              style={{ transitionDelay: `${index * 25}ms` }}
            >
              {letter}
            </span>
          ))}
        </span>
      </span>
    </h1>
  )
}

export default function Home() {
  return (
    <>
      <FlipName />
      <section>
        <h2 className="sr-only">About Me</h2>
        <p>
          I&rsquo;m a fresh entry-level developer, diving headfirst into the
          awesome world of building cool stuff in React. It&rsquo;s the most
          thrilling challenge I&rsquo;ve ever faced&mdash;
        </p>

        <p>Growth&mdash;lies in persistence.</p>

        <p>
          Trying out fresh ideas and techniques might feel like a lot for
          someone new, but I&rsquo;m all in for the journey of learning and
          growth! I&rsquo;m always hunting for fresh libraries and tools,
          pushing myself to get the hang of best practices while crafting killer
          user experiences.
        </p>

        <p>
          Every line of code tells its own story. With every hurdle I clear,
          I&rsquo;m reminded that each step I take is part of my growth as a
          developer.
        </p>
      </section>
    </>
  )
}
