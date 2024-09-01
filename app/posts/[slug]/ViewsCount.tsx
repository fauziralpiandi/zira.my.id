type ViewCount = {
  slug: string
  count: number
}

interface ViewCounterProps {
  slug: string
  allViews: ViewCount[] | undefined
  trackView?: boolean
}

export default function ViewCounter({ slug, allViews }: ViewCounterProps) {
  if (!Array.isArray(allViews)) {
    console.error('Invalid allViews data')
    return <span className="text-red-500">Error loading views</span>
  }

  const viewsForSlug = allViews.find((view) => view.slug === slug)
  const number = viewsForSlug?.count || 0

  return (
    <span className="text-neutral-300">
      {number.toLocaleString()} views
    </span>
  )
}
