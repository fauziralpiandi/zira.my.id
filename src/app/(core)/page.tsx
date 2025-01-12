import { SiReact } from 'react-icons/si';
import { constant } from '~/lib/constant';
import { Logo } from '~/components/ui';

const Home = () => {
  return (
    <section className="flex h-96 place-items-center md:h-80">
      <div className="flex flex-col items-center gap-2 md:flex-row md:gap-8">
        <Logo width={144} height={144} />
        <div className="z-10 flex flex-col text-center md:text-left">
          <h1 className="font-display text-xl font-bold leading-8 tracking-tight text-amber-100 md:text-2xl">
            {constant.authorName}
          </h1>
          <p className="max-w-md text-xs text-stone-300 md:text-sm">
            <mark>
              An enthusiastic frontend developer with a passionate storyteller
              who&rsquo;s all in&mdash; slapping semicolons &amp; sprinkling
              quotations with ease.
            </mark>
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
