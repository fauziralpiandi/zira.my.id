import { BlurFade } from 'app/components/BlurFade'

export const metadata = {
  title: 'Legal',
}

export default function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="prose animate-in">
      <BlurFade>{children}</BlurFade>
    </section>
  )
}
