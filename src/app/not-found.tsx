import { Link } from 'next-view-transitions';

const notFound = () => {
  return (
    <div className="grid min-h-72 place-items-center">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight">404</h1>
        <mark className="text-sm font-medium tracking-tight text-accent">
          Ouch! Looks like this page took a detour&mdash;
        </mark>
        <p className="mt-3 max-w-md text-xs text-neutral-300">
          No worries, you&rsquo;re not the only one! Double-check the URL or{' '}
          <Link href="/" className="text-accent">
            head back to the homepage
          </Link>
          . Maybe you&rsquo;ll find something cooler.
        </p>
      </div>
    </div>
  );
};

export default notFound;
