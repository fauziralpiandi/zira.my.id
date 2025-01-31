import { constant } from '~/lib/constant';
import { Moonlight } from '~/components/ui';

const { description, authorName } = constant;

const Home = () => {
  return (
    <section className="grid min-h-72 place-items-center">
      <div className="flex flex-col items-center gap-4 md:flex-row md:justify-around md:gap-8">
        <Moonlight />
        <div className="flex flex-col text-center md:text-left">
          <h1 className="font-display text-accent text-2xl font-bold">
            {authorName}
          </h1>
          <p className="max-w-md leading-snug font-light text-neutral-300 md:text-lg">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Home;
