import { getPosts } from 'app/utils/provider'
import { MyPosts, PostType } from 'app/posts/Posts'

/* Let's keep it concise but intriguing */
const desc = 'featuring posts \u0026 some thoughts\u2014'

export const metadata = {
  title: 'Posts',
  description: desc,
}

const PostPage = async () => {
  const Posts = await getPosts()

  /* Only the good stuff survives */
  const allPosts: PostType[] = Posts.filter(Boolean) as PostType[]

  return (
    <section>
      <div className="animate-in">
        <div className="mb-8">
          <p className="text-neutral-400">
            {allPosts.length} post &mdash; Stay tuned for more!
          </p>
        </div>
        <MyPosts /> {/* Rendering all posts like a pro */}
      </div>
    </section>
  )
}

export default PostPage
