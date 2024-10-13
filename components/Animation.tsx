import { Link } from 'next-view-transitions'
import { MdFormatQuote } from 'react-icons/md'

import { my } from '@/constant'

export function AnimatedName() {
  return (
    <Link
      href="/"
      className="flex items-center mb-8 font-medium text-mono-500 bg-transparent hover:no-underline fade-in"
    >
      &mdash; {my.tagLine}
      <MdFormatQuote className="hidden inline-flex ml-1 text-lg" />
    </Link>
  )
}

export function FlipName() {
  return (
    <h1 className="mb-8">
      <span className="sr-only">{my.fullName}</span>
      <span aria-hidden="true" className="block overflow-hidden group relative">
        <span className="inline-block transition-all duration-300 ease-in-out group-hover:-translate-y-full">
          {my.fullName.split('').map((letter, index) => (
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
          {my.headLine.split('').map((letter, index) => (
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
