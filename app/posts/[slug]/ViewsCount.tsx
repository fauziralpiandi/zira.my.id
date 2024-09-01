import { useMemo, useEffect } from 'react'

type ViewCount = {
  slug: string
  count: number
}

interface ViewCounterProps {
  slug: string
  allViews?: ViewCount[]
  trackView?: boolean
}

export default function ViewCounter({
  slug,
  allViews = [],
  trackView,
}: ViewCounterProps) {
  if (!Array.isArray(allViews)) {
    console.error(
      'Invalid allViews data. Expected an array of ViewCount objects.',
    )
    return <span className="text-red-500">Error loading views</span>
  }

  const number = useMemo(() => {
    const viewsForSlug = allViews.find((view) => view.slug === slug)
    return viewsForSlug?.count || 0
  }, [slug, allViews])

  const trackViewFunction = (slug: string) => {
    useEffect(() => {
      if (trackView) {
        trackViewFunction(slug)
      }
    }, [trackView, slug])
    console.log(`View tracked for slug: ${slug}`)
  }

  return (
    <span className="text-neutral-300">
      {number.toLocaleString()} views
    </span>
  )
}
