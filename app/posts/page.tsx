import { getPosts } from 'app/utils/provider'
import { MyPosts, PostType } from 'app/components/Posts'

/* Let's keep it concise but intriguing */
const desc = 'featuring posts \u0026 some thoughts\u2014'

export const metadata = {
  title: 'Posts',
  description: desc,
}

const PostPage = async () => {
  /* What’s a post without content? */
  const Posts = await getPosts()

  /* Only the good stuff survives */
  const allPosts: PostType[] = Posts.filter(Boolean) as PostType[]

  return (
    <section>
      <div className="animate-in">
        <div className="mb-8">
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

export default PostPage
