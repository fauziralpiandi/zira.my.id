import { getMyBlog } from 'app/lib/provider'

import { MyBlog } from 'app/blog/Helper'

import Subscription from 'app/components/Subscription'

interface BlogParamsProps {
  slug: string
  metadata: {
    date: string
    title: string
    featured?: boolean
  }
}

export default async function Blog() {
  const myBlog = await getMyBlog()

  const allBlog: BlogParamsProps[] = myBlog.filter(Boolean) as BlogParamsProps[]

  return (
    <div>
      <div className="mb-8">
        <span className="text-neutral-400">
          {allBlog.length} post &mdash; Stay tuned for more!
        </span>
      </div>
      <MyBlog />
      <Subscription />
    </div>
  )
}
