import { my } from 'app/meta'

export function FlipName() {
  return (
    <h1 className="mb-8">
      <span className="sr-only">{my.fullName}</span>
      <span aria-hidden="true" className="block overflow-hidden group relative">
        <span className="inline-block transition-all duration-300 ease-in-out group-hover:-translate-y-full">
          {my.fullName.split('').map((letter, index) => (
            <span
              key={index}
              className="inline-block text-yellow-700 dark:text-yellow-500"
              style={{ transitionDelay: `${index * 25}ms` }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </span>
        <span className="inline-block absolute left-0 top-0 transition-all duration-300 ease-in-out translate-y-full group-hover:translate-y-0">
          {my.role.split('').map((letter, index) => (
            <span
              key={index}
              className="inline-block text-yellow-700 dark:text-yellow-500"
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