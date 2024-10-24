import { Link } from 'next-view-transitions'
import { MdFormatQuote } from 'react-icons/md'

import { my } from '~/siteConfig'

export function Name() {
  return (
    <Link
      href="/"
      className="flex items-center mb-8 font-medium text-mono-500 fade-in"
    >
      &mdash; {my.tagLine}
      <MdFormatQuote className="minline-flex ml-1 text-lg" />
    </Link>
  )
}

export function FlipName() {
  return (
    <h1 className="mb-6 font-semibold tracking-tight leading-snug">
      <span className="sr-only">{my.fullName}</span>
      <span aria-hidden="true" className="block overflow-hidden group relative">
        <span className="inline-block transition-all duration-300 ease-in-out group-hover:-translate-y-full">
          {my.fullName.split('').map((letter, index) => (
            <span
              key={index}
              className="inline-block"
              style={{ transitionDelay: `${index * 15}ms` }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </span>
        <span className="inline-block absolute left-0 top-0 transition-all duration-300 ease-in-out translate-y-full group-hover:translate-y-0">
          {my.nickName.split('').map((letter, index) => (
            <span
              key={index}
              className="inline-block"
              style={{ transitionDelay: `${index * 15}ms` }}
            >
              {letter}
            </span>
          ))}
        </span>
      </span>
    </h1>
  )
}

export function FavIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="33"
      height="33"
      viewBox="85 170 380 240"
      version="1.1"
    >
      <path
        d="M 127.934 247.590 L 92.500 319.227 92.500 320.341 L 92.500 321.454 112.496 325.147 L 132.493 328.841 132.703 328.630 L 132.914 328.420 153.571 283.460 L 174.229 238.500 176.994 231.650 L 179.759 224.801 180.267 225.650 L 180.775 226.500 185.277 237.527 L 189.779 248.554 207.043 286.527 L 224.307 324.500 224.954 325.251 L 225.602 326.002 245.969 323.745 L 266.337 321.488 266.628 320.494 L 266.919 319.500 231.589 248 L 196.259 176.500 179.814 176.227 L 163.369 175.953 127.934 247.590 M 308 319.500 L 308 336 364.500 336 L 421 336 421 319.500 L 421 303 364.500 303 L 308 303 308 319.500"
        stroke="none"
        fill="#eee"
        fillRule="evenodd"
      />
    </svg>
  )
}
