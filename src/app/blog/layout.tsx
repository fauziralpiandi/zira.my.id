export const metadata = {
  title: 'Blog',
}

export default function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section className="animate-in">{children}</section>
}
