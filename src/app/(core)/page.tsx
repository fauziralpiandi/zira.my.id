import Image from 'next/image';
import { SiReact } from 'react-icons/si';

import { constant } from '~/lib/constant';

const { description, authorName } = constant;

const Home = () => {
  return (
    <section className="grid min-h-96 place-items-center">
      <div className="flex flex-col items-center gap-2 md:flex-row md:gap-8">
        <figure className="group relative flex h-36 w-36 items-center rounded-full bg-stone-900">
          <Image
            src="https://github.com/fauziralpiandi.png"
            alt={authorName}
            fill
            priority
            className="animate absolute scale-90 rounded-full object-cover blur-3xl grayscale-0 group-hover:scale-110 group-hover:grayscale"
          />
          <Image
            src="https://github.com/fauziralpiandi.png"
            alt={authorName}
            fill
            priority
            className="animate z-10 rounded-full object-cover grayscale group-hover:grayscale-0"
          />
        </figure>
        <div className="z-10 flex flex-col text-center md:text-left">
          <h1 className="font-display text-xl font-bold leading-8 tracking-tight text-amber-100 md:text-2xl">
            {authorName}
          </h1>
          <p className="max-w-md text-xs text-stone-300 md:text-sm">
            <mark>{description}</mark>
          </p>
          <div className="mt-4 flex justify-center md:justify-start">
            <a
              href="https://react.dev/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              title="React"
              aria-label="React"
            >
              <SiReact size={24} className="fill-amber-100" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
