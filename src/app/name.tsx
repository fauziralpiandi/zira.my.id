import { Link } from 'next-view-transitions'

export function FlexName() {
  return (
    <Link href="/" className="fade-in mb-8 flex-1 font-medium text-mono-500">
      Fauzira Alpiandi
    </Link>
  )
}

export function FlipName() {
  return (
    <h1 className="transition-element font-medium">
      <span className="sr-only">Fauzira Alpiandi</span>
      <span aria-hidden="true" className="group relative block overflow-hidden">
        <span className="inline-block transition-all duration-300 ease-in-out group-hover:-translate-y-full">
          {'Fauzira Alpiandi'.split('').map((letter, index) => (
            <span
              key={index}
              className="inline-block"
              style={{ transitionDelay: `${index * 25}ms` }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </span>
        <span className="absolute left-0 top-0 inline-block translate-y-full transition-all duration-300 ease-in-out group-hover:translate-y-0">
          {'Zira'.split('').map((letter, index) => (
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
