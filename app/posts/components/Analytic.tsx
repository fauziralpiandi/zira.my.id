import { FaEye } from 'react-icons/fa'

import { ViewsCounterProps } from 'app/lib/types'

import { increment, getViewsCount } from 'app/db/actions'

export async function ViewCounter({ slug, allViews }: ViewsCounterProps) {
  if (!Array.isArray(allViews)) {
    console.error('Invalid allViews data')
    return <span className="text-sm text-red-500">Error loading views</span>
  }

  const number = allViews.find((view) => view.slug === slug)?.count || 0

  return (
    <span className="flex items-center font-medium text-neutral-400">
      <FaEye className="mr-1" size={16} />
      <p>{number.toLocaleString()}</p>
    </span>
  )
}

const PostAnalytic = async ({ slug }: { slug: string }) => {
  try {
    await increment(slug)
    const allViews = await getViewsCount()
    return <ViewCounter allViews={allViews} slug={slug} />
  } catch (error) {
    console.error('Error fetching views:', error)
    return (
      <span className="font-medium text-sm text-red-500">
        Error fetching views
      </span>
    )
  }
}

export default PostAnalytic
