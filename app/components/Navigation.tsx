'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { site } from 'app/utils/constant'

export function Navbar() {
  const pathname = usePathname()
  const isBlogActive = pathname.startsWith('/posts')

  return (
    <aside className="pb-16">
      <div className="flex justify-between items-center space-x-2">
        <Link
          href="/"
          className="flex items-center"
          aria-label={site.title}
        >
          <Logo />
        </Link>
        <Link
          href="/posts"
          className={`flex items-center font-medium text-neutral-400 nav-link ${
            isBlogActive ? 'current text-white' : ''
          }`}
          aria-current={isBlogActive ? 'page' : undefined}
        >
          posts&mdash;
        </Link>
      </div>
    </aside>
  )
}

// SVG Logo component to keep the Navbar tidy and clean.
// This little fella deserves its own space.
const Logo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 512 512"
    version="1.1"
    aria-labelledby={site.author} // for accessibility
    role="img" // Making sure screen readers know this is an image.
  >
    <title id="logo-title">pretty</title>
    <path
      d="M 127.934 247.590 L 92.500 319.227 92.500 320.341 L 92.500 321.454 112.496 325.147 L 132.493 328.841 132.703 328.630 L 132.914 328.420 153.571 283.460 L 174.229 238.500 176.994 231.650 L 179.759 224.801 180.267 225.650 L 180.775 226.500 185.277 237.527 L 189.779 248.554 207.043 286.527 L 224.307 324.500 224.954 325.251 L 225.602 326.002 245.969 323.745 L 266.337 321.488 266.628 320.494 L 266.919 319.500 231.589 248 L 196.259 176.500 179.814 176.227 L 163.369 175.953 127.934 247.590 M 308 319.500 L 308 336 364.500 336 L 421 336 421 319.500 L 421 303 364.500 303 L 308 303 308 319.500"
      stroke="none"
      fill="#eee"
      fillRule="evenodd"
    />
    <path
      d="M 35.406 2.388 L 28.311 4.687 22.669 8.432 L 17.026 12.177 12.763 16.920 L 8.500 21.662 5.783 26.656 L 3.066 31.650 1.533 37.535 L 0 43.420 0 256.172 L -0 468.924 2.345 476.310 L 4.691 483.695 8.434 489.335 L 12.177 494.974 16.920 499.237 L 21.662 503.500 26.656 506.217 L 31.650 508.934 37.535 510.467 L 43.420 512 256.172 512 L 468.924 512 476.310 509.655 L 483.695 507.309 489.335 503.566 L 494.974 499.823 499.433 494.863 L 503.892 489.904 506.966 483.752 L 510.040 477.600 510.652 473.778 L 511.263 469.956 512.131 469.419 L 513 468.882 513 254.774 L 513 40.667 512.328 41.338 L 511.657 42.010 509.485 35.161 L 507.313 28.311 503.568 22.669 L 499.823 17.026 495.080 12.763 L 490.338 8.500 485.344 5.783 L 480.350 3.066 474.465 1.533 L 468.580 0 255.540 0.045 L 42.500 0.089 35.406 2.388 M 0.491 256 L 0.491 470.500 0.750 363.250 L 1.009 256 0.750 148.750 L 0.491 41.500 0.491 256 M 127.934 247.590 L 92.500 319.227 92.500 320.341 L 92.500 321.454 112.496 325.147 L 132.493 328.841 132.703 328.630 L 132.914 328.420 153.571 283.460 L 174.229 238.500 176.994 231.650 L 179.759 224.801 180.267 225.650 L 180.775 226.500 185.277 237.527 L 189.779 248.554 207.043 286.527 L 224.307 324.500 224.954 325.251 L 225.602 326.002 245.969 323.745 L 266.337 321.488 266.628 320.494 L 266.919 319.500 231.589 248 L 196.259 176.500 179.814 176.227 L 163.369 175.953 127.934 247.590 M 308 319.500 L 308 336 364.500 336 L 421 336 421 319.500 L 421 303 364.500 303 L 308 303 308 319.500"
      stroke="none"
      fill="#111"
      fillRule="evenodd"
    />
  </svg>
)

export default Navbar
