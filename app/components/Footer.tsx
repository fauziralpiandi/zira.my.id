import React from 'react'
import { site } from 'app/utils/config'

const Footer: React.FC = () => {
  return (
    <footer
      className="flex justify-between items-center opacity-75 mt-16 text-sm font-medium"
      aria-label="Footer"
    >
      <p>
        &copy; {new Date().getFullYear()} {site.author}
      </p>
      <a
        href="https://creativecommons.org/licenses/by-nd/4.0/"
        className="animate-pulse"
        aria-label="Attribution"
        target="_blank" // Opens the license link in a new tab.
        rel="noopener noreferrer" // Security and performance boost. Prevents the new page from accessing your page's window object.
      >
        CC BY-ND 4.0
      </a>
    </footer>
  )
}

export default Footer
