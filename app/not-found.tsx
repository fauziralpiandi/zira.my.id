import { IoIosWarning } from 'react-icons/io'

export default function NotFound() {
  return (
    <main className="flex flex-col md:items-center md:p-4">
      {/* Warning icon to alert users. Because who doesn't love a good scare? */}
      <IoIosWarning
        size={50}
        className="mb-4 text-yellow-500" // Red for "Oh no!"—the color of alarm and emergency (or just really bad coffee)
        role="alert" // Make sure screen readers don't miss this moment of panic!
        aria-label="Warning"
      />
      {/* Headline announcing the unfortunate news */}
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
      {/* A friendly reminder to check for typos */}
      <p className="mt-4 text-neutral-400">
        Or you can try checking the URL for mistakes! Even the best of us
        trip over the keyboard sometimes.
      </p>
      {/* Link back to home, because who doesn't love a good detour? */}
      <a
        href="/"
        className="mt-8 text-neutral-50 opacity-100 hover:opacity-50 transition-all duration-300"
        tabIndex={0} // Making it easier for our keyboard navigators
      >
        Go back to Home
      </a>
    </main>
  )
}
