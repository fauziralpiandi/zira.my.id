import { Link } from 'next-view-transitions';

const notFound = () => {
  return (
    <div className="flex h-96 items-center justify-center md:h-80">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight">404</h1>
        <mark className="text-sm font-medium tracking-tight text-amber-100">
          Ouch! Looks like this page took a detour&mdash;
        </mark>
        <p className="mt-3 max-w-md text-xs text-stone-300">
          No worries, you&rsquo;re not the only one! Double-check the URL or{' '}
          <Link href="/" className="text-amber-100">
            head back to the homepage
          </Link>
          . Maybe you&rsquo;ll find something cooler.
        </p>
      </div>
    </div>
  );
};

export default notFound;
