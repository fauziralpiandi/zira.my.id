import { Link } from 'next-view-transitions'

export default function NotFound() {
  return (
    <main className="flex flex-col justify-center items-start md:items-center md:justify-center space-y-4">
      <h1 className="text-6xl font-bold text-center">404</h1>
      <h2 className="text-xl font-medium leading-snug tracking-tight md:text-center">
        Oh no! This page doesn&rsquo;t exist&mdash;
      </h2>
      <p className="font-light md:text-center">
        You can try checking the URL for mistakes &mdash; Even the best of us
        trip over the keyboard sometimes... lmao
      </p>
      <Link href="/" className="text-center" tabIndex={0}>
        Go back?
      </Link>
    </main>
  )
}