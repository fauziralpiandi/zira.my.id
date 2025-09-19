import type { Metadata } from 'next';
import { Link } from 'next-view-transitions';

export const metadata: Metadata = {
  title: '404 Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="grid min-h-72 place-items-center">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight">404</h1>
        <mark className="text-accent text-sm font-medium tracking-tight">
          Ouch! Looks like this page took a detour&mdash;
        </mark>
        <p className="mt-3 max-w-md text-xs text-neutral-300">
          No worries, you&rsquo;re not the only one! Double-check the URL or{' '}
          <Link
            href="/"
            className="text-accent no-underline decoration-neutral-700 decoration-1 underline-offset-2 hover:underline"
          >
            head back to the homepage
          </Link>
          . Maybe you&rsquo;ll find something cooler.
        </p>
      </div>
    </div>
  );
}
