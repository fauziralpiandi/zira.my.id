import { getPosts } from 'app/utils/helper'
import { MyPosts, PostType } from 'app/components/Posts'

/* Let's keep it concise but intriguing */
const stuff = 'featuring posts \u0026 some thoughts\u2014'

export const metadata = {
  title: 'Posts',
  description: stuff,
}

export default async function PostsPage() {
  /* What’s a blog without content? */
  const Posts = await getPosts()

  /* Only the good stuff survives */
  const allPosts: PostType[] = Posts.filter(Boolean) as PostType[]

  return (
    <section>
      <div className="animate-in">
        <div className="mb-8">
          <h1 className="font-semibold text-2xl leading-tight tracking-tight mb-2">
            {stuff} {/* Bringing that meta desc. into the spotlight */}
          </h1>
          <p className="text-neutral-400">
            {allPosts.length} posts &mdash; Stay tuned for more!
            {/* Because we’ve got more content coming, right? */}
          </p>
        </div>
        <MyPosts /> {/* Rendering the posts like a pro */}
      </div>
    </section>
  )
}
