import { increment } from 'app/db/actions'
import { getViewsCount } from 'app/db/query'

type ViewCount = {
  slug: string
  count: number
}

interface ViewCounterProps {
  slug: string
  allViews: ViewCount[] | undefined
}

export async function ViewCounter({ slug, allViews }: ViewCounterProps) {
  if (!Array.isArray(allViews)) {
    console.error('Invalid allViews data')
    return (
      <span className="text-sm text-red-500">Error loading views</span>
    )
  }

  const number = allViews.find((view) => view.slug === slug)?.count || 0

  return (
    <span className="text-sm text-neutral-500">
      {number.toLocaleString()} views
    </span>
  )
}

const Views = async ({ slug }: { slug: string }) => {
  try {
    await increment(slug)
    const allViews = await getViewsCount()
    return <ViewCounter allViews={allViews} slug={slug} />
  } catch (error) {
    console.error('Error fetching views:', error)
    return <div>Error fetching views. Please try again later.</div>
  }
}

export default Views
