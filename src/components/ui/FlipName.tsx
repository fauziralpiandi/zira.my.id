// (https://github.com/leerob/site/blob/main/app/name.tsx)

import { Link } from 'next-view-transitions';

export function FlipName() {
  return (
    <h1 className="font-display text-accent font-medium">
      <span className="group relative block overflow-hidden">
        <span
          aria-hidden="true"
          className="animate block whitespace-nowrap group-hover:-translate-y-full"
        >
          {'fwzyrln_'.split('').map((letter, index) => (
            <span
              key={index}
              className="inline-block"
              style={{ transitionDelay: `${index * 25}ms` }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </span>
        <span className="animate absolute top-0 left-0 block translate-y-full group-hover:translate-y-0">
          <Link href="/" title="Home" aria-label="Go to Home">
            {'home'.split('').map((letter, index) => (
              <span
                key={index}
                className="inline-block"
                style={{ transitionDelay: `${index * 25}ms` }}
              >
                {letter}
              </span>
            ))}
          </Link>
        </span>
      </span>
    </h1>
  );
}
