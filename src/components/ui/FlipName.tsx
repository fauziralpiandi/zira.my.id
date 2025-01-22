import { Link } from 'next-view-transitions';

import { constant } from '~/lib/constant';

export const FlipName = () => {
  return (
    <h1 className="font-display font-medium text-accent">
      <span className="group relative block overflow-hidden">
        <span
          aria-hidden="true"
          className="animate inline-block whitespace-nowrap group-hover:-translate-y-full"
        >
          {constant.title.split('').map((letter, index) => (
            <span
              key={letter + index}
              className="inline-block"
              style={{ transitionDelay: `${index * 25}ms` }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </span>
        <span className="animate absolute left-0 top-0 inline-block translate-y-full group-hover:translate-y-0">
          <Link href="/" title="Go to Home" aria-label="Go to Home">
            {'home'.split('').map((letter, index) => (
              <span
                key={letter + index}
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
};
