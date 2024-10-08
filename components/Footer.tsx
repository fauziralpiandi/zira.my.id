import { Link } from 'next-view-transitions'
import { FaGithub, FaInstagram, FaXTwitter } from 'react-icons/fa6'

import { site } from 'app/site'
import ThemeSwitcher from 'components/ThemeSwitcher'

function Footer() {
  const links = [
    {
      name: 'Github',
      url: 'https://github.com/fauziralpiandi',
      icon: <FaGithub />,
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/fauziralpiandi',
      icon: <FaInstagram />,
    },
    {
      name: 'X Twitter',
      url: 'https://twitter.com/fauziralpiandi',
      icon: <FaXTwitter />,
    },
  ]

  return (
    <footer
      className="flex-shrink-0 flex justify-between items-center mt-16"
      aria-label="Footer"
    >
      <Link href="/" className="text-[0.95rem] tracking-tight no-underline">
        &copy; {new Date().getFullYear()} {site.author}
      </Link>
      <div className="flex items-center space-x-3">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.name}
            className="hidden flex items-center text-lg"
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
