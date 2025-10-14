import { Link } from 'next-view-transitions';

export function FlipName() {
  const title = 'fwzyrln_';
  const hoverText = 'home';

  return (
    <div className="font-display text-accent font-medium">
      <span className="group relative block overflow-hidden">
        <span
          aria-hidden="true"
          className="animate block whitespace-nowrap group-hover:-translate-y-full"
        >
          {title.split('').map((letter, i) => (
            <span
              key={i}
              className="inline-block"
              style={{ transitionDelay: `${i * 25}ms` }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </span>
        <span className="animate absolute top-0 left-0 block translate-y-full group-hover:translate-y-0">
          <Link href="/" aria-label="Go to homepage" title="Home">
            <span className="sr-only">Home</span>
            {hoverText.split('').map((letter, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="inline-block"
                style={{ transitionDelay: `${i * 25}ms` }}
              >
                {letter}
              </span>
            ))}
          </Link>
        </span>
      </span>
    </div>
  );
}
