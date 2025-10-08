import { Eclipse } from '@/components/ui';

export default function Home() {
  return (
    <main className="grid min-h-72 place-items-center">
      <div className="flex flex-col items-center gap-4 md:flex-row md:justify-around md:gap-8">
        <Eclipse />
        <div className="flex flex-col gap-1 text-center md:text-left">
          <h1 className="font-display text-accent text-2xl font-bold">
            Fauzira Alpiandi
          </h1>
          <p className="font max-w-md leading-snug font-light text-neutral-300 md:text-lg">
            A software engineer and writer building better experiences
          </p>
        </div>
      </div>
    </main>
  );
}
