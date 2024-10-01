import { BlurFade } from 'app/components/BlurFade'

export default function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="animate-in">
      <BlurFade>{children}</BlurFade>
    </section>
  )
}
