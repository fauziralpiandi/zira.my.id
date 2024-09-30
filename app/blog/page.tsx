import { getPosts } from 'app/lib/provider'
import { PostParamsProps } from 'app/lib/types'

import { MyPosts } from 'app/blog/Helper'

import Subscription from 'app/components/forms/Subscription'

export default async function PostPage() {
  const Posts = await getPosts()

  /* Only the good stuff can survives */
  const allPosts: PostParamsProps[] = Posts.filter(Boolean) as PostParamsProps[]

  return (
    <div>
      <div className="mb-8">
        <p className="text-neutral-400">
          {allPosts.length} post &mdash; Stay tuned for more!
        </p>
      </div>
      <MyPosts />
      <Subscription />
    </div>
  )
}
