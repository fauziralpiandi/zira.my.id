import { BlurFade } from 'app/components/BlurFade'

export const metadata = {
  title: 'Contact',
}

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
