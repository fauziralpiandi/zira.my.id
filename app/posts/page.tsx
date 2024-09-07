import { getPosts } from 'app/lib/provider'
import { PostProps } from 'app/lib/types'
import { MyPosts } from 'app/posts/components/List'
import Subscription from 'app/components/SubscriptionForm'

export const metadata = {
  title: 'Posts',
  description: 'featuring posts \u0026 some thoughts\u2014',
}

export default async function PostPage() {
  const Posts = await getPosts()

  /* Only the good stuff can survives */
  const allPosts: PostProps[] = Posts.filter(Boolean) as PostProps[]

  return (
    <section>
      <div className="animate-in">
        <div className="mb-8">
          <p className="text-neutral-400">
            {allPosts.length} post &mdash; Stay tuned for more!
          </p>
        </div>
        <MyPosts /> {/* Rendering all posts like a pro */}
        <Subscription />
      </div>
    </section>
  )
}
