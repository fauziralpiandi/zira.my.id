import React from 'react'
import { site } from 'app/utils/constant'

const Footer: React.FC = () => {
  return (
    <footer
      className="flex justify-center items-center text-neutral-400 opacity-80 mt-16 text-sm font-medium"
      aria-label="Footer"
    >
      <p>
        &copy; {new Date().getFullYear()} {site.author}
      </p>
    </footer>
  )
}

export default Footer
