export default function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="animate-in">
      <div>{children}</div>
    </section>
  )
}
