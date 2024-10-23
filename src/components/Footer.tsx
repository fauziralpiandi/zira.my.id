export default function Footer() {
  return (
    <footer
      className="flex-shrink-0 flex flex-col items-center mt-24"
      aria-label="Footer"
    >
      <span className="text-center text-[0.8rem] text-mono-500">
        &copy; {new Date().getFullYear()} Fauzira Alpiandi
      </span>
    </footer>
  )
}
