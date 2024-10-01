import React, { useMemo } from 'react'

export default function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), [])

  return (
    <footer
      className="flex-shrink-0 flex flex-col items-center mt-24 text-sm font-medium text-neutral-400 opacity-80"
      aria-label="Footer"
    >
      <p className="text-center">
        Copyright &copy; {currentYear} Fauzira Alpiandi
      </p>
    </footer>
  )
}
