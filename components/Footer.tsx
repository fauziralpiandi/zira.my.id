import { Link } from 'next-view-transitions'

import { site } from 'app/site'
import ThemeSwitcher from 'components/ThemeSwitcher'

function Footer() {
  const links = []
  return (
    <footer
      className="flex-shrink-0 flex justify-between items-center mt-16"
      aria-label="Footer"
    >
      <span
        className="font-medium text-[0.95rem] text-yellow-700 dark:text-yellow-500 tracking-tight"
        aria-label="Attribution"
      >
        &copy; {new Date().getFullYear()} {site.author} &mdash;{' '}
        <Link href="/legal" aria-label="Legal">
          Legal
        </Link>
      </span>

      <div className="flex items-center space-x-3">
        {Array.isArray(links) &&
          links.length > 0 &&
          links.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              className="flex items-center text-lg"
            >
              {link.icon}
            </a>
          ))}
        <ThemeSwitcher />
      </div>
    </footer>
  )
}

export default Footer
