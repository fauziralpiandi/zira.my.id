import { Eclipse } from '@/components/ui';

export default function Home() {
  return (
    <section className="grid min-h-72 place-items-center">
      <div className="flex flex-col items-center gap-4 md:flex-row md:justify-around md:gap-8">
        <Eclipse />
        <div className="flex flex-col text-center md:text-left">
          <h1 className="font-display text-accent text-2xl font-bold">
            Fauzira Alpiandi
          </h1>
          <p className="max-w-md leading-snug font-light text-neutral-300 md:text-lg">
            All cruise, no breaks &#126; throughout bits and breaths I drift,
            just me y nada más.
          </p>
        </div>
      </div>
    </section>
  );
}
