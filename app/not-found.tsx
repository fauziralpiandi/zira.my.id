import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex flex-col items-start justify-start md:items-center md:justify-center md:p-8">
      <h1 className="text-6xl font-bold mb-2 md:text-center">404</h1>
      <h2 className="text-xl font-medium leading-snug tracking-tight mb-6 md:text-center">
        Oh no! This page doesn&rsquo;t exist&mdash;
      </h2>
      <p className="text-neutral-400 font-light md:text-center">
        If you expected to see something here,{' '}
        <Link
          href="/contact"
          className="font-medium text-neutral-200"
          aria-label="Report"
        >
          let me know
        </Link>{' '}
        or you can try checking the URL for mistakes. Even the best of us trip
        over the keyboard sometimes... lmao
      </p>
      <Link
        href="/"
        className="mt-12 text-neutral-50 hover:text-neutral-500 transition duration-200 md:text-center"
        tabIndex={0}
      >
        Go back to Home
      </Link>
    </main>
  )
}
