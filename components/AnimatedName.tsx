import { Link } from 'next-view-transitions'
import { BsStars } from 'react-icons/bs'

import { my } from 'app/meta'

export function AnimatedName() {
  return (
    <Link
      href="/"
      className="flex items-center mt-1 mb-8 font-medium text-lg text-neutral-400 dark:text-neutral-500 no-underline fade-in"
    >
      {my.fullName}
      <BsStars className="inline-flex ml-1 text-xl align-middle" />
    </Link>
  )
}