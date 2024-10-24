export default function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="animate-in">
      <article className="typography">{children}</article>
    </section>
  )
}
