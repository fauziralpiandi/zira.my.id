import { IoIosWarning } from 'react-icons/io'

export default function NotFound() {
  return (
    <main className="flex flex-col md:items-center md:p-4">
      <IoIosWarning
        size={50}
        className="mb-4 text-yellow-500"
        role="alert"
        aria-label="Warning"
      />
      <h1 className="mb-4 font-bold text-2xl leading-snug tracking-tight">
        Oh no! This page doesn&rsquo;t exist&mdash;
      </h1>
      <p className="text-neutral-400">
        If you expected to see something here,{' '}
        <a
          href="mailto:fwzyrln@gmail.com"
          className="font-medium animate-pulse"
          aria-label="Report"
        >
          let me know!
        </a>
      </p>
      <p className="mt-4 text-neutral-400">
        Or you can try checking the URL for mistakes! Even the best of us
        trip over the keyboard sometimes.
      </p>
      <a
        href="/"
        className="mt-8 text-neutral-50 opacity-100 hover:opacity-50 transition-all duration-300"
        tabIndex={0}
      >
        Go back to Home
      </a>
    </main>
  )
}
