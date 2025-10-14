import { Eclipse } from '@/components/ui';

export default function Home() {
  return (
    <main className="grid min-h-80 place-items-center">
      <div className="flex flex-col items-center gap-4">
        <Eclipse />
        <div className="flex flex-col gap-1 text-center">
          <h1 className="font-display text-accent text-2xl font-bold">
            Fauzira Alpiandi
          </h1>
          <p className="max-w-md leading-snug font-light text-neutral-300">
            A software engineer and writer building better experiences
          </p>
          <a
            href="https://github.com/fauziralpiandi"
            target="_blank"
            rel="noopener noreferrer nofollow"
            title="GitHub profile"
            aria-label="GitHub profile"
            className="font-display text-accent mt-2 font-medium"
          >
            &lt;&#x2F;&gt;
          </a>
        </div>
      </div>
    </main>
  );
}
