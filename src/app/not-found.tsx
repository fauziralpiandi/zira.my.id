import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <main className="grid min-h-72 place-items-center text-center">
      <div className="flex flex-col items-center gap-1">
        <h1 className="font-display text-4xl font-bold tracking-tight">404</h1>
        <p className="text-accent text-sm font-medium tracking-tight">
          Ouch! Looks like this page took a detour&mdash;
        </p>
      </div>
    </main>
  );
}
